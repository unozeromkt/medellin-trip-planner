"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Star, Clock, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration } from "@/lib/mock-data";
import { useExperienceBuilderOptional } from "@/lib/experience-builder-context";
import type { TourSummary } from "@/lib/types";

interface TourCardProps {
  tour: TourSummary;
}

export function TourCard({ tour }: TourCardProps) {
  const primaryCategory = tour.categories[0];
  const builder = useExperienceBuilderOptional();
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

        {/* Offer / heart */}
        {tour.isOffer ? (
          <div className="absolute top-2.5 right-2.5">
            <Badge className="bg-accent text-foreground font-semibold text-[10px] rounded-full px-2 py-0.5 hover:bg-accent">
              Oferta
            </Badge>
          </div>
        ) : (
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-white transition-all"
            aria-label="Guardar tour"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}

        {/* Add to builder */}
        {builder && (
          <div className="absolute inset-x-0 bottom-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleBuilderToggle}
              className={`w-full text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-lg transition-colors ${
                isAdded
                  ? "bg-[#2BB7A6] text-white hover:bg-[#25A396]"
                  : "bg-white text-foreground hover:bg-primary hover:text-white"
              }`}
            >
              {isAdded ? (
                <><Check className="h-3 w-3" /> Agregado</>
              ) : (
                <><Plus className="h-3 w-3" /> Agregar a mi experiencia</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/tours/${tour.slug}`} className="flex flex-col flex-1 p-3">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
          {tour.operator.name}
        </p>

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
