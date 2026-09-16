// ============================================================
//  Landing Page — "Coastal Collection"
//  A visual showcase of the full product catalog, themed around
//  Mombasa's coast (dhow sailboats, the Indian Ocean, the sand).
//  Reached via a button on Home — not part of the bottom nav.
// ============================================================

import { CONFIG } from '../config.js';

function dhowSVG() {
  return `
  <svg class="dhow" viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <!-- mast -->
    <line x1="118" y1="150" x2="100" y2="18" stroke="#0F2B2E" stroke-width="3" stroke-linecap="round"/>
    <!-- lateen sail -->
    <path d="M100 18 L182 132 L118 150 Z" fill="#FBF7EC" stroke="#0F2B2E" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- boom -->
    <line x1="100" y1="18" x2="182" y2="132" stroke="#0F2B2E" stroke-width="2"/>
    <!-- hull -->
    <path d="M20 158 Q110 190 205 152 Q188 172 108 176 Q40 174 20 158 Z" fill="#0F2B2E"/>
    <!-- waterline reflection -->
    <path d="M35 168 Q110 184 190 162" fill="none" stroke="#0F2B2E" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  </svg>`;
}

// One palm, built from a curved trunk + five fronds fanning from the crown.
// mirror=true flips it for the right side of the frame.
function palmSVG(mirror) {
  return `
  <svg class="palm ${mirror ? 'palm-right' : 'palm-left'}" viewBox="0 0 160 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g ${mirror ? 'transform="translate(160,0) scale(-1,1)"' : ''}>
      <path d="M60 260 C55 190 50 140 78 92" fill="none" stroke="#0F2B2E" stroke-width="9" stroke-linecap="round"/>
      <g fill="#0F2B2E">
        <path d="M78 92 C50 78 20 82 4 68 C28 60 56 62 80 80 Z"/>
        <path d="M78 92 C46 66 30 40 10 18 C42 24 66 46 84 78 Z"/>
        <path d="M78 92 C68 56 68 26 60 0 C86 16 92 50 88 84 Z"/>
        <path d="M78 92 C94 58 118 38 132 14 C120 44 108 68 90 88 Z"/>
        <path d="M78 92 C104 82 126 88 150 78 C132 96 108 100 84 98 Z"/>
      </g>
    </g>
  </svg>`;
}

function waveDivider() {
  return `
  <svg class="wave-divider" viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,45 L1440,90 L0,90 Z" fill="#F3E7CE"/>
  </svg>`;
}

export function initLanding() {
  const productsHTML = CONFIG.products.map(p => `
    <div class="coast-card">
      <div class="coast-card-img-wrap">
        <img src="${p.image}" alt="${p.size}" onerror="this.style.display='none'">
      </div>
      <div class="coast-card-body">
        <h3>${p.size}</h3>
        <p class="coast-card-pack">${p.pack}</p>
        <p class="coast-card-price">KES ${p.price}</p>
      </div>
    </div>
  `).join('');

  document.getElementById('content').innerHTML = `
    <div class="landing-page">

      <section class="coast-hero">
        <div class="coast-sky">
          <div class="coast-sun"></div>
          <svg class="coast-waves-bg" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0,120 C200,150 400,90 600,110 C800,130 1000,80 1200,105 C1320,120 1400,110 1440,115 L1440,200 L0,200 Z" fill="#0A4B52" opacity="0.55"/>
            <path d="M0,150 C240,175 480,130 720,145 C960,160 1200,125 1440,150 L1440,200 L0,200 Z" fill="#0A4B52" opacity="0.8"/>
          </svg>
          ${dhowSVG()}
          ${palmSVG(false)}
          ${palmSVG(true)}
        </div>

        <div class="coast-hero-copy">
          <p class="coast-kicker">${CONFIG.businessName} · Mombasa, Kenya</p>
          <h1>Drawn from the coast<br>that raised us</h1>
          <p class="coast-sub">${CONFIG.heroSubtitle} — purified drinking water, delivered from the shores of Mombasa to your door.</p>
        </div>

        ${waveDivider()}
      </section>

      <section class="coast-proof">
        <img src="images/hero.jpg" alt="The full AquaSplash range" onerror="this.parentElement.style.display='none'">
        <p class="coast-proof-caption">The full AquaSplash range, from 300ml to our 20-litre dispenser.</p>
      </section>

      <section class="coast-collection">
        <h2>Our Collection</h2>
        <p class="coast-collection-sub">Every size, from a single bottle to a full office dispenser.</p>
        <div class="coast-grid">
          ${productsHTML}
        </div>
      </section>

      <section class="coast-cta">
        <h2>Order today</h2>
        <p>Delivering across Mombasa, Kwale, and Kilifi Counties.</p>
        <div class="coast-cta-buttons">
          <button class="coast-btn coast-btn-primary" onclick="window._nav('order')">Make an Order</button>
          <button class="coast-btn coast-btn-secondary" onclick="window.open('https://wa.me/${CONFIG.whatsappNumber}')">Chat on WhatsApp</button>
        </div>
      </section>

    </div>
  `;
}
