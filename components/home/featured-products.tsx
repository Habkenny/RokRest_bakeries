"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  return (
    <section
      id="featured"
      className="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8"
      aria-labelledby="featured-heading"
    >
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            id="featured-heading"
            className="font-heading text-3xl font-semibold text-primary md:text-4xl"
          >
            Fresh from the oven
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Four rotating highlights — sourced from our full Supabase-backed
            catalogue when connected, with sensible offline defaults.
          </p>
        </div>
        <Link
          href="/menu"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-brand-steel shrink-0"
          )}
        >
          See full menu
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full overflow-hidden border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image
                  src={p.image_url}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-200 hover:scale-[1.02]"
                  sizes="(max-width:1024px) 50vw, 25vw"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg leading-snug">
                  {p.name}
                </CardTitle>
                <p className="text-sm font-semibold text-brand-amber">
                  £{p.price.toFixed(2)}
                </p>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.is_vegan ? (
                    <Badge variant="secondary" aria-label="Vegan">
                      🥬 Vegan
                    </Badge>
                  ) : null}
                  {p.is_nut_free ? (
                    <Badge variant="secondary" aria-label="Nut free">
                      🥜❌ Nut-free
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
              <CardFooter className="gap-2 pt-0">
                <Button
                  type="button"
                  className="flex-1 bg-brand-steel text-primary-foreground hover:bg-brand-steel/90"
                  onClick={() => {
                    addItem({
                      productId: p.id,
                      name: p.name,
                      priceGbp: p.price,
                      image_url: p.image_url,
                      quantity: 1,
                    });
                    setOpen(true);
                  }}
                >
                  Add to basket
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
