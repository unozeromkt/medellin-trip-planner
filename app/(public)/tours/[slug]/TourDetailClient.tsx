"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Clock, Users, Star, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, Plus, Check, ArrowLeft, Play, Calendar,
  ShieldCheck, Zap, Wallet, MessageCircle, X, ChevronLeft, ChevronRight,
  ImageIcon,
} from "lucide-react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { TourCard } from "@/components/tours/TourCard";
import { TourLeadFormSheet } from "@/components/tours/TourLeadFormSheet";
import { formatDuration } from "@/lib/mock-data";
import { useExperienceBuilderOptional } from "@/lib/experience-builder-context";
import { useCurrency } from "@/lib/currency-context";
import { extractYouTubeId } from "@/lib/youtube";
import type { TourDetail, TourSummary } from "@/lib/types";

interface TourDetailClientProps {
  tour: TourDetail;
  relatedTours: TourSummary[];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 font-heading text-xl font-bold text-[#0D1B3D] mb-4">
      <span className="w-1.5 h-5 rounded-full bg-[#2BB7A6]" />
      {children}
    </h2>
  );
}

const panelClass =
  "bg-white rounded-2xl border border-[#E2E8ED] p-6 shadow-[0_1px_3px_rgba(13,27,61,0.04)]";

export function TourDetailClient({ tour, relatedTours }: TourDetailClientProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [itineraryOpen, setItineraryOpen] = useState(true);
  const [leadFormOpen, setLeadFormOpen] = useState(false);

  const builder = useExperienceBuilderOptional();
  const { formatPrice } = useCurrency();
  const isAdded = builder?.isSelected(tour.id) ?? false;

  function handleBuilderToggle() {
    if (!builder) return;
    isAdded ? builder.removeTour(tour.id) : builder.addTour(tour as unknown as TourSummary);
  }

  const galleryImages =
    tour.images.length > 0
      ? tour.images
      : tour.coverImage
      ? [{ url: tour.coverImage, altText: tour.title, isCover: true }]
      : [];

  const primaryCategory = tour.categories[0];
  const videoId = tour.videoUrl ? extractYouTubeId(tour.videoUrl) : null;
  const hasGallery = galleryImages.length > 0;

  // Lightbox keyboard nav + scroll lock
  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % galleryImages.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + galleryImages.length) % galleryImages.length));
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, galleryImages.length]);

  const capacityText =
    tour.capacityMin && tour.capacityMax
      ? `${tour.capacityMin}–${tour.capacityMax} personas`
      : tour.capacityMax
      ? `Máx. ${tour.capacityMax}`
      : tour.capacityMin
      ? `Mín. ${tour.capacityMin}`
      : null;

  const quickFacts = [
    tour.durationMinutes && { icon: <Clock className="w-4 h-4" />, label: "Duración", value: formatDuration(tour.durationMinutes) },
    capacityText && { icon: <Users className="w-4 h-4" />, label: "Grupo", value: capacityText },
    tour.departureTimes && tour.departureTimes.length > 0 && { icon: <Calendar className="w-4 h-4" />, label: "Salidas", value: tour.departureTimes.join(", ") },
    tour.meetingPoint && { icon: <MapPin className="w-4 h-4" />, label: "Punto de encuentro", value: tour.meetingPoint },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  const trustItems = [
    { icon: <ShieldCheck className="w-4 h-4" />, label: "Operador verificado" },
    { icon: <MessageCircle className="w-4 h-4" />, label: "Confirmación por WhatsApp" },
    { icon: <Wallet className="w-4 h-4" />, label: "Sin cargos ocultos" },
    { icon: <Zap className="w-4 h-4" />, label: "Respuesta inmediata" },
  ];

  const PlayButton = ({ size = "lg" }: { size?: "lg" | "sm" }) => (
    <button
      onClick={(e) => { e.stopPropagation(); setShowVideo(true); }}
      aria-label="Reproducir video"
      className="absolute inset-0 flex items-center justify-center bg-black/15 hover:bg-black/25 transition-colors z-10 group/play"
    >
      <span className={`${size === "lg" ? "w-16 h-16" : "w-11 h-11"} rounded-full bg-white/95 group-hover/play:bg-white flex items-center justify-center shadow-xl transition-transform group-hover/play:scale-105`}>
        <Play className={`${size === "lg" ? "h-6 w-6" : "h-4 w-4"} text-[#0D1B3D] ml-0.5`} fill="currentColor" />
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E2E8ED]">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[#637489]">
          <Link href="/tours" className="hover:text-[#0D1B3D] transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Tours
          </Link>
          <span className="text-[#C4CDD6]">/</span>
          <Link href={`/destinos/${tour.destination.slug}`} className="hover:text-[#0D1B3D] transition-colors">
            {tour.destination.name}
          </Link>
          <span className="text-[#C4CDD6]">/</span>
          <span className="text-[#0D1B3D] font-medium truncate">{tour.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* ── Title header ── */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            {primaryCategory && (
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: primaryCategory.color ?? "#0D1B3D" }}
              >
                {primaryCategory.name}
              </span>
            )}
            {tour.isOffer && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFC97A] text-[#0D1B3D]">Oferta</span>
            )}
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F8F6] text-[#2BB7A6]">
              <ShieldCheck className="w-3.5 h-3.5" /> Operador verificado
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-[2rem] font-bold text-[#0D1B3D] leading-[1.15] mb-3 max-w-3xl">
            {tour.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#637489]">
            {tour.rating != null && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#FFC97A] text-[#FFC97A]" />
                <span className="font-bold text-[#0D1B3D]">{tour.rating.toFixed(1)}</span>
                {tour.reviewCount != null && <span>({tour.reviewCount} reseñas)</span>}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {tour.destination.name}
              {tour.destination.region && `, ${tour.destination.region}`}
            </span>
            <span className="flex items-center gap-1.5">
              {tour.operator.logoUrl && (
                <span className="relative w-4 h-4 rounded-full overflow-hidden ring-1 ring-[#E2E8ED] bg-white shrink-0">
                  <Image src={tour.operator.logoUrl} alt={tour.operator.name} fill sizes="16px" className="object-contain" />
                </span>
              )}
              <span className="font-medium text-[#0D1B3D]">{tour.operator.name}</span>
            </span>
          </div>
        </div>

        {/* ── Gallery ── */}
        {hasGallery && (
          <div className="mb-6">
            {/* Desktop mosaic */}
            <div className="hidden sm:grid grid-cols-3 gap-2 h-[440px]">
              <button
                onClick={() => setLightbox(0)}
                className={`group relative ${galleryImages.length === 1 ? "col-span-3" : "col-span-2"} rounded-2xl overflow-hidden bg-[#E9EDF2]`}
              >
                <Image
                  src={galleryImages[0].url}
                  alt={galleryImages[0].altText ?? tour.title}
                  fill
                  sizes="(max-width: 1024px) 66vw, 600px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                />
                {videoId && <PlayButton />}
                <span className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#0D1B3D] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  <ImageIcon className="w-3.5 h-3.5" /> Ver fotos
                </span>
              </button>

              {galleryImages.length === 2 && (
                <button onClick={() => setLightbox(1)} className="group relative rounded-2xl overflow-hidden bg-[#E9EDF2]">
                  <Image src={galleryImages[1].url} alt={galleryImages[1].altText ?? tour.title} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </button>
              )}

              {galleryImages.length >= 3 && (
                <div className="grid grid-rows-2 gap-2">
                  {[1, 2].map((idx) => {
                    const img = galleryImages[idx];
                    const isLastVisible = idx === 2 && galleryImages.length > 3;
                    return (
                      <button key={idx} onClick={() => setLightbox(idx)} className="group relative rounded-2xl overflow-hidden bg-[#E9EDF2]">
                        <Image src={img.url} alt={img.altText ?? tour.title} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                        {isLastVisible && (
                          <span className="absolute inset-0 flex items-center justify-center bg-[#0D1B3D]/60 text-white font-heading font-bold text-lg">
                            +{galleryImages.length - 3}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile single + strip */}
            <div className="sm:hidden space-y-2">
              <button onClick={() => setLightbox(0)} className="relative block w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#E9EDF2]">
                <Image src={galleryImages[0].url} alt={galleryImages[0].altText ?? tour.title} fill sizes="100vw" className="object-cover" priority />
                {videoId && <PlayButton />}
              </button>
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {galleryImages.slice(1).map((img, i) => (
                    <button key={i} onClick={() => setLightbox(i + 1)} className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-[#E9EDF2]">
                      <Image src={img.url} alt={img.altText ?? tour.title} fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick facts */}
            {quickFacts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickFacts.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-[#E2E8ED] bg-white p-3">
                    <span className="w-9 h-9 rounded-lg bg-[#2BB7A6]/10 text-[#2BB7A6] flex items-center justify-center shrink-0">
                      {f.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-[#9DAAB5] font-semibold">{f.label}</p>
                      <p className="text-sm font-semibold text-[#0D1B3D] truncate">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {tour.description && (
              <div className={panelClass}>
                <SectionTitle>Sobre esta experiencia</SectionTitle>
                <div className="text-[#4A5C6A] leading-relaxed whitespace-pre-line text-[15px]">
                  {tour.description}
                </div>
              </div>
            )}

            {/* Includes / Excludes */}
            {(tour.includes.length > 0 || tour.excludes.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tour.includes.length > 0 && (
                  <div className="rounded-2xl border border-[#2BB7A6]/20 bg-[#2BB7A6]/[0.04] p-5">
                    <h3 className="flex items-center gap-2 font-heading font-bold text-base text-[#0D1B3D] mb-3">
                      <CheckCircle2 className="h-[18px] w-[18px] text-[#2BB7A6]" /> Incluye
                    </h3>
                    <ul className="space-y-2.5">
                      {tour.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A5C6A]">
                          <Check className="h-4 w-4 text-[#2BB7A6] shrink-0 mt-0.5" strokeWidth={2.5} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excludes.length > 0 && (
                  <div className="rounded-2xl border border-[#E2E8ED] bg-white p-5">
                    <h3 className="flex items-center gap-2 font-heading font-bold text-base text-[#0D1B3D] mb-3">
                      <XCircle className="h-[18px] w-[18px] text-[#9DAAB5]" /> No incluye
                    </h3>
                    <ul className="space-y-2.5">
                      {tour.excludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#637489]">
                          <X className="h-4 w-4 text-[#C4CDD6] shrink-0 mt-0.5" strokeWidth={2.5} />
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
              <div className={panelClass}>
                <button className="flex items-center justify-between w-full text-left" onClick={() => setItineraryOpen(!itineraryOpen)}>
                  <SectionTitle>Itinerario</SectionTitle>
                  <span className="text-[#9DAAB5]">{itineraryOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</span>
                </button>
                {itineraryOpen && (
                  <div className="mt-2 space-y-1">
                    {tour.itinerary.map((step, i) => (
                      <div key={step.stepNumber} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-9 h-9 rounded-full bg-[#0D1B3D] text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {step.stepNumber}
                          </div>
                          {i < tour.itinerary.length - 1 && <div className="w-0.5 flex-1 bg-[#E2E8ED] my-1.5 min-h-[24px]" />}
                        </div>
                        <div className="pb-5 pt-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-heading font-bold text-[15px] text-[#0D1B3D]">{step.title}</h3>
                            {step.duration && (
                              <span className="text-xs font-medium text-[#2BB7A6] bg-[#2BB7A6]/10 px-2 py-0.5 rounded-full">{step.duration}</span>
                            )}
                          </div>
                          {step.description && <p className="text-sm text-[#637489] leading-relaxed">{step.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAQs */}
            {tour.faqs.length > 0 && (
              <div className={panelClass}>
                <SectionTitle>Preguntas frecuentes</SectionTitle>
                <div className="space-y-2">
                  {tour.faqs.map((faq, i) => {
                    const open = openFaqIndex === i;
                    return (
                      <div key={i} className={`rounded-xl border transition-colors ${open ? "border-[#2BB7A6]/40 bg-[#2BB7A6]/[0.03]" : "border-[#E2E8ED] bg-white"}`}>
                        <button className="flex items-center justify-between w-full px-4 py-3.5 text-left" onClick={() => setOpenFaqIndex(open ? null : i)}>
                          <span className="font-semibold text-sm text-[#0D1B3D] pr-4">{faq.question}</span>
                          <ChevronDown className={`h-4 w-4 text-[#637489] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                        {open && (
                          <div className="px-4 pb-4 text-sm text-[#637489] leading-relaxed">{faq.answer}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            {tour.reviews.length > 0 && (
              <div className={panelClass}>
                <SectionTitle>Reseñas de viajeros</SectionTitle>
                {tour.rating != null && (
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#F1F3F6]">
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#0D1B3D] text-white px-5 py-3 shrink-0">
                      <span className="font-heading text-3xl font-bold leading-none">{tour.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-white/60 mt-1">de 5</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.round(tour.rating ?? 0) ? "fill-[#FFC97A] text-[#FFC97A]" : "fill-[#E2E8ED] text-[#E2E8ED]"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-[#637489]">
                        Basado en <span className="font-semibold text-[#0D1B3D]">{tour.reviewCount ?? tour.reviews.length}</span> reseñas de viajeros
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tour.reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-[#E2E8ED] bg-white p-4">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-9 h-9 rounded-full bg-[#A8CBE6]/30 text-[#0D1B3D] text-xs font-bold flex items-center justify-center shrink-0">
                          {review.authorName.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-[#0D1B3D] truncate">{review.authorName}</p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-[#FFC97A] text-[#FFC97A]" : "fill-[#E2E8ED] text-[#E2E8ED]"}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && <p className="text-sm text-[#637489] leading-relaxed">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar (desktop) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-[#E2E8ED] bg-white shadow-[0_8px_30px_rgba(13,27,61,0.08)] overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-[#2BB7A6] to-[#0D1B3D]" />
                <div className="p-6 space-y-4">
                  <div className="flex items-end justify-between gap-3">
                    {tour.priceFrom ? (
                      <div>
                        <span className="text-xs text-[#637489]">Desde</span>
                        <p className="font-heading font-bold text-3xl text-[#0D1B3D] leading-tight">{formatPrice(tour.priceFrom)}</p>
                        <p className="text-xs text-[#9DAAB5]">
                          por persona{tour.priceChild ? ` · Niño ${formatPrice(tour.priceChild)}` : ""}
                        </p>
                      </div>
                    ) : (
                      <p className="font-heading font-bold text-lg text-[#0D1B3D]">Consulta disponibilidad</p>
                    )}
                    {tour.rating != null && (
                      <span className="flex items-center gap-1 bg-[#F1F3F6] rounded-full px-2.5 py-1 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-[#FFC97A] text-[#FFC97A]" />
                        <span className="text-sm font-bold text-[#0D1B3D]">{tour.rating.toFixed(1)}</span>
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2 py-1">
                    {trustItems.map((t, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-[#4A5C6A]">
                        <span className="text-[#2BB7A6]">{t.icon}</span>
                        {t.label}
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2.5">
                    <Button
                      onClick={() => setLeadFormOpen(true)}
                      className="w-full bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold rounded-xl py-6 gap-2 text-[15px] shadow-lg shadow-[#25D366]/20"
                    >
                      <WhatsappLogo size={20} weight="fill" />
                      Reservar por WhatsApp
                    </Button>
                    {builder && (
                      <Button
                        variant="outline"
                        onClick={handleBuilderToggle}
                        className={`w-full rounded-xl py-6 gap-2 transition-colors ${
                          isAdded ? "border-[#2BB7A6] bg-[#2BB7A6]/5 text-[#2BB7A6]" : "border-[#2BB7A6]/30 text-[#2BB7A6] hover:bg-[#2BB7A6]/5"
                        }`}
                      >
                        {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isAdded ? "Quitar de mi experiencia" : "Agregar a mi experiencia"}
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-[#9DAAB5] text-center">
                    Reserva sin pago anticipado · Confirmación en minutos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related tours */}
        {relatedTours.length > 0 && (
          <div className="mt-10">
            <SectionTitle>Tours relacionados</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && hasGallery && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" onClick={() => setLightbox(null)} aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
          <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
            {lightbox + 1} / {galleryImages.length}
          </span>
          {galleryImages.length > 1 && (
            <button
              className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? i : (i - 1 + galleryImages.length) % galleryImages.length)); }}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <div className="relative w-[92vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={galleryImages[lightbox].url} alt={galleryImages[lightbox].altText ?? tour.title} fill sizes="92vw" className="object-contain" />
          </div>
          {galleryImages.length > 1 && (
            <button
              className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? i : (i + 1) % galleryImages.length)); }}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Video lightbox */}
      {showVideo && videoId && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowVideo(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" onClick={() => setShowVideo(false)} aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={`Video: ${tour.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E2E8ED] px-4 py-3 flex items-center gap-3 z-40 shadow-[0_-4px_16px_rgba(13,27,61,0.08)]">
        {tour.priceFrom && (
          <div className="flex-1">
            <span className="text-[11px] text-[#9DAAB5] block leading-none mb-0.5">Desde</span>
            <span className="font-heading font-bold text-lg text-[#0D1B3D]">{formatPrice(tour.priceFrom)}</span>
          </div>
        )}
        <Button
          onClick={() => setLeadFormOpen(true)}
          className="bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold rounded-xl gap-2 px-6 py-6"
        >
          <WhatsappLogo size={18} weight="fill" />
          Reservar
        </Button>
      </div>
      <div className="lg:hidden h-20" />

      <TourLeadFormSheet
        open={leadFormOpen}
        onOpenChange={setLeadFormOpen}
        tour={{
          id: tour.id,
          slug: tour.slug,
          title: tour.title,
          priceFrom: tour.priceFrom,
          durationMinutes: tour.durationMinutes,
        }}
      />
    </div>
  );
}
