import { fetchProductsServer } from "@/lib/data/products-server";

export interface LineItemInput {
  id: string;
  quantity: number;
}

/**
 * Recalculate order total on the server using DB (or mock) prices
 * so clients cannot tamper with amounts before Stripe.
 */
export async function quoteLineItems(items: LineItemInput[]) {
  const products = await fetchProductsServer();
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines: {
    id: string;
    name: string;
    quantity: number;
    price_each: number;
    line_total_pence: number;
  }[] = [];

  for (const item of items) {
    const p = byId.get(item.id);
    if (!p || item.quantity < 1) continue;
    const priceEach = Math.round(p.price * 100);
    const lineTotal = priceEach * item.quantity;
    lines.push({
      id: p.id,
      name: p.name,
      quantity: item.quantity,
      price_each: p.price,
      line_total_pence: lineTotal,
    });
  }

  const total_pence = lines.reduce((s, l) => s + l.line_total_pence, 0);
  return { lines, total_pence };
}
