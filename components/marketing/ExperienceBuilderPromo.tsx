import Link from "next/link";
import { Wand2, CheckCircle2 } from "lucide-react";

const STEPS = [
  "Elige tus destinos favoritos",
  "Selecciona experiencias por categoría",
  "Recibe un itinerario personalizado",
  "Contacta directo por WhatsApp",
];

export function ExperienceBuilderPromo() {
  return (
    <section className="bg-[#0D1B3D] py-20 lg:py-24 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #A8CBE6 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#2BB7A6]/15 border border-[#2BB7A6]/30 rounded-full px-4 py-1.5 mb-5">
            <Wand2 className="w-3.5 h-3.5 text-[#2BB7A6]" />
            <span className="font-body text-xs font-semibold text-[#2BB7A6] tracking-wide uppercase">
              Experience Builder
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Arma tu viaje a Colombia
            <br />
            <span className="text-[#2BB7A6]">en minutos</span>
          </h2>

          <p className="font-body text-white/60 text-base leading-relaxed mb-8">
            Selecciona destinos y experiencias de múltiples operadores y genera tu itinerario
            personalizado al instante. Sin formularios largos, sin espera.
          </p>

          <ul className="space-y-3 mb-10">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2BB7A6]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2BB7A6]" />
                </div>
                <span className="font-body text-sm text-white/80">{step}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/experience-builder"
            className="inline-flex items-center gap-2.5 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-base px-7 py-3.5 rounded-2xl transition-colors"
          >
            <Wand2 className="w-4.5 h-4.5" />
            Planear mi viaje gratis
          </Link>
        </div>

        {/* Right: visual cards */}
        <div className="hidden lg:grid grid-cols-2 gap-3 pointer-events-none select-none">
          {[
            { cat: "Aventura", name: "Rafting en el río Claro", hrs: "6h", price: "$89" },
            { cat: "Cultura", name: "Tour gráfico en el Barrio", hrs: "3h", price: "$45" },
            { cat: "Naturaleza", name: "Senderismo en Jardin", hrs: "8h", price: "$65" },
            { cat: "Gastronomía", name: "Degustación en Laureles", hrs: "2h", price: "$55" },
          ].map((card, i) => (
            <div
              key={card.name}
              className={`bg-white/[0.07] border border-white/10 rounded-2xl p-4 ${i === 1 ? "mt-5" : ""} ${i === 3 ? "mt-5" : ""}`}
            >
              <p className="font-body text-[10px] font-bold text-[#2BB7A6] uppercase tracking-widest mb-1.5">
                {card.cat}
              </p>
              <p className="font-heading text-sm font-bold text-white leading-snug mb-3">
                {card.name}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-white/50">{card.hrs}</span>
                <span className="font-heading text-sm font-bold text-[#FFC97A]">
                  {card.price} USD
                </span>
              </div>
              <div className="mt-3 h-1 bg-[#2BB7A6]/30 rounded-full">
                <div
                  className="h-1 bg-[#2BB7A6] rounded-full"
                  style={{ width: i % 2 === 0 ? "100%" : "0%" }}
                />
              </div>
              <p className="font-body text-[10px] text-white/30 mt-1">
                {i % 2 === 0 ? "✓ Agregado al itinerario" : "Toca para agregar"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
