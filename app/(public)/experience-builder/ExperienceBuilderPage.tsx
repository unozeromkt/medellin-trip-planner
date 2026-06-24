"use client";

import { useState } from "react";
import { Search, Layers, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TourCard } from "@/components/tours/TourCard";
import { BuilderSummary } from "@/components/builder/BuilderSummary";
import { LeadFormSheet } from "@/components/builder/LeadFormSheet";
import { useExperienceBuilder } from "@/lib/experience-builder-context";
import { mockTours, mockCategories, formatPrice } from "@/lib/mock-data";

export function ExperienceBuilderPage() {
  const { selectedTours, totalPrice } = useExperienceBuilder();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const filtered = mockTours.filter((t) => {
    if (activeCategory && !t.categories.some((c) => c.slug === activeCategory)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.destination.name.toLowerCase().includes(q) ||
      t.categories.some((c) => c.name.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Page header */}
        <div className="bg-[#0D1B3D] text-white py-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="h-5 w-5 text-primary" />
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                Constructor de experiencias
              </p>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
              Diseña tu viaje ideal
            </h1>
            <p className="text-white/60 max-w-xl">
              Combina múltiples tours, ve el precio total en tiempo real y solicita todo por WhatsApp en un solo mensaje.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8 items-start">
            {/* ── Left: Tour browser ── */}
            <div className="flex-1 min-w-0">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar experiencias..."
                    className="pl-9 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Category pills — local state, no URL navigation */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none -mx-1 px-1">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === null
                      ? "bg-[#0D1B3D] text-white"
                      : "bg-white text-muted-foreground border border-border hover:text-foreground"
                  }`}
                >
                  Todos
                </button>
                {mockCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setActiveCategory(activeCategory === cat.slug ? null : cat.slug)
                    }
                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat.slug
                        ? "bg-primary text-white"
                        : "bg-white text-muted-foreground border border-border hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Count */}
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-medium text-foreground">{filtered.length}</span> experiencia
                {filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
              </p>

              {/* Tour grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filtered.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <SlidersHorizontal className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="font-medium text-foreground mb-1">Sin resultados</p>
                  <p className="text-sm text-muted-foreground">Prueba otro término de búsqueda.</p>
                </div>
              )}
            </div>

            {/* ── Right: Summary panel (desktop) ── */}
            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24">
                <BuilderSummary onContinue={() => setFormOpen(true)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile floating bar */}
      {selectedTours.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border/50 px-4 py-3 z-40">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">
                {selectedTours.length} tour{selectedTours.length !== 1 ? "s" : ""}
              </p>
              <p className="font-bold text-foreground text-sm">
                {formatPrice(totalPrice)}
              </p>
            </div>
            <button
              onClick={() => setFormOpen(true)}
              className="bg-primary text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Layers className="h-4 w-4" />
              Ver mi experiencia
            </button>
          </div>
        </div>
      )}

      <LeadFormSheet open={formOpen} onOpenChange={setFormOpen} />
    </>
  );
}
