import type { Metadata } from "next";
import Link from "next/link";
import { getActiveWholesalePackages } from "@/lib/queries";
import { Clock, Users, MapPin, ArrowRight, Star, Image as ImageIcon } from "lucide-react";
import { DestinoSelect } from "./DestinoSelect";

export const metadata: Metadata = {
  title: "Paquetes mayoristas — Medellín Trip Planner",
  description:
    "Catálogo de paquetes turísticos mayoristas para Colombia. Tarifas netas, comisiones competitivas y múltiples destinos.",
  robots: { index: false, follow: false },
};

const AUDIENCE_COLORS: Record<string, { bg: string; text: string }> = {
  "Familias":      { bg: "#EFF6FF", text: "#1D4ED8" },
  "Parejas":       { bg: "#FDF2F8", text: "#9D174D" },
  "Entre amigos":  { bg: "#F0FDF4", text: "#166534" },
  "Grupos":        { bg: "#FFF7ED", text: "#9A3412" },
  "Relax":         { bg: "#F0FDFA", text: "#134E4A" },
  "Adrenalina":    { bg: "#FFF1F2", text: "#9F1239" },
  "Cultura":       { bg: "#FAF5FF", text: "#6B21A8" },
  "Premium":       { bg: "#FEFCE8", text: "#854D0E" },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Ciudad":     "#2BB7A6",
  "Naturaleza": "#16A34A",
  "Cultural":   "#7C3AED",
  "Aventura":   "#DC2626",
  "Premium":    "#D97706",
};

