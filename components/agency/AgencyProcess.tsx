"use client";

import { motion } from "motion/react";
import { ClipboardList, BookOpen, Calculator, Banknote } from "lucide-react";

const steps = [
  {
    number: "01",
    Icon: ClipboardList,
    title: "Registra tu agencia",
    description:
      "Completa el formulario de acceso con los datos de tu agencia. Sin cuota de membresía, sin compromisos de volumen mínimo.",
  },
  {
    number: "02",
    Icon: BookOpen,
    title: "Accede al catálogo completo",
    description:
      "En menos de 24 horas recibes acceso a todas las tarifas netas, fichas técnicas y condiciones de cada paquete del catálogo.",
  },
  {
    number: "03",
    Icon: Calculator,
    title: "Cotiza a tus clientes",
    description:
      "Usa nuestros paquetes combinados para armar propuestas rápido. Tu ejecutivo está disponible para cotizaciones especiales o grupos.",
  },
  {
    number: "04",
    Icon: Banknote,
    title: "Confirma y gana",
    description:
      "Confirmas la reserva, nosotros coordinamos con los operadores. Recibes tu comisión garantizada en cada operación cerrada.",
  },
];

export function AgencyProcess() {
  return (
    <section id="proceso" className="bg-[#F1F3F6] py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="font-body text-[#2BB7A6] text-sm font-semibold tracking-widest uppercase mb-3"
          >
            Cómo Funciona
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-[#0D1B3D] mb-4"
          >
            Del registro a tu primera comisión
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.14 }}
            className="font-body text-[#637489] text-lg max-w-2xl mx-auto"
          >
            Acceso mayorista en 4 pasos. Sin burocracia, sin esperas largas.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, i) => {
            const Icon = step.Icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-0 h-px bg-[#E9EEF4] z-0" />
                )}

                <div className="relative bg-white rounded-2xl p-6 border border-[#E9EEF4] text-center z-10">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0D1B3D] text-white mb-4 relative">
                    <Icon className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#2BB7A6] rounded-full text-white text-xs font-heading font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-[#0D1B3D] mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-[#637489] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
