// ============================================================
//  In-memory payment status store, keyed by CheckoutRequestID.
//
//  This is intentionally simple: these are small storefronts
//  where a customer pays and waits ~10-60s on the same page,
//  so persistence across server restarts isn't required. Entries
//  auto-expire after 30 minutes to avoid unbounded memory growth.
//
//  If a client later needs a payment history / reconciliation
//  dashboard, swap this for Firestore (same pattern used in
//  Merkaz POS / GO OS) — the rest of the code doesn't change,
//  only get()/set() below.
// ============================================================

const store = new Map();
const TTL_MS = 30 * 60 * 1000;

export function setPending(checkoutRequestId, data) {
  store.set(checkoutRequestId, {
    status: 'pending',
    ...data,
    createdAt: Date.now(),
  });
}

export function setResult(checkoutRequestId, result) {
  const existing = store.get(checkoutRequestId) || {};
  store.set(checkoutRequestId, {
    ...existing,
    ...result,
    updatedAt: Date.now(),
  });
}

export function get(checkoutRequestId) {
  return store.get(checkoutRequestId) || null;
}

// ── Periodic cleanup ──────────────────────────────────────
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now - value.createdAt > TTL_MS) store.delete(key);
  }
}, 5 * 60 * 1000).unref();
