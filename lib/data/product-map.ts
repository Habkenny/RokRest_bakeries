import type { Product } from "@/lib/types";

export function mapProductRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description ?? ""),
    price: Number(row.price),
    category: row.category as Product["category"],
    image_url: String(row.image_url ?? ""),
    is_vegan: Boolean(row.is_vegan),
    is_nut_free: Boolean(row.is_nut_free),
    featured: Boolean(row.featured),
  };
}
