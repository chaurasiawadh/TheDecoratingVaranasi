export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  priceStart: number;
  features: string[];
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
  image: string;
  price: number;
  oldPrice: number;
  discount: number; // percentage
  shortDescription: string;
  fullDescription: string;
  tags: string[]; // e.g., "bestseller", "outdoor", "premium"
  rating: number;
  reviews: number;
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
  id: number;
  name: string;
  comment: string;
  rating: number;
  image: string;
}