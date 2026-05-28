import { PageTransition } from "@/components/motion/page-transition";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <PageTransition>
      <CheckoutFlow />
    </PageTransition>
  );
}
