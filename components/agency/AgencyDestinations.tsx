"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MapPin, Package } from "lucide-react";
import { mockDestinations } from "@/lib/mock-data";

const packageCounts: Record<string, number> = {
  medellin: 4,
  guatape: 4,
  jardin: 2,
  "oriente-antioqueno": 2,
  doradal: 1,
  "santa-fe-de-antioquia": 1,
};

export function AgencyDestinations() {
  return (
    <section id="destinos" className="bg-white py-20 lg:py-24">
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
            Destinos Disponibles
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-[#0D1B3D] mb-4"
          >
            Antioquia y Colombia, cubiertos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.14 }}
            className="font-body text-[#637489] text-lg max-w-2xl mx-auto"
          >
            Todos los destinos del catálogo son operados directamente por nuestros afiliados.
            Cobertura geográfica consolidada, sin subcontratación.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDestinations.map((dest, i) => {
            const count = packageCounts[dest.slug] ?? 0;
            return (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-2xl bg-[#0D1B3D] aspect-[4/3] cursor-pointer"
              >
                {/* Cover image */}
                <Image
                  src={dest.coverImage ?? ""}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-450 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3D]/80 via-[#0D1B3D]/20 to-transparent" />

                {/* Package count badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-body font-semibold px-3 py-1.5 rounded-full">
                    <Package className="w-3.5 h-3.5" />
                    {count} {count === 1 ? "paquete" : "paquetes"}
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1 text-[#A8CBE6] text-xs font-body mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {dest.region}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-1">
                    {dest.name}
                  </h3>
                  <p className="font-body text-sm text-white/70 leading-snug line-clamp-2">
                    {dest.description}
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
