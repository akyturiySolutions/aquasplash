// ============================================================
//  About Page
//  Business info and contact details
// ============================================================

import { CONFIG }          from '../config.js';
import { updateActiveNav } from '../components/nav.js';

export function initAbout() {
  updateActiveNav('about');

  document.getElementById('content').innerHTML = `
    <div class="page about-page">
      <h2 class="page-title">About Us</h2>

      <div class="about-card">
        <p>${CONFIG.businessName} ${CONFIG.about.blurb}</p>
      </div>

      <div class="contact-section">
        <h3>Contact Us</h3>

        <a class="contact-btn call-btn" href="tel:${CONFIG.phone}">
          📞 Call Us — ${CONFIG.phone}
        </a>

        <a class="contact-btn whatsapp-btn"
           href="https://wa.me/${CONFIG.whatsappNumber}"
           target="_blank">
          💬 Chat on WhatsApp
        </a>
      </div>

      <div class="areas-section">
        <h3>Delivery Areas</h3>
        <div class="areas-list">
          ${CONFIG.deliveryAreas.map(a => `<span class="area-tag">${a}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}
