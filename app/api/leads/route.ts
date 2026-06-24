import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().optional(),
  travelDate: z.string().min(1),
  peopleCount: z.coerce.number().min(1),
  budget: z.string().optional(),
  language: z.string().optional(),
  message: z.string().optional(),
  tours: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      priceFrom: z.number().optional().nullable(),
      durationMinutes: z.number().optional().nullable(),
    })
  ),
  totalPrice: z.number().optional(),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const data = parsed.data;

  // Try to save to DB — gracefully skip if not connected
  try {
    const { db } = await import("@/lib/db");

    const lead = await db.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email ?? null,
        travelDate: data.travelDate ? new Date(data.travelDate) : null,
        peopleCount: data.peopleCount,
        language: data.language ?? null,
        message: data.message ?? null,
        source: data.source ?? "experience-builder",
        status: "new",
        leadTours: {
          create: data.tours.map((t) => ({
            tourId: t.id,
            priceSnapshot: t.priceFrom ?? null,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (dbError) {
    // DB not connected — log and return success anyway so WhatsApp flow continues
    console.warn("[leads API] DB unavailable, lead not persisted:", dbError);
    return NextResponse.json({ success: true, leadId: null, persisted: false });
  }
}
