import { Suspense } from "react";
import type { Metadata } from "next";
import { ToursContent } from "./ToursContent";
import { getPublishedTours, getActiveCategories, getActiveDestinations } from "@/lib/queries";

const TITLE = "Tours y Experiencias";
const DESCRIPTION =
  "Descubre los mejores tours en Medellín, Guatapé y Antioquia. Filtra por categoría, destino y presupuesto.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/tours",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tours",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function ToursPage() {
  const [tours, categories, destinations] = await Promise.all([
    getPublishedTours(),
    getActiveCategories(),
    getActiveDestinations(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<ToursPageSkeleton />}>
        <ToursContent initialTours={tours} categories={categories} destinations={destinations} />
      </Suspense>
    </div>
  );
}

function ToursPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden">
            <div className="aspect-[16/10] bg-muted animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
