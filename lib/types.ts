/** Shared domain types for RokRest bakery (DB-aligned). */

export type ProductCategory =
  | "Artisan Breads"
  | "Pastries"
  | "Cakes & Desserts"
  | "Savories"
  | "International Specials";

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Stored in DB as decimal GBP; app uses number for display. */
  price: number;
  category: ProductCategory;
  image_url: string;
  is_vegan: boolean;
  is_nut_free: boolean;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

export interface OpeningHoursRow {
  id: string;
  day_label: string;
  hours_text: string;
  sort_order: number;
}

export interface HolidayNotice {
  id: string;
  title: string;
  body: string;
  sort_order: number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface OrderPayload {
  customer_email: string;
  customer_name?: string;
  items: { id: string; name: string; quantity: number; price_each: number }[];
  total: number;
  delivery_slot: string;
  pickup_method: "delivery" | "curbside";
  postcode?: string;
  status: OrderStatus;
}
