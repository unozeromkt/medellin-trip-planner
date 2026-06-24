import { ShieldCheck, Globe, Sparkles, Zap, BadgeCheck } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    label: "Certificado",
    description: "Turismo confiable y verificado",
    color: "#2BB7A6",
  },
  {
    icon: Globe,
    label: "Global",
    description: "+5 años conectando viajeros con Colombia",
    color: "#0D1B3D",
  },
  {
    icon: Sparkles,
    label: "Curada",
    description: "Experiencias seleccionadas con propósito",
    color: "#FFC97A",
  },
  {
    icon: Zap,
    label: "Ágil",
    description: "Reservas simples, sin complicaciones",
    color: "#2BB7A6",
  },
  {
    icon: BadgeCheck,
    label: "Profesional",
    description: "Equipo experto que garantiza calidad",
    color: "#0D1B3D",
  },
];

export function TrustBar() {
  return (
    <div className="bg-white border-b border-border/60">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-border/50">
          {BADGES.map(({ icon: Icon, label, description, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-4 first:pl-0 last:pr-0"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: color + "15" }}
              >
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground leading-tight">{label}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 hidden sm:block">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
