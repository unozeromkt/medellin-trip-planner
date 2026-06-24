"use client";

import { motion } from "motion/react";
import {
  DollarSign,
  FileText,
  TrendingUp,
  Headphones,
  CreditCard,
  Package,
} from "lucide-react";

const benefits = [
  {
    Icon: DollarSign,
    title: "Tarifas netas directas",
    description:
      "Accede al costo real de cada experiencia sin markup ni intermediarios. Tu margen es tuyo, no una concesión nuestra.",
    accent: "#2BB7A6",
  },
  {
    Icon: FileText,
    title: "Un solo contrato",
    description:
      "Firma una vez con MTP y trabaja con todos los operadores del catálogo. Sin negociar, sin gestión individual de proveedores.",
    accent: "#FFC97A",
  },
  {
    Icon: TrendingUp,
    title: "Comisiones del 18 al 25%",
    description:
      "Márgenes garantizados por escrito en cada paquete. Conoces tu rentabilidad antes de vender, no después.",
    accent: "#2BB7A6",
  },
  {
    Icon: Headphones,
    title: "Soporte comercial dedicado",
    description:
      "Ejecutivo asignado, materiales de venta, fichas técnicas y respuesta a cotizaciones en menos de 24 horas.",
    accent: "#FFC97A",
  },
  {
    Icon: CreditCard,
    title: "Pagos centralizados",
    description:
      "Un solo punto de facturación y pago. Emisión en COP o USD según tu conveniencia. Sin reconciliaciones con múltiples proveedores.",
    accent: "#2BB7A6",
  },
  {
    Icon: Package,
    title: "Catálogo listo el día uno",
    description:
      "Más de 120 paquetes armados, operados y probados. No esperas diseñar productos: los vendes desde el primer acceso.",
    accent: "#FFC97A",
  },
];

export function WhyPartner() {
  return (
    <section className="bg-[#0D1B3D] py-20 lg:py-24 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #F1F3F6 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="font-body text-[#2BB7A6] text-sm font-semibold tracking-widest uppercase mb-3"
          >
            ¿Por qué elegirnos?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-[#F1F3F6] mb-4"
          >
            Trabajar con MTP es sinónimo de{" "}
            <span className="text-[#2BB7A6]">margen real</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.14 }}
            className="font-body text-[#A8CBE6] text-lg max-w-2xl mx-auto"
          >
            No somos una plataforma de reservas. Somos el canal mayorista que conecta
            tu agencia directamente con los operadores.
          </motion.p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.Icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 rounded-2xl p-6 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${benefit.accent}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: benefit.accent }} />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#F1F3F6] mb-2">
                  {benefit.title}
                </h3>
                <p className="font-body text-sm text-[#A8CBE6] leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
