export interface Service {
  id: string; // Maps to 'slug' in Firestore
  title: string; // Maps to 'service' in Firestore
  description: string;
  image: string; // Service Hero Image
  priceStart: number;
  features: string[]; // Maps to 'tags' in Firestore

  // Extra Firestore fields
  slug?: string;
  currency?: string;
  featured?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface Package {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  image: string;
  includes: string[];
}

export interface ProductItem {
  id: string;
  serviceId: string;
  name: string;
  image: string; // Maps to 'heroImage'
  price: number;
  oldPrice: number;
  discount: number; // percentage, mapped from discountPercent
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  rating: number;
  reviews: number; // mapped from reviewsCount

  // Firestore Schema Fields
  images?: string[];
  discountPercent?: number;
  discountText?: string;
  currency?: string;
  sku?: string;
  availability?: string;
  stockQty?: number;
  deliveryOptions?: string[];
  deliveryTimeEstimate?: string;
  areaCoverage?: string;
  guestsRecommended?: number;
  isFeatured?: boolean;
  meta?: {
    seoTitle: string;
    seoDescription: string;
  };
  createdAt?: number;
  updatedAt?: number;
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  packageId?: string; // Can map to ProductItem.id now as well
  date: string;
  time: string;
  address: string;
  guests: number;
  message: string;
}

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  image: string;
}

export interface CapturedMoment {
  id: string;
  name: string;
  type: string; // Service title or ID
  imageUrl: string;
  timestamp?: any;
}