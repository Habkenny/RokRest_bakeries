"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0)
  );
  const setOpen = useCartStore((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link
          href="/"
          className="font-heading text-xl font-semibold text-primary md:text-2xl"
          aria-label="RokRest International Bakery home"
        >
          RokRest
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Primary"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-amber focus-visible:outline-none",
                pathname === l.href
                  ? "text-brand-amber"
                  : "text-foreground/80"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
          <Button
            type="button"
            className="relative gap-2 bg-brand-steel text-primary-foreground hover:bg-brand-steel/90"
            aria-label={`Shopping bag, ${count} items`}
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="size-4" aria-hidden />
            <span className="hidden sm:inline">Basket</span>
            {count > 0 ? (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand-amber text-[10px] font-bold text-white"
              >
                {count > 9 ? "9+" : count}
              </motion.span>
            ) : null}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <motion.div
          id="mobile-nav"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border md:hidden"
        >
          <nav
            className="flex flex-col gap-1 px-4 py-3"
            aria-label="Mobile primary"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      ) : null}
    </header>
  );
}
