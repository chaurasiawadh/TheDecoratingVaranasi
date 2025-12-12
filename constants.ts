import { Service, Package, Testimonial } from './types';

export const PHONE_NUMBER = "919250333876";
export const APP_NAME = "TheDecoratingVaranasi";

export const SERVICES: Service[] = [
  {
    id: "birthday",
    title: "Birthday Celebrations",
    description: "Magical setups for your special day. From balloon arches to themed parties.",
    image: "https://picsum.photos/id/104/800/600", // Dreamy / Starry
    priceStart: 1999,
    features: ["Balloon Arches", "Themed Backdrops", "Cake Table Decor"]
  },
  {
    id: "wedding",
    title: "Wedding Decorations",
    description: "Elegant floral arrangements and grand stage designs for your big day.",
    image: "https://picsum.photos/id/250/800/600", // Camera/Flowers?
    priceStart: 15000,
    features: ["Floral Mandap", "Entrance Gate", "Stage Lighting"]
  },
  {
    id: "anniversary",
    title: "Anniversary Parties",
    description: "Romantic ambiance with candles, flowers, and elegant dining setups.",
    image: "https://picsum.photos/id/360/800/600", // Flowers
    priceStart: 2500,
    features: ["Candlelight Dinner", "Room Decor", "Rose Petal Pathway"]
  },
  {
    id: "baby-shower",
    title: "Baby Showers",
    description: "Cute and cozy decorations to welcome the newest family member.",
    image: "https://picsum.photos/id/998/800/600", // Soft / Light
    priceStart: 3500,
    features: ["Gender Reveal Props", "Soft Pastels", "Photo Booth"]
  },
  {
    id: "farewell",
    title: "Farewell Party",
    description: "Memorable send-offs with classy decor and photo corners.",
    image: "https://picsum.photos/id/435/800/600", // People / Gathering
    priceStart: 2000,
    features: ["Signature Wall", "Stage Setup", "Memory Lane"]
  },
  {
    id: "inauguration",
    title: "Inauguration Party",
    description: "Professional and grand setups for shop or office openings.",
    image: "https://picsum.photos/id/106/800/600", // Bright / Lights
    priceStart: 5000,
    features: ["Ribbon Cutting Area", "Flower Garlands", "Entrance Carpet"]
  }
];

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