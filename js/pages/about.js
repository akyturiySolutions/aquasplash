// ============================================================
//  About Page
//  Combines business info, contact, delivery info, and
//  service area / map into one page (kept together deliberately
//  so the bottom nav stays to 4 tabs: Home, Products, Order, About)
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
        <p>${CONFIG.contact.intro}</p>

        <a class="contact-btn call-btn" href="tel:${CONFIG.phone}">
          📞 Call Us — ${CONFIG.phone}
        </a>

        <a class="contact-btn whatsapp-btn"
           href="https://wa.me/${CONFIG.whatsappNumber}"
           target="_blank">
          💬 Chat on WhatsApp
        </a>
      </div>

      <div class="info-card">
        <h3>📍 Location</h3>
        <p>${CONFIG.contact.locationText}</p>
      </div>

      <div class="info-card">
        <h3>🕐 Business Hours</h3>
        <p>${CONFIG.contact.businessHours}</p>
      </div>

      <div class="areas-section">
        <h3>🚚 Delivery Areas</h3>
        <div class="areas-list">
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

      <div class="info-card">
        <h3>🗺️ Service Area</h3>
        <p>${CONFIG.map.serviceAreaText}</p>
      </div>

      <a class="contact-btn green" href="${CONFIG.map.googleMapsUrl}" target="_blank">
        📍 Open in Google Maps
      </a>
    </div>
  `;
}
