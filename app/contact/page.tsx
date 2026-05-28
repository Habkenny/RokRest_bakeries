import { PageTransition } from "@/components/motion/page-transition";
import { ContactForm } from "@/components/contact/contact-page-client";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <ContactForm />
    </PageTransition>
  );
}
