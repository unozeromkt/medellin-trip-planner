"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Clock,
  MapPin,
  Users,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Building2,
  MessageCircle,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { type WholesalePackage } from "@/lib/wholesale-packages";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";

type Props = { pkg: WholesalePackage };

export function PackagePublicClient({ pkg }: Props) {
  const [itineraryOpen, setItineraryOpen] = useState(true);

  const waMessage = encodeURIComponent(
    `Hola, me interesa el paquete *${pkg.name}* (${pkg.duration}). ¿Pueden darme información y tarifas disponibles?`
  );
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  return (
    <div className="bg-[#F1F3F6] min-h-screen">
      {/* Agent share notice */}
      <div className="bg-[#FFC97A]/20 border-b border-[#FFC97A]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#0D1B3D] shrink-0" />
          <p className="font-body text-sm text-[#0D1B3D]">
            Tu agente de viajes compartió esta página contigo. Consulta las tarifas y disponibilidad directamente con ellos.
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#0D1B3D] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #2BB7A6 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2BB7A6] opacity-[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
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
              {pkg.operatorCount} operadores
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#2BB7A6]" />
              {pkg.minPax}–{pkg.maxPax} personas
            </span>
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
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-[#0D1B3D] text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
                          {day.day}
                        </div>
                        {day.day < pkg.itinerary.length && (
                          <div className="w-px flex-1 bg-[#E9EEF4] mt-2" />
                        )}
                      </div>
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
                <h2 className="font-heading text-lg font-bold text-[#0D1B3D] mb-4">Incluye</h2>
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
                <h2 className="font-heading text-lg font-bold text-[#0D1B3D] mb-4">No incluye</h2>
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

            {/* Operators */}
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
          </div>

          {/* Right: sticky sidebar */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl border border-[#E9EEF4] shadow-lg p-6"
            >
              <p className="font-body text-xs text-[#637489] uppercase tracking-widest mb-2">
                Detalles del paquete
              </p>

              <div className="space-y-2.5 mb-6">
                {[
                  { Icon: Clock, label: "Duración", value: pkg.duration },
                  { Icon: MapPin, label: "Destinos", value: pkg.destinations.join(", ") },
                  { Icon: Building2, label: "Operadores", value: `${pkg.operatorCount} incluidos` },
                  { Icon: Users, label: "Grupo", value: `${pkg.minPax}–${pkg.maxPax} personas` },
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

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants(),
                  "w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold h-12 rounded-xl text-base shadow-md shadow-[#25D366]/20"
                )}
              >
                <MessageCircle className="w-5 h-5" />
                Consultar con mi agencia
              </a>
            </motion.div>

            {/* Disclaimer */}
            <div className="bg-[#0D1B3D] rounded-2xl p-5">
              <p className="font-body text-[#A8CBE6] text-sm leading-snug">
                Las tarifas y disponibilidad de este paquete son gestionadas por tu agencia de viajes. Contáctalos para obtener el precio final.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
