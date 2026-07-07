import Link from "next/link";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { ToursTable } from "./ToursTable";

async function getTours() {
  return db.tour.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      priceFrom: true,
      isFeatured: true,
      destination: { select: { name: true } },
      tourCategories: { select: { category: { select: { name: true } } } },
    },
  });
}

export default async function AdminToursPage() {
  const tours = await getTours();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Tours</h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            {tours.length} tour{tours.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white text-sm font-semibold font-body px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo tour
        </Link>
      </div>

      {tours.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E9EEF4] py-20 text-center">
          <p className="text-[#9DAAB5] font-body text-sm mb-3">No hay tours creados aún.</p>
          <Link
            href="/admin/tours/new"
            className="inline-flex items-center gap-2 bg-[#2BB7A6] text-white text-sm font-semibold font-body px-5 py-2.5 rounded-xl"
          >
            <Plus className="w-4 h-4" /> Crear primer tour
          </Link>
        </div>
      ) : (
        <ToursTable tours={tours} />
      )}
    </div>
  );
}
