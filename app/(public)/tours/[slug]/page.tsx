import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTourBySlug, getPublishedTourSlugs, getRelatedTours } from "@/lib/queries";
import { truncateDescription, absoluteUrl, SITE_NAME } from "@/lib/seo";
import type { TourDetail } from "@/lib/types";
import { TourDetailClient } from "./TourDetailClient";

function toAbsolute(url: string) {
  return url.startsWith("http") ? url : absoluteUrl(url);
}

/**
 * Rich structured data so Google can render price, rating and FAQ rich
 * results for each tour. Rendered server-side into the initial HTML.
 */
function buildTourJsonLd(tour: TourDetail) {
  const path = `/tours/${tour.slug}`;
  const images = [
    tour.coverImage,
    ...tour.images.map((img) => img.url),
  ].filter((v): v is string => Boolean(v)).map(toAbsolute);

  const description =
    tour.shortDescription?.trim() ||
    tour.description?.trim() ||
    `Reserva ${tour.title} en ${tour.destination.name} con ${SITE_NAME}.`;

  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tour.title,
    description: truncateDescription(description, 300),
    image: images.length > 0 ? images : undefined,
    brand: { "@type": "Brand", name: tour.operator.name },
    category: tour.categories[0]?.name,
  };

  if (tour.priceFrom) {
    product.offers = {
      "@type": "Offer",
      price: tour.priceFrom,
      priceCurrency: tour.currency || "COP",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(path),
    };
  }

  if (tour.rating && tour.reviewCount) {
    product.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: tour.rating.toFixed(1),
      reviewCount: tour.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  if (tour.reviews.length > 0) {
    product.review = tour.reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.authorName },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: "5" },
      reviewBody: r.comment ?? undefined,
    }));
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Tours", item: absoluteUrl("/tours") },
      { "@type": "ListItem", position: 3, name: tour.title, item: absoluteUrl(path) },
    ],
  };

  const graph: Record<string, unknown>[] = [product, breadcrumb];

  if (tour.faqs.length > 0) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tour.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return graph;
}

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

  const title = `${tour.title} — Tour en ${tour.destination.name}`;
  const description = truncateDescription(
    tour.shortDescription?.trim() ||
      tour.description?.trim() ||
      `Reserva ${tour.title} en ${tour.destination.name} con Medellín Trip Planner. Operadores verificados, reserva fácil y confirmación por WhatsApp.`
  );
  const coverImage = tour.coverImage ?? tour.images.find((img) => img.isCover)?.url ?? tour.images[0]?.url;
  const path = `/tours/${tour.slug}`;

  return {
    title,
    description,
    keywords: [
      tour.title,
      `tours ${tour.destination.name}`,
      ...tour.categories.map((c) => c.name),
      "Medellín Trip Planner",
    ],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      images: coverImage ? [{ url: coverImage, width: 1200, height: 630, alt: tour.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
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

  const jsonLd = buildTourJsonLd(tour);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TourDetailClient tour={tour} relatedTours={relatedTours} />
    </>
  );
}
