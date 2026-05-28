import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/env";

export function getStripe() {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
}
