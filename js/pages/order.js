// ============================================================
//  Order Page
//  Product selection + quantity + WhatsApp submit + optional
//  M-Pesa STK Push payment
// ============================================================

import { CONFIG }          from '../config.js';
import { updateActiveNav } from '../components/nav.js';

// ── Payment methods block: tap-to-copy Till/Paybill lines,
//    plain cash line, and an M-Pesa STK prompt (live button if
//    enabled, disabled preview + "Coming Soon" badge if not) ──
function buildPaymentMethodsHTML() {
  const pay = CONFIG.payments || {};
  const lines = [];

  if (pay.mpesaTill) {
    lines.push(`
      <div class="payment-line" onclick="window._copyPayment('${pay.mpesaTill}', this)">
        <div>
          <span class="payment-label">M-Pesa Till</span>
          <span class="payment-value">${pay.mpesaTill}</span>
        </div>
        <span class="copy-icon">📋</span>
      </div>
    `);
  }

  if (pay.paybillNumber) {
    const acctSuffix = pay.paybillAccount ? ` (A/C ${pay.paybillAccount})` : '';
    const copyText = pay.paybillAccount ? `${pay.paybillNumber} ${pay.paybillAccount}` : pay.paybillNumber;
    lines.push(`
      <div class="payment-line" onclick="window._copyPayment('${copyText}', this)">
        <div>
          <span class="payment-label">Equity Paybill</span>
          <span class="payment-value">${pay.paybillNumber}<small>${acctSuffix}</small></span>
        </div>
        <span class="copy-icon">📋</span>
      </div>
    `);
  }

  if (pay.cashOnDelivery) {
    lines.push(`
      <div class="payment-line-simple">
        <span class="payment-label">Cash</span>
        <span class="payment-value">Pay on Delivery</span>
      </div>
    `);
  }

  const mpesaSection = pay.mpesaEnabled ? '' : `
    <div class="mpesa-coming-soon-block">
      <div class="mpesa-coming-soon-header">
        <span>📲 Instant M-Pesa Payment Prompt</span>
        <span class="badge-soon">Coming Soon</span>
      </div>
      <input class="form-input" type="tel" placeholder="Phone number (feature launching soon)" disabled>
    </div>
  `;

  return `
    <div class="payment-methods-card">
      <h3>💳 Payment Methods</h3>
      ${lines.join('')}
      ${mpesaSection}
    </div>
  `;
}

window._copyPayment = async (text, el) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  const icon = el.querySelector('.copy-icon');
  if (!icon) return;
  const original = icon.textContent;
  icon.textContent = '✅';
  setTimeout(() => { icon.textContent = original; }, 1500);
};

export function initOrder() {
  updateActiveNav('order');

  const mpesaOn = CONFIG.payments && CONFIG.payments.mpesaEnabled;

  // Build product cards
  const productsHTML = CONFIG.products.map(p => `
    <div class="product-card" data-id="${p.id}">
      <img class="product-img"
           src="${p.image}"
           alt="${p.size}"
           onerror="this.style.display='none'">
      <div class="product-info">
        <h3 class="product-size">${p.size}</h3>
        <p class="product-pack">${p.pack}</p>
        <p class="product-desc">${p.description}</p>
        <p class="product-price">KES ${p.price}</p>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="window._changeQty(${p.id}, -1)">−</button>
        <span class="qty-display" id="qty-${p.id}">0</span>
        <button class="qty-btn" onclick="window._changeQty(${p.id}, +1)">+</button>
      </div>
    </div>
  `).join('');

  document.getElementById('content').innerHTML = `
    <div class="page order-page">
      <h2 class="page-title">${CONFIG.order.pageTitle}</h2>

      <div class="products-list">
        ${productsHTML}
      </div>

      ${buildPaymentMethodsHTML()}

      <div class="order-summary" id="orderSummary" style="display:none">
        <h3>Order Summary</h3>
        <div id="summaryItems"></div>
        <p class="summary-total" id="summaryTotal"></p>
      </div>

      <div class="order-form">
        <input class="form-input" id="customerName"  type="text"  placeholder="Your name *" />
        <input class="form-input" id="customerPhone" type="tel"   placeholder="Your phone number *" />
        <input class="form-input" id="customerArea"  type="text"  placeholder="Your area / location *" />
      </div>

      ${mpesaOn ? `
      <button class="btn-mpesa" id="mpesaBtn" onclick="window._payWithMpesa()">
        📱 Pay Now via M-Pesa
      </button>
      <p class="mpesa-status" id="mpesaStatus" style="display:none"></p>
      ` : ''}

      <button class="btn-whatsapp" id="submitBtn" onclick="window._submitOrder()">
        📲 Send Order via WhatsApp
      </button>
      <p class="order-note">${CONFIG.order.formNote}</p>
    </div>
  `;

  // Quantity state: { productId: quantity }
  const quantities = {};
  CONFIG.products.forEach(p => { quantities[p.id] = 0; });

  // Expose qty handler globally for onclick
  window._changeQty = (id, delta) => {
    quantities[id] = Math.max(0, (quantities[id] || 0) + delta);
    document.getElementById(`qty-${id}`).textContent = quantities[id];
    refreshSummary(quantities);
  };

  // Expose submit handlers globally
  window._submitOrder = () => submitOrder(quantities);
  if (mpesaOn) window._payWithMpesa = () => payWithMpesa(quantities);
}

