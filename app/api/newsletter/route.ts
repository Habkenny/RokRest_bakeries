import { NextResponse } from "next/server";
import { z } from "zod";
import { tryCreateServiceRoleClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  email: z.string().email(),
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
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = tryCreateServiceRoleClient();
  if (supabase) {
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: parsed.data.email.toLowerCase(),
    });
    if (error && error.code !== "23505") {
      console.error("[newsletter]", error.message);
      return NextResponse.json(
        { error: "Could not save subscription (check server logs)." },
        { status: 500 }
      );
    }
  } else {
    console.info(
      `[demo-newsletter] subscribed: ${parsed.data.email} (no service role key)`
    );
  }

  return NextResponse.json({ ok: true });
}
