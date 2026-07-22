import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Elige tus experiencias",
    description:
      "Explora nuestro catálogo curado. Filtra por destino, categoría, duración o presupuesto y encuentra lo que buscas.",
  },
  {
    number: "02",
    title: "Combina y planifica",
    description:
      "Arma tu itinerario combinando tours de distintos operadores y revisa el total estimado en tiempo real.",
  },
  {
    number: "03",
    title: "Solicita por WhatsApp",
    description:
      "Un mensaje con todos los detalles de tu viaje llega directo a nuestro equipo. Sin formularios complicados.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-16 items-center">
          {/* Left: heading + photo */}
          <div>
            <p className="text-xs font-semibold text-[#2BB7A6] uppercase tracking-widest mb-3">
              ¿Cómo funciona?
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground leading-[1.1] mb-8">
              Planea tu viaje
              <br />
              en minutos.
            </h2>

            <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-[#0D1B3D]/10 aspect-[4/5] w-full max-w-xl">
              <Image
                src="/img/turtle-bus-adventure.jpg"
                alt="Viajero disfrutando una experiencia en Medellín"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3D]/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right: curved steps */}
          <div className="relative">
            <svg
              className="absolute left-0 top-7 w-14 lg:w-16 h-[calc(100%-3.5rem)]"
              viewBox="0 0 56 100"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M28 0 C 46 16, 46 34, 28 50 C 10 66, 10 84, 28 100"
                stroke="#D5DDE8"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="space-y-14 lg:space-y-20">
              {steps.map((step) => (
                <div key={step.number} className="relative flex gap-6 lg:gap-8">
                  <div className="relative z-10 shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white border-2 border-[#2BB7A6] flex items-center justify-center">
                    <span className="font-heading font-bold text-lg text-foreground">
                      {step.number}
                    </span>
                  </div>
                  <div className="pt-2 lg:pt-3">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
