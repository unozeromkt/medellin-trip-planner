import Link from "next/link";
import { CheckCircle, Clock, Mail } from "lucide-react";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-10">
          <div className="w-16 h-16 rounded-2xl bg-[#2BB7A6]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-[#2BB7A6]" />
          </div>

          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D] mb-2">
            ¡Solicitud enviada!
          </h1>
          <p className="font-body text-sm text-[#637489] mb-8">
            Recibimos tu registro. Nuestro equipo lo revisará y te notificará por correo
            en un plazo de <strong className="text-[#0D1B3D]">24 a 48 horas</strong>.
          </p>

          <div className="space-y-3 text-left mb-8">
            {[
              {
                icon: Mail,
                title: "Revisa tu correo",
                desc: "Recibirás un enlace de confirmación de Supabase. Confírmalo para activar tu cuenta.",
              },
              {
                icon: Clock,
                title: "Espera la aprobación",
                desc: "Un administrador revisará tu solicitud y activará tu acceso al portal mayorista.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8ED]">
                <div className="w-8 h-8 rounded-lg bg-[#2BB7A6]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#2BB7A6]" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-[#0D1B3D]">{title}</p>
                  <p className="font-body text-xs text-[#637489] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/login?next=/agency"
              className="w-full h-11 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm rounded-xl transition-colors flex items-center justify-center"
            >
              Ir al portal de agencias
            </Link>
            <Link
              href="/"
              className="w-full h-11 border border-[#E2E8ED] text-[#637489] hover:text-[#0D1B3D] font-body text-sm rounded-xl transition-colors flex items-center justify-center"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
