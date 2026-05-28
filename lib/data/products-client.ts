import type { Product } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/env";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import { mapProductRow } from "@/lib/data/product-map";

/** Client-side fetch for interactive menu page (no server-only imports). */
export async function fetchProductsClient(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return MOCK_PRODUCTS;
  try {
    const supabase = createClient();
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
