import type { Metadata } from "next";
import { Phone, Mail, Clock } from "lucide-react";
import { WhatsappLogo, InstagramLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/contact/ContactForm";

const TITLE = "Contáctanos";
const DESCRIPTION =
  "Escríbenos por WhatsApp, llámanos o déjanos un mensaje. Nuestro equipo te ayuda a planear tu próximo viaje por Antioquia y Colombia.";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573107788830";
const WHATSAPP_DISPLAY = "(310)-778 8830";
const CALL_NUMBER = "573118681689";
const CALL_DISPLAY = "(311)-868 1689";
const EMAIL = "info@medellintrip.co";
const INSTAGRAM_URL = "https://instagram.com";
const TIKTOK_URL = "https://tiktok.com";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contacto" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/contacto", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* Hero */}
      <div className="bg-[#0D1B3D] py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-body text-xs font-semibold text-[#2BB7A6] tracking-widest uppercase mb-3">
            Estamos para ayudarte
          </p>
          <h1 className="font-heading text-4xl font-bold text-white leading-tight">
            Hablemos de
            <br />
            <span className="text-[#2BB7A6]">tu próximo viaje</span>
          </h1>
          <p className="font-body text-base text-white/60 mt-4 max-w-xl mx-auto">
            Escríbenos, llámanos o déjanos un mensaje. Te respondemos rápido para armar la experiencia perfecta.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-start">
        {/* Contact info */}
        <div className="space-y-4">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white rounded-2xl border border-[#E2E8ED] p-5 hover:shadow-md transition-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
              <WhatsappLogo size={22} weight="fill" color="#25D366" />
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-[#0D1B3D]">WhatsApp</p>
              <p className="font-body text-sm text-[#637489]">{WHATSAPP_DISPLAY}</p>
            </div>
          </a>

          <a
            href={`tel:+${CALL_NUMBER}`}
            className="flex items-center gap-4 bg-white rounded-2xl border border-[#E2E8ED] p-5 hover:shadow-md transition-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-[#2BB7A6]/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-[#2BB7A6]" />
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-[#0D1B3D]">Llámenos</p>
              <p className="font-body text-sm text-[#637489]">{CALL_DISPLAY}</p>
            </div>
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-4 bg-white rounded-2xl border border-[#E2E8ED] p-5 hover:shadow-md transition-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-[#A8CBE6]/30 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[#0D1B3D]" />
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-[#0D1B3D]">Email</p>
              <p className="font-body text-sm text-[#637489]">{EMAIL}</p>
            </div>
          </a>

          <div className="flex items-center gap-4 bg-white rounded-2xl border border-[#E2E8ED] p-5">
            <div className="w-11 h-11 rounded-xl bg-[#FFC97A]/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#B87A1E]" />
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-[#0D1B3D]">Horario de atención</p>
              <p className="font-body text-sm text-[#637489]">Lunes a domingo, 7:00 a.m. – 9:00 p.m.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-white border border-[#E2E8ED] flex items-center justify-center text-[#4A5C6A] hover:text-[#0D1B3D] hover:border-[#0D1B3D] transition-colors"
            >
              <InstagramLogo size={18} weight="fill" />
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-10 h-10 rounded-full bg-white border border-[#E2E8ED] flex items-center justify-center text-[#4A5C6A] hover:text-[#0D1B3D] hover:border-[#0D1B3D] transition-colors"
            >
              <TiktokLogo size={18} weight="fill" />
            </a>
          </div>
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
}
