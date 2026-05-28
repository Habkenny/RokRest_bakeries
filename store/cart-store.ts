"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  name: string;
  /** Price in GBP for display and server reconciliation. */
  priceGbp: number;
  quantity: number;
  image_url?: string;
}

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      addItem: (line) => {
        const qty = line.quantity ?? 1;
        set((s) => {
          const existing = s.items.find((i) => i.productId === line.productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === line.productId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return {
            items: [
              ...s.items,
              {
                productId: line.productId,
                name: line.name,
                priceGbp: line.priceGbp,
                image_url: line.image_url,
                quantity: qty,
              },
            ],
          };
        });
      },
      removeItem: (productId) =>
        set((s) => ({
          items: s.items.filter((i) => i.productId !== productId),
        })),
      setQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "rokrest-cart",
      partialize: (s) => ({ items: s.items }),
    }
  )
);

export function cartSubtotalGbp(items: CartLine[]) {
  return items.reduce((sum, i) => sum + i.priceGbp * i.quantity, 0);
}
