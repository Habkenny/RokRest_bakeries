import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-brand-steel text-primary-foreground">
      <div className="mx-auto grid max-w-content gap-8 px-4 py-12 md:grid-cols-3 md:px-6 lg:px-8">
        <div>
          <p className="font-heading text-lg font-semibold">
            RokRest International Bakery
          </p>
          <p className="mt-2 text-sm text-primary-foreground/85">
            22 Baker&apos;s Row, Sheffield, S1 2JH
          </p>
          <p className="mt-1 text-sm">
            <a href="mailto:info@rokrestbakery.co.uk" className="underline">
              info@rokrestbakery.co.uk
            </a>
          </p>
          <p className="text-sm">
            <a href="tel:+441141234567" className="underline">
              +44 114 123 4567
            </a>
          </p>
        </div>
        <div>
          <p className="font-medium">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/85">
            <li>
              <Link href="/menu" className="hover:underline">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/locations" className="hover:underline">
                Locations &amp; hours
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact &amp; catering
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium">Social</p>
          <div className="mt-3 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              aria-label="TikTok"
            >
              TikTok
            </a>
          </div>
          <p className="mt-4 text-xs text-primary-foreground/70">
            Placeholder domain: rokrestbakery.co.uk
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} RokRest International Bakery. Sheffield,
        UK.
      </div>
    </footer>
  );
}
