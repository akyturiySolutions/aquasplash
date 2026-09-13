import { CONFIG } from '../config.js';

export function renderHeader() {
  document.getElementById('header').innerHTML = `
    <div class="app-header">
      <div class="header-logo">
        <img src="images/logo.png" alt="Logo" onerror="this.parentElement.innerHTML='<div class=\'header-logo-placeholder\'>💧</div>'">
      </div>
      <div class="header-text">
        <div class="header-title">${CONFIG.businessName}</div>
        <div class="header-tagline">${CONFIG.tagline}</div>
      </div>
      <div class="header-actions">
        <button class="header-icon-btn" onclick="window.open('tel:${CONFIG.phone}')">📞</button>
        <button class="header-icon-btn" onclick="window.open('https://wa.me/${CONFIG.whatsappNumber}')">💬</button>
      </div>
    </div>
  `;
}
