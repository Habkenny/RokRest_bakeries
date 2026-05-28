import type {
  HolidayNotice,
  OpeningHoursRow,
  Product,
  Testimonial,
} from "@/lib/types";

/** Fallback catalogue when Supabase is not configured or fetch fails. */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "m1",
    name: "Sourdough Bloomer",
    description: "Slow-fermented loaf with a crackling crust.",
    price: 4.5,
    category: "Artisan Breads",
    image_url:
      "https://images.unsplash.com/photo-1586444248909-1c15a0a7b2c6?w=800&q=80",
    is_vegan: true,
    is_nut_free: true,
    featured: true,
  },
  {
    id: "m2",
    name: "Butter Croissant",
    description: "French-style layers, baked fresh each morning.",
    price: 2.8,
    category: "Pastries",
    image_url:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    is_vegan: false,
    is_nut_free: true,
    featured: true,
  },
  {
    id: "m3",
    name: "Tiramisu Slice",
    description: "Italian classic with espresso-soaked sponge.",
    price: 5.25,
    category: "Cakes & Desserts",
    image_url:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    is_vegan: false,
    is_nut_free: false,
    featured: true,
  },
  {
    id: "m4",
    name: "Spinach & Feta Parcel",
    description: "Flaky pastry with Mediterranean flavours.",
    price: 3.95,
    category: "Savories",
    image_url:
      "https://images.unsplash.com/photo-1625937759425-26d8e52dcb3e?w=800&q=80",
    is_vegan: false,
    is_nut_free: true,
    featured: true,
  },
  {
    id: "m5",
    name: "Pretzel Roll",
    description: "German-style pretzel dough with salt crystals.",
    price: 2.2,
    category: "International Specials",
    image_url:
      "https://images.unsplash.com/photo-1594631252849-802569c087d3?w=800&q=80",
    is_vegan: false,
    is_nut_free: true,
    featured: false,
  },
  {
    id: "m6",
    name: "Baklava Bites",
    description: "Middle Eastern honeyed pastry with pistachio.",
    price: 4.75,
    category: "International Specials",
    image_url:
      "https://images.unsplash.com/photo-1608743652456-0cfd3d85e51f?w=800&q=80",
    is_vegan: false,
    is_nut_free: false,
    featured: false,
  },
  {
    id: "m7",
    name: "Custard Bun",
    description: "Soft Asian-style milk bread with vanilla custard.",
    price: 2.9,
    category: "International Specials",
    image_url:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
    is_vegan: false,
    is_nut_free: true,
    featured: false,
  },
  {
    id: "m8",
    name: "Focaccia di Recco",
    description: "Thin Italian flatbread with olive oil and rosemary.",
    price: 4.1,
    category: "Artisan Breads",
    image_url:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80",
    is_vegan: true,
    is_nut_free: true,
    featured: false,
  },
  {
    id: "m9",
    name: "Victoria Sponge",
    description: "British tea-room classic with jam and cream.",
    price: 3.6,
    category: "Cakes & Desserts",
    image_url:
      "https://images.unsplash.com/photo-1562447279-89998b8c8b5c?w=800&q=80",
    is_vegan: false,
    is_nut_free: true,
    featured: false,
  },
  {
    id: "m10",
    name: "Vegan Cinnamon Swirl",
    description: "Plant-based swirl with caramel glaze.",
    price: 3.2,
    category: "Pastries",
    image_url:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80",
    is_vegan: true,
    is_nut_free: true,
    featured: false,
  },
  {
    id: "m11",
    name: "Scotch Egg",
    description: "Sausage-wrapped egg with wholegrain mustard.",
    price: 4.4,
    category: "Savories",
    image_url:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
    is_vegan: false,
    is_nut_free: true,
    featured: false,
  },
  {
    id: "m12",
    name: "Cardamom Bun",
    description: "Nordic-inspired knot with pearl sugar.",
    price: 3.5,
    category: "Pastries",
    image_url:
      "https://images.unsplash.com/photo-1517433670267-08bbd4f89046?w=800&q=80",
    is_vegan: false,
    is_nut_free: true,
    featured: false,
  },
  {
    id: "m13",
    name: "Manchester Tart",
    description: "Regional favourite with custard and cherry.",
    price: 3.85,
    category: "Cakes & Desserts",
    image_url:
      "https://images.unsplash.com/photo-1586985289686-b3bf05bcc740?w=800&q=80",
    is_vegan: false,
    is_nut_free: false,
    featured: false,
  },
  {
    id: "m14",
    name: "Seeded Rye",
    description: "Hearty German-style rye with sunflower seeds.",
    price: 5.1,
    category: "Artisan Breads",
    image_url:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    is_vegan: true,
    is_nut_free: false,
    featured: false,
  },
  {
    id: "m15",
    name: "Leek & Montgomery Tart",
    description: "British savoury tart with mature cheddar.",
    price: 4.95,
    category: "Savories",
    image_url:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
    is_vegan: false,
    is_nut_free: true,
    featured: false,
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Aisha K.",
    text: "Best croissants in Sheffield — flaky, buttery, and always warm.",
    rating: 5,
    date: "2025-11-02",
  },
  {
    id: "t2",
    name: "James P.",
    text: "The international specials are a treat. Baklava bites are incredible.",
    rating: 5,
    date: "2025-10-18",
  },
  {
    id: "t3",
    name: "Elena M.",
    text: "Ordered catering for our office; punctual and beautifully presented.",
    rating: 5,
    date: "2025-09-30",
  },
];

export const MOCK_OPENING_HOURS: OpeningHoursRow[] = [
  { id: "oh1", day_label: "Monday – Saturday", hours_text: "8:00 – 19:00", sort_order: 0 },
  { id: "oh2", day_label: "Sunday", hours_text: "9:00 – 15:00", sort_order: 1 },
];

export const MOCK_HOLIDAY_NOTICES: HolidayNotice[] = [
  {
    id: "h1",
    title: "Easter weekend",
    body: "Adjusted hours: Good Friday 9am–3pm; Easter Monday closed.",
    sort_order: 0,
  },
  {
    id: "h2",
    title: "Christmas",
    body: "24 Dec 9am–2pm; closed 25–26 Dec; 27 Dec 10am–4pm.",
    sort_order: 1,
  },
  {
    id: "h3",
    title: "Summer closure",
    body: "One-week summer break each August — dates posted in-store.",
    sort_order: 2,
  },
];

export function openingHoursBadgeText(rows: OpeningHoursRow[]) {
  const line = rows.find((r) => r.day_label.toLowerCase().includes("monday"));
  const sun = rows.find((r) => r.day_label.toLowerCase().includes("sunday"));
  if (line && sun) {
    return `${line.day_label.split("–")[0].trim()}–Sat ${line.hours_text.split("–")[0]?.trim()}–${line.hours_text.split("–")[1]?.trim()}, Sun ${sun.hours_text.replace(/\s+/g, " ")}`;
  }
  return "Mon–Sat 8am–7pm • Sun 9am–3pm";
}
