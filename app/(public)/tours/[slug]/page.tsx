import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mockTours, mockTourDetails } from "@/lib/mock-data";
import type { TourDetail } from "@/lib/types";
import { TourDetailClient } from "./TourDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mockTours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const summary = mockTours.find((t) => t.slug === slug);
  if (!summary) return {};
  return {
    title: summary.title,
    description: summary.shortDescription ?? undefined,
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;

  // Try rich detail first, fall back to summary
  const detail = mockTourDetails[slug];
  const summary = mockTours.find((t) => t.slug === slug);

  if (!detail && !summary) notFound();

  const tour: TourDetail = detail ?? {
    ...(summary!),
    description: summary!.shortDescription ?? null,
    meetingPoint: null,
    capacityMin: null,
    capacityMax: null,
    includes: [],
    excludes: [],
    images: summary!.coverImage
      ? [{ url: summary!.coverImage, altText: summary!.title, isCover: true }]
      : [],
    itinerary: [],
    faqs: [],
  };

  const relatedTours = mockTours
    .filter(
      (t) =>
        t.slug !== slug &&
        t.categories.some((c) =>
          tour.categories.some((fc: { slug: string }) => fc.slug === c.slug)
        )
    )
    .slice(0, 3);

  return <TourDetailClient tour={tour} relatedTours={relatedTours} />;
}
