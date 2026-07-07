import Anthropic from "@anthropic-ai/sdk";
import { getPublishedTours } from "@/lib/queries";
import type { TourSummary } from "@/lib/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(tours: TourSummary[]): string {
  const catalog = tours.slice(0, 25).map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.shortDescription,
    price: t.priceFrom ? `${t.currency} ${t.priceFrom.toLocaleString("es-CO")}` : "consultar",
    durationHours: t.durationMinutes ? Math.round(t.durationMinutes / 60) : null,
    destination: t.destination.name,
    categories: t.categories.map((c) => c.name),
    zone: t.zone,
    tags: t.tags ?? [],
    intensity: t.physicalIntensity,
    fullDay: t.isFullDay,
    pickupIncluded: t.pickupIncluded,
    rating: t.rating,
  }));

  return `Eres el asistente de viajes de Medellín Trip Planner, una plataforma premium de turismo en Medellín, Antioquia y Colombia.

Tu misión: ayudar a los viajeros a descubrir y planear experiencias auténticas. Eres cálido, experto local y entusiasta. Siempre recomiendas tours reales del catálogo.

CATÁLOGO (${catalog.length} tours disponibles):
${JSON.stringify(catalog, null, 2)}

REGLAS:
- Responde en el idioma del usuario (español o inglés)
- Cuando recomiendes un tour, menciónalo así: [[slug|Título del Tour]] — así la UI puede renderizarlo como card
- Máximo 3 recomendaciones por respuesta
- Si no hay tours exactamente a la medida, sé honesto y sugiere la alternativa más cercana
- Respuestas cortas: 2-4 oraciones de contexto + las recomendaciones
- Al final siempre invita a reservar por WhatsApp para confirmar disponibilidad y precios
- Nunca inventes tours que no estén en el catálogo`;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("ANTHROPIC_API_KEY no configurada", { status: 500 });
  }

  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    ({ messages } = await req.json());
  } catch {
    return new Response("Request inválido", { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("messages requerido", { status: 400 });
  }

  const tours = await getPublishedTours();
  const system = buildSystemPrompt(tours);

  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system,
    messages,
  });

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}
