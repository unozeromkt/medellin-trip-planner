import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { TourForm } from "@/app/admin/tours/new/TourForm";
import { createProviderTour } from "@/app/provider/tours/actions";

export const metadata: Metadata = { title: "Nuevo tour | Portal Operadores" };

export default async function ProviderNuevoTourPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "operator" || !profile.operatorId) redirect("/login");

  const [destinations, categories, operator] = await Promise.all([
    db.destination.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, description: true, coverImage: true, region: true },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, description: true, icon: true, color: true },
    }),
    db.operator.findUnique({
      where: { id: profile.operatorId },
    }),
  ]);

  if (!operator) redirect("/provider");

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/provider/tours"
          className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Mis tours
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Nuevo tour</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Guarda como borrador o envía a revisión cuando esté listo.
        </p>
      </div>

      <TourForm
        destinations={destinations}
        categories={categories}
        operators={[operator]}
        serverAction={createProviderTour}
        initialData={{ operatorId: operator.id } as Parameters<typeof TourForm>[0]["initialData"]}
        providerMode
      />
    </div>
  );
}
