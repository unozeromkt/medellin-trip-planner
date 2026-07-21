"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { Destination } from "@/lib/types";


interface FeaturedDestinationsProps {
  destinations: Destination[];
}

export function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  function onMouseDown(e: React.MouseEvent) {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    const el = trackRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const delta = x - startX.current;
    if (Math.abs(delta) > 4) hasDragged.current = true;
    el.scrollLeft = scrollLeft.current - delta;
  }

  function onMouseUp() {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = false;
    el.style.cursor = "grab";
    el.style.userSelect = "";
  }

  function onClickCapture(e: React.MouseEvent) {
    if (hasDragged.current) e.preventDefault();
  }

  function scroll(direction: "left" | "right") {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a")?.offsetWidth ?? 300;
    el.scrollBy({ left: direction === "left" ? -(cardWidth + 16) : cardWidth + 16, behavior: "smooth" });
  }

  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-[#2BB7A6] uppercase tracking-widest mb-1">
            Destinos destacados
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            ¿A dónde quieres ir?
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Prev / Next buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Anterior"
              className="w-9 h-9 rounded-full border border-[#E2E8ED] flex items-center justify-center text-[#4A5C6A] hover:border-[#0D1B3D] hover:text-[#0D1B3D] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Siguiente"
              className="w-9 h-9 rounded-full border border-[#E2E8ED] flex items-center justify-center text-[#4A5C6A] hover:border-[#0D1B3D] hover:text-[#0D1B3D] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            href="/tours"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", cursor: "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClickCapture={onClickCapture}
      >
        {destinations.map((dest) => (
          <Link
            key={dest.id}
            href={`/tours?destination=${dest.slug}`}
            className="group relative flex-none w-[280px] sm:w-[320px] overflow-hidden rounded-2xl bg-muted snap-start"
            style={{ aspectRatio: "4/3" }}
          >
            {dest.coverImage && (
              <Image
                src={dest.coverImage}
                alt={dest.name}
                fill
                sizes="320px"
                quality={85}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 inset-x-0 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-white/70 text-sm">{dest.region}</p>
                </div>
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <Star className="h-3 w-3 text-[#FFC97A] fill-[#FFC97A]" />
                  <span className="text-xs font-semibold text-white">
                    {dest.rating?.toFixed(1) ?? "4.7"}
                  </span>
                </div>
              </div>
            </div>

            {/* Hover CTA */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white text-foreground text-sm font-semibold px-5 py-2 rounded-full shadow-lg flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                Explorar tours <ArrowRight className="h-4 w-4 text-primary" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 sm:hidden text-center">
        <Link
          href="/tours"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
        >
          Ver todos los destinos <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
