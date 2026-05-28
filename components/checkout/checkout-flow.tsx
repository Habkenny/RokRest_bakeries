"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getNextDeliverySlots } from "@/lib/delivery-slots";
import { cartSubtotalGbp, useCartStore } from "@/store/cart-store";

type PickupMethod = "delivery" | "curbside";

function PaymentStep({
  email,
  name,
  deliverySlotLabel,
  pickupMethod,
  postcode,
  onOrderComplete,
}: {
  email: string;
  name: string;
  deliverySlotLabel: string;
  pickupMethod: PickupMethod;
  postcode: string;
  onOrderComplete: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const lines = useCartStore((s) => s.items);
  const [paying, setPaying] = useState(false);

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
          receipt_email: email,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message ?? "Payment failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const res = await fetch("/api/orders/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            customerEmail: email,
            customerName: name || undefined,
            items: lines.map((i) => ({
              id: i.productId,
              name: i.name,
              quantity: i.quantity,
              price_each: i.priceGbp,
            })),
            deliverySlot: deliverySlotLabel,
            pickupMethod,
            postcode: pickupMethod === "delivery" ? postcode : undefined,
          }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(body.error || "Could not finalise order");
          return;
        }
        onOrderComplete();
        router.push(
          `/order-confirmation?ref=${encodeURIComponent(String(body.orderId))}`
        );
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handlePay}>
      <PaymentElement />
      <Button
        type="submit"
        className="w-full bg-brand-amber text-accent-foreground hover:bg-brand-amber/90"
        disabled={!stripe || paying}
      >
        {paying ? "Processing…" : `Pay £${cartSubtotalGbp(lines).toFixed(2)}`}
      </Button>
    </form>
  );
}

export function CheckoutFlow() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>("delivery");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [checkingPc, setCheckingPc] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const slots = useMemo(() => getNextDeliverySlots(), []);

  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = useMemo(() => (pk ? loadStripe(pk) : null), [pk]);

  useEffect(() => {
    if (!items.length) {
      router.replace("/menu");
    }
  }, [items.length, router]);

  useEffect(() => {
    if (slots.length && !deliverySlot) {
      setDeliverySlot(slots[0]!.id);
    }
  }, [slots, deliverySlot]);

  const subtotal = cartSubtotalGbp(items);
  const deliverySlotLabel =
    slots.find((s) => s.id === deliverySlot)?.label ?? deliverySlot;

  const startPayment = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email for your receipt.");
      return;
    }
    if (!deliverySlot) {
      toast.error("Choose a delivery slot.");
      return;
    }
    if (pickupMethod === "delivery") {
      setCheckingPc(true);
      try {
        const pcRes = await fetch("/api/postcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postcode }),
        });
        const pcBody = await pcRes.json().catch(() => ({}));
        if (!pcRes.ok || !pcBody.ok) {
          toast.error(pcBody.message || "Postcode not in delivery zone.");
          return;
        }
      } finally {
        setCheckingPc(false);
      }
    }

    if (!pk || !stripePromise) {
      toast.error("Stripe publishable key is missing.");
      return;
    }

    const res = await fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          id: i.productId,
          quantity: i.quantity,
        })),
        email,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.clientSecret) {
      toast.error(body.error || "Could not start checkout.");
      return;
    }
    setClientSecret(body.clientSecret);
    setStep(2);
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 text-center">
        <p className="text-muted-foreground">Redirecting to menu…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-4 py-12 md:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-primary">
        Checkout
      </h1>
      <p className="mt-2 text-muted-foreground">
        Step {step} of 2 · Subtotal <strong>£{subtotal.toFixed(2)}</strong>
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              {step === 1 ? "Delivery & pickup" : "Payment"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="ck-name">Full name</Label>
                  <Input
                    id="ck-name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ck-email">Email</Label>
                  <Input
                    id="ck-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fulfilment</Label>
                  <RadioGroup
                    className="grid gap-3"
                    value={pickupMethod}
                    onValueChange={(v) => setPickupMethod(v as PickupMethod)}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="delivery" id="fulfil-delivery" />
                      <Label htmlFor="fulfil-delivery">
                        Delivery (Sheffield zone)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="curbside" id="fulfil-curbside" />
                      <Label htmlFor="fulfil-curbside">Curbside pickup</Label>
                    </div>
                  </RadioGroup>
                </div>

                {pickupMethod === "delivery" ? (
                  <div className="space-y-2">
                    <Label htmlFor="ck-postcode">Postcode</Label>
                    <Input
                      id="ck-postcode"
                      autoComplete="postal-code"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      We deliver to S1–S11, S35, and S36.
                    </p>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="ck-slot">Delivery / pickup slot</Label>
                  <Select
                    value={deliverySlot}
                    onValueChange={(v) => setDeliverySlot(v ?? "")}
                  >
                    <SelectTrigger id="ck-slot">
                      <SelectValue placeholder="Choose a slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {slots.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  className="w-full bg-brand-steel text-primary-foreground hover:bg-brand-steel/90"
                  disabled={checkingPc}
                  onClick={startPayment}
                >
                  {checkingPc ? "Checking postcode…" : "Continue to payment"}
                </Button>
                {!pk ? (
                  <p className="text-sm text-destructive">
                    Add{" "}
                    <code className="rounded bg-muted px-1">
                      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                    </code>{" "}
                    to continue.
                  </p>
                ) : null}
              </>
            ) : clientSecret && stripePromise ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#4A4E54",
                    },
                  },
                }}
              >
                <PaymentStep
                  email={email}
                  name={name}
                  deliverySlotLabel={deliverySlotLabel}
                  pickupMethod={pickupMethod}
                  postcode={postcode}
                  onOrderComplete={() => clear()}
                />
              </Elements>
            ) : (
              <p className="text-sm text-muted-foreground">
                Preparing payment form…
              </p>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="font-heading text-xl font-semibold text-primary">
            Order summary
          </h2>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
            {items.map((i) => (
              <li
                key={i.productId}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
              >
                <span>
                  {i.quantity}× {i.name}
                </span>
                <span className="tabular-nums">
                  £{(i.priceGbp * i.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Test card:{" "}
            <span className="font-mono">4242 4242 4242 4242</span> · any future
            expiry · any CVC.
          </p>
          <Link
            href="/menu"
            className={cn(buttonVariants({ variant: "link" }), "mt-4 px-0")}
          >
            ← Back to menu
          </Link>
        </div>
      </div>
    </div>
  );
}
