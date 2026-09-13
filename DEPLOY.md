# 🚀 Dala Dala Water — Deploy Guide

Two repos, two minutes of setup. After that, updates are instant.

---

## PART 1 — Deploy the PWA to Vercel (do this first)

### Step 1 — Create a GitHub repo for the PWA
1. Go to https://github.com → click **New**
2. Name it: `dala-dala-water-pwa`
3. Set to **Private**
4. Click **Create repository**
5. Upload all files from `DalaDalaWater-PWA.zip`
6. Click **Commit changes**

### Step 2 — Deploy to Vercel
1. Go to https://vercel.com → sign in with GitHub
2. Click **Add New → Project**
3. Select your `dala-dala-water-pwa` repo
4. Leave all settings as default (Vercel auto-detects it)
5. Click **Deploy**
6. ✅ Your PWA is live at e.g. `https://dala-dala-water-pwa.vercel.app`

> Copy that URL — you need it in Part 2.

### Step 3 — Test the PWA
- Open the URL on your Android phone in Chrome
- Tap the **"Add to Home Screen"** banner that appears
- It installs like a real app — full screen, no browser bar
- Open it offline — it still works ✅

---

## PART 2 — Update the TWA and build the Android APK

This gives you a proper `.apk` / `.aab` for Google Play that wraps your live PWA.

### Step 1 — Update the URL in AndroidManifest.xml
Open `DalaDalaWater-TWA/app/src/main/AndroidManifest.xml`
Find the two lines marked `✏️ REPLACE` and put in your real Vercel URL:

```xml
android:value="https://dala-dala-water-pwa.vercel.app"
...
android:host="dala-dala-water-pwa.vercel.app"
```

### Step 2 — Create a GitHub repo for the TWA
1. Go to https://github.com → click **New**
2. Name it: `dala-dala-water-twa`
3. Set to **Private**
4. Upload all files from `DalaDalaWater-TWA.zip` (including `.github` folder)
5. Click **Commit changes**

### Step 3 — Watch it build
1. Click the **Actions** tab in your TWA repo
2. You'll see **"Build TWA APK & AAB"** running
3. Download **DalaDalaWater-TWA-GOOGLE-PLAY** → upload to Google Play

---

## Everyday update workflow

```
Changed prices / products / text?
  → Edit js/config.js in the PWA repo on GitHub
  → Vercel rebuilds in ~10 seconds
  → Change is LIVE immediately — no APK rebuild needed ✅

Changed something major (app icon, name, permissions)?
  → Update TWA repo too → GitHub rebuilds APK → upload to Play Store
```

---

## Adding icons (important)

The PWA needs two icon files in the `images/` folder:
- `images/icon-192.png` — 192×192px version of your logo
- `images/icon-512.png` — 512×512px version of your logo

Without these, the install prompt won't show the correct icon.
You can create them from your existing logo using https://realfavicongenerator.net
