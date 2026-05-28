"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import { PageTransition } from "@/components/motion/page-transition";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function OrderLiveStatus({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured() || !orderId.includes("-")) return;
    let supabase;
    try {
      supabase = createClient();
    } catch {
      return;
    }
    const channel = supabase
      .channel(`order:${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const next = (payload.new as { status?: string }).status;
          if (next) setStatus(next);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (!status) return null;
  return (
    <p className="mt-4 rounded-lg border border-border bg-muted px-4 py-3 text-sm">
      <strong>Live kitchen status:</strong> {status}
    </p>
  );
}

function OrderConfirmationInner() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <div className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-primary">
        Thank you!
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Your payment was successful. We&apos;ve sent a confirmation email (or
        logged a demo message in development).
      </p>
      {ref ? (
        <p className="mt-6 font-mono text-sm text-foreground">
          Order reference: {ref}
        </p>
      ) : null}
      {ref ? <OrderLiveStatus orderId={ref} /> : null}
      <p className="mt-6 text-sm text-muted-foreground">
        Enable Supabase Realtime on the <code className="rounded bg-muted px-1">orders</code>{" "}
        table to see live status updates here after checkout.
      </p>
      <Link
        href="/menu"
        className={cn(
          buttonVariants(),
          "mt-8 inline-flex bg-brand-steel text-primary-foreground hover:bg-brand-steel/90"
        )}
      >
        Back to menu
      </Link>
    </div>
  );
}

export function OrderConfirmationView() {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <div className="px-4 py-16 text-center text-muted-foreground">
            Loading…
          </div>
        }
      >
        <OrderConfirmationInner />
      </Suspense>
    </PageTransition>
  );
}
