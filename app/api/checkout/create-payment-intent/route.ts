import { NextResponse } from "next/server";
import { z } from "zod";
import { isStripeConfigured } from "@/lib/env";
import { quoteLineItems } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";

const itemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().min(1).max(99),
});

const bodySchema = z.object({
  items: z.array(itemSchema).min(1),
  email: z.string().email().optional(),
});

/** Creates a PaymentIntent with a server-calculated amount (GBP, pence). */
export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
      },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
  }

  const { lines, total_pence } = await quoteLineItems(
    parsed.data.items.map((i) => ({ id: i.id, quantity: i.quantity }))
  );

  if (!lines.length || total_pence < 50) {
    return NextResponse.json(
      { error: "Basket total is too small or items are unavailable." },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: total_pence,
      currency: "gbp",
      receipt_email: parsed.data.email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        item_count: String(lines.length),
      },
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      amount: total_pence / 100,
    });
  } catch (e) {
    console.error("[stripe-pi]", e);
    return NextResponse.json(
      { error: "Could not start payment. Try again shortly." },
      { status: 500 }
    );
  }
}
