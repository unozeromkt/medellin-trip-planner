import { db } from "./db";
import type { Prisma } from "@prisma/client";
import type { TourSummary, TourDetail, Destination, Category, TourZone, PhysicalIntensity } from "./types";
import type { WholesalePackage } from "./wholesale-packages";

// ── Shared select shape for tour summaries ──────────────────────────
const TOUR_SUMMARY_SELECT = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  priceFrom: true,
  currency: true,
  durationMinutes: true,
  isFeatured: true,
  isOffer: true,
  coverImage: true,
  rating: true,
  reviewCount: true,
  departureTimes: true,
  returnTime: true,
  isFullDay: true,
  zone: true,
  physicalIntensity: true,
  operatingDays: true,
  pickupIncluded: true,
  bookingAdvanceDays: true,
  tags: true,
  destination: { select: { id: true, name: true, slug: true, region: true } },
  operator: { select: { id: true, name: true, slug: true, logoUrl: true } },
  tourCategories: {
    select: { category: { select: { id: true, name: true, slug: true, icon: true, color: true } } },
    orderBy: { category: { sortOrder: "asc" as const } },
  },
} as const;

type TourSummaryRow = Prisma.TourGetPayload<{ select: typeof TOUR_SUMMARY_SELECT }>;

function mapTour(raw: TourSummaryRow): TourSummary {
  return {
    ...raw,
    // zone/physicalIntensity are free-form strings in the DB; the app only
    // ever writes values from the TourZone/PhysicalIntensity unions.
    zone: raw.zone as TourZone | null,
    physicalIntensity: raw.physicalIntensity as PhysicalIntensity | null,
    categories: raw.tourCategories.map((tc) => tc.category),
  };
}

// ── Tours ───────────────────────────────────────────────────────────

export async function getPublishedTours(): Promise<TourSummary[]> {
  const rows = await db.tour.findMany({
    where: { status: "published" },
    select: TOUR_SUMMARY_SELECT,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
  });
  return rows.map(mapTour);
}

export async function getFeaturedTours(): Promise<TourSummary[]> {
  const rows = await db.tour.findMany({
    where: { status: "published", isFeatured: true },
    select: TOUR_SUMMARY_SELECT,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(mapTour);
}

export async function getTourBySlug(slug: string): Promise<TourDetail | null> {
  const raw = await db.tour.findUnique({
    where: { slug, status: "published" },
    select: {
      ...TOUR_SUMMARY_SELECT,
      description: true,
      meetingPoint: true,
      capacityMin: true,
      capacityMax: true,
      includes: true,
      excludes: true,
      images: {
        select: { url: true, altText: true, isCover: true },
        orderBy: { sortOrder: "asc" },
      },
      itinerary: {
        select: { stepNumber: true, title: true, description: true, duration: true },
        orderBy: { stepNumber: "asc" },
      },
      faqs: { select: { question: true, answer: true } },
    },
  });
  if (!raw) return null;
  return {
    ...mapTour(raw),
    description: raw.description,
    meetingPoint: raw.meetingPoint,
    capacityMin: raw.capacityMin,
    capacityMax: raw.capacityMax,
    includes: raw.includes,
    excludes: raw.excludes,
    images: raw.images,
    itinerary: raw.itinerary,
    faqs: raw.faqs,
  };
}

export async function getPublishedTourSlugs(): Promise<string[]> {
  const rows = await db.tour.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getRelatedTours(
  excludeSlug: string,
  categorySlugList: string[]
): Promise<TourSummary[]> {
  const rows = await db.tour.findMany({
    where: {
      status: "published",
      slug: { not: excludeSlug },
      tourCategories: { some: { category: { slug: { in: categorySlugList } } } },
    },
    select: TOUR_SUMMARY_SELECT,
    take: 3,
  });
  return rows.map(mapTour);
}

// ── Destinations ────────────────────────────────────────────────────

export async function getActiveDestinations(): Promise<Destination[]> {
  return db.destination.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, description: true, coverImage: true, region: true, rating: true, reviewCount: true },
    orderBy: { sortOrder: "asc" },
  });
}

// ── Categories ──────────────────────────────────────────────────────

export async function getActiveCategories(): Promise<Category[]> {
  return db.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, icon: true, color: true },
    orderBy: { sortOrder: "asc" },
  });
}

// ── Wholesale Packages ──────────────────────────────────────────────

function mapPackage(raw: Prisma.WholesalePackageGetPayload<Record<string, never>>): WholesalePackage {
  return {
    ...raw,
    audiences: raw.audiences ?? [],
    coverImage: raw.coverImage ?? null,
    itinerary: raw.itinerary as WholesalePackage["itinerary"],
    paxPricing: raw.paxPricing as WholesalePackage["paxPricing"],
    operatorBreakdown: raw.operatorBreakdown as WholesalePackage["operatorBreakdown"],
  };
}

export async function getActiveWholesalePackages(): Promise<WholesalePackage[]> {
  const rows = await db.wholesalePackage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(mapPackage);
}

export async function getWholesalePackageBySlug(slug: string): Promise<WholesalePackage | null> {
  const raw = await db.wholesalePackage.findUnique({ where: { slug, isActive: true } });
  if (!raw) return null;
  return mapPackage(raw);
}

export async function getRelatedWholesalePackages(
  excludeSlug: string,
  category: string
): Promise<WholesalePackage[]> {
  const rows = await db.wholesalePackage.findMany({
    where: { isActive: true, slug: { not: excludeSlug }, category },
    orderBy: { sortOrder: "asc" },
    take: 3,
  });
  return rows.map(mapPackage);
}

export async function getSiteStats(): Promise<{
  tours: number;
  operators: number;
  destinations: number;
}> {
  const [tours, operators, destinations] = await Promise.all([
    db.tour.count({ where: { status: "published" } }),
    db.operator.count({ where: { status: "active" } }),
    db.destination.count({ where: { isActive: true } }),
  ]);
  return { tours, operators, destinations };
}

export async function getDestinationPackageCounts(): Promise<Record<string, number>> {
  const packages = await db.wholesalePackage.findMany({
    where: { isActive: true },
    select: { destinations: true },
  });
  const counts: Record<string, number> = {};
  for (const pkg of packages) {
    for (const dest of pkg.destinations) {
      const key = dest.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  return counts;
}
