// Type definitions for wholesale packages — data lives in the database (WholesalePackage table)

export type PaxPricing = {
  label: string;
  netRatePP: number | null;
  commission: number | null;
  note?: string;
};

export type OperatorInPackage = {
  name: string;
  experience: string;
};

export type ItineraryDay = {
  day: number;
  title: string;
  activities: string[];
};

export type WholesalePackage = {
  id: string;
  slug: string;
  name: string;
  duration: string;
  durationDays: number;
  category: string;
  destinations: string[];
  operatorCount: number;
  experiences: string[];
  netRate: number;
  commission: number;
  minPax: number;
  maxPax: number;
  highlight: boolean;
  badge: string | null;
  coverImage: string | null;
  audiences: string[];
  description: string;
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  paxPricing: PaxPricing[];
  operatorBreakdown: OperatorInPackage[];
  cancelPolicy: string;
};
