import type { Metadata } from "next";
import { ExperienceBuilderPage } from "./ExperienceBuilderPage";
import { getPublishedTours, getActiveCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Constructor de Experiencias",
  description:
    "Combina múltiples tours y crea tu experiencia perfecta en Medellín y Antioquia. Planifica, personaliza y solicita por WhatsApp.",
};

export default async function Page() {
  const [tours, categories] = await Promise.all([
    getPublishedTours(),
    getActiveCategories(),
  ]);

  return <ExperienceBuilderPage tours={tours} categories={categories} />;
}
