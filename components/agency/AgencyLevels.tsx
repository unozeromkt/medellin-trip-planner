import { CheckCircle2, Star } from "lucide-react";

const LEVELS = [
  {
    name: "Bronze",
    color: "#CD7F32",
    bg: "#FDF6EE",
    border: "#E8C49A",
    threshold: "0–9 reservas/mes",
    commission: "+0%",
    perks: [
      "Acceso al catálogo mayorista",
      "Tarifas netas garantizadas",
      "Soporte por WhatsApp",
      "Materiales de venta digitales",
    ],
    featured: false,
  },
  {
    name: "Silver",
    color: "#9CA3AF",
    bg: "#F9FAFB",
    border: "#D1D5DB",
    threshold: "10–24 reservas/mes",
    commission: "+2%",
    perks: [
      "Todo lo del nivel Bronze",
      "2% adicional sobre comisión base",
      "Acceso a preventas exclusivas",
      "Newsletter mayorista mensual",
    ],
    featured: false,
  },
  {
    name: "Gold",
    color: "#EAB308",
    bg: "#FEFCE8",
    border: "#FDE047",
    threshold: "25–49 reservas/mes",
    commission: "+5%",
    perks: [
      "Todo lo del nivel Silver",
      "5% adicional sobre comisión base",
      "Soporte prioritario <4h",
      "Cupo asegurado en tours top",
    ],
    featured: true,
  },
  {
    name: "Platinum",
    color: "#2BB7A6",
    bg: "#F0FDFB",
    border: "#A7F3D0",
    threshold: "50+ reservas/mes",
    commission: "+8%",
    perks: [
      "Todo lo del nivel Gold",
      "8% adicional sobre comisión base",
      "Ejecutivo comercial dedicado",
      "Co-marketing con tu agencia",
    ],
    featured: false,
  },
] as const;

export function AgencyLevels() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-body text-[#2BB7A6] text-sm font-semibold tracking-widest uppercase mb-3">
            Programa de beneficios
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0D1B3D] mb-4">
            Crece y gana más con cada reserva
          </h2>
          <p className="font-body text-[#637489] text-lg max-w-2xl mx-auto">
            Cuantas más reservas generes, más sube tu nivel y mayor es tu comisión.
            Sin cuota de membresía, sin letras pequeñas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LEVELS.map((level) => (
            <div
              key={level.name}
              className={`rounded-2xl border p-6 flex flex-col relative ${level.featured ? "ring-2 ring-[#EAB308] shadow-lg shadow-yellow-100" : ""}`}
              style={{ backgroundColor: level.bg, borderColor: level.border }}
            >
              {level.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-[#EAB308] text-white font-body text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Más popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: level.color }}
                />
                <p className="font-heading text-lg font-bold" style={{ color: level.color }}>
                  {level.name}
                </p>
              </div>

              <p className="font-body text-xs text-[#637489] mb-4">{level.threshold}</p>

              <div className="mb-5">
                <p className="font-body text-xs text-[#9DAAB5] mb-0.5">Comisión adicional</p>
                <p className="font-heading text-3xl font-bold" style={{ color: level.color }}>
                  {level.commission}
                </p>
              </div>

              <ul className="space-y-2 flex-1">
                {level.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <CheckCircle2
                      className="w-3.5 h-3.5 shrink-0 mt-0.5"
                      style={{ color: level.color }}
                    />
                    <span className="font-body text-xs text-[#637489] leading-snug">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="font-body text-xs text-[#9DAAB5] text-center mt-8">
          El nivel se calcula automáticamente según las reservas de los últimos 30 días. La comisión adicional se suma a la comisión base del paquete.
        </p>
      </div>
    </section>
  );
}
