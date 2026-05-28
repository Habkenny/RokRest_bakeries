"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Testimonial } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused, testimonials.length]);

  const current = testimonials[index];

  if (!current) return null;

  return (
    <section
      className="border-y border-border bg-[#f7f0e2]"
      aria-label="Customer testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-content px-4 py-14 md:px-6 lg:px-8">
        <h2 className="font-heading text-center text-3xl font-semibold text-primary md:text-4xl">
          Loved in Sheffield
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
          Students, families, and foodies — hear what our neighbours say.
        </p>

        <div className="mx-auto mt-10 max-w-3xl">
          <Card className="border-border/80 bg-card shadow-md">
            <CardContent className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <p className="text-lg leading-relaxed text-foreground">
                    “{current.text}”
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {current.name}
                    </span>
                    <span aria-hidden>·</span>
                    <span>
                      {Array.from({ length: current.rating }).map((_, i) => (
                        <span key={i} aria-hidden>
                          ★
                        </span>
                      ))}
                      <span className="sr-only">{current.rating} out of 5</span>
                    </span>
                    <span aria-hidden>·</span>
                    <time dateTime={current.date}>
                      {new Date(current.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={`size-2.5 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  i === index
                    ? "border-brand-amber bg-brand-amber"
                    : "border-border bg-background hover:bg-muted"
                }`}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
