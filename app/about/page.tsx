import Image from "next/image";
import { PageTransition } from "@/components/motion/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const bakers = [
  {
    name: "Marie L.",
    role: "Head Viennoiserie",
    bio: "Trained in Lyon; obsessed with laminating butter at precisely 4°C.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Davide R.",
    role: "Bread & Oven",
    bio: "Sourdough whisperer from Emilia-Romagna — biga, bassa, bold crusts.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
  {
    name: "Yasmin H.",
    role: "Pastry & Specials",
    bio: "Middle Eastern sweets meet Yorkshire dairy — cardamom, rose, and honey.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-content px-4 py-14 md:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-semibold text-primary md:text-5xl">
          Our story
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Founded in 2023 in Sheffield, RokRest was born from years of travel
          — market mornings in Paris, late-night focaccia in Liguria, tea-sweet
          afternoons in Amman, and steam-filled bakeries across East Asia. We
          brought those notebooks home to South Yorkshire.
        </p>

        <Separator className="my-12" />

        <section aria-labelledby="values-heading">
          <h2
            id="values-heading"
            className="font-heading text-3xl font-semibold text-primary"
          >
            What we stand for
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Fresh ingredients",
                body: "Local flour where we can, real butter, and seasonal produce from trusted growers.",
              },
              {
                title: "Traditional techniques",
                body: "Long ferments, hand shaping, and respect for each region’s craft.",
              },
              {
                title: "Community support",
                body: "Partnerships with schools, markets, and charities across Sheffield.",
              },
            ].map((v) => (
              <Card key={v.title} className="border-border/80 bg-card">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">{v.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{v.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        <section aria-labelledby="bakers-heading">
          <h2
            id="bakers-heading"
            className="font-heading text-3xl font-semibold text-primary"
          >
            Meet the bakers
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {bakers.map((b) => (
              <Card key={b.name} className="overflow-hidden border-border/80">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={b.img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">{b.name}</CardTitle>
                  <p className="text-sm font-medium text-brand-amber">{b.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{b.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        <section aria-labelledby="sheffield-heading">
          <h2
            id="sheffield-heading"
            className="font-heading text-3xl font-semibold text-primary"
          >
            Sheffield roots
          </h2>
          <ul className="mt-6 list-inside list-disc space-y-2 text-muted-foreground">
            <li>Regular stall at Kelham Island Market</li>
            <li>Sheffield Food Festival — baking demos &amp; tasting boards</li>
            <li>Local charity bake sales and surplus-food partnerships</li>
          </ul>
        </section>
      </div>
    </PageTransition>
  );
}
