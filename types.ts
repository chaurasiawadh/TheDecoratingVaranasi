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

export interface BookingFormData {
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  packageId?: string;
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