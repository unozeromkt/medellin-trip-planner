import type { Metadata } from "next";
import { ExperienceBuilderPage } from "./ExperienceBuilderPage";

export const metadata: Metadata = {
  title: "Constructor de Experiencias",
  description:
    "Combina múltiples tours y crea tu experiencia perfecta en Medellín y Antioquia. Planifica, personaliza y solicita por WhatsApp.",
};

export default function Page() {
  return <ExperienceBuilderPage />;
}
