import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTourBySlug, getPublishedTourSlugs, getRelatedTours } from "@/lib/queries";
import { TourDetailClient } from "./TourDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};
  return {
    title: tour.title,
    description: tour.shortDescription ?? undefined,
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const relatedTours = await getRelatedTours(
    slug,
    tour.categories.map((c) => c.slug)
  );

  return <TourDetailClient tour={tour} relatedTours={relatedTours} />;
}
