import { Phone, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";

export function WhatsAppCTABanner() {
  const message = encodeURIComponent(
    "Hola, quiero información sobre experiencias en Medellín Trip Planner."
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <section className="py-16 bg-[#0D1B3D] relative overflow-hidden">
      {/* Decorative teal glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#FFC97A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-white/80">
              Soporte humano y digital — siempre disponible
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
            Cuéntanos qué tipo de experiencia buscas y nuestro equipo te ayuda a planificarla. Respuesta en menos de 2 horas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-[#25D366]/20 group"
            >
              <Phone className="h-5 w-5" />
              Escribir por WhatsApp
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/tours"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 transition-colors"
            >
              Explorar tours
            </a>
          </div>

          <p className="mt-6 text-xs text-white/30">
            Sin compromisos. Sin tarjeta de crédito. Solo experiencias increíbles.
          </p>
        </div>
      </div>
    </section>
  );
}
