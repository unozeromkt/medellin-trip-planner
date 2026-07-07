"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { Pencil, ExternalLink, Search, EyeOff, Eye, X } from "lucide-react";
import { setTourStatus } from "./actions";

type Tour = {
  id: string;
  title: string;
  slug: string;
  status: string;
  priceFrom: number | null;
  isFeatured: boolean;
  destination: { name: string };
  tourCategories: { category: { name: string } }[];
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:          { label: "Borrador",    color: "bg-gray-100 text-gray-600" },
  pending_review: { label: "En revisión", color: "bg-amber-100 text-amber-700" },
  approved:       { label: "Aprobado",    color: "bg-blue-100 text-blue-700" },
  published:      { label: "Publicado",   color: "bg-emerald-100 text-emerald-700" },
  rejected:       { label: "Rechazado",   color: "bg-red-100 text-red-700" },
  archived:       { label: "Archivado",   color: "bg-gray-100 text-gray-500" },
};

function StatusChip({ tour }: { tour: Tour }) {
  const [pending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState(tour.status);

  const current = STATUS_LABELS[optimisticStatus] ?? STATUS_LABELS.draft;
  const isPublished = optimisticStatus === "published";
  const isDraft = optimisticStatus === "draft";

  if (!isPublished && !isDraft) {
    return (
      <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${current.color}`}>
        {current.label}
      </span>
    );
  }

  function toggle() {
    const next = isPublished ? "draft" : "published";
    setOptimisticStatus(next);
    startTransition(async () => {
      const result = await setTourStatus(tour.id, next as "published" | "draft");
      if (result.error) setOptimisticStatus(optimisticStatus);
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title={isPublished ? "Clic para despublicar" : "Clic para publicar"}
      className={`group inline-flex items-center gap-1 text-xs font-body font-medium px-2.5 py-1 rounded-full transition-all cursor-pointer disabled:opacity-60 ${current.color} ${
        isPublished
          ? "hover:bg-red-100 hover:text-red-700"
          : "hover:bg-emerald-100 hover:text-emerald-700"
      }`}
    >
      <span className="group-hover:hidden">{current.label}</span>
      {isPublished ? (
        <span className="hidden group-hover:inline-flex items-center gap-1">
          <EyeOff className="w-3 h-3" /> Despublicar
        </span>
      ) : (
        <span className="hidden group-hover:inline-flex items-center gap-1">
          <Eye className="w-3 h-3" /> Publicar
        </span>
      )}
    </button>
  );
}

export function ToursTable({ tours }: { tours: Tour[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tours;
    return tours.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.destination.name.toLowerCase().includes(q) ||
        t.tourCategories.some((tc) => tc.category.name.toLowerCase().includes(q))
    );
  }, [query, tours]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DAAB5] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, destino o categoría…"
          className="w-full pl-10 pr-9 py-2.5 text-sm font-body bg-white border border-[#E9EEF4] rounded-xl text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6]/30 focus:border-[#2BB7A6] transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DAAB5] hover:text-[#637489]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E9EEF4] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#9DAAB5] font-body text-sm">
              {query ? `Sin resultados para "${query}"` : "No hay tours creados aún."}
            </p>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="mt-2 text-xs font-body text-[#2BB7A6] hover:underline"
              >
                Limpiar búsqueda
              </button>
            )}
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
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F6]">
              {filtered.map((tour) => {
                const cats = tour.tourCategories.map((tc) => tc.category.name).join(", ");
                return (
                  <tr key={tour.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-body font-medium text-[#0D1B3D]">
                        {tour.title}
                        {tour.isFeatured && (
                          <span className="ml-2 text-[10px] bg-[#FFC97A] text-[#0D1B3D] font-semibold px-1.5 py-0.5 rounded-full">
                            Destacado
                          </span>
                        )}
                      </p>
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
                      <StatusChip tour={tour} />
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-body text-[#637489]">
                        {tour.priceFrom
                          ? `$${tour.priceFrom.toLocaleString("es-CO")} COP`
                          : "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href={`/tours/${tour.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Previsualizar"
                          className="inline-flex items-center gap-1 text-xs font-body font-medium text-[#637489] hover:text-[#0D1B3D] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Vista
                        </a>
                        <Link
                          href={`/admin/tours/${tour.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs font-body font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {query && filtered.length > 0 && (
        <p className="text-xs font-body text-[#9DAAB5] px-1">
          {filtered.length} de {tours.length} tour{tours.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
