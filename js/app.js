// ============================================================
//  App Entry Point
//  Boots the app: applies tenant theme, renders shell
//  components, then loads home page
// ============================================================

import { CONFIG }       from './config.js';
import { renderHeader } from './components/header.js';
import { renderNav }    from './components/nav.js';
import { navigateTo }   from './router.js';

// ── Apply tenant theme colors as CSS custom properties ──────
// Maps camelCase keys in CONFIG.theme to the --kebab-case
// custom properties defined in css/styles.css
function applyTheme(theme) {
  if (!theme) return;
  const map = {
    navy:      '--navy',
    blue:      '--blue',
    blueMid:   '--blue-mid',
    blueLight: '--blue-light',
    green:     '--green',
    greenDark: '--green-dark',
    text:      '--text',
    textLight: '--text-light',
    bg:        '--bg',
    cardBg:    '--card-bg',
    border:    '--border',
  };
  const root = document.documentElement.style;
  Object.entries(map).forEach(([key, cssVar]) => {
    if (theme[key]) root.setProperty(cssVar, theme[key]);
  });
}

// ── Install prompt (discreet header button) ──────────────────
// Android/Chrome: fires beforeinstallprompt when installable.
// iOS Safari never fires that event, so we detect iOS separately
// and show simple manual instructions instead (no native prompt
// exists there). Never shown if already running as an installed app.
let deferredInstallPrompt = null;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true; // iOS Safari's own flag
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function showInstallButton() {
  const btn = document.getElementById('installBtn');
  if (btn) btn.style.display = 'flex';
}

function hideInstallButton() {
  const btn = document.getElementById('installBtn');
  if (btn) btn.style.display = 'none';
}

function setupInstallPrompt() {
  if (isStandalone()) return; // already installed — never show

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    hideInstallButton();
  });

  // iOS has no install event at all — offer manual steps instead,
  // since Safari doesn't support a programmatic prompt.
  if (isIOS()) {
    showInstallButton();
  }

  window._installApp = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      hideInstallButton();
      return;
    }
    if (isIOS()) {
      alert('To install: tap the Share icon below, then "Add to Home Screen".');
    }
  };
}

window.addEventListener('sw-update-available', () => {
  const banner = document.getElementById('updateBanner');
  if (banner) banner.style.display = 'flex';
});

function initApp() {
  applyTheme(CONFIG.theme);
  document.title = CONFIG.businessName;
  renderHeader();
  renderNav();
  navigateTo('home');
  setupInstallPrompt();
}

initApp();
