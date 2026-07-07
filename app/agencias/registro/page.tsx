import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./RegisterForm";
import { Building2, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Registro de Agencias | Medellín Trip Planner",
  description:
    "Regístrate como agencia mayorista y accede a tarifas netas, comisiones del 18 al 25% y paquetes exclusivos para toda Colombia.",
  robots: { index: false, follow: false },
};

const BENEFITS = [
  "Tarifas netas sin intermediarios",
  "Comisiones del 18 al 25% garantizadas",
  "Catálogo exclusivo mayorista",
  "Soporte dedicado para agencias",
  "Itinerarios listos para vender",
];

export default function AgencyRegisterPage() {
  return (
    <div className="min-h-screen bg-[#F1F3F6] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/agencias" className="inline-flex flex-col items-center mb-4">
            <span className="text-[9px] font-medium text-[#637489] tracking-[0.18em] uppercase">
              Medellín
            </span>
            <span className="font-heading font-bold text-2xl leading-tight text-[#0D1B3D]">
              Trip <span className="text-[#2BB7A6]">Planner</span>
            </span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-[#0D1B3D] mt-2">
            Registro de Agencias
          </h1>
          <p className="text-[#637489] font-body text-base mt-2 max-w-xl mx-auto">
            Únete a la red mayorista más curada de Colombia. Tu solicitud será revisada
            en 24–48 horas.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Sidebar benefits */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0D1B3D] rounded-2xl p-6 text-white">
              <div className="w-10 h-10 rounded-xl bg-[#2BB7A6]/20 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 text-[#2BB7A6]" />
              </div>
              <h2 className="font-heading text-lg font-bold mb-1">Portal Mayorista</h2>
              <p className="font-body text-sm text-white/60 mb-5">
                Acceso exclusivo para agencias de viaje registradas.
              </p>
              <ul className="space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#2BB7A6] shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-white/80">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
              <p className="font-body text-sm font-semibold text-[#0D1B3D] mb-1">
                ¿Ya tienes cuenta?
              </p>
              <p className="font-body text-xs text-[#637489] mb-3">
                Accede a tu portal de agencia con tus credenciales.
              </p>
              <Link
                href="/login?next=/agency"
                className="inline-flex items-center gap-2 text-sm font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
              >
                Iniciar sesión →
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8ED] p-8">
            <h2 className="font-heading text-xl font-bold text-[#0D1B3D] mb-1">
              Datos de la agencia
            </h2>
            <p className="font-body text-sm text-[#637489] mb-6">
              Completa el formulario y recibirás confirmación por correo.
            </p>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
