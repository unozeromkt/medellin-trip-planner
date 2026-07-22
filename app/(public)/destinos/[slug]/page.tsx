import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Star, MapPin, Compass } from "lucide-react";
import {
  getDestinationBySlug,
  getActiveDestinationSlugs,
  getToursByDestinationSlug,
} from "@/lib/queries";
import { truncateDescription } from "@/lib/seo";
import { TourCard } from "@/components/tours/TourCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getActiveDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};

  const title = `${destination.name} — Tours y experiencias | Medellín Trip Planner`;
  const description = truncateDescription(
    destination.description?.trim() ||
      `Descubre los mejores tours y experiencias en ${destination.name}, Antioquia, con operadores verificados.`
  );
  const path = `/destinos/${destination.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      images: destination.coverImage
        ? [{ url: destination.coverImage, width: 1200, height: 630, alt: destination.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: destination.coverImage ? [destination.coverImage] : undefined,
    },
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const [destination, tours] = await Promise.all([
    getDestinationBySlug(slug),
    getToursByDestinationSlug(slug),
  ]);

  if (!destination) notFound();

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E2E8ED]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link
            href="/destinos"
            className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Destinos
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[45vh] min-h-[320px] bg-[#0D1B3D]">
        {destination.coverImage && (
          <Image
            src={destination.coverImage}
            alt={destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 pb-8 w-full">
            {destination.region && (
              <p className="flex items-center gap-1.5 text-white/70 text-sm font-body mb-2">
                <MapPin className="w-3.5 h-3.5" /> {destination.region}
              </p>
            )}
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
              {destination.name}
            </h1>
            {destination.rating != null && (
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-[#FFC97A] fill-[#FFC97A]" />
                <span className="text-sm font-body font-semibold text-white">{destination.rating.toFixed(1)}</span>
                {destination.reviewCount != null && (
                  <span className="text-sm font-body text-white/60">({destination.reviewCount} reseñas)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {destination.description && (
          <p className="font-body text-base text-[#4A5C6A] leading-relaxed max-w-3xl">
            {destination.description}
          </p>
        )}

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#0D1B3D] mb-5">
            Tours en {destination.name}
          </h2>

          {tours.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
              <Compass className="w-10 h-10 text-[#9DAAB5] mx-auto mb-3" />
              <p className="font-body text-sm font-medium text-[#0D1B3D] mb-1">
                Aún no tenemos tours publicados en {destination.name}
              </p>
              <p className="font-body text-xs text-[#637489] mb-5">
                Muy pronto sumaremos experiencias en este destino. Mientras tanto, explora el resto del catálogo.
              </p>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Ver todos los tours
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
