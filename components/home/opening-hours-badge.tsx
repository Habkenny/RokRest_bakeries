import { Badge } from "@/components/ui/badge";
import type { OpeningHoursRow } from "@/lib/types";
import { openingHoursBadgeText } from "@/lib/mock-data";

export function OpeningHoursBadge({
  rows,
}: {
  rows: OpeningHoursRow[];
}) {
  return (
    <div className="flex justify-center px-4 pb-10">
      <Badge
        variant="secondary"
        className="rounded-full bg-brand-steel px-4 py-2 text-primary-foreground hover:bg-brand-steel"
      >
        <span className="sr-only">Opening hours:&nbsp;</span>
        {openingHoursBadgeText(rows)}
      </Badge>
    </div>
  );
}
