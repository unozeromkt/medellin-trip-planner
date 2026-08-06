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

// Sorted longest-first so e.g. "593" (Ecuador) matches before a stray "5".
const KNOWN_PHONE_PREFIXES = [
  "593", "591", "595", "598", "502", "503", "504", "505", "506", "507", "509",
  "54", "55", "56", "51", "52", "57", "58", "34", "44", "49", "33", "39",
  "1",
];

/**
 * Wompi's WidgetCheckout requires phoneNumberPrefix and phoneNumber as
 * separate fields whenever customerData.phoneNumber is set. Splitting an
 * arbitrary international number is inherently ambiguous, so this only
 * recognizes a short list of prefixes relevant to this business and falls
 * back to Colombia (+57), matching the default used in lib/ghl.ts.
 */
export function splitPhoneForWompi(phone: string): { phoneNumberPrefix: string; phoneNumber: string } {
  const cleaned = phone.trim().replace(/[^\d+]/g, "");
  const hasPlus = cleaned.startsWith("+");
  const digitsOnly = hasPlus ? cleaned.slice(1) : cleaned;

  if (hasPlus) {
    const prefix = KNOWN_PHONE_PREFIXES.find((p) => digitsOnly.startsWith(p));
    if (prefix) {
      return { phoneNumberPrefix: `+${prefix}`, phoneNumber: digitsOnly.slice(prefix.length) };
    }
  }

  return { phoneNumberPrefix: "+57", phoneNumber: digitsOnly.replace(/^57/, "") };
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
