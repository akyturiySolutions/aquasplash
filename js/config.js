// ============================================================
//  TENANT CONFIG — AquaSplash
// ============================================================

export const CONFIG = {

  // -----------------------------------------------------------
  //  Identity
  // -----------------------------------------------------------
  businessName: "AquaSplash",
  shortName:    "AquaSplash",
  tagline:      "Purified Drinking Water",
  heroSubtitle: "Your Hygiene Our Priority",
  emoji:        "💧",

  phone:          "+254726557840",
  whatsappNumber: "254726557840",   // WhatsApp Sales line

  // -----------------------------------------------------------
  //  Theme
  // -----------------------------------------------------------
  theme: {
    navy:       "#0b2a63",
    blue:       "#17469e",
    blueMid:    "#1f5fc4",
    blueLight:  "#d9ecfa",
    green:      "#1da85a",
    greenDark:  "#178a49",
    text:       "#132043",
    textLight:  "#55627f",
    bg:         "#e3eefa",
    cardBg:     "#ffffff",
    border:     "#c7dcf2",
  },

  // -----------------------------------------------------------
  //  Home page content
  // -----------------------------------------------------------
  home: {
    welcomeHeading: "Welcome to AquaSplash",
    welcomeText:    "Quality, safe and affordable drinking water — delivered reliably with exceptional customer service across Mombasa, Kwale, and Kilifi Counties.",
    orderButtonLabel: "Order Water Now",
  },

  // -----------------------------------------------------------
  //  Order page / WhatsApp message wording
  // -----------------------------------------------------------
  order: {
    pageTitle:        "Place Your Order",
    whatsappGreeting: "Hello AquaSplash! 💧",
    whatsappClosing:  "Please confirm availability and delivery time. Asante!",
    formNote:         "Your order will be sent directly to us on WhatsApp",
  },

  // -----------------------------------------------------------
  //  About page
  // -----------------------------------------------------------
  about: {
    blurb: "provides quality, safe and affordable drinking water, delivered reliably with exceptional customer service. Our mission is to become the most trusted water brand, renowned for quality, reliability and innovation.",
  },

  // -----------------------------------------------------------
  //  Contact page
  // -----------------------------------------------------------
  contact: {
    intro: "We're happy to help with orders, delivery questions, or anything else. Call us on +254 726 557 840 or +254 101 141 268.",
    locationText: "Nyali, Mombasa, Kenya.",
    businessHours: "Monday – Saturday: 8:00 AM – 5:00 PM",
  },

  // -----------------------------------------------------------
  //  Delivery page
  // -----------------------------------------------------------
  delivery: {
    timesText: "Contact us to confirm delivery timing for your order.", // TODO: confirm same-day cutoff / delivery windows with client
    paymentText: "M-Pesa Till 9226343, Equity Paybill 247247 (Account No. 801801), or cash on delivery.",
    minimumOrderText: "Contact us to confirm minimum order quantities.", // TODO: confirm with client
  },

  // -----------------------------------------------------------
  //  Map / service area page
  // -----------------------------------------------------------
  map: {
    areaLabel:      "Nyali, Mombasa, Kenya",
    serviceAreaText: "We currently deliver across Mombasa, Kwale, and Kilifi Counties.<br><br>Contact us to confirm delivery to your specific location.",
    googleMapsUrl:  "https://maps.google.com/?q=Nyali,Mombasa,Kenya",
  },

  // -----------------------------------------------------------
  //  Delivery areas (chips shown on About / Delivery pages)
  // -----------------------------------------------------------
  deliveryAreas: [
    "Mombasa County", "Kwale County", "Kilifi County"
  ],

  // -----------------------------------------------------------
  //  Products
  // -----------------------------------------------------------
  products: [
    {
      id: 1,
      size:        "300ml",
      pack:        "1×24 Carton",
      price:       310,
      image:       "images/300ml-carton.jpg",
      description: "Carton of 24 small bottles — ideal for events & offices",
    },
    {
      id: 2,
      size:        "500ml",
      pack:        "1×24 Carton",
      price:       320,
      image:       "images/500ml-carton.jpg",
      description: "Carton of 24 standard bottles",
    },
    {
      id: 3,
      size:        "1.5 Litres",
      pack:        "1×12 Carton",
      price:       320,
      image:       "images/1-5L-pack.jpg",
      description: "Carton of 12 large bottles — great for home",
    },
    {
      id: 4,
      size:        "5 Litres",
      pack:        "1×4 Carton",
      price:       330,
      image:       "images/5L.png",
      description: "Carton of 4 five-litre bottles with carry handle",
    },
    {
      id: 5,
      size:        "10 Litres",
      pack:        "Single Bottle",
      price:       110,
      image:       "images/10L.jpg",
      description: "Single 10-litre bottle",
    },
    {
      id: 6,
      size:        "18.9 Litres",
      pack:        "Dispenser Bottle",
      price:       1800,
      image:       "images/20L.jpg",
      description: "Large dispenser bottle — best for offices & bulk use",
    },
    {
      id: 7,
      size:        "18.9 Litres",
      pack:        "Empty Hard Bottle (Reusable)",
      price:       1300,
      image:       "images/18-9L-empty-reusable.jpg",
      description: "Empty reusable hard bottle, no water included — for customers who need their own container",
    },
    {
      id: 8,
      size:        "18.9 Litres",
      pack:        "Disposable Jar (Empty)",
      price:       500,
      image:       "images/18-9L-empty-reusable.jpg",
      description: "Empty disposable jar, no water included",
    },
    {
      id: 9,
      size:        "10 Litres",
      pack:        "Disposable (Empty)",
      price:       250,
      image:       "images/10L.jpg",
      description: "Empty disposable 10-litre container, no water included",
    },
  ],

  // -----------------------------------------------------------
  //  Payments — M-Pesa STK Push (off until client's Daraja
  //  credentials are provided and /server is deployed for them)
  // -----------------------------------------------------------
  payments: {
    mpesaEnabled: false,
    apiBaseUrl: "https://aquasplash-mpesa-server.onrender.com", // update once deployed

    mpesaTill:      "9226343",
    paybillNumber:  "247247",
    paybillAccount: "801801",
    cashOnDelivery: true,
  },

  // -----------------------------------------------------------
  //  PWA / SEO metadata
  // -----------------------------------------------------------
  meta: {
    description: "Quality, safe, affordable drinking water delivered across Mombasa, Kwale, and Kilifi Counties — order online.",
    themeColor:  "#0b2a63",
    ogImage:     "images/icon-512.png",
    lang:        "en",
    categories:  ["food", "shopping"],
  },
};
