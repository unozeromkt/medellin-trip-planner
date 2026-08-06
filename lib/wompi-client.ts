"use client";

export interface WompiCheckoutConfig {
  publicKey: string;
  currency: string;
  amountInCents: number;
  reference: string;
  signature: string;
  redirectUrl: string;
  customerData?: {
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    phoneNumberPrefix?: string;
    legalId?: string;
    legalIdType?: string;
  };
}

export interface WompiCheckoutResult {
  transaction?: { id: string; status: string; reference: string };
}

declare global {
  interface Window {
    WidgetCheckout?: new (config: Record<string, unknown>) => {
      open: (callback: (result: WompiCheckoutResult) => void) => void;
    };
  }
}

let widgetScriptPromise: Promise<void> | null = null;

function loadWompiWidgetScript(): Promise<void> {
  if (typeof window !== "undefined" && window.WidgetCheckout) return Promise.resolve();
  if (widgetScriptPromise) return widgetScriptPromise;

  widgetScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      widgetScriptPromise = null;
      reject(new Error("No se pudo cargar el widget de pagos de Wompi"));
    };
    document.body.appendChild(script);
  });
  return widgetScriptPromise;
}

function describeThrown(value: unknown): string {
  if (value instanceof Error) return value.message;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export async function openWompiCheckout(config: WompiCheckoutConfig): Promise<WompiCheckoutResult> {
  await loadWompiWidgetScript();
  if (!window.WidgetCheckout) throw new Error("Widget de Wompi no disponible");

  const widgetConfig = {
    currency: config.currency,
    amountInCents: config.amountInCents,
    reference: config.reference,
    publicKey: config.publicKey,
    signature: { integrity: config.signature },
    redirectUrl: config.redirectUrl,
    customerData: config.customerData,
  };

  try {
    return await new Promise((resolve, reject) => {
      try {
        const checkout = new window.WidgetCheckout!(widgetConfig);
        checkout.open((result) => resolve(result));
      } catch (constructError) {
        reject(constructError);
      }
    });
  } catch (err) {
    console.error("[wompi] Widget rejected config:", widgetConfig, "reason:", err);
    throw new Error(describeThrown(err));
  }
}
