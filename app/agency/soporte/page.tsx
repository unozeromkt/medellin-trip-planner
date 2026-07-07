import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { MessageSquare, Phone, Mail, ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Soporte | Portal Agencias" };

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";

const FAQS = [
  {
    q: "¿Cómo funciona la comisión mayorista?",
    a: "La tarifa neta que ves en el catálogo ya descuenta nuestra operación. La diferencia entre lo que cobras al cliente y la tarifa neta es tu comisión. El porcentaje exacto está en tu perfil y varía según tu nivel (Bronze, Silver, Gold, Platinum).",
  },
  {
    q: "¿Cuánto tarda en confirmarse una reserva?",
    a: "Revisamos todas las solicitudes en un plazo de 24 a 48 horas hábiles. Recibirás un correo con la confirmación de disponibilidad y las instrucciones de pago. Puedes ver el estado actualizado en 'Mis reservas'.",
  },
  {
    q: "¿Puedo solicitar paquetes personalizados para grupos?",
    a: "Sí. Escríbenos por WhatsApp con el destino, número de pax y fecha tentativa. Generamos cotizaciones especiales para grupos de 10 pax o más, con descuentos adicionales según volumen.",
  },
  {
    q: "¿Cómo gestiono la cancelación de una reserva?",
    a: "Escríbenos por WhatsApp o correo con el número de reserva antes de la fecha límite indicada. Cada paquete tiene su política de cancelación detallada en la ficha de producto. Las cancelaciones con más de 30 días de anticipación no tienen penalidad.",
  },
  {
    q: "¿Cuándo y cómo recibo mi comisión?",
    a: "Liquidamos comisiones los primeros 5 días hábiles de cada mes sobre los servicios completados del mes anterior. Si necesitas agregar datos bancarios para transferencia, contáctanos directamente por WhatsApp.",
  },
  {
    q: "¿Cómo puedo subir de nivel?",
    a: "Los niveles Silver, Gold y Platinum se asignan según el volumen de reservas confirmadas en los últimos 12 meses. Tu asesor te notificará cuando califiques para un ascenso de nivel.",
  },
];

export default async function AgencySoportePage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "agency") redirect("/login");

  const agencyName = profile.agency?.name ?? profile.email;
  const supportMessage = encodeURIComponent(
    `Hola, soy de la agencia *${agencyName}* y necesito ayuda con una consulta.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${supportMessage}`;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Soporte</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Estamos disponibles para ayudarte con tu operación
        </p>
      </div>

      {/* Contact options */}
      <div className="grid sm:grid-cols-3 gap-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-[#E2E8ED] hover:border-[#2BB7A6]/50 hover:shadow-sm transition-all group text-center"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-[#0D1B3D]">WhatsApp</p>
            <p className="font-body text-xs text-[#637489] mt-0.5">Respuesta en minutos</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-body font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Abrir chat <ExternalLink className="w-3 h-3" />
          </span>
        </a>

        <a
          href="mailto:mayoristas@medellintrip.com"
          className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-[#E2E8ED] hover:border-[#2BB7A6]/50 hover:shadow-sm transition-all group text-center"
        >
          <div className="w-11 h-11 rounded-xl bg-[#A8CBE6]/30 flex items-center justify-center group-hover:bg-[#A8CBE6]/50 transition-colors">
            <Mail className="w-5 h-5 text-[#0D1B3D]" />
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-[#0D1B3D]">Correo</p>
            <p className="font-body text-xs text-[#637489] mt-0.5">Respuesta en 24 h</p>
          </div>
          <span className="text-xs font-body text-[#637489] truncate max-w-full px-1">
            mayoristas@medellintrip.com
          </span>
        </a>

        <div className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-[#E2E8ED] text-center">
          <div className="w-11 h-11 rounded-xl bg-[#FFC97A]/20 flex items-center justify-center">
            <Phone className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-[#0D1B3D]">Teléfono</p>
            <p className="font-body text-xs text-[#637489] mt-0.5">Lun–Vie 8am–6pm</p>
          </div>
          <span className="text-xs font-body text-[#637489]">+57 300 000 0000</span>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6">
        <h2 className="font-heading text-base font-bold text-[#0D1B3D] mb-5">
          Preguntas frecuentes
        </h2>
        <div className="space-y-1">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group border border-[#E2E8ED] rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none font-body text-sm font-semibold text-[#0D1B3D] hover:bg-[#F8FAFC] transition-colors">
                {faq.q}
                <span className="shrink-0 w-5 h-5 rounded-full bg-[#F1F3F6] flex items-center justify-center text-[#637489] group-open:rotate-45 transition-transform text-base leading-none font-normal">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 pt-1">
                <p className="font-body text-sm text-[#637489] leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#0D1B3D] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-heading text-base font-bold text-white">
            ¿No encontraste lo que buscabas?
          </p>
          <p className="font-body text-sm text-white/60 mt-1">
            Habla directamente con tu asesor mayorista.
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  );
}
