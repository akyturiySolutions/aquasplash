import { navigateTo, getCurrentPage } from '../router.js';

function icon(paths) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

const NAV_ITEMS = [
  { id: 'home',     label: 'Home',     svg: icon('<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>') },
  { id: 'products', label: 'Products', svg: icon('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>') },
  { id: 'order',    label: 'Order',    svg: icon('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>') },
  { id: 'delivery', label: 'Delivery', svg: icon('<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>') },
  { id: 'contact',  label: 'Contact',  svg: icon('<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.5a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/>') },
  { id: 'map',      label: 'Map',      svg: icon('<polygon points="3 11 22 2 13 21 11 13 3 11"/>') },
  { id: 'about',    label: 'About',    svg: icon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>') },
];

export function renderNav() {
  document.getElementById('nav').innerHTML = `
    <nav class="bottom-nav">
      ${NAV_ITEMS.map(item => `
        <button class="nav-btn" data-page="${item.id}" onclick="window._nav('${item.id}')">
          ${item.svg}
          ${item.label}
        </button>
      `).join('')}
    </nav>
  `;
  window._nav = (page) => { navigateTo(page); updateActiveNav(page); };
}

export function updateActiveNav(page) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
}
