"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const operators = [
  {
    id: "1",
    name: "Turtle Bus",
    specialty: "Transporte turístico y city tours",
    experiences: 24,
    tags: ["Ciudad", "Cultural", "Grupos"],
    logo: "/logos/logo-turtlebus.webp",
    logoBg: null as string | null,
  },
  {
    id: "2",
    name: "Aeroturex",
    specialty: "Aventura, parapente y deportes extremos",
    experiences: 18,
    tags: ["Aventura", "Outdoor", "Adrenalina"],
    logo: "/logos/aeroturex-logo.png",
    logoBg: "#0D1B3D", // mark is white-on-transparent, needs a dark backdrop
  },
  {
    id: "3",
    name: "Guatapé Travel",
    specialty: "Especialistas en Guatapé y El Peñol",
    experiences: 12,
    tags: ["Guatapé", "Náutico", "Naturaleza"],
    logo: "/logos/logo-web-guatape-travel-180px.png",
    logoBg: null,
  },
  {
    id: "4",
    name: "Chivas & Trolley Tours",
    specialty: "Vida nocturna y cultura paisa",
    experiences: 8,
    tags: ["Nocturno", "Cultura", "Grupal"],
    logo: "/logos/chivas-logo.png",
    logoBg: null,
  },
];

export function PartnerBrands() {
  return (
    <section id="operadores" className="bg-white py-20 lg:py-24">
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
            Operadores Afiliados
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-[#0D1B3D] mb-4"
          >
            Las marcas detrás del catálogo
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.14 }}
            className="font-body text-[#637489] text-lg max-w-2xl mx-auto"
          >
            Un solo contrato con MTP te da acceso directo a todos estos operadores.
            Sin negociar con cada uno. Sin margen extra por intermediación.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {operators.map((op, i) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="group bg-[#F1F3F6] hover:bg-white border border-transparent hover:border-[#E9EEF4] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <span
                  className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#E9EEF4] p-3 shrink-0 shadow-sm"
                  style={{ backgroundColor: op.logoBg ?? "#FFFFFF" }}
                >
                  <Image src={op.logo} alt={op.name} fill sizes="80px" className="object-contain" />
                </span>
                <div className="flex items-center gap-1.5 text-[#2BB7A6] text-xs font-semibold font-body">
                  <CheckCircle2 className="w-4 h-4" />
                  Verificado
                </div>
              </div>

              {/* Name & specialty */}
              <h3 className="font-heading text-lg font-bold text-[#0D1B3D] mb-1">
                {op.name}
              </h3>
              <p className="font-body text-sm text-[#637489] mb-4 leading-snug">
                {op.specialty}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {op.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white text-[#637489] border border-[#E9EEF4] text-xs font-body rounded-lg px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-[#E9EEF4]">
                <span className="font-body text-sm font-semibold text-[#0D1B3D]">
                  {op.experiences} experiencias
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
