"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { TourCard } from "@/components/tours/TourCard";
import { CategoryPills } from "@/components/marketing/CategoryPills";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockTours, mockCategories, mockDestinations } from "@/lib/mock-data";
import type { TourSummary } from "@/lib/types";

const PRICE_RANGES = [
  { label: "Hasta $250K", value: "hasta-250k", min: 0, max: 250000 },
  { label: "$250K – $500K", value: "250k-500k", min: 250000, max: 500000 },
  { label: "$500K – $1M", value: "500k-1m", min: 500000, max: 1000000 },
  { label: "Más de $1M", value: "mas-1m", min: 1000000, max: Infinity },
];

export function ToursContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlQuery = searchParams.get("q") ?? "";
  const urlDestination = searchParams.get("destination") ?? "";
  const urlBudget = searchParams.get("budget") ?? "";
  const urlDate = searchParams.get("date") ?? "";

  const [searchText, setSearchText] = useState(urlQuery);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(urlDestination || null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(() => {
    if (!urlBudget) return null;
    const idx = PRICE_RANGES.findIndex((r) => r.value === urlBudget);
    return idx >= 0 ? idx : null;
  });
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return mockTours.filter((tour) => {
      if (urlCategory && !tour.categories.some((c) => c.slug === urlCategory)) return false;
      if (
        searchText &&
        !tour.title.toLowerCase().includes(searchText.toLowerCase()) &&
        !tour.destination.name.toLowerCase().includes(searchText.toLowerCase())
      )
        return false;
      if (selectedDestination && tour.destination.slug !== selectedDestination) return false;
      if (selectedPriceRange !== null) {
        const range = PRICE_RANGES[selectedPriceRange];
        if (!tour.priceFrom) return false;
        if (tour.priceFrom < range.min || tour.priceFrom > range.max) return false;
      }
      return true;
    });
  }, [urlCategory, searchText, selectedDestination, selectedPriceRange]);

  const activeFilterCount =
    (urlCategory ? 1 : 0) +
    (selectedDestination ? 1 : 0) +
    (selectedPriceRange !== null ? 1 : 0) +
    (urlDate ? 1 : 0);

  function clearFilters() {
    setSelectedDestination(null);
    setSelectedPriceRange(null);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-1">
          Tours y Experiencias
        </h1>
        <p className="text-muted-foreground">
          {filtered.length} experiencia{filtered.length !== 1 ? "s" : ""} disponible
          {filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar tours o destinos..."
            className="pl-9 rounded-xl bg-white"
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-xl bg-white relative"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white text-[10px] rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Category pills */}
      <div className="mb-6">
        <CategoryPills categories={mockCategories} activeSlug={urlCategory} />
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-border p-5 mb-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-foreground">Filtros adicionales</h2>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <X className="h-3 w-3" />
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Destination filter */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Destino
            </p>
            <div className="flex flex-wrap gap-2">
              {mockDestinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() =>
                    setSelectedDestination(
                      selectedDestination === dest.slug ? null : dest.slug
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedDestination === dest.slug
                      ? "bg-foreground text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {dest.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price range filter */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Presupuesto por persona
            </p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((range, i) => (
                <button
                  key={range.label}
                  onClick={() =>
                    setSelectedPriceRange(selectedPriceRange === i ? null : i)
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedPriceRange === i
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {(urlCategory || selectedDestination || selectedPriceRange !== null || urlDate) && (
        <div className="flex flex-wrap gap-2 mb-5">
          {urlCategory && (
            <a
              href="/tours"
              className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              {mockCategories.find((c) => c.slug === urlCategory)?.name}
              <X className="h-3 w-3" />
            </a>
          )}
          {selectedDestination && (
            <button
              onClick={() => setSelectedDestination(null)}
              className="inline-flex items-center gap-1.5 bg-foreground/10 text-foreground text-xs font-medium px-3 py-1.5 rounded-full hover:bg-foreground/15 transition-colors"
            >
              {mockDestinations.find((d) => d.slug === selectedDestination)?.name}
              <X className="h-3 w-3" />
            </button>
          )}
          {selectedPriceRange !== null && (
            <button
              onClick={() => setSelectedPriceRange(null)}
              className="inline-flex items-center gap-1.5 bg-accent/20 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-accent/30 transition-colors"
            >
              {PRICE_RANGES[selectedPriceRange].label}
              <X className="h-3 w-3" />
            </button>
          )}
          {urlDate && (
            <span className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-full">
              {new Date(urlDate + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      )}

      {/* Tours grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <EmptyState onClear={clearFilters} />
      )}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
        No encontramos tours para estos filtros
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
        Intenta con otros criterios de búsqueda o elimina algunos filtros.
      </p>
      <Button variant="outline" onClick={onClear} className="rounded-full">
        Limpiar filtros
      </Button>
    </div>
  );
}
