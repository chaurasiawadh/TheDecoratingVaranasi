import { Service, Package, Testimonial, ProductItem } from './types';

export const PHONE_NUMBER = "919936169852";
export const APP_NAME = "TheDecoratingVaranasi";
export const LOGO_URL = "https://i.ibb.co/V0LTJJpZ/THE-DECORATINDG-VARANASI-NEW-LOGO-2.png";

export const SERVICES: Service[] = [
  {
    id: "birthday",
    title: "Birthday Celebrations",
    description: "Magical setups for your special day. From balloon arches to themed parties.",
    image: "https://images.stockcake.com/public/c/8/1/c81f7134-8fd5-4e26-896f-5a0cd18eff8e_large/joyful-birthday-celebration-stockcake.jpg",
    priceStart: 1999,
    features: ["Balloon Arches", "Themed Backdrops", "Cake Table Decor"]
  },
  {
    id: "wedding",
    title: "Wedding Decorations",
    description: "Elegant floral arrangements and grand stage designs for your big day.",
    image: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwd2VkZGluZyUyMGRlY29yfGVufDB8fDB8fHww",
    priceStart: 15000,
    features: ["Floral Mandap", "Entrance Gate", "Stage Lighting"]
  },
  {
    id: "anniversary",
    title: "Anniversary Parties",
    description: "Romantic ambiance with candles, flowers, and elegant dining setups.",
    image: "https://m.media-amazon.com/images/I/71jLV5-8QOL._AC_UF1000,1000_QL80_.jpg",
    priceStart: 2500,
    features: ["Candlelight Dinner", "Room Decor", "Rose Petal Pathway"]
  },
  {
    id: "baby-shower",
    title: "Baby Showers",
    description: "Cute and cozy decorations to welcome the newest family member.",
    image: "https://t4.ftcdn.net/jpg/08/12/42/39/360_F_812423914_NbtgwoMQXTho1mxTTcjoWdWsmmhWbEv3.jpg",
    priceStart: 3500,
    features: ["Gender Reveal Props", "Soft Pastels", "Photo Booth"]
  },
  {
    id: "farewell",
    title: "Farewell Party",
    description: "Memorable send-offs with classy decor and photo corners.",
    image: "https://e1.pxfuel.com/desktop-wallpaper/683/418/desktop-wallpaper-fue-farewell-party-farewell.jpg",
    priceStart: 2000,
    features: ["Signature Wall", "Stage Setup", "Memory Lane"]
  },
  {
    id: "inauguration",
    title: "Inauguration Party",
    description: "Professional and grand setups for shop or office openings.",
    image: "https://www.flowernpetals.com/wp-content/uploads/2019/07/marigold-Mala-flower-decorations-genda-flower-Mala-Decoration-16.jpg",
    priceStart: 5000,
    features: ["Ribbon Cutting Area", "Flower Garlands", "Entrance Carpet"]
  }
];

// Helper to generate items
const generateItems = (serviceId: string, baseName: string, keywords: string, count: number): ProductItem[] => {
  return Array.from({ length: count }).map((_, i) => {
    const price = Math.floor(Math.random() * (20000 - 1500 + 1) + 1500);
    const discount = Math.random() > 0.3 ? Math.floor(Math.random() * 20 + 5) : 0; // 70% chance of discount
    const oldPrice = discount > 0 ? Math.floor(price * (1 + discount / 100)) : price;

    // Using loremflickr with lock to get consistent but varied images
    const image = `https://loremflickr.com/800/600/${keywords.replace(' ', ',')}?lock=${serviceId}-${i}`;

    return {
      id: `${serviceId}-item-${i + 1}`,
      serviceId,
      name: `${baseName} ${['Deluxe', 'Premium', 'Standard', 'Royal', 'Elegant'][i % 5]} ${i + 1}`,
      image,
      price,
      oldPrice,
      discount,
      shortDescription: `A beautiful ${baseName.toLowerCase()} setup perfect for your celebration.`,
      fullDescription: `Experience the best ${baseName.toLowerCase()} service in Varanasi. This package includes premium materials, professional installation, and breakdown. \n\nIncludes: \n- High-quality props and decor elements \n- LED lighting setup \n- 4-hour rental duration (extendable) \n- On-site coordinator. \n\nSuitable for both indoor and outdoor venues. Customize colors to match your theme!`,
      tags: [
        i % 3 === 0 ? "bestseller" : "",
        i % 4 === 0 ? "new" : "",
        price < 5000 ? "budget" : "premium",
        "same-day"
      ].filter(Boolean),
      rating: 4 + Math.random(),
      reviews: Math.floor(Math.random() * 100 + 10)
    };
  });
};

// Generate ~20 items per service
export const ALL_PRODUCTS: ProductItem[] = [
  ...generateItems("birthday", "Balloon Decor", "birthday,balloon", 22),
  ...generateItems("wedding", "Wedding Stage", "wedding,flowers", 20),
  ...generateItems("anniversary", "Romantic Setup", "rose,candle", 20),
  ...generateItems("baby-shower", "Baby Shower Theme", "baby,pastel", 20),
  ...generateItems("farewell", "Party Backdrop", "party,celebration", 20),
  ...generateItems("inauguration", "Inauguration Flower", "marigold,opening", 20),
];

// Keep existing packages for backward compatibility if needed, but UI will prefer ALL_PRODUCTS now
export const PACKAGES: Package[] = [
  {
    id: "bday-basic",
    serviceId: "birthday",
    name: "Basic Balloon Bliss",
    price: 1999,
    image: "https://picsum.photos/id/158/400/300",
    includes: ["200 Balloons", "Happy Birthday Foil", "Ribbons"]
  },
  {
    id: "bday-premium",
    serviceId: "birthday",
    name: "Premium Theme Setup",
    price: 4999,
    image: "https://picsum.photos/id/327/400/300",
    includes: ["Arch Setup", "Backdrop", "LED Lights", "Name Cutout"]
  },
  {
    id: "wed-royal",
    serviceId: "wedding",
    name: "Royal Floral Stage",
    price: 25000,
    image: "https://picsum.photos/id/514/400/300",
    includes: ["Fresh Flowers", "Sofa Set", "Stage Carpet", "Backdrop Drapes"]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Priya Singh",
    comment: "Absolutely stunning decoration for my son's 1st birthday! The team was punctual and creative.",
    rating: 5,
    image: "https://picsum.photos/id/64/100/100"
  },
  {
    id: 2,
    name: "Rahul Verma",
    comment: "Used their service for my sister's wedding haldi. Very professional and budget-friendly.",
    rating: 5,
    image: "https://picsum.photos/id/91/100/100"
  },
  {
    id: 3,
    name: "Amit Gupta",
    comment: "The surprise room decor for my wife was perfect. She loved it! Highly recommended.",
    rating: 4,
    image: "https://picsum.photos/id/177/100/100"
  }
];