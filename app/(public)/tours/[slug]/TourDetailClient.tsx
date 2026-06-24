"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Clock, Users, Star, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, Phone, Plus, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TourCard } from "@/components/tours/TourCard";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import { formatPrice, formatDuration } from "@/lib/mock-data";
import { useExperienceBuilderOptional } from "@/lib/experience-builder-context";
import type { TourDetail, TourSummary } from "@/lib/types";

interface TourDetailClientProps {
  tour: TourDetail;
  relatedTours: TourSummary[];
}

export function TourDetailClient({ tour, relatedTours }: TourDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [itineraryOpen, setItineraryOpen] = useState(true);

  const builder = useExperienceBuilderOptional();
  const isAdded = builder?.isSelected(tour.id) ?? false;

  function handleBuilderToggle() {
    if (!builder) return;
    isAdded ? builder.removeTour(tour.id) : builder.addTour(tour as unknown as TourSummary);
  }

  const coverImage = tour.images[0]?.url ?? tour.coverImage;
  const primaryCategory = tour.categories[0];

  function handleWhatsApp() {
    const { whatsappUrl } = buildWhatsAppMessage({
      selectedTours: [
        {
          title: tour.title,
          priceFrom: tour.priceFrom ?? undefined,
          duration: tour.durationMinutes
            ? formatDuration(tour.durationMinutes)
            : undefined,
        },
      ],
      source: `/tours/${tour.slug}`,
    });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/tours" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Tours
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{tour.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left/Main column ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-2">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
                {coverImage && (
                  <Image
                    src={tour.images[activeImage]?.url ?? coverImage}
                    alt={tour.images[activeImage]?.altText ?? tour.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                )}
                {primaryCategory && (
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-xs font-semibold px-3 py-1.5 rounded-full text-white shadow"
                      style={{ backgroundColor: primaryCategory.color ?? "#0D1B3D" }}
                    >
                      {primaryCategory.name}
                    </span>
                  </div>
                )}
              </div>
              {tour.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {tour.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 transition-all ${
                        activeImage === i
                          ? "ring-2 ring-primary ring-offset-1"
                          : "opacity-60 hover:opacity-90"
                      }`}
                    >
                      <Image src={img.url} alt={img.altText ?? ""} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & meta */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {tour.title}
                </h1>
                {tour.isOffer && (
                  <Badge className="bg-accent text-foreground shrink-0 rounded-full">
                    Oferta
                  </Badge>
                )}
              </div>

              {/* Operator & location */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="font-medium text-foreground">{tour.operator.name}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {tour.destination.name}
                  {tour.destination.region && `, ${tour.destination.region}`}
                </span>
                {tour.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#FFC97A] text-[#FFC97A]" />
                    <span className="font-semibold text-foreground">{tour.rating.toFixed(1)}</span>
                    {tour.reviewCount && (
                      <span>({tour.reviewCount} reseñas)</span>
                    )}
                  </span>
                )}
              </div>

              {/* Key info strip */}
              <div className="flex flex-wrap gap-4 text-sm bg-white rounded-xl border border-border/50 px-4 py-3">
                {tour.durationMinutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{formatDuration(tour.durationMinutes)}</span>
                  </div>
                )}
                {(tour.capacityMin || tour.capacityMax) && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>
                      {tour.capacityMin && tour.capacityMax
                        ? `${tour.capacityMin}–${tour.capacityMax} personas`
                        : tour.capacityMax
                        ? `Máx. ${tour.capacityMax} personas`
                        : `Mín. ${tour.capacityMin} personas`}
                    </span>
                  </div>
                )}
                {tour.meetingPoint && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="truncate max-w-[240px]">{tour.meetingPoint}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {tour.description && (
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground mb-3">
                  Sobre esta experiencia
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                  {tour.description}
                </div>
              </div>
            )}

            {/* Includes / Excludes */}
            {(tour.includes.length > 0 || tour.excludes.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tour.includes.length > 0 && (
                  <div>
                    <h2 className="font-heading font-semibold text-base text-foreground mb-3">
                      Incluye
                    </h2>
                    <ul className="space-y-2">
                      {tour.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excludes.length > 0 && (
                  <div>
                    <h2 className="font-heading font-semibold text-base text-foreground mb-3">
                      No incluye
                    </h2>
                    <ul className="space-y-2">
                      {tour.excludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <XCircle className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary.length > 0 && (
              <div>
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => setItineraryOpen(!itineraryOpen)}
                >
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Itinerario
                  </h2>
                  {itineraryOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {itineraryOpen && (
                  <div className="mt-4 space-y-4">
                    {tour.itinerary.map((step) => (
                      <div key={step.stepNumber} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {step.stepNumber}
                          </div>
                          {step.stepNumber < tour.itinerary.length && (
                            <div className="w-px flex-1 bg-border mt-2 min-h-[20px]" />
                          )}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm text-foreground">{step.title}</h3>
                            {step.duration && (
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {step.duration}
                              </span>
                            )}
                          </div>
                          {step.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAQs */}
            {tour.faqs.length > 0 && (
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Preguntas frecuentes
                </h2>
                <div className="space-y-2">
                  {tour.faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="border border-border/50 rounded-xl overflow-hidden bg-white"
                    >
                      <button
                        className="flex items-center justify-between w-full px-4 py-3.5 text-left"
                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      >
                        <span className="font-medium text-sm text-foreground pr-4">
                          {faq.question}
                        </span>
                        {openFaqIndex === i ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {openFaqIndex === i && (
                        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                          <div className="pt-3">{faq.answer}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related tours */}
            {relatedTours.length > 0 && (
              <div>
                <Separator className="mb-8" />
                <h2 className="font-heading font-semibold text-lg text-foreground mb-5">
                  Tours relacionados
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedTours.map((t) => (
                    <TourCard key={t.id} tour={t} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right sidebar (desktop) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
                {/* Price */}
                {tour.priceFrom && (
                  <div>
                    <span className="text-sm text-muted-foreground">Precio desde</span>
                    <p className="font-heading font-bold text-2xl text-foreground mt-0.5">
                      {formatPrice(tour.priceFrom, tour.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">por persona</p>
                  </div>
                )}

                <Separator />

                {/* Quick info */}
                <div className="space-y-2.5 text-sm">
                  {tour.durationMinutes && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {formatDuration(tour.durationMinutes)}
                    </div>
                  )}
                  {tour.destination && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {tour.destination.name}
                    </div>
                  )}
                  {tour.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-[#FFC97A] text-[#FFC97A]" />
                      <span className="font-semibold text-foreground">{tour.rating.toFixed(1)}</span>
                      {tour.reviewCount && (
                        <span className="text-muted-foreground">({tour.reviewCount})</span>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* CTAs */}
                <div className="space-y-3">
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold rounded-xl py-3 gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Reservar por WhatsApp
                  </Button>
                  {builder && (
                    <Button
                      variant="outline"
                      onClick={handleBuilderToggle}
                      className={`w-full rounded-xl gap-2 transition-colors ${
                        isAdded
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-primary/30 text-primary hover:bg-primary/5"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      {isAdded ? "Quitar de mi experiencia" : "Agregar a mi experiencia"}
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Sin cargos ocultos · Confirmación inmediata
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border/50 px-4 py-3 flex items-center gap-3 z-40">
        {tour.priceFrom && (
          <div className="flex-1">
            <span className="text-xs text-muted-foreground block">Desde</span>
            <span className="font-bold text-foreground">
              {formatPrice(tour.priceFrom, tour.currency)}
            </span>
          </div>
        )}
        <Button
          onClick={handleWhatsApp}
          className="bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold rounded-xl gap-2 px-6"
        >
          <Phone className="h-4 w-4" />
          Reservar
        </Button>
      </div>

      {/* Spacer for mobile CTA */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
