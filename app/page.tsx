import { HomeHero } from "@/components/home/home-hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { OpeningHoursBadge } from "@/components/home/opening-hours-badge";
import { PageTransition } from "@/components/motion/page-transition";
import { fetchProductsServer, getFeaturedProducts } from "@/lib/data/products-server";
import { fetchTestimonialsServer } from "@/lib/data/testimonials";
import { fetchOpeningHoursServer } from "@/lib/data/site";

export default async function HomePage() {
  const [products, testimonials, hours] = await Promise.all([
    fetchProductsServer(),
    fetchTestimonialsServer(),
    fetchOpeningHoursServer(),
  ]);
  const featured = getFeaturedProducts(products, 4);

  return (
    <PageTransition>
      <HomeHero />
      <OpeningHoursBadge rows={hours} />
      <FeaturedProducts products={featured} />
      <TestimonialsCarousel testimonials={testimonials} />
      <NewsletterSignup />
    </PageTransition>
  );
}
