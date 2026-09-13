# Dala Dala Water — App Update Guide

## How to update common things

### 1. Prices or Products
Edit **`js/config.js`** only. Each product has:
```js
{ id: 1, size: "300ml", price: 20, image: "images/product-300ml.jpg", description: "..." }
```
Change `price`, add a new product block, or remove one. Nothing else to touch.

---

### 2. Logo
Drop your logo file into the `images/` folder named exactly:
```
images/logo.png
```
Done. The app picks it up automatically.

---

### 3. Hero Banner (Home page background image)
Drop your image into:
```
images/hero.jpg
```
Done.

---

### 4. Product Images
Drop each product image into the `images/` folder and update the
`image` field in `js/config.js` to match the filename:
```js
{ id: 2, size: "500ml", price: 30, image: "images/product-500ml.jpg", ... }
```
If no image file is found, the image slot is hidden automatically — nothing breaks.

---

## File map (what lives where)

```
index.html               ← App shell — rarely needs editing
css/styles.css           ← All colours and layout
images/                  ← All images go here
  logo.png
  hero.jpg
  product-300ml.jpg
  product-500ml.jpg
  product-1litre.jpg
  product-5litres.jpg
js/
  config.js              ← MAIN FILE — prices, products, phone number
  app.js                 ← Boots the app
  router.js              ← Page navigation
  components/
    header.js            ← Top header bar
    nav.js               ← Bottom navigation
  pages/
    home.js              ← Home page content
    order.js             ← Order page + WhatsApp submit
    about.js             ← About + contact page
```

## Brand colour
To change the main blue colour, edit this line in `css/styles.css`:
```css
--blue: #0057B8;
```
