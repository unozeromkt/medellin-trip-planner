import { Map, Users, Compass, Clock } from "lucide-react";

interface TrustBarProps {
  tours?: number;
  operators?: number;
  destinations?: number;
}

export function TrustBar({ tours = 0, operators = 0, destinations = 0 }: TrustBarProps) {
  const stats = [
    {
      icon: Compass,
      value: tours > 0 ? `${tours}+` : "Cientos de",
      label: "tours publicados",
      color: "#2BB7A6",
    },
    {
      icon: Users,
      value: operators > 0 ? `${operators}` : "Múltiples",
      label: "operadores verificados",
      color: "#0D1B3D",
    },
    {
      icon: Map,
      value: destinations > 0 ? `${destinations}` : "Decenas de",
      label: "destinos en Colombia",
      color: "#FFC97A",
    },
    {
      icon: Clock,
      value: "24h",
      label: "respuesta garantizada",
      color: "#2BB7A6",
    },
  ];

  return (
    <div className="bg-white border-b border-[#E2E8ED]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E2E8ED]">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-4 first:pl-0 last:pr-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: color + "18" }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-base font-bold text-[#0D1B3D] leading-none">
                  {value}
                </p>
                <p className="font-body text-xs text-[#637489] mt-0.5 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
