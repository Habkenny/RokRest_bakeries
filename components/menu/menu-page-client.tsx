"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Product, ProductCategory } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { fetchProductsClient } from "@/lib/data/products-client";

const CATEGORIES: ProductCategory[] = [
  "Artisan Breads",
  "Pastries",
  "Cakes & Desserts",
  "Savories",
  "International Specials",
];

export function MenuPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [veganOnly, setVeganOnly] = useState(false);
  const [nutFreeOnly, setNutFreeOnly] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const qtyFor = (id: string) => quantities[id] ?? 1;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchProductsClient();
      if (!cancelled) setProducts(data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (veganOnly && !p.is_vegan) return false;
      if (nutFreeOnly && !p.is_nut_free) return false;
      return true;
    });
  }, [products, category, veganOnly, nutFreeOnly]);

  return (
    <div className="mx-auto max-w-content px-4 py-12 md:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-primary md:text-5xl">
        Menu
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Filter by tradition, diet, or craving — then add to your basket.
      </p>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="lg:w-64 lg:shrink-0">
          <fieldset className="space-y-3 rounded-lg border border-border bg-card p-4">
            <legend className="text-sm font-semibold text-foreground">
              Dietary
            </legend>
            <div className="flex items-center gap-2">
              <Checkbox
                id="vegan-only"
                checked={veganOnly}
                onCheckedChange={(c) => setVeganOnly(Boolean(c))}
              />
              <Label htmlFor="vegan-only">Vegan only 🥬</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="nutfree-only"
                checked={nutFreeOnly}
                onCheckedChange={(c) => setNutFreeOnly(Boolean(c))}
              />
              <Label htmlFor="nutfree-only">Nut-free 🥜❌</Label>
            </div>
          </fieldset>
        </aside>

        <div className="min-w-0 flex-1">
          <div
            className="mb-6 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Product categories"
          >
            <Button
              type="button"
              size="sm"
              variant={category === "all" ? "default" : "outline"}
              className={
                category === "all"
                  ? "bg-brand-steel text-primary-foreground hover:bg-brand-steel/90"
                  : ""
              }
              role="tab"
              aria-selected={category === "all"}
              onClick={() => setCategory("all")}
            >
              All
            </Button>
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                type="button"
                size="sm"
                variant={category === c ? "default" : "outline"}
                className={
                  category === c
                    ? "bg-brand-steel text-primary-foreground hover:bg-brand-steel/90"
                    : ""
                }
                role="tab"
                aria-selected={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" role="tabpanel">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.2) }}
              >
                <Card className="flex h-full flex-col overflow-hidden border-border/80 bg-card shadow-sm transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={p.image_url}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-200 hover:scale-[1.02]"
                      sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-lg leading-snug">
                      {p.name}
                    </CardTitle>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {p.category}
                    </p>
                    <p className="text-sm font-semibold text-brand-amber">
                      £{p.price.toFixed(2)}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 pb-3">
                    <p className="text-sm text-muted-foreground">
                      {p.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.is_vegan ? (
                        <Badge variant="secondary">🥬 Vegan</Badge>
                      ) : null}
                      {p.is_nut_free ? (
                        <Badge variant="secondary">🥜❌ Nut-free</Badge>
                      ) : null}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`qty-${p.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Qty
                      </Label>
                      <input
                        id={`qty-${p.id}`}
                        type="number"
                        min={1}
                        className="h-9 w-16 rounded-md border border-input bg-background px-2 text-sm"
                        value={qtyFor(p.id)}
                        onChange={(e) =>
                          setQuantities((q) => ({
                            ...q,
                            [p.id]: Math.max(1, Number(e.target.value) || 1),
                          }))
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      className="flex-1 bg-brand-steel text-primary-foreground hover:bg-brand-steel/90"
                      onClick={() => {
                        addItem({
                          productId: p.id,
                          name: p.name,
                          priceGbp: p.price,
                          image_url: p.image_url,
                          quantity: qtyFor(p.id),
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

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No products match these filters.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
