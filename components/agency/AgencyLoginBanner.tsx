import Link from "next/link";
import { LogIn, LayoutDashboard } from "lucide-react";

export function AgencyLoginBanner() {
  return (
    <div className="bg-[#0D1B3D]/95 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-body text-sm text-white/70">
          <span className="text-white font-semibold">¿Ya tienes cuenta?</span>
          {" "}Accede al portal para ver tus comisiones, reservas y catálogo exclusivo.
        </p>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 border border-white/20 hover:border-white/40 text-white font-body text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            Iniciar sesión
          </Link>
          <Link
            href="/agency/dashboard"
            className="inline-flex items-center gap-1.5 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Mi portal
          </Link>
        </div>
      </div>
    </div>
  );
}
