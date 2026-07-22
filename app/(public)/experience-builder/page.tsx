import type { Metadata } from "next";
import { ExperienceBuilderPage } from "./ExperienceBuilderPage";
import { getPublishedTours, getActiveCategories } from "@/lib/queries";

const TITLE = "Constructor de Experiencias";
const DESCRIPTION =
  "Combina múltiples tours y crea tu experiencia perfecta en Medellín y Antioquia. Planifica, personaliza y solicita por WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/experience-builder",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/experience-builder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function Page() {
  const [tours, categories] = await Promise.all([
    getPublishedTours(),
    getActiveCategories(),
  ]);

  return <ExperienceBuilderPage tours={tours} categories={categories} />;
}
