import { CONFIG } from '../config.js';
import { updateActiveNav } from '../components/nav.js';

export function initDelivery() {
  updateActiveNav('delivery');

  document.getElementById('content').innerHTML = `
    <div class="page">
      <p class="page-title">Delivery Info</p>

      <div class="info-card">
        <h3>🚚 Delivery Areas</h3>
        <div style="margin-top:8px">
          ${CONFIG.deliveryAreas.map(a => `<span class="area-tag">${a}</span>`).join('')}
        </div>
      </div>

      <div class="info-card">
        <h3>⏰ Delivery Times</h3>
        <p>${CONFIG.delivery.timesText}</p>
      </div>

      <div class="info-card">
        <h3>💳 Payment</h3>
        <p>${CONFIG.delivery.paymentText}</p>
      </div>

      <div class="info-card">
        <h3>📦 Minimum Order</h3>
        <p>${CONFIG.delivery.minimumOrderText}</p>
      </div>
    </div>
  `;
}
