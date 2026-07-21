import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";

export function OperatorBanner() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto overflow-hidden rounded-3xl border border-[#2BB7A6]/15 bg-gradient-to-br from-[#E8F8F6] via-white to-[#EAF3FB] px-6 py-10 sm:px-12 sm:py-12">
          {/* Decorative accents */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#2BB7A6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#FFC97A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#2BB7A6]/10 border border-[#2BB7A6]/20 flex items-center justify-center shrink-0">
              <Store className="w-8 h-8 text-[#2BB7A6]" />
            </div>

            <div className="flex-1">
              <p className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                ¿Eres operador turístico?
              </p>
              <p className="font-body text-sm sm:text-base text-muted-foreground max-w-md">
                Publica tus tours, llega a miles de viajeros y haz crecer tu negocio con Medellín Trip Planner.
              </p>
            </div>

            <Link
              href="/agencias"
              className="inline-flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-[#2BB7A6]/20 transition-all hover:-translate-y-0.5 shrink-0"
            >
              Unirme como proveedor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
