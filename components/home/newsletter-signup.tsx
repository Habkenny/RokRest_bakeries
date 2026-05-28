"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterSignup() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not subscribe");
      toast.success("You are on the list — thanks for joining!");
      reset();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">
            Bakery notes &amp; seasonal drops
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Join our newsletter — stored securely in Supabase when configured.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="flex max-w-xl flex-col gap-4 sm:flex-row sm:items-end"
            onSubmit={onSubmit}
            noValidate
          >
            <div className="flex-1 space-y-2">
              <Label htmlFor="newsletter-email">Email</Label>
              <Input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "newsletter-email-error" : undefined
                }
                {...register("email")}
              />
              {errors.email ? (
                <p id="newsletter-email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="bg-brand-amber text-accent-foreground hover:bg-brand-amber/90"
              disabled={loading}
            >
              {loading ? "Joining…" : "Subscribe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
