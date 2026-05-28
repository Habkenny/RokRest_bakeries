import { NextResponse } from "next/server";
import { z } from "zod";
import { isStripeConfigured } from "@/lib/env";
import { quoteLineItems } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { tryCreateServiceRoleClient } from "@/lib/supabase/admin";
import { isPostcodeAllowed } from "@/lib/postcode";

const lineSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().min(1),
  price_each: z.number(),
});

const bodySchema = z.object({
  paymentIntentId: z.string(),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  items: z.array(lineSchema).min(1),
  deliverySlot: z.string().min(3),
  pickupMethod: z.enum(["delivery", "curbside"]),
  postcode: z.string().optional(),
});

/**
 * Confirms Stripe succeeded, re-quotes totals, persists order, and triggers email.
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
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }

  const {
    paymentIntentId,
    customerEmail,
    customerName,
    items,
    deliverySlot,
    pickupMethod,
    postcode,
  } = parsed.data;

  if (pickupMethod === "delivery") {
    const pc = postcode?.trim() ?? "";
    if (!pc || !isPostcodeAllowed(pc)) {
      return NextResponse.json(
        { error: "Delivery postcode is not in range." },
        { status: 400 }
      );
    }
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment has not completed yet." },
        { status: 400 }
      );
    }
  } catch (e) {
    console.error("[orders-complete-stripe]", e);
    return NextResponse.json(
      { error: "Could not verify payment." },
      { status: 500 }
    );
  }

  const quote = await quoteLineItems(
    items.map((i) => ({ id: i.id, quantity: i.quantity }))
  );
  const clientTotal = items.reduce(
    (s, i) => s + i.price_each * i.quantity,
    0
  );
  const serverTotal = quote.total_pence / 100;
  if (Math.abs(clientTotal - serverTotal) > 0.02) {
    return NextResponse.json(
      { error: "Amount mismatch — refresh and try again." },
      { status: 400 }
    );
  }

  const fallbackRef =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8).toUpperCase()
      : `RR${Date.now().toString().slice(-6)}`;

  let orderIdReturned: string = fallbackRef;
  const supabase = tryCreateServiceRoleClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_email: customerEmail,
        customer_name: customerName ?? null,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price_each: i.price_each,
        })),
        total: serverTotal,
        delivery_slot: deliverySlot,
        pickup_method: pickupMethod,
        postcode: postcode ?? null,
        status: "paid",
        stripe_payment_intent_id: paymentIntentId,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[orders-insert]", error.message);
      return NextResponse.json(
        { error: "Order saved in Stripe but database write failed." },
        { status: 500 }
      );
    }
    if (data?.id) {
      orderIdReturned = String(data.id);
    }
  } else {
    console.info(
      `[demo-order] #${fallbackRef} ${customerEmail} £${serverTotal.toFixed(2)}`
    );
  }

  const summaryLines = items.map(
    (i) => `${i.quantity}× ${i.name} — £${(i.price_each * i.quantity).toFixed(2)}`
  );

  const emailOrderLabel =
    orderIdReturned.includes("-") && orderIdReturned.length > 12
      ? orderIdReturned.replace(/-/g, "").slice(0, 8).toUpperCase()
      : orderIdReturned;

  await sendOrderConfirmationEmail({
    to: customerEmail,
    orderId: emailOrderLabel,
    summaryLines,
    totalGbp: serverTotal.toFixed(2),
  });

  return NextResponse.json({ orderId: orderIdReturned });
}
