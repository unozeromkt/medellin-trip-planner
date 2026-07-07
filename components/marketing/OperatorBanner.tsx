import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";

export function OperatorBanner() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";
  const waMsg = encodeURIComponent(
    "Hola, soy operador turístico y me interesa publicar mis experiencias en Medellín Trip Planner. ¿Cómo puedo registrarme?"
  );

  return (
    <div className="bg-[#F1F3F6] border-t border-[#E2E8ED]">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2BB7A6]/10 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-[#2BB7A6]" />
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-[#0D1B3D]">
              ¿Eres operador turístico?
            </p>
            <p className="font-body text-xs text-[#637489]">
              Publica tus tours y llega a miles de viajeros en Colombia
            </p>
          </div>
        </div>
        <Link
          href={`https://wa.me/${waNumber}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0"
        >
          Unirme como proveedor
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
