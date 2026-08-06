import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;

  const order = await db.tourOrder.findUnique({
    where: { reference },
    select: {
      reference: true,
      status: true,
      amountInCents: true,
      currency: true,
      contactName: true,
      travelDate: true,
      peopleCount: true,
      tour: { select: { title: true, slug: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
