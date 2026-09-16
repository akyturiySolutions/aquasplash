// ============================================================
//  Daraja (M-Pesa) client — reusable across every tenant.
//  All tenant-specific values come from environment variables.
//  Nothing here should ever contain a hardcoded key, secret,
//  or shortcode for any particular client.
// ============================================================

import axios from 'axios';

function baseUrl() {
  return process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Check server/.env`);
  }
  return value;
}

// ── OAuth token ───────────────────────────────────────────
let cachedToken = null;
let cachedTokenExpiry = 0;

export async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiry) return cachedToken;

  const consumerKey = requireEnv('MPESA_CONSUMER_KEY');
  const consumerSecret = requireEnv('MPESA_CONSUMER_SECRET');
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const { data } = await axios.get(
    `${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  cachedToken = data.access_token;
  // Daraja tokens last 3600s — refresh a little early
  cachedTokenExpiry = now + (Number(data.expires_in || 3600) - 60) * 1000;
  return cachedToken;
}

// ── Password + timestamp ─────────────────────────────────
function timestamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function buildPassword(shortcode, passkey, ts) {
  return Buffer.from(`${shortcode}${passkey}${ts}`).toString('base64');
}

// ── Normalize phone to 2547XXXXXXXX / 2541XXXXXXXX ──────
export function normalizePhone(phone) {
  let p = String(phone).trim().replace(/[\s-]/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('0')) p = '254' + p.slice(1);
  if (p.startsWith('7') || p.startsWith('1')) p = '254' + p;
  return p;
}

// ── STK Push ──────────────────────────────────────────────
export async function stkPush({ phone, amount, accountReference, transactionDesc }) {
  const shortcode = requireEnv('MPESA_SHORTCODE');
  const passkey = requireEnv('MPESA_PASSKEY');
  const callbackUrl = requireEnv('MPESA_CALLBACK_URL');
  const transactionType = process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline';
  const partyB = process.env.MPESA_PARTY_B || shortcode;

  const ts = timestamp();
  const password = buildPassword(shortcode, passkey, ts);
  const token = await getAccessToken();
  const msisdn = normalizePhone(phone);

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: ts,
    TransactionType: transactionType,
    Amount: Math.round(amount),
    PartyA: msisdn,
    PartyB: partyB,
    PhoneNumber: msisdn,
    CallBackURL: callbackUrl,
    AccountReference: (accountReference || 'Order').slice(0, 12),
    TransactionDesc: (transactionDesc || 'Order payment').slice(0, 13),
  };

  const { data } = await axios.post(
    `${baseUrl()}/mpesa/stkpush/v1/processrequest`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data; // { MerchantRequestID, CheckoutRequestID, ResponseCode, CustomerMessage, ... }
}

// ── Query STK status directly from Safaricom (optional,
//    used as a fallback if the callback hasn't arrived yet) ──
export async function stkQuery(checkoutRequestId) {
  const shortcode = requireEnv('MPESA_SHORTCODE');
  const passkey = requireEnv('MPESA_PASSKEY');
  const ts = timestamp();
  const password = buildPassword(shortcode, passkey, ts);
  const token = await getAccessToken();

  const { data } = await axios.post(
    `${baseUrl()}/mpesa/stkpushquery/v1/query`,
    {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      CheckoutRequestID: checkoutRequestId,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
}
