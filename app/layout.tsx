import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/components/providers";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartSheet } from "@/components/cart/cart-sheet";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://rokrestbakery.co.uk"
  ),
  title: {
    default: "RokRest International Bakery | Sheffield",
    template: "%s | RokRest International Bakery",
  },
  description:
    "International bakery in Sheffield — French, Italian, British, German, Middle Eastern & Asian classics baked fresh daily.",
  openGraph: {
    title: "RokRest International Bakery",
    description:
      "Sheffield's taste of the world — artisan breads, pastries, cakes, and savouries.",
    locale: "en_GB",
    type: "website",
    url: "https://rokrestbakery.co.uk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          playfair.variable,
          "flex min-h-screen flex-col antialiased"
        )}
      >
        <AnalyticsScripts />
        <AppProviders>
          <SiteHeader />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
          <CartSheet />
        </AppProviders>
      </body>
    </html>
  );
}
