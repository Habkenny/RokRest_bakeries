/** Build delivery slot labels for the next three days (UK locale). */

const SLOT_LABELS = ["10:00–12:00", "14:00–16:00", "17:00–19:00"];

export interface DeliverySlotOption {
  id: string;
  label: string;
}

export function getNextDeliverySlots(): DeliverySlotOption[] {
  const out: DeliverySlotOption[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  for (let d = 0; d < 3; d++) {
    const day = new Date(start);
    day.setDate(start.getDate() + d);
    const dayStr = day.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    for (const slot of SLOT_LABELS) {
      const id = `${day.toISOString().slice(0, 10)}_${slot.replace(/[^0-9]/g, "")}`;
      out.push({
        id,
        label: `${dayStr} · ${slot}`,
      });
    }
  }
  return out;
}
