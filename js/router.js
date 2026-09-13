let currentPage = null;

export function navigateTo(pageName) {
  if (currentPage === pageName) return;
  currentPage = pageName;
  switch (pageName) {
    case 'home':     import('./pages/home.js').then(m => m.initHome()); break;
    case 'products': import('./pages/products.js').then(m => m.initProducts()); break;
    case 'order':    import('./pages/order.js').then(m => m.initOrder()); break;
    case 'delivery': import('./pages/delivery.js').then(m => m.initDelivery()); break;
    case 'contact':  import('./pages/contact.js').then(m => m.initContact()); break;
    case 'map':      import('./pages/map.js').then(m => m.initMap()); break;
    case 'about':    import('./pages/about.js').then(m => m.initAbout()); break;
    default:         import('./pages/home.js').then(m => m.initHome());
  }
}

export function getCurrentPage() { return currentPage; }
