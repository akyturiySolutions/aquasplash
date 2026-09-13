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

function initApp() {
  applyTheme(CONFIG.theme);
  document.title = CONFIG.businessName;
  renderHeader();
  renderNav();
  navigateTo('home');
}

initApp();
