"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Star, Clock, Plus, Check, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/mock-data";
import { useExperienceBuilderOptional } from "@/lib/experience-builder-context";
import { useCurrency } from "@/lib/currency-context";
import type { TourSummary } from "@/lib/types";

interface TourCardProps {
  tour: TourSummary;
}

// Some operator marks are white-on-transparent and need a dark backdrop to read.
const DARK_LOGO_OPERATORS = new Set(["aeroturex"]);

export function TourCard({ tour }: TourCardProps) {
  const primaryCategory = tour.categories[0];
  const builder = useExperienceBuilderOptional();
  const { formatPrice } = useCurrency();
  const isAdded = builder?.isSelected(tour.id) ?? false;

  function handleBuilderToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (!builder) return;
    isAdded ? builder.removeTour(tour.id) : builder.addTour(tour);
  }

  return (
    <motion.article
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${
        isAdded ? "ring-2 ring-[#2BB7A6] ring-offset-1" : "border border-border"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        {tour.coverImage && (
          <Image
            src={tour.coverImage}
            alt={tour.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Category badge */}
        {primaryCategory && (
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-black/40 backdrop-blur-sm">
              {primaryCategory.name}
            </span>
          </div>
        )}

        {/* Offer badge */}
        {tour.isOffer && (
          <div className="absolute top-2.5 right-2.5">
            <Badge className="bg-accent text-foreground font-semibold text-[10px] rounded-full px-2 py-0.5 hover:bg-accent">
              Oferta
            </Badge>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-2.5 space-y-1.5 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300">
            <Link
              href={`/tours/${tour.slug}`}
              className="w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-lg bg-[#2BB7A6] text-white hover:bg-[#25A396] transition-colors"
            >
              <CalendarCheck className="h-3.5 w-3.5" /> Reservar ahora
            </Link>
            {builder && (
              <button
                onClick={handleBuilderToggle}
                className={`w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-sm transition-colors ${
                  isAdded
                    ? "bg-[#0D1B3D] text-white hover:bg-[#0D1B3D]/90"
                    : "bg-white/95 text-foreground hover:bg-white"
                }`}
              >
                {isAdded ? (
                  <><Check className="h-3.5 w-3.5" /> Agregado</>
                ) : (
                  <><Plus className="h-3.5 w-3.5" /> Agregar a mi experiencia</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <Link href={`/tours/${tour.slug}`} className="flex flex-col flex-1 p-3">
        <div className="flex items-center gap-1.5 mb-0.5">
          {tour.operator.logoUrl && (
            <span
              className={`relative w-4 h-4 rounded-full overflow-hidden ring-1 ring-border shrink-0 ${
                DARK_LOGO_OPERATORS.has(tour.operator.slug) ? "bg-[#0D1B3D]" : "bg-white"
              }`}
            >
              <Image
                src={tour.operator.logoUrl}
                alt={tour.operator.name}
                fill
                sizes="16px"
                className="object-contain"
              />
            </span>
          )}
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide truncate">
            {tour.operator.name}
          </p>
        </div>

        <h3 className="font-heading font-semibold text-sm text-foreground leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {tour.title}
        </h3>

        <p className="text-xs text-muted-foreground mb-2.5">
          {tour.destination.name}
          {tour.destination.region && (
            <span className="text-muted-foreground/60"> · {tour.destination.region}</span>
          )}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-border/50">
          <div className="flex items-center gap-2">
            {tour.rating !== undefined && (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 text-[#FFC97A] fill-[#FFC97A]" />
                <span className="text-xs font-bold text-foreground">{tour.rating.toFixed(1)}</span>
                {tour.reviewCount && (
                  <span className="text-[10px] text-muted-foreground ml-0.5">({tour.reviewCount})</span>
                )}
              </div>
            )}
            {tour.durationMinutes && (
              <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                {formatDuration(tour.durationMinutes)}
              </div>
            )}
          </div>
          {tour.priceFrom && (
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground">desde </span>
              <span className="text-xs font-bold text-foreground">
                {formatPrice(tour.priceFrom)}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
