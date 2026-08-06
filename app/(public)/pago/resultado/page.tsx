import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PaymentResultView } from "@/components/payments/PaymentResultView";

export const metadata: Metadata = { title: "Resultado de tu pago | Medellín Trip Planner" };

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  if (!ref) notFound();

  const order = await db.tourOrder.findUnique({
    where: { reference: ref },
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

  if (!order) notFound();

  return (
    <PaymentResultView
      initialOrder={{
        ...order,
        travelDate: order.travelDate ? order.travelDate.toISOString() : null,
      }}
    />
  );
}
