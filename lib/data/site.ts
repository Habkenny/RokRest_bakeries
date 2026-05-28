import type { HolidayNotice, OpeningHoursRow } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/env";
import {
  MOCK_HOLIDAY_NOTICES,
  MOCK_OPENING_HOURS,
} from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

export async function fetchOpeningHoursClient(): Promise<OpeningHoursRow[]> {
  if (!isSupabaseConfigured()) return MOCK_OPENING_HOURS;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("opening_hours")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return MOCK_OPENING_HOURS;
    return data.map((r) => ({
      id: String((r as { id: string }).id),
      day_label: String((r as { day_label: string }).day_label),
      hours_text: String((r as { hours_text: string }).hours_text),
      sort_order: Number((r as { sort_order: number }).sort_order),
    }));
  } catch {
    return MOCK_OPENING_HOURS;
  }
}

export async function fetchOpeningHoursServer(): Promise<OpeningHoursRow[]> {
  if (!isSupabaseConfigured()) return MOCK_OPENING_HOURS;
  try {
    const { createClient: createServerClient } = await import(
      "@/lib/supabase/server"
    );
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("opening_hours")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return MOCK_OPENING_HOURS;
    return data.map((r) => ({
      id: String((r as { id: string }).id),
      day_label: String((r as { day_label: string }).day_label),
      hours_text: String((r as { hours_text: string }).hours_text),
      sort_order: Number((r as { sort_order: number }).sort_order),
    }));
  } catch {
    return MOCK_OPENING_HOURS;
  }
}

export async function fetchHolidayNoticesClient(): Promise<HolidayNotice[]> {
  if (!isSupabaseConfigured()) return MOCK_HOLIDAY_NOTICES;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("holiday_notices")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return MOCK_HOLIDAY_NOTICES;
    return data.map((r) => ({
      id: String((r as { id: string }).id),
      title: String((r as { title: string }).title),
      body: String((r as { body: string }).body),
      sort_order: Number((r as { sort_order: number }).sort_order),
    }));
  } catch {
    return MOCK_HOLIDAY_NOTICES;
  }
}

export async function fetchHolidayNoticesServer(): Promise<HolidayNotice[]> {
  if (!isSupabaseConfigured()) return MOCK_HOLIDAY_NOTICES;
  try {
    const { createClient: createServerClient } = await import(
      "@/lib/supabase/server"
    );
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("holiday_notices")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return MOCK_HOLIDAY_NOTICES;
    return data.map((r) => ({
      id: String((r as { id: string }).id),
      title: String((r as { title: string }).title),
      body: String((r as { body: string }).body),
      sort_order: Number((r as { sort_order: number }).sort_order),
    }));
  } catch {
    return MOCK_HOLIDAY_NOTICES;
  }
}
