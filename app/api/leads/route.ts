import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
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
  additionalInfo: z.string().optional(),
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
  const budgetRange = data.budget ? BUDGET_RANGES[data.budget] : undefined;

  let leadId: string | null = null;
  let agency: { id: string; name: string; referralCode: string | null } | null = null;

  // Try to save to DB — gracefully degrade if not connected. This must NOT
  // gate the GHL sync below: a DB hiccup should never silently skip the CRM.
  try {
    const { db } = await import("@/lib/db");

    const cookieStore = await cookies();
    const refCode = cookieStore.get("mtp_ref")?.value;
    agency = refCode
      ? await db.agency.findFirst({
          where: { referralCode: refCode, status: "active" },
          select: { id: true, name: true, referralCode: true },
        })
      : null;

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
        agencyId: agency?.id ?? null,
        additionalInfo: data.additionalInfo ?? null,
        leadTours: {
          create: data.tours.map((t) => ({
            tourId: t.id,
            priceSnapshot: t.priceFrom ?? null,
          })),
        },
      },
    });
    leadId = lead.id;
  } catch (dbError) {
    console.warn("[leads API] DB unavailable, lead not persisted:", dbError);
  }

  // syncLeadToGHL never throws past its own boundary, so this always runs
  // regardless of whether the DB write above succeeded.
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
    agencyName: agency?.name ?? null,
    agencyCode: agency?.referralCode ?? null,
    additionalInfo: data.additionalInfo ?? null,
  });

  return NextResponse.json({ success: true, leadId, persisted: leadId !== null });
}