export default async function PaquetesListPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; destino?: string; audiencia?: string }>;
}) {
  const { categoria, destino, audiencia } = await searchParams;

  const all = await getActiveWholesalePackages();

  const categories = [...new Set(all.map((p) => p.category))].sort();
  const destinations = [...new Set(all.flatMap((p) => p.destinations))].sort();
  const allAudiences = [...new Set(all.flatMap((p) => p.audiences))].sort();

  const filtered = all.filter((p) => {
    const matchCat = !categoria || p.category === categoria;
    const matchDest = !destino || p.destinations.some((d) => d.toLowerCase().includes(destino.toLowerCase()));
    const matchAud = !audiencia || p.audiences.includes(audiencia);
    return matchCat && matchDest && matchAud;
  });

  const sorted = [...filtered.filter((p) => p.highlight), ...filtered.filter((p) => !p.highlight)];

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* Hero */}
      <div className="bg-[#0D1B3D] py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-body text-xs font-semibold text-[#2BB7A6] tracking-widest uppercase mb-3">
            Portal Mayorista
          </p>
          <h1 className="font-heading text-4xl font-bold text-white leading-tight">
            Paquetes turísticos
            <br />
            <span className="text-[#2BB7A6]">para Colombia</span>
          </h1>
          <p className="font-body text-base text-white/60 mt-4 max-w-xl mx-auto">
            Catálogo exclusivo para agencias de viajes. Tarifas netas, múltiples operadores y destinos únicos.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        {/* Filters row 1: categories + destination */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 bg-white border border-[#E2E8ED] rounded-xl p-1 flex-wrap">
            <a
              href={`/paquetes${destino ? `?destino=${encodeURIComponent(destino)}` : ""}${audiencia ? `${destino ? "&" : "?"}audiencia=${encodeURIComponent(audiencia)}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-colors ${!categoria ? "bg-[#0D1B3D] text-white" : "text-[#637489] hover:text-[#0D1B3D] hover:bg-[#F1F3F6]"}`}
            >
              Todos
            </a>
            {categories.map((cat) => {
              const params = new URLSearchParams();
              params.set("categoria", cat);
              if (destino) params.set("destino", destino);
              if (audiencia) params.set("audiencia", audiencia);
              return (
                <a
                  key={cat}
                  href={`/paquetes?${params.toString()}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-colors ${categoria === cat ? "bg-[#0D1B3D] text-white" : "text-[#637489] hover:text-[#0D1B3D] hover:bg-[#F1F3F6]"}`}
                >
                  {cat}
                </a>
              );
            })}
          </div>
          <DestinoSelect destinations={destinations} current={destino ?? ""} categoria={categoria} />
          <p className="ml-auto font-body text-sm text-[#9DAAB5]">
            {sorted.length} paquete{sorted.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters row 2: audiences */}
        {allAudiences.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-xs font-semibold text-[#637489] uppercase tracking-wide mr-1">Ideal para:</span>
            {audiencia && (
              <a
                href={`/paquetes${categoria ? `?categoria=${encodeURIComponent(categoria)}` : ""}${destino ? `${categoria ? "&" : "?"}destino=${encodeURIComponent(destino)}` : ""}`}
                className="px-3 py-1 rounded-full text-xs font-body font-semibold bg-[#0D1B3D] text-white"
              >
                {audiencia} ✕
              </a>
            )}
            {allAudiences.filter((a) => a !== audiencia).map((aud) => {
              const colors = AUDIENCE_COLORS[aud] ?? { bg: "#F1F3F6", text: "#637489" };
              const params = new URLSearchParams();
              if (categoria) params.set("categoria", categoria);
              if (destino) params.set("destino", destino);
              params.set("audiencia", aud);
              return (
                <a
                  key={aud}
                  href={`/paquetes?${params.toString()}`}
                  className="px-3 py-1 rounded-full text-xs font-body font-semibold border border-transparent hover:border-current transition-colors"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {aud}
                </a>
              );
            })}
          </div>
        )}

        {/* Grid */}
        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
            <MapPin className="w-10 h-10 text-[#9DAAB5] mx-auto mb-3" />
            <p className="font-body text-sm font-medium text-[#0D1B3D] mb-1">Sin paquetes para este filtro</p>
            <Link href="/paquetes" className="font-body text-sm text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors">
              Ver todos →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((pkg) => {
              const catColor = CATEGORY_COLORS[pkg.category] ?? "#637489";
              return (
                <Link
                  key={pkg.id}
                  href={`/paquetes/${pkg.slug}`}
                  className="bg-white rounded-2xl border border-[#E2E8ED] overflow-hidden hover:border-[#2BB7A6]/50 hover:shadow-lg transition-all group flex flex-col"
                >
                  {/* Cover image */}
                  <div className="relative h-44 overflow-hidden bg-[#F1F3F6] shrink-0">
                    {pkg.coverImage ? (
                      <img
                        src={pkg.coverImage}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${catColor}20 0%, ${catColor}08 100%)` }}
                      >
                        <ImageIcon className="w-7 h-7" style={{ color: catColor + "60" }} />
                        <span className="font-body text-xs font-semibold" style={{ color: catColor + "80" }}>
                          {pkg.destinations[0]}
                        </span>
                      </div>
                    )}

                    {/* Overlay badges */}
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <span
                        className="font-body text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: catColor }}
                      >
                        {pkg.category}
                      </span>
                      {pkg.badge && (
                        <span className="font-body text-[10px] font-bold bg-[#FFC97A] text-[#0D1B3D] px-2 py-0.5 rounded-full">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    {pkg.highlight && (
                      <div className="absolute top-2.5 right-2.5">
                        <Star className="w-4 h-4 fill-[#FFC97A] text-[#FFC97A] drop-shadow" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-heading text-base font-bold text-[#0D1B3D] leading-snug mb-2 group-hover:text-[#2BB7A6] transition-colors">
                      {pkg.name}
                    </h2>

                    {/* Audiences */}
                    {pkg.audiences.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pkg.audiences.slice(0, 3).map((aud) => {
                          const colors = AUDIENCE_COLORS[aud] ?? { bg: "#F1F3F6", text: "#637489" };
                          return (
                            <span
                              key={aud}
                              className="font-body text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: colors.bg, color: colors.text }}
                            >
                              {aud}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Destinations */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3 h-3 text-[#9DAAB5] shrink-0" />
                      <p className="font-body text-xs text-[#637489] line-clamp-1">
                        {pkg.destinations.join(" · ")}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs font-body text-[#9DAAB5] mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Mín {pkg.minPax} pax
                      </span>
                    </div>

                    {/* Price */}
                    <div className="border-t border-[#F1F3F6] pt-4 mt-auto flex items-end justify-between">
                      <div>
                        <p className="font-body text-[10px] text-[#9DAAB5]">Tarifa neta desde</p>
                        <p className="font-heading text-xl font-bold text-[#2BB7A6] leading-none mt-0.5">
                          ${pkg.netRate.toLocaleString("es-CO")}
                        </p>
                        <p className="font-body text-[10px] text-[#9DAAB5] mt-0.5">COP / pax</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-body font-semibold text-[#2BB7A6] group-hover:gap-2.5 transition-all">
                        Ver detalles <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA strip */}
        <div className="bg-[#0D1B3D] rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="font-heading text-lg font-bold text-white">¿Eres agencia de viajes?</p>
            <p className="font-body text-sm text-white/60 mt-1">
              Accede a tarifas netas, reserva en línea y gestiona tus solicitudes desde el portal mayorista.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/agencias/registro"
              className="inline-flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Registrar agencia
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
