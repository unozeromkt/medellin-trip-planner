import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReserveWizard } from "@/app/agency/paquetes/[slug]/ReserveWizard";
import { ArrowLeft } from "lucide-react";
import { DEFAULT_COUNTRY_CODE } from "@/lib/country-codes";

export const metadata: Metadata = { title: "Editar reserva | Portal Agencias" };

export default async function EditReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "agency" || !profile.agencyId) redirect("/login");

  const { id } = await params;

  const reservation = await db.packageReservation.findUnique({
    where: { id },
    include: {
      package: { select: { id: true, name: true, netRate: true, commission: true, minPax: true, maxPax: true } },
      passengers: { orderBy: [{ isLeader: "desc" }, { createdAt: "asc" }] },
    },
  });

  if (!reservation || reservation.agencyId !== profile.agencyId) notFound();
  if (reservation.status !== "pending") redirect("/agency/reservas");

  const initialData = {
    travelDate: reservation.travelDate.toISOString().split("T")[0],
    paxCount: reservation.paxCount,
    contactName: reservation.contactName,
    contactEmail: reservation.contactEmail ?? "",
    contactPhone: reservation.contactPhone ?? "",
    message: reservation.message ?? "",
    groupLanguage: reservation.groupLanguage ?? "",
    paymentMethod: reservation.paymentMethod ?? "",
    paymentProofUrl: reservation.paymentProofUrl ?? "",
    paymentRef: reservation.paymentRef ?? "",
    passengers: reservation.passengers.map((p) => ({
      fullName: p.fullName,
      documentId: p.documentId,
      phoneCountryCode: p.phoneCountryCode ?? DEFAULT_COUNTRY_CODE,
      phone: p.phone ?? "",
      email: p.email ?? "",
    })),
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/agency/reservas" className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Mis reservas
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Editar reserva</h1>
        <p className="text-[#637489] text-sm font-body mt-1">{reservation.package.name}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
        <ReserveWizard
          packageId={reservation.package.id}
          packageName={reservation.package.name}
          netRate={reservation.package.netRate}
          commission={reservation.package.commission}
          minPax={reservation.package.minPax}
          maxPax={reservation.package.maxPax}
          contactName={reservation.contactName}
          mode="edit"
          reservationId={reservation.id}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
