import { Resend } from "resend";

/**
 * Sends order confirmation via Resend when RESEND_API_KEY is set;
 * otherwise logs a demo message (safe for local development).
 */
export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderId: string;
  summaryLines: string[];
  totalGbp: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "orders@rokrestbakery.co.uk";

  const body = [
    `Thank you for your order at RokRest International Bakery.`,
    ``,
    `Order ${params.orderId}`,
    ...params.summaryLines,
    ``,
    `Total: £${params.totalGbp}`,
  ].join("\n");

  if (!apiKey) {
    // Demo mode — requirement: visible confirmation trail without third-party setup.
    console.info(
      `[demo-email] Order ${params.orderId} sent to ${params.to}\n${body}`
    );
    return { ok: true as const, demo: true };
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: params.to,
    subject: `Your RokRest order ${params.orderId}`,
    text: body,
  });
  return { ok: true as const, demo: false };
}
