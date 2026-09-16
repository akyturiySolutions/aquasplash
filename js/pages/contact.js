import { CONFIG } from '../config.js';
import { updateActiveNav } from '../components/nav.js';

export function initContact() {
  updateActiveNav('contact');

  document.getElementById('content').innerHTML = `
    <div class="page">
      <p class="page-title">Contact Us</p>

      <div class="info-card">
        <h3>Get in Touch</h3>
        <p>${CONFIG.contact.intro}</p>
      </div>

      <a class="contact-btn blue" href="tel:${CONFIG.phone}">
        📞 Call — ${CONFIG.phone}
      </a>

      <a class="contact-btn green" href="https://wa.me/${CONFIG.whatsappNumber}" target="_blank">
        💬 Chat on WhatsApp
      </a>

      <div class="info-card">
        <h3>📍 Location</h3>
        <p>${CONFIG.contact.locationText}</p>
      </div>

      <div class="info-card">
        <h3>🕐 Business Hours</h3>
        <p>${CONFIG.contact.businessHours}</p>
      </div>
    </div>
  `;
}
