import Link from "next/link";
import { Phone, Mail, ExternalLink } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";

export function Footer() {
  return (
    <footer className="bg-[#0D1B3D] text-white/70">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col leading-none mb-4">
              <span className="text-[9px] font-medium text-white/40 tracking-[0.18em] uppercase">
                Medellín
              </span>
              <span className="font-heading font-bold text-xl leading-tight text-white">
                Trip <span className="text-primary">Planner</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Experiencias curadas, operadores verificados y planificación inteligente para tu próximo viaje en Colombia.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#1ebe59] transition-colors"
              >
                <Phone className="h-3 w-3" />
                WhatsApp
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-medium" aria-label="Instagram">
                IG
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-medium" aria-label="Facebook">
                FB
              </a>
              <a href="mailto:info@medellintrip.co" className="text-white/40 hover:text-white transition-colors" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Explorar</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Todos los tours", href: "/tours" },
                { label: "Destinos", href: "/destinations" },
                { label: "Categorías", href: "/categories" },
                { label: "Constructor de experiencias", href: "/experience-builder" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operadores */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Operadores</h3>
            <ul className="space-y-2.5 text-sm">
              {["Turtle Bus", "Aeroturex", "Guatapé Travel", "Chivas & Celebraciones"].map(
                (name) => (
                  <li key={name}>
                    <span className="hover:text-white transition-colors cursor-pointer">{name}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Compañía */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Compañía</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Nosotros", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Proveedores", href: "/provider/dashboard" },
                { label: "Agencias B2B", href: "/agency" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Medellín Trip Planner. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/30 flex items-center gap-1">
            <span className="text-primary/60">—</span>
            Experiencias por toda Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
