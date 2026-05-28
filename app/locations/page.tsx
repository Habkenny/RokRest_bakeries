import { PageTransition } from "@/components/motion/page-transition";
import { SheffieldMapLazy } from "@/components/locations/sheffield-map-lazy";
import {
  fetchHolidayNoticesServer,
  fetchOpeningHoursServer,
} from "@/lib/data/site";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Locations & hours",
};

export default async function LocationsPage() {
  const [hours, holidays] = await Promise.all([
    fetchOpeningHoursServer(),
    fetchHolidayNoticesServer(),
  ]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-content px-4 py-12 md:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-semibold text-primary md:text-5xl">
          Visit us
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          City centre Sheffield — a short walk from the Cathedral tram stop and
          major Q-Park sites.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Address</CardTitle>
                <CardDescription>
                  Postcode enquiries welcome for our delivery zone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium text-foreground">
                  RokRest International Bakery
                </p>
                <p>22 Baker&apos;s Row</p>
                <p>Sheffield, S1 2JH</p>
                <p>United Kingdom</p>
              </CardContent>
            </Card>

            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Opening hours
                </CardTitle>
                <CardDescription>
                  Loaded from Supabase when available.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <tbody>
                    {hours.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <th className="py-2 pr-4 text-left font-medium text-foreground">
                          {row.day_label}
                        </th>
                        <td className="py-2 text-muted-foreground">
                          {row.hours_text}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Holiday notices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {holidays.map((h) => (
                  <div key={h.id}>
                    <p className="font-medium text-foreground">{h.title}</p>
                    <p className="text-sm text-muted-foreground">{h.body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Getting here
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Tram:</strong> Cathedral
                  stop — about a 5-minute walk.
                </p>
                <p>
                  <strong className="text-foreground">Driving:</strong> Q-Park
                  and on-street bays nearby (check signage).
                </p>
                <p>
                  <strong className="text-foreground">Map centre:</strong>{" "}
                  approx.{" "}
                  <span className="whitespace-nowrap">53.3811°N, 1.4701°W</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <SheffieldMapLazy />
            <p className="mt-3 text-xs text-muted-foreground">
              Interactive map via Leaflet &amp; OpenStreetMap (no API key
              required).
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
