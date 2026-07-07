import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { createTour } from "@/app/admin/tours/actions";
import { TourForm } from "./TourForm";

async function getFormData() {
  const [destinations, categories, operators] = await Promise.all([
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
    db.operator.findMany({
      where: { status: "active" },
      orderBy: { name: "asc" },
    }),
  ]);
  return { destinations, categories, operators };
}

export default async function NewTourPage() {
  const { destinations, categories, operators } = await getFormData();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/tours"
          className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a tours
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Crear nuevo tour</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Completa la información básica para publicar el tour.
        </p>
      </div>

      <TourForm
        destinations={destinations}
        categories={categories}
        operators={operators}
        serverAction={createTour}
      />
    </div>
  );
}
