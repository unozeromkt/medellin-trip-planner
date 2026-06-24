"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const COLLECTIONS = [
  {
    id: "ciudad",
    title: "Vive la ciudad",
    description: "Medellín desde adentro: barrios, arte, historia y vida local.",
    operator: "Aeroturex",
    tags: ["Tours Urbanos", "Cultura"],
    tourCount: 4,
    href: "/tours?destination=medellin",
    image: "/img/medellin-city.jpg",
    accent: "#2BB7A6",
  },
  {
    id: "guatape",
    title: "Descubre Guatapé y sus alrededores",
    description: "La Piedra, el embalse, el pueblo más colorido de Colombia.",
    operator: "Guatapé Travel",
    tags: ["Naturaleza", "Aventura"],
    tourCount: 2,
    href: "/tours?destination=guatape",
    image: "/img/Piedra_del_Penol_Colombia_pano.jpg",
    accent: "#A8CBE6",
  },
  {
    id: "buses",
    title: "Aventura sin límite en buses temáticos",
    description: "Recorre la ciudad a bordo de los icónicos Turtle Bus.",
    operator: "Turtle Bus",
    tags: ["Tours Urbanos", "Vida Nocturna"],
    tourCount: 3,
    href: "/tours?q=turtle",
    image: "/img/turtle-bus-adventure.jpg",
    accent: "#FFC97A",
  },
  {
    id: "chivas",
    title: "Fiesta y Celebración en Chivas",
    description: "Música, trago y rumba en las chivas más famosas de Medellín.",
    operator: "Chivas & Trolley Tours",
    tags: ["Fiesta", "Experiencias VIP"],
    tourCount: 2,
    href: "/tours?category=party",
    image: "/img/chivas_trolley_tours.jpg",
    accent: "#E88C30",
  },
] as const;

/* ─── grid placement per card at lg breakpoint ─────────── */
const CARD_GRID_STYLES = [
  // Card 1: wide, top-left (cols 1–2, row 1)
  { gridColumn: "1 / 3", gridRow: "1 / 2" },
  // Card 2: tall, right side (col 3, rows 1–2)
  { gridColumn: "3 / 4", gridRow: "1 / 3" },
  // Card 3: bottom-left square (col 1, row 2)
  { gridColumn: "1 / 2", gridRow: "2 / 3" },
  // Card 4: bottom-center square (col 2, row 2)
  { gridColumn: "2 / 3", gridRow: "2 / 3" },
];

function CollectionCard({
  collection,
  style,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  collection: (typeof COLLECTIONS)[number];
  style?: React.CSSProperties;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={collection.href}
      style={style}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#0D1B3D] h-56 sm:h-64 lg:h-auto"
    >
      {/* Background image */}
      <Image
        src={collection.image}
        alt={collection.title}
        fill
        priority={priority}
        quality={90}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes={sizes}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/35" />

      {/* Top: hover arrow */}
      <div className="relative z-10 flex items-start justify-end p-4">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowRight className="h-3.5 w-3.5 text-[#0D1B3D]" />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom: operator + title + CTA */}
      <div className="relative z-10 p-5">
        {/* Operator */}
        <div className="flex items-center gap-1.5 mb-2">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: collection.accent }}
          />
          <span className="text-[10px] font-semibold text-white/55 uppercase tracking-wider">
            Operado por {collection.operator}
          </span>
        </div>

        <h3 className="font-heading font-bold text-white leading-snug mb-3 text-lg sm:text-xl">
          {collection.title}
        </h3>

        <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-2">
          {collection.description}
        </p>

        {/* Count badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 group-hover:bg-white group-hover:border-white transition-all duration-300">
          <span
            className="text-xs font-bold group-hover:text-[#0D1B3D] transition-colors"
            style={{ color: collection.accent }}
          >
            {collection.tourCount}
          </span>
          <span className="text-xs font-medium text-white/75 group-hover:text-[#0D1B3D] transition-colors">
            experiencia{(collection.tourCount as number) !== 1 ? "s" : ""}
          </span>
          <ArrowRight className="h-3 w-3 text-white/50 group-hover:text-[#0D1B3D] transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export function FeaturedCollections() {
  return (
    <section className="py-16 sm:py-20 bg-[#F7F9FC]">
      <div className="container mx-auto px-4">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2BB7A6]/10 text-[#2BB7A6] rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Colecciones curadas
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Experiencias para{" "}
              <span className="relative inline-block">
                cada viajero
                <span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                  style={{ background: "linear-gradient(90deg, #2BB7A6, #FFC97A)" }}
                />
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
              Colecciones temáticas operadas por los mejores operadores de Medellín y Antioquia.
            </p>
          </div>

          <Link
            href="/tours"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
          >
            Ver todas las experiencias
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── Bento grid ── */}
        {/* Mobile/tablet: simple 1-2 col stacked grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {COLLECTIONS.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              priority={col.id === "ciudad"}
            />
          ))}
        </div>

        {/* Desktop: asymmetric bento (3 cols × 2 rows) */}
        <div
          className="hidden lg:grid lg:grid-cols-3 gap-4"
          style={{ gridTemplateRows: "280px 280px" }}
        >
          {COLLECTIONS.map((col, i) => (
            <CollectionCard
              key={col.id}
              collection={col}
              style={CARD_GRID_STYLES[i]}
              priority={i === 0}
              sizes={
                i === 0
                  ? "(max-width: 1024px) 100vw, 66vw"   // wide card: 2 of 3 cols
                  : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
            />
          ))}
        </div>

      </div>
    </section>
  );
}
