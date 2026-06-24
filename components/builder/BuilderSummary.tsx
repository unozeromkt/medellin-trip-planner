"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Clock, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useExperienceBuilder } from "@/lib/experience-builder-context";
import { formatPrice, formatDuration } from "@/lib/mock-data";

interface BuilderSummaryProps {
  onContinue: () => void;
}

export function BuilderSummary({ onContinue }: BuilderSummaryProps) {
  const { selectedTours, removeTour, clearAll, totalPrice, totalDurationMinutes } =
    useExperienceBuilder();

  if (selectedTours.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border/50 p-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Layers className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-heading font-semibold text-base text-foreground mb-1">
          Mi experiencia
        </h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Agrega tours desde el catálogo y crea tu viaje personalizado.
        </p>
        <Link
          href="/tours"
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
        >
          Ver todos los tours <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h2 className="font-heading font-semibold text-sm text-foreground">
            Mi experiencia
          </h2>
          <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {selectedTours.length}
          </span>
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Limpiar
        </button>
      </div>

      {/* Selected tours list */}
      <div className="divide-y divide-border/40 max-h-72 overflow-y-auto">
        {selectedTours.map((tour) => (
          <div key={tour.id} className="flex items-center gap-3 p-4">
            {/* Thumbnail */}
            <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
              {tour.coverImage && (
                <Image
                  src={tour.coverImage}
                  alt={tour.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                {tour.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {tour.durationMinutes && (
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    {formatDuration(tour.durationMinutes)}
                  </span>
                )}
                {tour.priceFrom && (
                  <span className="text-[11px] font-semibold text-primary">
                    {formatPrice(tour.priceFrom)}
                  </span>
                )}
              </div>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeTour(tour.id)}
              className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Quitar tour"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="px-5 py-4 bg-muted/30">
        <div className="space-y-1.5 text-sm mb-4">
          <div className="flex justify-between text-muted-foreground">
            <span>{selectedTours.length} tour{selectedTours.length !== 1 ? "s" : ""}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(totalDurationMinutes)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total estimado</span>
            <span className="text-primary">{formatPrice(totalPrice)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Precios desde por persona</p>
        </div>

        <Button
          onClick={onContinue}
          className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl font-semibold gap-2"
        >
          Personalizar y solicitar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
