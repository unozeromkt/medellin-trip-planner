"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Users, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WholesalePackage } from "@/lib/wholesale-packages";

const TABS = ["Todos", "2-3 días", "4-5 días", "Premium"] as const;
type TabKey = (typeof TABS)[number];

function filterPackages(pkgs: WholesalePackage[], tab: TabKey): WholesalePackage[] {
  if (tab === "Todos") return pkgs;
  if (tab === "2-3 días") return pkgs.filter((p) => p.durationDays <= 3);
  if (tab === "4-5 días") return pkgs.filter((p) => p.durationDays >= 4);
  if (tab === "Premium") return pkgs.filter((p) => p.category === "Premium");
  return pkgs;
}

function PackageCard({ pkg }: { pkg: WholesalePackage }) {
  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col ${
        pkg.highlight
          ? "ring-2 ring-[#2BB7A6] shadow-lg shadow-[#2BB7A6]/10"
          : "border border-[#E9EEF4] hover:border-[#2BB7A6]/30"
      }`}
    >
      <div className="h-1.5 bg-gradient-to-r from-[#2BB7A6] to-[#A8CBE6]" />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-[#0D1B3D]/8 text-[#0D1B3D] text-xs rounded-lg border-0 font-body font-medium px-2 py-0.5">
              {pkg.category}
            </Badge>
            {pkg.badge && (
              <Badge className="bg-[#FFC97A] text-[#0D1B3D] text-xs rounded-lg border-0 font-body font-semibold px-2 py-0.5">
                {pkg.badge}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-[#637489] text-xs font-body shrink-0">
            <Clock className="w-3.5 h-3.5" />
            {pkg.duration}
          </div>
        </div>

        <h3 className="font-heading text-lg font-bold text-[#0D1B3D] mb-3 leading-snug">
          {pkg.name}
        </h3>

        <div className="flex items-center gap-3 mb-3 text-xs text-[#637489] font-body">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#2BB7A6]" />
            {pkg.destinations.join(" · ")}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#2BB7A6]" />
            {pkg.operatorCount} operadores
          </div>
        </div>

        <ul className="space-y-1.5 mb-4 flex-1">
          {pkg.experiences.slice(0, 4).map((exp) => (
            <li key={exp} className="flex items-start gap-2 text-sm text-[#637489] font-body">
              <Check className="w-4 h-4 text-[#2BB7A6] mt-0.5 shrink-0" />
              <span className="leading-snug">{exp}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-[#E9EEF4] pt-4 mt-auto">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <p className="font-body text-xs text-[#637489] mb-0.5">Tarifa neta / persona</p>
              <p className="font-heading text-2xl font-bold text-[#0D1B3D]">
                ${pkg.netRate}{" "}
                <span className="text-sm font-normal text-[#637489]">USD</span>
              </p>
              <p className="font-body text-xs text-[#637489]">Mín. {pkg.minPax} pax</p>
            </div>
            <div className="bg-[#2BB7A6]/10 border border-[#2BB7A6]/25 rounded-xl px-3 py-2 text-center shrink-0">
              <p className="font-body text-[10px] text-[#2BB7A6] uppercase tracking-wide font-semibold">
                Tu margen
              </p>
              <p className="font-heading text-xl font-bold text-[#2BB7A6]">
                {pkg.commission}%
              </p>
            </div>
          </div>
          <Link
            href={`/agencias/paquetes/${pkg.slug}`}
            className={cn(buttonVariants(), "w-full bg-[#0D1B3D] hover:bg-[#0D1B3D]/90 text-white rounded-xl h-10 font-semibold text-sm")}
          >
            Ver detalles y tarifas
          </Link>
        </div>
      </div>
    </div>
  );
}

interface WholesalePackagesProps {
  packages: WholesalePackage[];
}

export function WholesalePackages({ packages }: WholesalePackagesProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("Todos");
  const filtered = filterPackages(packages, activeTab);

  return (
    <section id="catalogo" className="bg-[#F1F3F6] py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="font-body text-[#2BB7A6] text-sm font-semibold tracking-widest uppercase mb-3"
          >
            Catálogo Mayorista
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-[#0D1B3D] mb-4"
          >
            Paquetes combinados listos para vender
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.14 }}
            className="font-body text-[#637489] text-lg max-w-2xl mx-auto"
          >
            Productos armados, tarifas netas, sin markup. Muestra la comisión a tu equipo
            desde el día uno.
          </motion.p>
        </div>

        <div className="flex justify-center mb-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
            <TabsList className="bg-white border border-[#E9EEF4] rounded-xl p-1 h-auto gap-1">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="font-body text-sm rounded-lg px-4 py-2 data-[state=active]:bg-[#0D1B3D] data-[state=active]:text-white data-[state=inactive]:text-[#637489] data-[state=inactive]:hover:text-[#0D1B3D] transition-all duration-200"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/paquetes"
            className={cn(buttonVariants(), "bg-[#0D1B3D] hover:bg-[#0D1B3D]/90 text-white rounded-xl px-8 h-11 font-semibold transition-colors")}
          >
            Ver catálogo completo →
          </Link>
          <a
            href="#registro"
            className={cn(buttonVariants({ variant: "outline" }), "border-[#0D1B3D] text-[#0D1B3D] hover:bg-[#0D1B3D] hover:text-white rounded-xl px-8 h-11 font-semibold transition-colors")}
          >
            Solicitar cotización personalizada
          </a>
        </motion.div>
      </div>
    </section>
  );
}
