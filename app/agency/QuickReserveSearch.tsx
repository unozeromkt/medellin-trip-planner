"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, TrendingUp, ArrowRight } from "lucide-react";

export type QuickReservePackage = {
  id: string;
  slug: string;
  name: string;
  category: string;
  destinations: string[];
  netRate: number;
  commission: number;
  reservationCount?: number;
};

type Props = {
  packages: QuickReservePackage[];
  topSellers: QuickReservePackage[];
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function QuickReserveSearch({ packages, topSellers }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return null;
    return packages
      .filter((pkg) => {
        const haystack = normalize(
          [pkg.name, pkg.category, ...pkg.destinations].join(" ")
        );
        return haystack.includes(q);
      })
      .slice(0, 6);
  }, [query, packages]);

  const listToShow = results ?? topSellers;
  const isSearching = results !== null;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-base font-bold text-[#0D1B3D]">
          Reservar rápido
        </h2>
        {!isSearching && (
          <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-[#637489]">
            <TrendingUp className="w-3.5 h-3.5 text-[#2BB7A6]" />
            Más vendidos
          </span>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DAAB5]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar paquete por nombre o destino…"
          className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition"
        />
      </div>

      {listToShow.length === 0 ? (
        <p className="font-body text-sm text-[#637489] text-center py-6">
          {isSearching
            ? "No encontramos paquetes que coincidan con tu búsqueda."
            : "Aún no hay paquetes disponibles."}
        </p>
      ) : (
        <div className="space-y-2">
          {listToShow.map((pkg, i) => (
            <Link
              key={pkg.id}
              href={`/agency/paquetes/${pkg.slug}#reservar`}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8ED] hover:border-[#2BB7A6]/40 hover:bg-[#2BB7A6]/4 transition-colors group"
            >
              {!isSearching && (
                <span className="w-6 h-6 rounded-full bg-[#2BB7A6]/10 text-[#2BB7A6] text-xs font-bold font-body flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#0D1B3D] truncate">
                  {pkg.name}
                </p>
                <p className="font-body text-xs text-[#637489] truncate">
                  {pkg.destinations.join(" · ")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-heading text-sm font-bold text-[#2BB7A6]">
                  ${pkg.netRate.toLocaleString("es-CO")}
                </p>
                <p className="font-body text-[10px] text-[#9DAAB5]">
                  {pkg.commission}% comisión
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-body font-semibold text-[#2BB7A6] bg-[#2BB7A6]/10 group-hover:bg-[#2BB7A6] group-hover:text-white transition-colors px-3 py-1.5 rounded-lg shrink-0">
                Reservar
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
