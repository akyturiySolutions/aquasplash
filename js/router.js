let currentPage = null;

export function navigateTo(pageName) {
  if (currentPage === pageName) return;
  currentPage = pageName;
  switch (pageName) {
    case 'home':     import('./pages/home.js').then(m => m.initHome()); break;
    case 'products': import('./pages/products.js').then(m => m.initProducts()); break;
    case 'order':    import('./pages/order.js').then(m => m.initOrder()); break;
    case 'about':    import('./pages/about.js').then(m => m.initAbout()); break;
    case 'landing':  import('./pages/landing.js').then(m => m.initLanding()); break;
    default:         import('./pages/home.js').then(m => m.initHome());
  }
}

export function getCurrentPage() { return currentPage; }
