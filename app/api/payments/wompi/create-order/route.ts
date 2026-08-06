import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  buildIntegritySignature,
  generateOrderReference,
  getWompiPublicKey,
  splitPhoneForWompi,
} from "@/lib/wompi";

const createOrderSchema = z.object({
  tourId: z.string().min(1),
  peopleCount: z.coerce.number().min(1).max(100),
  travelDate: z.string().optional(),
  contactName: z.string().min(2),
  contactPhone: z.string().min(7),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactDocument: z.string().optional(),
  pickup: z.string().optional(),
  message: z.string().optional(),
  pageUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }
  const data = parsed.data;

  const tour = await db.tour.findUnique({
    where: { id: data.tourId },
    select: { id: true, slug: true, title: true, priceFrom: true, currency: true, status: true },
  });

  if (!tour || !tour.priceFrom) {
    return NextResponse.json({ error: "Tour no disponible para pago en línea" }, { status: 422 });
  }

  const currency = tour.currency || "COP";
  const amountInCents = Math.round(tour.priceFrom * data.peopleCount * 100);
  const reference = generateOrderReference(tour.slug);

  await db.tourOrder.create({
    data: {
      reference,
      tourId: tour.id,
      status: "pending",
      amountInCents,
      currency,
      travelDate: data.travelDate ? new Date(data.travelDate) : null,
      peopleCount: data.peopleCount,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail || null,
      contactDocument: data.contactDocument || null,
      pickup: data.pickup || null,
      message: data.message || null,
      pageUrl: data.pageUrl || null,
    },
  });

  const signature = buildIntegritySignature({ reference, amountInCents, currency });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const { phoneNumberPrefix, phoneNumber } = splitPhoneForWompi(data.contactPhone);

  return NextResponse.json({
    publicKey: getWompiPublicKey(),
    reference,
    amountInCents,
    currency,
    signature,
    redirectUrl: `${siteUrl}/pago/resultado?ref=${reference}`,
    customerData: {
      email: data.contactEmail || undefined,
      fullName: data.contactName,
      phoneNumber,
      phoneNumberPrefix,
      legalId: data.contactDocument || undefined,
      legalIdType: data.contactDocument ? "CC" : undefined,
    },
  });
}
