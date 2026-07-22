/**
 * Geographic zone within or around Medellín.
 * Used by the AI trip planner to group nearby tours on the same day.
 */
export type TourZone =
  | "norte"          // Bello, Copacabana, San Félix
  | "centro"         // Centro, Laureles, Estadio
  | "sur"            // El Poblado, Envigado, Sabaneta
  | "oriente"        // Rionegro, El Retiro
  | "fuera-medellin" // Guatapé, Santa Fe de Antioquia, Doradal

/** Effort/fitness level required for the tour. */
export type PhysicalIntensity = "low" | "medium" | "high";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
};

export type Destination = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  region?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
};

export type Operator = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
};

export type TourSummary = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  priceFrom?: number | null;
  currency: string;
  durationMinutes?: number | null;
  isFeatured: boolean;
  isOffer: boolean;
  destination: Pick<Destination, "id" | "name" | "slug" | "region">;
  operator: Pick<Operator, "id" | "name" | "slug" | "logoUrl">;
  categories: Pick<Category, "id" | "name" | "slug" | "color">[];
  coverImage?: string | null;
  rating?: number;
  reviewCount?: number;

  // ── AI trip planner fields ──────────────────────────────────────
  /** Times the tour departs (24h format, e.g. "07:00"). */
  departureTimes?: string[];
  /** Estimated time back at meeting point / hotel (24h). */
  returnTime?: string | null;
  /** True when the tour occupies the whole day (≥ 6h or mandatory full-day). */
  isFullDay?: boolean;
  /** Geographic zone — used to group nearby tours on the same day. */
  zone?: TourZone | null;
  /** Physical effort level. */
  physicalIntensity?: PhysicalIntensity | null;
  /** ISO weekdays on which the tour operates: 1 = Mon … 7 = Sun. */
  operatingDays?: number[];
  /** True if hotel/accommodation pickup is included. */
  pickupIncluded?: boolean;
  /** Minimum days in advance the tour must be booked. */
  bookingAdvanceDays?: number | null;
  /**
   * Free-form planning tags used by the AI assistant.
   * Examples: "mañana" | "tarde" | "noche" | "familiar" | "romántico"
   *           | "adrenalina" | "cultural" | "fotográfico" | "acuático"
   *           | "premium" | "privado" | "grupal" | "día-completo"
   */
  tags?: string[];
};

export type TourInitialData = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  coverImage: string | null;
  videoUrl: string | null;
  priceFrom: number | null;
  priceChild: number | null;
  duration: string | null;
  destinationId: string;
  operatorId: string;
  status: "draft" | "pending_review" | "approved" | "published" | "rejected" | "archived";
  isFeatured: boolean;
  includes: string[];
  excludes: string[];
  tourCategories: { categoryId: string }[];
  images: { url: string; sortOrder: number }[];
  itinerary: { title: string; description: string | null; stepNumber: number }[];
  faqs: { question: string; answer: string }[];
  reviews: { authorName: string; rating: number; comment: string | null }[];
};

export type TourDetail = TourSummary & {
  description?: string | null;
  meetingPoint?: string | null;
  capacityMin?: number | null;
  capacityMax?: number | null;
  includes: string[];
  excludes: string[];
  images: { url: string; altText?: string | null; isCover: boolean }[];
  itinerary: {
    stepNumber: number;
    title: string;
    description?: string | null;
    duration?: string | null;
  }[];
  faqs: { question: string; answer: string }[];
  videoUrl?: string | null;
  priceChild?: number | null;
  reviews: {
    id: string;
    authorName: string;
    rating: number;
    comment?: string | null;
    createdAt: Date;
  }[];
};
