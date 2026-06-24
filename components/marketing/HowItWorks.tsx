import { Search, Layers, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Elige tus experiencias",
    description:
      "Explora nuestro catálogo de tours curados. Filtra por destino, categoría, duración o presupuesto y encuentra lo que buscas.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Layers,
    number: "02",
    title: "Combina y planifica",
    description:
      "Usa el Constructor de Experiencias para combinar múltiples tours y crear tu itinerario ideal. Ve el total estimado en tiempo real.",
    color: "bg-accent/20 text-[#B8860B]",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Solicita por WhatsApp",
    description:
      "Un mensaje prellenado con todos los detalles de tu viaje llega directamente a nuestro equipo. Sin formularios complicados.",
    color: "bg-[#25D366]/10 text-[#25D366]",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#2BB7A6] uppercase tracking-widest mb-2">
            ¿Cómo funciona?
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Planear tu viaje es muy simple
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            De la inspiración a la solicitud en tres pasos. Sin complicaciones, sin esperas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center md:items-start md:text-left">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-0 h-px bg-border" />
              )}

              <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-4 shrink-0`}>
                <step.icon className="h-6 w-6" />
              </div>

              <div className="text-4xl font-heading font-black text-muted/40 mb-2 leading-none">
                {step.number}
              </div>

              <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
