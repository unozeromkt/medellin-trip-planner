"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Building2,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { type WholesalePackage } from "@/lib/wholesale-packages";

type Props = {
  pkg: WholesalePackage;
  related: WholesalePackage[];
};

export function PackageDetailClient({ pkg, related }: Props) {
  const [itineraryOpen, setItineraryOpen] = useState(true);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  function handleShare() {
    const url = `${window.location.origin}/paquetes/${pkg.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    });
  }

  return (
    <div className="bg-[#F1F3F6] min-h-screen">
      {/* Page header */}
      <div className="bg-[#0D1B3D] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #2BB7A6 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2BB7A6] opacity-[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-body text-[#A8CBE6] mb-6">
            <Link href="/agencias" className="hover:text-white transition-colors">
              Portal Mayorista
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/agencias#catalogo" className="hover:text-white transition-colors">
              Catálogo
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{pkg.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-[#2BB7A6]/15 border border-[#2BB7A6]/30 text-[#2BB7A6] text-xs font-body font-medium rounded-lg px-2.5 py-0.5">
                  {pkg.category}
                </Badge>
                {pkg.badge && (
                  <Badge className="bg-[#FFC97A] text-[#0D1B3D] text-xs font-body font-semibold rounded-lg px-2.5 py-0.5 border-0">
                    {pkg.badge}
                  </Badge>
                )}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {pkg.name}
              </h1>

              {/* Key meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#A8CBE6] font-body">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2BB7A6]" />
                  {pkg.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2BB7A6]" />
                  {pkg.destinations.join(" · ")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#2BB7A6]" />
                  {pkg.operatorCount} operadores incluidos
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#2BB7A6]" />
                  Mín. {pkg.minPax} — Máx. {pkg.maxPax} pax
                </span>
              </div>
            </div>

            {/* Commission highlight — desktop visible in header */}
            <div className="hidden lg:flex items-center gap-4 bg-white/10 border border-white/15 rounded-2xl px-6 py-4">
              <div className="text-center">
                <p className="font-body text-[#A8CBE6] text-xs uppercase tracking-widest mb-1">
                  Tu margen
                </p>
                <p className="font-heading text-4xl font-bold text-[#2BB7A6]">
                  {pkg.commission}%
                </p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="font-body text-[#A8CBE6] text-xs uppercase tracking-widest mb-1">
                  Tarifa neta
                </p>
                <p className="font-heading text-4xl font-bold text-white">
                  ${pkg.netRate}
                  <span className="text-lg font-normal text-[#A8CBE6]"> USD</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-[#E9EEF4] p-6">
              <h2 className="font-heading text-xl font-bold text-[#0D1B3D] mb-3">
                Sobre este paquete
              </h2>
              <p className="font-body text-[#637489] leading-relaxed">{pkg.description}</p>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-2xl border border-[#E9EEF4] overflow-hidden">
              <button
                onClick={() => setItineraryOpen(!itineraryOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F1F3F6] transition-colors"
              >
                <h2 className="font-heading text-xl font-bold text-[#0D1B3D]">
                  Itinerario día a día
                </h2>
                {itineraryOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#637489]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#637489]" />
                )}
              </button>

              {itineraryOpen && (
                <div className="px-6 pb-6 space-y-6">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="flex gap-4">
                      {/* Day circle */}
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-[#0D1B3D] text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
                          {day.day}
                        </div>
                        {day.day < pkg.itinerary.length && (
                          <div className="w-px flex-1 bg-[#E9EEF4] mt-2" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="pb-6">
                        <h3 className="font-heading text-base font-bold text-[#0D1B3D] mb-2">
                          Día {day.day}: {day.title}
                        </h3>
                        <ul className="space-y-1.5">
                          {day.activities.map((act) => (
                            <li
                              key={act}
                              className="flex items-start gap-2 font-body text-sm text-[#637489]"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#2BB7A6] mt-2 shrink-0" />
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Includes / Excludes */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#E9EEF4] p-6">
                <h2 className="font-heading text-lg font-bold text-[#0D1B3D] mb-4">
                  Incluye
                </h2>
                <ul className="space-y-2">
                  {pkg.included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 font-body text-sm text-[#637489]">
                      <Check className="w-4 h-4 text-[#2BB7A6] mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-[#E9EEF4] p-6">
                <h2 className="font-heading text-lg font-bold text-[#0D1B3D] mb-4">
                  No incluye
                </h2>
                <ul className="space-y-2">
                  {pkg.excluded.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 font-body text-sm text-[#637489]">
                      <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Operators breakdown */}
            <div className="bg-white rounded-2xl border border-[#E9EEF4] p-6">
              <h2 className="font-heading text-xl font-bold text-[#0D1B3D] mb-4">
                Operadores en este paquete
              </h2>
              <div className="divide-y divide-[#E9EEF4]">
                {pkg.operatorBreakdown.map((op) => (
                  <div key={op.name} className="py-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2BB7A6]/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-[#2BB7A6]" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-[#0D1B3D]">{op.name}</p>
                      <p className="font-body text-xs text-[#637489]">{op.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing table */}
            <div className="bg-white rounded-2xl border border-[#E9EEF4] p-6">
              <h2 className="font-heading text-xl font-bold text-[#0D1B3D] mb-1">
                Tarifas netas por volumen
              </h2>
              <p className="font-body text-sm text-[#637489] mb-5">
                Precios netos por persona. Tu margen se calcula sobre el precio público referencial.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-[#E9EEF4]">
                      <th className="text-left text-[#637489] font-semibold pb-3 pr-4">Grupo</th>
                      <th className="text-right text-[#637489] font-semibold pb-3 px-4">Tarifa neta / pp</th>
                      <th className="text-right text-[#637489] font-semibold pb-3 pl-4">Tu comisión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EEF4]">
                    {pkg.paxPricing.map((row) => (
                      <tr key={row.label} className="hover:bg-[#F1F3F6] transition-colors">
                        <td className="py-3 pr-4 font-medium text-[#0D1B3D]">{row.label}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#0D1B3D]">
                          {row.netRatePP !== null ? (
                            <>
                              ${row.netRatePP}{" "}
                              <span className="font-normal text-[#637489]">USD</span>
                            </>
                          ) : (
                            <span className="text-[#637489] font-normal">{row.note}</span>
                          )}
                        </td>
                        <td className="py-3 pl-4 text-right">
                          {row.commission !== null ? (
                            <span className="inline-flex items-center justify-end gap-1 text-[#2BB7A6] font-bold">
                              {row.commission}%
                            </span>
                          ) : (
                            <span className="text-[#637489]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cancel policy */}
            <div className="bg-[#FFF9EE] border border-[#FFC97A]/30 rounded-2xl p-5">
              <h3 className="font-heading text-base font-bold text-[#0D1B3D] mb-2">
                Política de cancelación
              </h3>
              <p className="font-body text-sm text-[#637489] leading-relaxed">
                {pkg.cancelPolicy}
              </p>
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Pricing card */}
            <div className="bg-white rounded-2xl border border-[#E9EEF4] shadow-lg p-6">
              <p className="font-body text-xs text-[#637489] uppercase tracking-widest mb-1">
                Tarifa neta desde
              </p>
              <div className="flex items-end gap-2 mb-1">
                <p className="font-heading text-4xl font-bold text-[#0D1B3D]">
                  ${pkg.netRate}
                </p>
                <p className="font-body text-[#637489] mb-1">USD / pp</p>
              </div>
              <p className="font-body text-xs text-[#637489] mb-5">
                Mín. {pkg.minPax} personas
              </p>

              {/* Commission badge */}
              <div className="bg-[#2BB7A6]/8 border border-[#2BB7A6]/20 rounded-xl p-4 flex items-center justify-between mb-5">
                <div>
                  <p className="font-body text-xs text-[#2BB7A6] font-semibold uppercase tracking-wide">
                    Tu margen garantizado
                  </p>
                  <p className="font-body text-xs text-[#637489] mt-0.5">
                    Por escrito en el contrato
                  </p>
                </div>
                <p className="font-heading text-3xl font-bold text-[#2BB7A6]">
                  {pkg.commission}%
                </p>
              </div>

              {/* Key facts */}
              <div className="space-y-2.5 mb-5">
                {[
                  { Icon: Clock, label: "Duración", value: pkg.duration },
                  { Icon: MapPin, label: "Destinos", value: pkg.destinations.join(", ") },
                  { Icon: Building2, label: "Operadores", value: `${pkg.operatorCount} incluidos` },
                  { Icon: Users, label: "Grupo", value: `${pkg.minPax}–${pkg.maxPax} pax` },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm font-body">
                    <span className="flex items-center gap-2 text-[#637489]">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                    <span className="font-medium text-[#0D1B3D]">{value}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/agencias#registro"
                className={cn(buttonVariants(), "w-full bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-semibold h-12 rounded-xl text-base shadow-md shadow-[#2BB7A6]/20 mb-3")}
              >
                Solicitar cotización
              </Link>
              <Link
                href="/agencias#catalogo"
                className={cn(buttonVariants({ variant: "outline" }), "w-full flex items-center justify-center border-[#E9EEF4] text-[#637489] hover:text-[#0D1B3D] hover:border-[#0D1B3D] rounded-xl h-10 text-sm font-medium")}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Ver catálogo completo
              </Link>

              {/* Share with client */}
              <button
                onClick={handleShare}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-xl h-10 text-sm font-medium border transition-all duration-200",
                  shareState === "copied"
                    ? "border-[#2BB7A6] bg-[#2BB7A6]/8 text-[#2BB7A6]"
                    : "border-[#2BB7A6] text-[#2BB7A6] hover:bg-[#2BB7A6]/8"
                )}
              >
                <Share2 className="w-4 h-4" />
                {shareState === "copied" ? "¡Enlace copiado!" : "Compartir con cliente"}
              </button>
            </div>

            {/* Agency access note */}
            <div className="bg-[#0D1B3D] rounded-2xl p-5 text-center">
              <p className="font-body text-[#A8CBE6] text-sm mb-3 leading-snug">
                ¿Aún no eres agencia registrada? El acceso a tarifas finales y contratos requiere registro.
              </p>
              <Link
                href="/agencias#registro"
                className={cn(buttonVariants({ variant: "default" }), "bg-[#FFC97A] hover:bg-[#FFC97A]/90 text-[#0D1B3D] font-semibold rounded-xl w-full")}
              >
                Registrar mi agencia →
              </Link>
            </div>
          </div>
        </div>

        {/* Related packages */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="mt-14"
          >
            <h2 className="font-heading text-2xl font-bold text-[#0D1B3D] mb-6">
              Paquetes similares
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/agencias/paquetes/${rel.slug}`}
                  className="group bg-white rounded-2xl border border-[#E9EEF4] hover:border-[#2BB7A6]/30 hover:shadow-lg transition-all duration-300 p-5"
                >
                  <div className="h-1 bg-gradient-to-r from-[#2BB7A6] to-[#A8CBE6] rounded-full mb-4" />
                  <Badge className="bg-[#0D1B3D]/8 text-[#0D1B3D] text-xs rounded-lg border-0 font-body font-medium px-2 py-0.5 mb-3">
                    {rel.category}
                  </Badge>
                  <h3 className="font-heading text-base font-bold text-[#0D1B3D] mb-1 group-hover:text-[#2BB7A6] transition-colors">
                    {rel.name}
                  </h3>
                  <p className="font-body text-xs text-[#637489] mb-3">{rel.duration} · {rel.destinations.join(", ")}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg font-bold text-[#0D1B3D]">
                      ${rel.netRate} <span className="text-xs font-normal text-[#637489]">USD/pp</span>
                    </span>
                    <span className="font-body text-sm font-bold text-[#2BB7A6]">
                      {rel.commission}% margen
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
