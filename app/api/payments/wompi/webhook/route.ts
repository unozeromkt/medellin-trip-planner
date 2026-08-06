import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWompiWebhookChecksum, WOMPI_STATUS_TO_ORDER_STATUS, type WompiWebhookEvent } from "@/lib/wompi";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { markGHLContactAsPaid } from "@/lib/ghl";

export async function POST(request: NextRequest) {
  let event: WompiWebhookEvent;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!event?.data?.transaction || !event?.signature?.checksum) {
    return NextResponse.json({ error: "Malformed event" }, { status: 400 });
  }

  if (!verifyWompiWebhookChecksum(event)) {
    console.warn("[wompi webhook] Checksum verification failed");
    return NextResponse.json({ error: "Invalid checksum" }, { status: 401 });
  }

  if (event.event !== "transaction.updated") {
    return NextResponse.json({ received: true });
  }

  const { transaction } = event.data;
  const order = await db.tourOrder.findUnique({
    where: { reference: transaction.reference },
    include: { items: { include: { tour: { select: { title: true } } } } },
  });

  if (!order) {
    console.warn(`[wompi webhook] No TourOrder found for reference ${transaction.reference}`);
    return NextResponse.json({ received: true });
  }

  const tourTitles = order.items.map((i) => i.tour.title).join(", ");

  const newStatus = WOMPI_STATUS_TO_ORDER_STATUS[transaction.status] ?? "error";
  const wasAlreadyApproved = order.status === "approved";

  await db.tourOrder.update({
    where: { id: order.id },
    data: {
      status: newStatus,
      wompiTransactionId: transaction.id,
      wompiPaymentMethod: transaction.payment_method_type ?? null,
      paidAt: newStatus === "approved" ? new Date() : order.paidAt,
    },
  });

  if (newStatus === "approved" && !wasAlreadyApproved) {
    const sideEffects: Promise<unknown>[] = [];

    if (order.contactEmail) {
      sideEffects.push(
        sendOrderConfirmationEmail({
          contactName: order.contactName,
          contactEmail: order.contactEmail,
          tourTitle: tourTitles,
          reference: order.reference,
          amountInCents: order.amountInCents,
          currency: order.currency,
          travelDate: order.travelDate,
          peopleCount: order.peopleCount,
        }).then((sent) =>
          sent ? db.tourOrder.update({ where: { id: order.id }, data: { confirmationEmailSentAt: new Date() } }) : null
        )
      );
    }

    sideEffects.push(
      markGHLContactAsPaid({
        name: order.contactName,
        phone: order.contactPhone,
        email: order.contactEmail,
        tourTitle: tourTitles,
        reference: order.reference,
        amountInCents: order.amountInCents,
      }).then((result) =>
        db.tourOrder.update({
          where: { id: order.id },
          data: result.ok
            ? { ghlSyncedAt: new Date(), ghlSyncError: result.note ?? null }
            : { ghlSyncError: result.error },
        })
      )
    );

    await Promise.allSettled(sideEffects);
  }

  return NextResponse.json({ received: true });
}
