import { Resend } from "resend";

export interface OrderConfirmationPayload {
  contactName: string;
  contactEmail: string;
  tourTitle: string;
  reference: string;
  amountInCents: number;
  currency: string;
  travelDate?: Date | null;
  peopleCount?: number | null;
}

function formatAmount(amountInCents: number, currency: string): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    amountInCents / 100
  );
}

/**
 * Never throws past this boundary — email delivery must not break the
 * payment webhook flow, same convention as syncLeadToGHL in lib/ghl.ts.
 */
export async function sendOrderConfirmationEmail(payload: OrderConfirmationPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("[email] Missing RESEND_API_KEY or RESEND_FROM_EMAIL, skipping confirmation email");
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const travelDateLabel = payload.travelDate
      ? new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(
          payload.travelDate
        )
      : null;

    await resend.emails.send({
      from,
      to: payload.contactEmail,
      subject: `Confirmación de pago — ${payload.tourTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0D1B3D;">¡Pago confirmado, ${payload.contactName}!</h2>
          <p style="color: #4A5C6A;">Tu reserva para <strong>${payload.tourTitle}</strong> quedó pagada y confirmada.</p>
          <ul style="color: #4A5C6A;">
            <li>Referencia: ${payload.reference}</li>
            ${travelDateLabel ? `<li>Fecha: ${travelDateLabel}</li>` : ""}
            ${payload.peopleCount ? `<li>Personas: ${payload.peopleCount}</li>` : ""}
            <li>Total pagado: ${formatAmount(payload.amountInCents, payload.currency)}</li>
          </ul>
          <p style="color: #4A5C6A;">Nuestro equipo se pondrá en contacto contigo por WhatsApp para confirmar los últimos detalles.</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("[email] Failed to send order confirmation:", err);
    return false;
  }
}
