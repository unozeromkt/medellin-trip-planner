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

export async function openWompiCheckout(config: WompiCheckoutConfig): Promise<WompiCheckoutResult> {
  await loadWompiWidgetScript();
  if (!window.WidgetCheckout) throw new Error("Widget de Wompi no disponible");

  return new Promise((resolve) => {
    const checkout = new window.WidgetCheckout!({
      currency: config.currency,
      amountInCents: config.amountInCents,
      reference: config.reference,
      publicKey: config.publicKey,
      signature: { integrity: config.signature },
      redirectUrl: config.redirectUrl,
      customerData: config.customerData,
    });
    checkout.open((result) => resolve(result));
  });
}
