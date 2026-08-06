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
  items: z
    .array(
      z.object({
        tourId: z.string().min(1),
        // Multiplier applied to that tour's priceFrom. The single-tour sheet
        // sends peopleCount here (price × pax); the experience-builder cart
        // sends 1 per tour, matching the flat per-tour total shown there.
        quantity: z.coerce.number().min(1).max(100),
      })
    )
    .min(1),
  peopleCount: z.coerce.number().min(1).max(100).optional(),
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

  const tours = await db.tour.findMany({
    where: { id: { in: data.items.map((i) => i.tourId) } },
    select: { id: true, slug: true, title: true, priceFrom: true, currency: true },
  });
  const tourById = new Map(tours.map((t) => [t.id, t]));

  if (tours.length !== new Set(data.items.map((i) => i.tourId)).size || tours.some((t) => !t.priceFrom)) {
    return NextResponse.json({ error: "Uno o más tours no están disponibles para pago en línea" }, { status: 422 });
  }

  const currency = tours[0].currency || "COP";
  const amountInCents = data.items.reduce((sum, item) => {
    const tour = tourById.get(item.tourId)!;
    return sum + Math.round(tour.priceFrom! * item.quantity * 100);
  }, 0);
  const reference = generateOrderReference(tours.length === 1 ? tours[0].slug : "carrito");

  await db.tourOrder.create({
    data: {
      reference,
      status: "pending",
      amountInCents,
      currency,
      travelDate: data.travelDate ? new Date(data.travelDate) : null,
      peopleCount: data.peopleCount ?? null,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail || null,
      contactDocument: data.contactDocument || null,
      pickup: data.pickup || null,
      message: data.message || null,
      pageUrl: data.pageUrl || null,
      items: {
        create: data.items.map((item) => {
          const tour = tourById.get(item.tourId)!;
          return { tourId: tour.id, quantity: item.quantity, priceSnapshot: tour.priceFrom };
        }),
      },
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
