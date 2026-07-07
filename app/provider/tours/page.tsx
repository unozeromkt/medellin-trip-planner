import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { Plus, Pencil } from "lucide-react";

export const metadata: Metadata = { title: "Mis tours | Portal Operadores" };

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "bg-gray-100 text-gray-600" },
  pending_review: { label: "En revisión", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprobado", color: "bg-blue-100 text-blue-700" },
  published: { label: "Publicado", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rechazado", color: "bg-red-100 text-red-700" },
  archived: { label: "Archivado", color: "bg-gray-100 text-gray-500" },
};

export default async function ProviderToursPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "operator" || !profile.operatorId) redirect("/login");

  const tours = await db.tour.findMany({
    where: { operatorId: profile.operatorId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      priceFrom: true,
      updatedAt: true,
      destination: { select: { name: true } },
      tourCategories: { select: { category: { select: { name: true } } } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Mis tours</h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            {tours.length} tour{tours.length !== 1 ? "s" : ""} en tu catálogo
          </p>
        </div>
        <Link
          href="/provider/tours/nuevo"
          className="flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white text-sm font-semibold font-body px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo tour
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E9EEF4] overflow-hidden">
        {tours.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#9DAAB5] font-body text-sm mb-3">
              Aún no tienes tours. Crea uno y envíalo a revisión.
            </p>
            <Link
              href="/provider/tours/nuevo"
              className="inline-flex items-center gap-2 bg-[#2BB7A6] text-white text-sm font-semibold font-body px-5 py-2.5 rounded-xl"
            >
              <Plus className="w-4 h-4" /> Crear primer tour
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E9EEF4] bg-[#F8FAFC]">
                <th className="text-left text-xs font-body font-semibold text-[#9DAAB5] uppercase tracking-wide px-6 py-3.5">
                  Tour
                </th>
                <th className="text-left text-xs font-body font-semibold text-[#9DAAB5] uppercase tracking-wide px-4 py-3.5">
                  Destino
                </th>
                <th className="text-left text-xs font-body font-semibold text-[#9DAAB5] uppercase tracking-wide px-4 py-3.5">
                  Estado
                </th>
                <th className="text-left text-xs font-body font-semibold text-[#9DAAB5] uppercase tracking-wide px-4 py-3.5">
                  Precio
                </th>
                <th className="text-left text-xs font-body font-semibold text-[#9DAAB5] uppercase tracking-wide px-4 py-3.5">
                  Actualizado
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F6]">
              {tours.map((tour) => {
                const status = STATUS_LABELS[tour.status] ?? STATUS_LABELS.draft;
                const cats = tour.tourCategories.map((tc) => tc.category.name).join(", ");
                return (
                  <tr key={tour.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-body font-medium text-[#0D1B3D]">{tour.title}</p>
                      {cats && (
                        <p className="text-xs text-[#9DAAB5] font-body mt-0.5">{cats}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-body text-[#637489]">
                        {tour.destination.name}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-body text-[#637489]">
                        {tour.priceFrom
                          ? `$${tour.priceFrom.toLocaleString("es-CO")} COP`
                          : "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs font-body text-[#9DAAB5]">
                        {new Intl.DateTimeFormat("es-CO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(tour.updatedAt))}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {["draft", "pending_review", "rejected"].includes(tour.status) ? (
                        <Link
                          href={`/provider/tours/${tour.id}/editar`}
                          className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </Link>
                      ) : (
                        <span className="text-xs font-body text-[#9DAAB5]">En revisión</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Status guide */}
      <div className="mt-6 bg-white rounded-2xl border border-[#E2E8ED] p-5">
        <p className="font-body text-xs font-semibold text-[#637489] mb-3 uppercase tracking-wide">
          Estados del flujo de publicación
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(STATUS_LABELS).map(([, { label, color }]) => (
            <span key={label} className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${color}`}>
              {label}
            </span>
          ))}
        </div>
        <p className="font-body text-xs text-[#9DAAB5] mt-3">
          Crea un borrador → envía a revisión → el admin aprueba y publica. Los tours rechazados pueden editarse y reenviarse.
        </p>
      </div>
    </div>
  );
}
