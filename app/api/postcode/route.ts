import { NextResponse } from "next/server";
import { z } from "zod";
import { isPostcodeAllowed } from "@/lib/postcode";

const bodySchema = z.object({
  postcode: z.string().min(3),
});

/**
 * Mirrors Ideal Postcodes behaviour in demo mode: deterministic Sheffield checks.
 * Swap `isPostcodeAllowed` for a fetch() when IDEAL_POSTCODES_API_KEY is wired.
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid postcode" }, { status: 400 });
  }

  const ok = isPostcodeAllowed(parsed.data.postcode);
  return NextResponse.json({
    ok,
    message: ok
      ? "Great — you are inside our delivery zone."
      : "Sorry — that postcode is outside our delivery area.",
  });
}
