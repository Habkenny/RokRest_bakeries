import type { Testimonial } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/env";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

export async function fetchTestimonialsClient(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return MOCK_TESTIMONIALS;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("date", { ascending: false });
    if (error || !data?.length) return MOCK_TESTIMONIALS;
    return data.map((r) => ({
      id: String((r as { id: string }).id),
      name: String((r as { name: string }).name),
      text: String((r as { text: string }).text),
      rating: Number((r as { rating: number }).rating),
      date: String((r as { date: string }).date),
    }));
  } catch {
    return MOCK_TESTIMONIALS;
  }
}

export async function fetchTestimonialsServer(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return MOCK_TESTIMONIALS;
  try {
    const { createClient: createServerClient } = await import(
      "@/lib/supabase/server"
    );
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("date", { ascending: false });
    if (error || !data?.length) return MOCK_TESTIMONIALS;
    return data.map((r) => ({
      id: String((r as { id: string }).id),
      name: String((r as { name: string }).name),
      text: String((r as { text: string }).text),
      rating: Number((r as { rating: number }).rating),
      date: String((r as { date: string }).date),
    }));
  } catch {
    return MOCK_TESTIMONIALS;
  }
}
