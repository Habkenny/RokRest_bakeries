"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  order_type: z.enum(["general", "catering", "custom_cake", "other"]),
  message: z.string().min(10, "Tell us a little more (10+ characters)"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { order_type: "general" },
  });

  const orderType = watch("order_type");

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          phone: data.phone || null,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not send message");
      toast.success("Message sent — we’ll reply shortly.");
      reset({ order_type: "general" });
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="mx-auto max-w-content px-4 py-12 md:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-primary md:text-5xl">
        Contact
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Table reservations, catering, and custom cakes — tell us what you need.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section id="reserve" className="scroll-mt-28">
          <h2 className="font-heading text-2xl font-semibold text-primary">
            Send a message
          </h2>
          <form
            className="mt-6 space-y-4"
            onSubmit={onSubmit}
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone (optional)</Label>
              <Input
                id="contact-phone"
                type="tel"
                autoComplete="tel"
                {...register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-type">Order type</Label>
              <Select
                value={orderType}
                onValueChange={(v) =>
                  setValue(
                    "order_type",
                    (v ?? "general") as FormValues["order_type"],
                    {
                      shouldValidate: true,
                    }
                  )
                }
              >
                <SelectTrigger id="order-type" aria-label="Order type">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General enquiry</SelectItem>
                  <SelectItem value="catering">Catering</SelectItem>
                  <SelectItem value="custom_cake">Custom cake</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.order_type ? (
                <p className="text-sm text-destructive">
                  {errors.order_type.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                rows={5}
                aria-invalid={Boolean(errors.message)}
                {...register("message")}
              />
              {errors.message ? (
                <p className="text-sm text-destructive">
                  {errors.message.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="bg-brand-amber text-accent-foreground hover:bg-brand-amber/90"
              disabled={loading}
            >
              {loading ? "Sending…" : "Send message"}
            </Button>
          </form>
        </section>

        <aside className="space-y-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-primary">
              Direct contact
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  className="font-medium text-foreground underline"
                  href="mailto:info@rokrestbakery.co.uk"
                >
                  info@rokrestbakery.co.uk
                </a>
              </li>
              <li>
                <a className="font-medium text-foreground underline" href="tel:+441141234567">
                  +44 114 123 4567
                </a>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Instagram
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Facebook
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                TikTok
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-semibold text-primary">
              FAQ
            </h2>
            <Accordion multiple={false} defaultValue={[]} className="mt-4 w-full">
              <AccordionItem value="delivery">
                <AccordionTrigger>Delivery zones</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  We currently deliver to Sheffield postcodes S1–S11, S35, and
                  S36. Enter your postcode at checkout to confirm.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="cakes">
                <AccordionTrigger>Custom cakes</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Share your date, servings, flavours, and dietary needs —
                  we&apos;ll follow up with sketches and pricing.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="allergens">
                <AccordionTrigger>Allergens</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Nuts, gluten, dairy, eggs, and sesame are present in our
                  kitchen. Please ask for an allergen matrix before ordering.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="catering">
                <AccordionTrigger>Catering</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Office breakfasts, canapés, and dessert tables — minimum
                  notice 72 hours where possible.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>
      </div>
    </div>
  );
}
