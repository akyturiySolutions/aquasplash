import { CONFIG } from '../config.js';
import { updateActiveNav } from '../components/nav.js';

export function initProducts() {
  updateActiveNav('products');

  const cards = CONFIG.products.map(p => `
    <div class="product-card">
      <img class="product-img" src="${p.image}" alt="${p.size}"
           onerror="this.style.display='none'">
      <div class="product-info">
        <div class="product-size">${p.size}</div>
        <div class="product-pack">${p.pack}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-price">KES ${p.price}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('content').innerHTML = `
    <div class="page">
      <p class="page-title">Our Products</p>
      <div class="product-grid">${cards}</div>
      <button class="btn-order" onclick="window._nav('order')">
        🛒 Make an Order
      </button>
    </div>
  `;
}