// ── Summary display ──────────────────────────────────────────

function refreshSummary(quantities) {
  const items = CONFIG.products.filter(p => quantities[p.id] > 0);
  const summaryEl = document.getElementById('orderSummary');

  if (items.length === 0) {
    summaryEl.style.display = 'none';
    return;
  }

  summaryEl.style.display = 'block';

  const total = items.reduce((sum, p) => sum + p.price * quantities[p.id], 0);

  document.getElementById('summaryItems').innerHTML = items.map(p => `
    <div class="summary-row">
      <span>${p.size} × ${quantities[p.id]}</span>
      <span>KES ${p.price * quantities[p.id]}</span>
    </div>
  `).join('');

  document.getElementById('summaryTotal').innerHTML =
    `<strong>Total: KES ${total}</strong>`;
}

// ── Shared validation ─────────────────────────────────────────

function validateForm(quantities) {
  const name  = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const area  = document.getElementById('customerArea').value.trim();
  const items = CONFIG.products.filter(p => quantities[p.id] > 0);

  if (!name || !phone || !area) {
    alert('Please fill in your name, phone number, and area.');
    return null;
  }
  if (items.length === 0) {
    alert('Please select at least one product.');
    return null;
  }

  const total = items.reduce((sum, p) => sum + p.price * quantities[p.id], 0);
  return { name, phone, area, items, total };
}

function buildOrderMessage({ name, phone, area, items, total }, extra = '') {
  const orderLines = items
    .map(p => `  • ${p.size} ${p.pack} × ${p.qty} = KES ${p.price * p.qty}`)
    .join('\n');

  return (
    `${CONFIG.order.whatsappGreeting}\n\n` +
    `*New Order*\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Area: ${area}\n\n` +
    `*Items:*\n${orderLines}\n\n` +
    `*Total: KES ${total}*\n` +
    extra +
    `\n${CONFIG.order.whatsappClosing}`
  );
}

// ── WhatsApp submit (cash / pay-on-delivery path) ─────────────

function submitOrder(quantities) {
  const form = validateForm(quantities);
  if (!form) return;

  const itemsWithQty = form.items.map(p => ({ ...p, qty: quantities[p.id] }));
  const message = buildOrderMessage({ ...form, items: itemsWithQty });

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ── M-Pesa STK Push submit ────────────────────────────────────

async function payWithMpesa(quantities) {
  const form = validateForm(quantities);
  if (!form) return;

  const statusEl = document.getElementById('mpesaStatus');
  const btn = document.getElementById('mpesaBtn');

  const setStatus = (text) => {
    statusEl.style.display = 'block';
    statusEl.textContent = text;
  };

  btn.disabled = true;
  setStatus('Sending payment request to your phone…');

  try {
    const initRes = await fetch(`${CONFIG.payments.apiBaseUrl}/api/mpesa/stkpush`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: form.phone,
        amount: form.total,
        accountReference: form.name,
        transactionDesc: `${CONFIG.businessName} order`,
      }),
    });

    const initData = await initRes.json();

    if (!initRes.ok) {
      setStatus(`❌ ${initData.error || 'Could not start payment. Please try again.'}`);
      btn.disabled = false;
      return;
    }

    setStatus('📲 Check your phone and enter your M-Pesa PIN to complete payment…');

    const result = await pollForResult(initData.checkoutRequestId);
    const itemsWithQty = form.items.map(p => ({ ...p, qty: quantities[p.id] }));

    if (result.status === 'success') {
      setStatus(`✅ Payment received! Receipt: ${result.mpesaReceiptNumber}`);
      const receiptNote = `\n*Paid via M-Pesa:* ${result.mpesaReceiptNumber}\n`;
      const message = buildOrderMessage({ ...form, items: itemsWithQty }, receiptNote);
      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      setStatus(`❌ Payment ${result.status === 'failed' ? 'failed' : 'was not completed'}${result.resultDesc ? ': ' + result.resultDesc : ''}. You can try again or send your order via WhatsApp instead.`);
      btn.disabled = false;
    }
  } catch (err) {
    console.error('M-Pesa payment error:', err);
    setStatus('❌ Could not reach the payment service. Please check your connection or send your order via WhatsApp instead.');
    btn.disabled = false;
  }
}

// Poll the status endpoint every 3s for up to ~90s
async function pollForResult(checkoutRequestId) {
  const maxAttempts = 30;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));
    try {
      const res = await fetch(`${CONFIG.payments.apiBaseUrl}/api/mpesa/status/${checkoutRequestId}`);
      const data = await res.json();
      if (data.status && data.status !== 'pending') return data;
    } catch {
      // network hiccup mid-poll — keep trying
    }
  }
  return { status: 'timeout', resultDesc: 'No response received in time' };
}
