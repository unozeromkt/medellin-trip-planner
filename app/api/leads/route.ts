import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { syncLeadToGHL } from "@/lib/ghl";

const leadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().optional(),
  travelDate: z.string().optional(),
  peopleCount: z.coerce.number().min(1).optional(),
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
  pageUrl: z.string().optional(),
});

const BUDGET_RANGES: Record<string, { budgetMin: number; budgetMax: number | null }> = {
  "hasta-500k": { budgetMin: 0, budgetMax: 500000 },
  "500k-1m": { budgetMin: 500000, budgetMax: 1000000 },
  "1m-2m": { budgetMin: 1000000, budgetMax: 2000000 },
  "mas-2m": { budgetMin: 2000000, budgetMax: null },
};

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

    const budgetRange = data.budget ? BUDGET_RANGES[data.budget] : undefined;

    const lead = await db.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email ?? null,
        travelDate: data.travelDate ? new Date(data.travelDate) : null,
        peopleCount: data.peopleCount ?? null,
        budgetMin: budgetRange?.budgetMin ?? null,
        budgetMax: budgetRange?.budgetMax ?? null,
        language: data.language ?? null,
        message: data.message ?? null,
        source: data.source ?? "experience-builder",
        pageUrl: data.pageUrl ?? null,
        status: "new",
        leadTours: {
          create: data.tours.map((t) => ({
            tourId: t.id,
            priceSnapshot: t.priceFrom ?? null,
          })),
        },
      },
    });

    await syncLeadToGHL({
      name: data.name,
      phone: data.phone,
      email: data.email,
      source: data.source ?? "experience-builder",
      message: data.message,
      tourTitles: data.tours.map((t) => t.title),
      peopleCount: data.peopleCount,
      travelDate: data.travelDate,
      budget: data.budget,
      pageUrl: data.pageUrl,
      totalPrice: data.totalPrice,
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (dbError) {
    // DB not connected — log and return success anyway so WhatsApp flow continues
    console.warn("[leads API] DB unavailable, lead not persisted:", dbError);
    return NextResponse.json({ success: true, leadId: null, persisted: false });
  }
}
