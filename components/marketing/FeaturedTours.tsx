"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Buildings, Mountains, Waves, Bus } from "@phosphor-icons/react";
import { TourCard } from "@/components/tours/TourCard";
import type { TourSummary } from "@/lib/types";

const CATEGORY_TABS = [
  {
    id: "ciudad",
    label: "Ciudad",
    Icon: Buildings,
    accent: "#2BB7A6",
    textOnAccent: "#ffffff",
    description: "Tours urbanos, cultura y vida nocturna en Medellín",
    toursHref: "/tours?category=city-tours",
    filter: (t: TourSummary) =>
      t.destination?.slug === "medellin" &&
      t.categories.some((c) =>
        ["city-tours", "culture", "nightlife", "vip-experiences"].includes(c.slug)
      ),
  },
  {
    id: "aventura",
    label: "Aventura",
    Icon: Mountains,
    accent: "#4B5E7A",
    textOnAccent: "#ffffff",
    description: "Naturaleza, adrenalina y deportes al aire libre",
    toursHref: "/tours?category=adventure",
    filter: (t: TourSummary) =>
      t.categories.some((c) => ["adventure", "nature"].includes(c.slug)),
  },
  {
    id: "guatape",
    label: "Guatapé",
    Icon: Waves,
    accent: "#5B9EC9",
    textOnAccent: "#ffffff",
    description: "La Piedra del Peñol, el embalse y el pueblo más colorido de Colombia",
    toursHref: "/tours?destination=guatape",
    filter: (t: TourSummary) => t.destination?.slug === "guatape",
  },
  {
    id: "chivas",
    label: "Chivas & Celebraciones",
    Icon: Bus,
    accent: "#E8A430",
    textOnAccent: "#ffffff",
    description: "Rumba auténtica en chivas tradicionales y eventos privados",
    toursHref: "/tours?category=party",
    filter: (t: TourSummary) =>
      (t.operator?.slug?.includes("chiva") ?? false) ||
      t.categories.some((c) => c.slug === "party"),
  },
];

interface FeaturedToursProps {
  tours: TourSummary[];
}

export function FeaturedTours({ tours }: FeaturedToursProps) {
  const [activeTab, setActiveTab] = useState(CATEGORY_TABS[0].id);

  const activeTabData = CATEGORY_TABS.find((t) => t.id === activeTab)!;
  const filteredTours = tours.filter(activeTabData.filter).slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">

        {/* ── Section header ── */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-[#2BB7A6] uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-[#2BB7A6]/10">
            Tours recomendados
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#0D1B3D] mb-4 leading-tight">
            ¿Qué te gutaría vivir hoy?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Explora lo mejor de Medellín y Antioquia, curado por expertos locales.
          </p>
        </div>

        {/* ── Category tabs ── */}
        <div className="flex items-stretch justify-center gap-3 mb-8 flex-wrap">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="group flex flex-col items-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-w-[110px]"
                style={{
                  backgroundColor: isActive ? tab.accent : "#F8FAFC",
                  color: isActive ? tab.textOnAccent : "#475569",
                  border: `2px solid ${isActive ? tab.accent : "#E2E8F0"}`,
                  boxShadow: isActive ? `0 8px 24px 0 ${tab.accent}35` : "none",
                  transform: isActive ? "translateY(-2px)" : "none",
                }}
              >
                <tab.Icon
                  size={28}
                  weight={isActive ? "fill" : "regular"}
                  style={{ color: isActive ? "#fff" : tab.accent }}
                  aria-hidden
                />
                <span className="leading-tight text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Active tab sub-header ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + "-sub"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <p className="text-sm text-muted-foreground">
              {activeTabData.description}
            </p>
            <Link
              href={activeTabData.toursHref}
              className="hidden sm:flex items-center gap-1 text-sm font-semibold ml-6 whitespace-nowrap transition-colors"
              style={{ color: activeTabData.accent }}
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* ── Tour grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Mobile: ver todos ── */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={activeTabData.toursHref}
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: activeTabData.accent }}
          >
            Ver todos los tours <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

