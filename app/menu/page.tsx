import { PageTransition } from "@/components/motion/page-transition";
import { MenuPageClient } from "@/components/menu/menu-page-client";

export const metadata = {
  title: "Menu",
};

export default function MenuPage() {
  return (
    <PageTransition>
      <MenuPageClient />
    </PageTransition>
  );
}
