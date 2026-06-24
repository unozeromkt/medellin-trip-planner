"use client";

import { motion } from "motion/react";
import { CheckCircle2, Bus, Zap, Waves, Moon, Leaf, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const operators = [
  {
    id: "1",
    name: "Turtle Bus",
    specialty: "Transporte turístico y city tours",
    experiences: 24,
    tags: ["Ciudad", "Cultural", "Grupos"],
    Icon: Bus,
    accentColor: "#2BB7A6",
    since: "2018",
  },
  {
    id: "2",
    name: "Aeroturex",
    specialty: "Aventura, parapente y deportes extremos",
    experiences: 18,
    tags: ["Aventura", "Outdoor", "Adrenalina"],
    Icon: Zap,
    accentColor: "#FFC97A",
    since: "2015",
  },
  {
    id: "3",
    name: "Guatapé Travel",
    specialty: "Especialistas en Guatapé y El Peñol",
    experiences: 12,
    tags: ["Guatapé", "Náutico", "Naturaleza"],
    Icon: Waves,
    accentColor: "#A8CBE6",
    since: "2019",
  },
  {
    id: "4",
    name: "Chivas & Trolley Tours",
    specialty: "Vida nocturna y cultura paisa",
    experiences: 8,
    tags: ["Nocturno", "Cultura", "Grupal"],
    Icon: Moon,
    accentColor: "#2BB7A6",
    since: "2016",
  },
  {
    id: "5",
    name: "Colombia Coffee Routes",
    specialty: "Región cafetera y ecoturismo rural",
    experiences: 15,
    tags: ["Café", "Ecoturismo", "Rural"],
    Icon: Leaf,
    accentColor: "#FFC97A",
    since: "2020",
  },
  {
    id: "6",
    name: "Metro Cultura",
    specialty: "Arte urbano, grafiti y transformación social",
    experiences: 10,
    tags: ["Arte", "Grafiti", "Historia"],
    Icon: Palette,
    accentColor: "#A8CBE6",
    since: "2017",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {operators.map((op, i) => {
            const Icon = op.Icon;
            return (
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
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${op.accentColor}18` }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: op.accentColor }}
                    />
                  </div>
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
                <div className="flex items-center justify-between pt-4 border-t border-[#E9EEF4]">
                  <span className="font-body text-xs text-[#637489]">
                    Desde {op.since}
                  </span>
                  <span className="font-body text-sm font-semibold text-[#0D1B3D]">
                    {op.experiences} experiencias
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
