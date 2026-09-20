// ============================================================
//  build.js — generates index.html and manifest.json from
//  js/config.js. Run this after editing config.js, before
//  every commit/push.
//
//  Usage (Windows CMD or any terminal with Node installed):
//      node build.js
//
//  Requires Node 18+ (uses native ES module dynamic import).
// ============================================================

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const { CONFIG } = await import('./js/config.js');

  await buildIndexHtml(CONFIG);
  await buildManifest(CONFIG);
  await buildVersionFile();

  console.log('✅ Generated index.html, manifest.json and version.json from js/config.js');
}

// version.json is what the page polls (over the network, never
// cached — see sw.js) to notice a new deploy. Its value is derived
// straight from sw.js's own CACHE_NAME, so bumping the cache name
// the normal way when you ship a change is the ONLY thing you need
// to remember — this file always stays in lockstep automatically.
async function buildVersionFile() {
  const swPath = path.join(__dirname, 'sw.js');
  const sw = await readFile(swPath, 'utf8');
  const match = sw.match(/const\s+CACHE_NAME\s*=\s*['"]([^'"]+)['"]/);
  if (!match) {
    throw new Error('Could not find CACHE_NAME in sw.js — version.json not generated.');
  }
  await writeFile(
    path.join(__dirname, 'version.json'),
    JSON.stringify({ version: match[1] }, null, 2) + '\n',
    'utf8'
  );
}

async function buildIndexHtml(CONFIG) {
  const templatePath = path.join(__dirname, 'index.template.html');
  let html = await readFile(templatePath, 'utf8');

  const replacements = {
    '{{LANG}}':             CONFIG.meta.lang || 'en',
    '{{THEME_COLOR}}':      CONFIG.meta.themeColor || CONFIG.theme.navy,
    '{{META_DESCRIPTION}}': CONFIG.meta.description,
    '{{SHORT_NAME}}':       CONFIG.shortName,
    '{{BUSINESS_NAME}}':    CONFIG.businessName,
    '{{OG_IMAGE}}':         CONFIG.meta.ogImage,
  };

  for (const [token, value] of Object.entries(replacements)) {
    html = html.split(token).join(value);
  }

  await writeFile(path.join(__dirname, 'index.html'), html, 'utf8');
}

async function buildManifest(CONFIG) {
  const manifest = {
    name: CONFIG.businessName,
    short_name: CONFIG.shortName,
    description: CONFIG.meta.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: CONFIG.meta.themeColor || CONFIG.theme.navy,
    theme_color: CONFIG.meta.themeColor || CONFIG.theme.navy,
    lang: CONFIG.meta.lang || 'en',
    categories: CONFIG.meta.categories || [],
    icons: [
      {
        src: 'images/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: 'images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: CONFIG.home.orderButtonLabel,
        short_name: 'Order',
        description: CONFIG.home.orderButtonLabel,
        url: '/?page=order',
        icons: [{ src: 'images/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'WhatsApp Chat',
        short_name: 'WhatsApp',
        description: 'Chat with us on WhatsApp',
        url: '/?page=contact',
        icons: [{ src: 'images/icon-192.png', sizes: '192x192' }],
      },
    ],
  };

  await writeFile(
    path.join(__dirname, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8'
  );
}

main().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
