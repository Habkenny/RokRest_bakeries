import "server-only";

import type { Product } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/env";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import { mapProductRow } from "@/lib/data/product-map";

/** Server Components / Route Handlers — uses cookies-aware Supabase client. */
export async function fetchProductsServer(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return MOCK_PRODUCTS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");
    if (error || !data?.length) return MOCK_PRODUCTS;
    return data.map((r) => mapProductRow(r as Record<string, unknown>));
  } catch {
    return MOCK_PRODUCTS;
  }
}

export function getFeaturedProducts(products: Product[], limit = 4) {
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}
