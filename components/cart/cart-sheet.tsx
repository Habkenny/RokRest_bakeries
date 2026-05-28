"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cartSubtotalGbp, useCartStore } from "@/store/cart-store";

export function CartSheet() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const setQty = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.removeItem);

  const subtotal = cartSubtotalGbp(items);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Your basket</SheetTitle>
          <SheetDescription>
            Review items before checkout. Prices include VAT where applicable.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-4 flex-1 pr-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your basket is empty. Browse the{" "}
              <Link
                href="/menu"
                className="font-medium text-brand-amber underline"
                onClick={() => setOpen(false)}
              >
                menu
              </Link>{" "}
              to add treats.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((line) => (
                <motion.li
                  key={line.productId}
                  layout
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {line.image_url ? (
                      <Image
                        src={line.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-tight">{line.name}</p>
                    <p className="text-sm text-muted-foreground">
                      £{line.priceGbp.toFixed(2)} each
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${line.productId}`}>
                        Quantity for {line.name}
                      </label>
                      <input
                        id={`qty-${line.productId}`}
                        type="number"
                        min={1}
                        className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
                        value={line.quantity}
                        onChange={(e) =>
                          setQty(line.productId, Number(e.target.value) || 1)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => remove(line.productId)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </ScrollArea>

        <Separator className="my-4" />

        <SheetFooter className="mt-auto flex-col gap-3 sm:flex-col">
          <div className="flex w-full items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">£{subtotal.toFixed(2)}</span>
          </div>
          {items.length === 0 ? (
            <Button type="button" disabled className="w-full">
              Checkout
            </Button>
          ) : (
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants(),
                "w-full bg-brand-amber !text-accent-foreground hover:bg-brand-amber/90"
              )}
            >
              Checkout
            </Link>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
