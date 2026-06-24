import { ShieldCheck, Star, HeadphonesIcon } from "lucide-react";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Confianza y seguridad",
    description: "Todos nuestros operadores son verificados. Protegemos tu viaje de principio a fin con soporte permanente.",
    color: "#2BB7A6",
    bg: "#2BB7A615",
  },
  {
    icon: Star,
    title: "Experiencias curadas",
    description: "No publicamos cualquier tour. Seleccionamos lo mejor de Colombia con autenticidad, calidad y propósito.",
    color: "#FFC97A",
    bg: "#FFC97A15",
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte humano y digital",
    description: "Nuestro equipo está disponible por WhatsApp para acompañarte en cada paso de tu planificación.",
    color: "#0D1B3D",
    bg: "#0D1B3D10",
  },
];

export function BrandValues() {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-center">

          {/* Left: headline */}
          <div className="lg:col-span-1">
            <p className="text-xs font-semibold text-[#2BB7A6] uppercase tracking-widest mb-3">
              Por qué elegirnos
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-snug">
              Una marca de turismo{" "}
              <span className="text-[#2BB7A6]">moderna</span>,{" "}
              confiable y escalable.
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[#FFC97A] font-bold text-sm">—</span>
              <span className="text-xs text-muted-foreground">Experiencias por toda Colombia</span>
            </div>
          </div>

          {/* Right: 3 value props */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
