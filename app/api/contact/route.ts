import { NextResponse } from "next/server";
import { z } from "zod";
import { tryCreateServiceRoleClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  message: z.string().min(10),
  order_type: z.enum(["general", "catering", "custom_cake", "other"]),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const supabase = tryCreateServiceRoleClient();
  if (supabase) {
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      message: parsed.data.message,
      order_type: parsed.data.order_type,
    });
    if (error) {
      console.error("[contact]", error.message);
      return NextResponse.json(
        { error: "Could not save message (check server logs)." },
        { status: 500 }
      );
    }
  } else {
    console.info(
      `[demo-contact] from ${parsed.data.email}: ${parsed.data.message.slice(0, 80)}…`
    );
  }

  return NextResponse.json({ ok: true });
}
