import { createHash } from "crypto";

export function getWompiPublicKey(): string {
  const key = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_WOMPI_PUBLIC_KEY");
  return key;
}

export function isWompiSandbox(): boolean {
  return getWompiPublicKey().startsWith("pub_test_");
}

/** Wompi requires whole COP pesos converted to integer cents. */
export function cordsToAmountInCents(pricePerPersonCOP: number, peopleCount: number): number {
  return Math.round(pricePerPersonCOP * peopleCount * 100);
}

export function generateOrderReference(tourSlug: string): string {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `MTP-${tourSlug.slice(0, 20).toUpperCase()}-${Date.now()}-${random}`;
}

/**
 * Firma de integridad: SHA256(reference + amountInCents + currency + integritySecret), hex lowercase.
 * https://docs.wompi.co/docs/colombia/widget-checkout-web/
 */
export function buildIntegritySignature(params: {
  reference: string;
  amountInCents: number;
  currency: string;
}): string {
  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secret) throw new Error("Missing WOMPI_INTEGRITY_SECRET");
  const raw = `${params.reference}${params.amountInCents}${params.currency}${secret}`;
  return createHash("sha256").update(raw).digest("hex");
}

export interface WompiWebhookEvent {
  event: string;
  data: {
    transaction: {
      id: string;
      amount_in_cents: number;
      reference: string;
      status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING";
      status_message?: string | null;
      payment_method_type?: string;
      customer_email?: string;
    };
  };
  environment: string;
  signature: { properties: string[]; checksum: string };
  timestamp: number;
  sent_at: string;
}

function readPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Verifies the webhook checksum: SHA256(values of signature.properties in
 * order + timestamp + events secret). https://docs.wompi.co/docs/colombia/eventos/
 */
export function verifyWompiWebhookChecksum(event: WompiWebhookEvent): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) {
    console.warn("[wompi] Missing WOMPI_EVENTS_SECRET, cannot verify webhook");
    return false;
  }

  const concatenatedValues = event.signature.properties
    .map((prop) => readPath(event.data, prop))
    .join("");
  const raw = `${concatenatedValues}${event.timestamp}${secret}`;
  const computed = createHash("sha256").update(raw).digest("hex");

  return computed.toLowerCase() === event.signature.checksum.toLowerCase();
}

export const WOMPI_STATUS_TO_ORDER_STATUS = {
  APPROVED: "approved",
  DECLINED: "declined",
  VOIDED: "voided",
  ERROR: "error",
  PENDING: "pending",
} as const;
