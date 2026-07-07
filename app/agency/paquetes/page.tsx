import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { getActiveWholesalePackages } from "@/lib/queries";
import { MapPin, Clock, Users, ArrowRight, Star } from "lucide-react";

export const metadata: Metadata = { title: "Paquetes mayoristas | Portal Agencias" };

const CATEGORY_COLORS: Record<string, string> = {
  aventura: "bg-emerald-50 text-emerald-700",
  cultural: "bg-blue-50 text-blue-700",
  naturaleza: "bg-green-50 text-green-700",
  bienestar: "bg-purple-50 text-purple-700",
};

export default async function AgencyPaquetesPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "agency") redirect("/login");

  const packages = await getActiveWholesalePackages();
  const highlighted = packages.filter((p) => p.highlight);
  const rest = packages.filter((p) => !p.highlight);
  const ordered = [...highlighted, ...rest];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Paquetes mayoristas</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          {packages.length} paquete{packages.length !== 1 ? "s" : ""} disponible{packages.length !== 1 ? "s" : ""} · Tarifas netas exclusivas para agencias
        </p>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
          <p className="font-body text-sm text-[#637489]">
            Aún no hay paquetes mayoristas disponibles. Vuelve pronto.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {ordered.map((pkg) => {
            const catKey = pkg.category.toLowerCase();
            const catClass = CATEGORY_COLORS[catKey] ?? "bg-[#F1F3F6] text-[#637489]";
            return (
              <div key={pkg.id} className={`bg-white rounded-2xl border flex flex-col transition-all hover:shadow-md ${pkg.highlight ? "border-[#2BB7A6]/40 shadow-sm" : "border-[#E2E8ED]"}`}>
                {/* Card header */}
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full ${catClass}`}>
                      {pkg.category}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {pkg.highlight && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                      {pkg.badge && (
                        <span className="text-[10px] font-body font-bold bg-[#FFC97A]/20 text-amber-700 px-2 py-0.5 rounded-full">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className="font-heading text-base font-bold text-[#0D1B3D] leading-snug">
                    {pkg.name}
                  </h2>

                  <p className="text-xs font-body text-[#637489] line-clamp-2">{pkg.description}</p>

                  <div className="flex flex-wrap gap-2 text-xs font-body text-[#637489]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{pkg.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />Mín {pkg.minPax} pax
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {pkg.destinations.map((d) => (
                      <span key={d} className="flex items-center gap-0.5 text-xs font-body text-[#637489] bg-[#F1F3F6] px-2 py-0.5 rounded-md">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />{d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer */}
                <div className="border-t border-[#F1F3F6] px-5 py-4">
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-body text-[#9DAAB5] uppercase tracking-wide">Tarifa neta desde</p>
                      <p className="font-heading text-xl font-bold text-[#2BB7A6]">
                        ${pkg.netRate.toLocaleString("es-CO")}
                        <span className="text-xs font-body font-normal text-[#9DAAB5] ml-1">COP/pax</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-body text-[#9DAAB5] uppercase tracking-wide">Tu comisión</p>
                      <p className="font-heading text-xl font-bold text-[#0D1B3D]">{pkg.commission}%</p>
                    </div>
                  </div>
                  <Link
                    href={`/agency/paquetes/${pkg.slug}`}
                    className="flex items-center justify-center gap-2 w-full bg-[#0D1B3D] hover:bg-[#0D1B3D]/90 text-white font-body font-semibold text-sm py-2.5 rounded-xl transition-colors"
                  >
                    Ver detalle y reservar <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
