import { CONFIG } from '../config.js';
import { navigateTo } from '../router.js';
import { updateActiveNav } from '../components/nav.js';

export function initHome() {
  updateActiveNav('home');

  const featured = CONFIG.products.slice(0, 6).map(p => `
    <div class="feat-card" onclick="window._nav('order')">
      <img class="feat-card-img" src="${p.image}" alt="${p.size}"
           onerror="this.outerHTML='<div class=\\'feat-card-img-placeholder\\'>${CONFIG.emoji}</div>'">
      <div class="feat-card-body">
        <div class="feat-card-size">${p.size}</div>
        <div class="feat-card-pack">${p.pack}</div>
        <div class="feat-card-price">KES ${p.price}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('content').innerHTML = `
    <div class="hero">
      <img class="hero-logo" src="images/logo.png" alt="${CONFIG.businessName}"
           onerror="this.outerHTML='<div class=\\'hero-logo-placeholder\\'>${CONFIG.shortName}</div>'">
      <h1 class="hero-title">${CONFIG.businessName}</h1>
      <p class="hero-tagline"><span>✦</span> ${CONFIG.tagline.toUpperCase()} <span>✦</span></p>
      <p class="hero-subtitle">${CONFIG.heroSubtitle}</p>
      <svg class="hero-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path fill="#ddeef8" d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z"/>
      </svg>
    </div>

    <div class="page-body">

      <div class="welcome-card">
        <h2>${CONFIG.home.welcomeHeading} ${CONFIG.emoji}</h2>
        <p>${CONFIG.home.welcomeText}</p>
      </div>

      <div class="coast-promo-card">
        <h3>The Coastal Collection</h3>
        <p>See every AquaSplash size in one place, styled around the Mombasa coast we're proud to call home.</p>
        <button class="coast-promo-btn" onclick="window._nav('landing')">🌊 View the Collection</button>
      </div>

      <div class="quick-actions">
        <p class="section-heading">Quick Actions</p>
        <button class="btn-order" onclick="window._nav('order')">
          🛒 ${CONFIG.home.orderButtonLabel}
        </button>
        <div class="action-row">
          <button class="btn-whatsapp" onclick="window.open('https://wa.me/${CONFIG.whatsappNumber}')">
            💬 WhatsApp Chat
          </button>
          <button class="btn-call" onclick="window.open('tel:${CONFIG.phone}')">
            📞 Call Us
          </button>
        </div>
      </div>

      <div class="featured-section">
        <p class="section-heading">Featured Products</p>
        <div class="products-scroll">${featured}</div>
      </div>

    </div>
  `;
}
