"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeHero() {
  const scrollToMenu = () => {
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-background to-[#f0e6d2]"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto flex max-w-content flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:px-6 md:py-20 lg:px-8">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-amber">
            Sheffield · Since 2023
          </p>
          <h1
            id="hero-heading"
            className="font-heading text-4xl font-semibold leading-tight text-primary md:text-5xl lg:text-6xl"
          >
            Sheffield&apos;s Taste of the World – Baked Fresh Daily
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            French viennoiserie, Italian dolci, Middle Eastern sweets, and
            Asian bakery favourites — all under one steel-city roof.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              className="bg-brand-amber text-accent-foreground hover:bg-brand-amber/90"
              onClick={scrollToMenu}
            >
              Order online
            </Button>
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-brand-steel text-brand-steel hover:bg-brand-steel/10"
              )}
            >
              View menu
            </Link>
            <Link
              href="/contact#reserve"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "bg-brand-steel text-primary-foreground hover:bg-brand-steel/90"
              )}
            >
              Reserve a table
            </Link>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="relative aspect-[4/3] w-full flex-1 overflow-hidden rounded-2xl border border-border bg-muted shadow-lg"
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
