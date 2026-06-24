const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";

export type WhatsAppLeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  travelDate?: string;
  peopleCount?: number;
  budget?: string;
  language?: string;
  selectedTours: {
    title: string;
    priceFrom?: number;
    duration?: string;
  }[];
  source?: string;
};

export function buildWhatsAppMessage(payload: WhatsAppLeadPayload): {
  message: string;
  encodedMessage: string;
  whatsappUrl: string;
} {
  const tourLines = payload.selectedTours
    .map((t, i) => {
      const price = t.priceFrom
        ? ` — desde ${new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
          }).format(t.priceFrom)}`
        : "";
      const duration = t.duration ? ` (${t.duration})` : "";
      return `${i + 1}. ${t.title}${price}${duration}`;
    })
    .join("\n");

  const lines = [
    "Hola, quiero información sobre una experiencia en *Medellín Trip Planner*.",
    "",
    payload.name ? `*Nombre:* ${payload.name}` : null,
    payload.travelDate ? `*Fecha tentativa:* ${payload.travelDate}` : null,
    payload.peopleCount
      ? `*Número de personas:* ${payload.peopleCount}`
      : null,
    payload.budget ? `*Presupuesto:* ${payload.budget}` : null,
    payload.language ? `*Idioma preferido:* ${payload.language}` : null,
    "",
    payload.selectedTours.length > 0
      ? `*Tours seleccionados:*\n${tourLines}`
      : null,
    payload.source ? `\n_Fuente: ${payload.source}_` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const encodedMessage = encodeURIComponent(lines);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return { message: lines, encodedMessage, whatsappUrl };
}
