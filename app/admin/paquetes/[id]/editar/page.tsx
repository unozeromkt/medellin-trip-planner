import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import { EditPackageForm } from "./EditPackageForm";
import type { ItineraryDay, PaxPricing, OperatorInPackage } from "@/lib/wholesale-packages";

export const metadata: Metadata = { title: "Editar paquete | Admin" };

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [pkg, destinationRows] = await Promise.all([
    db.wholesalePackage.findUnique({ where: { id } }),
    db.destination.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { name: true } }),
  ]);
  if (!pkg) notFound();
  const destinationOptions = destinationRows.map((d) => d.name);

  const itinerary = (pkg.itinerary as ItineraryDay[]) ?? [];
  const paxPricing = (pkg.paxPricing as PaxPricing[]) ?? [];
  const operatorBreakdown = (pkg.operatorBreakdown as OperatorInPackage[]) ?? [];

  const defaults = {
    name: pkg.name,
    slug: pkg.slug,
    duration: pkg.duration,
    durationDays: pkg.durationDays,
    category: pkg.category,
    destinations: pkg.destinations,
    netRate: pkg.netRate,
    commission: pkg.commission,
    minPax: pkg.minPax,
    maxPax: pkg.maxPax,
    highlight: pkg.highlight,
    badge: pkg.badge ?? "",
    coverImage: pkg.coverImage ?? "",
    audiences: pkg.audiences,
    description: pkg.description,
    operatorCount: pkg.operatorCount,
    experiences: pkg.experiences.join("\n"),
    included: pkg.included.join("\n"),
    excluded: pkg.excluded.join("\n"),
    cancelPolicy: pkg.cancelPolicy,
    isActive: pkg.isActive,
    sortOrder: pkg.sortOrder,
    itinerary: itinerary.map((d) => ({
      day: d.day,
      title: d.title,
      activities: d.activities.join("\n"),
    })),
    paxPricing,
    operatorBreakdown,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/paquetes"
          className="flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Paquetes
        </Link>
        <span className="text-[#9DAAB5]">/</span>
        <span className="text-sm font-body text-[#0D1B3D] font-semibold truncate">
          {pkg.name}
        </span>
      </div>

      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Editar paquete</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Los cambios se reflejarán en el portal de agencias de inmediato.
        </p>
      </div>

      <EditPackageForm packageId={id} defaults={defaults} destinationOptions={destinationOptions} />
    </div>
  );
}
