# 📱 M-Pesa STK Push — Setup Guide

This adds "Pay Now via M-Pesa" to the order page: the customer taps it,
gets an STK prompt on their phone, enters their PIN, and the app shows
confirmation with the M-Pesa receipt number — before the WhatsApp
message is sent to you with proof of payment already attached.

The code is generic and identical for every tenant. Everything
client-specific — consumer key/secret, shortcode, passkey, callback
URL, sandbox vs. production — lives in one `.env` file per deployment.
You never touch `/server/src` when onboarding a new client.

---

## 1. What the client needs to give you

From their Safaricom Daraja app (developer.safaricom.co.ke):

| Value | Where to find it |
|---|---|
| Consumer Key | Daraja app dashboard |
| Consumer Secret | Daraja app dashboard |
| Shortcode (Paybill or Till) | Their M-Pesa business account |
| Passkey | Shown next to the shortcode on the Daraja app page (sandbox has a shared test passkey; production passkey is issued after go-live approval) |
| Paybill or Till? | Determines `MPESA_TRANSACTION_TYPE` below |

You do **not** need separate code for sandbox vs. production — one
`.env` variable (`MPESA_ENV`) switches the API base URL. Test with
their sandbox credentials first, then swap in production credentials
and flip that one variable when they're ready to go live.

---

## 2. Deploy the server (once per tenant)

Same pattern as GO OS / Merkaz POS: GitHub → Render.

1. Push the `/server` folder to its own GitHub repo (e.g.
   `voi-gas-mpesa-server`).
2. On Render: New → Web Service → connect that repo.
   - Build command: `npm install`
   - Start command: `npm start`
3. In Render's Environment tab, add every variable from
   `server/.env.example`. Leave `MPESA_ENV=sandbox` until the client
   is ready to go live.
4. Once deployed, your callback URL is:
   ```
   https://<your-render-service>.onrender.com/api/mpesa/callback
   ```
   Copy that into `MPESA_CALLBACK_URL` in Render's env vars and
   redeploy (Safaricom needs this URL to already be live and
   reachable — it can't point at localhost).
5. Set `ALLOWED_ORIGINS` to the client's deployed Vercel URL, e.g.
   `https://voi-gas.vercel.app` — this keeps random sites from calling
   their payment endpoint.

---

## 3. Wire the frontend

In that client's `js/config.js`:

```js
payments: {
  mpesaEnabled: true,
  apiBaseUrl: "https://voi-gas-mpesa-server.onrender.com",
},
```

Set `mpesaEnabled: false` for any client who isn't ready for M-Pesa
yet — the "Pay Now via M-Pesa" button simply won't render, and the
existing WhatsApp order flow keeps working exactly as before.

Run `node build.js`, commit, push. Done.

---

## 4. How it works end to end

1. Customer fills the order form and taps **Pay Now via M-Pesa**.
2. Frontend calls `POST /api/mpesa/stkpush` on the tenant's server.
3. Server gets a Daraja OAuth token, sends the STK push request,
   returns a `CheckoutRequestID` to the frontend immediately.
4. Frontend polls `GET /api/mpesa/status/:checkoutRequestId` every 3s.
5. Customer enters their PIN on their phone. Safaricom POSTs the
   result to `/api/mpesa/callback` on the server.
6. Next time the frontend polls, it sees `status: "success"` (with
   the M-Pesa receipt number) or `status: "failed"`.
7. On success, the frontend opens the WhatsApp order message with the
   receipt number already included, so you get the order and proof
   of payment in one message.

If the callback is ever delayed (e.g. a cold Render instance), the
status endpoint also directly queries Safaricom as a fallback after
15 seconds — so a slow callback won't strand the customer on
"pending" forever.

---

## 5. Testing in sandbox

Safaricom's sandbox test number is `254708374149` with PIN `12345678` (their published test values may change — safaricom.co.ke has the current ones). Use that phone number when testing an order, and Safaricom's sandbox will simulate the PIN entry automatically.

---

## 6. Notes

- Each tenant gets its **own** deployed server + `.env` — no shared
  secrets between clients, same isolation model as the rest of this
  framework.
- Payment status is currently held in memory on the server (fine for
  this use case — customers wait on the same page for confirmation).
  If a client later wants payment history / reconciliation, swap
  `server/src/mpesa/store.js` for Firestore — same pattern already
  used in Merkaz POS / GO OS, and nothing else in the server needs to
  change.
- Cash-on-delivery / WhatsApp-only ordering keeps working regardless
  — M-Pesa is additive, not a replacement.
