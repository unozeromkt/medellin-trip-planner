"use client";

import { motion } from "motion/react";
import { ArrowRight, Building2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const stats = [
  { value: "18+", label: "Operadores afiliados" },
  { value: "120+", label: "Paquetes combinados" },
  { value: "6", label: "Destinos en Colombia" },
  { value: "0", label: "Intermediarios" },
];

export function AgencyHero() {
  return (
    <section className="relative bg-[#0D1B3D] overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #2BB7A6 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2BB7A6] opacity-[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFC97A] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 lg:pt-28 lg:pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-[#2BB7A6]/10 border border-[#2BB7A6]/30 text-[#2BB7A6] text-sm font-medium px-4 py-1.5 rounded-full mb-6 font-body"
          >
            <Shield className="w-4 h-4" />
            Portal exclusivo para agencias de viaje
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#F1F3F6] leading-tight mb-6"
          >
            El mayorista de{" "}
            <span className="text-[#2BB7A6]">experiencias</span>
            <br className="hidden sm:block" /> de Colombia
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="font-body text-[#A8CBE6] text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl"
          >
            Accede directamente a más de 120 paquetes combinados de los mejores
            operadores de Medellín y Antioquia.{" "}
            <strong className="text-[#F1F3F6] font-semibold">
              Sin intermediarios. Sin markup.
            </strong>{" "}
            Tarifas netas y comisiones garantizadas del 18 al 25% para tu agencia.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a
              href="#catalogo"
              className={cn(buttonVariants(), "flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-semibold px-8 h-12 text-base rounded-xl shadow-lg shadow-[#2BB7A6]/20")}
            >
              Ver catálogo mayorista
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#registro"
              className={cn(buttonVariants({ variant: "outline" }), "flex items-center gap-2 border-white/20 text-[#F1F3F6] hover:bg-white/10 hover:border-white/30 px-8 h-12 text-base rounded-xl bg-transparent")}
            >
              <Building2 className="w-5 h-5" />
              Registrar mi agencia
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative border-t border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.45 + i * 0.07 }}
                className="text-center"
              >
                <div className="font-heading text-3xl sm:text-4xl font-bold text-[#2BB7A6]">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-[#A8CBE6] mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
