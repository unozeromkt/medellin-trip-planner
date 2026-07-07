import { HeroSearch } from "@/components/marketing/HeroSearch";
import { FeaturedCollections } from "@/components/marketing/FeaturedCollections";
import { FeaturedDestinations } from "@/components/marketing/FeaturedDestinations";
import { FeaturedTours } from "@/components/marketing/FeaturedTours";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { WhatsAppCTABanner } from "@/components/marketing/WhatsAppCTABanner";
import { AiTripAssistant } from "@/components/ai/AiTripAssistant";
import { getPublishedTours, getActiveDestinations, getActiveCategories } from "@/lib/queries";

export const metadata = {
  title: "Medellín Trip Planner — Asistente IA (Demo)",
  robots: { index: false },
};

export default async function AiDemoPage() {
  const [tours, destinations, categories] = await Promise.all([
    getPublishedTours(),
    getActiveDestinations(),
    getActiveCategories(),
  ]);

  return (
    <>
      {/* Demo banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 text-center font-body text-sm text-primary">
        <span className="font-semibold">Demo — Asistente IA</span>
        {" · "}El widget flotante en la esquina inferior derecha está conectado a Claude.
      </div>

      <HeroSearch destinations={destinations} categories={categories} />
      <FeaturedCollections />
      <div className="bg-[#F7F9FC]">
        <div className="container mx-auto px-4">
          <FeaturedDestinations destinations={destinations} />
        </div>
      </div>
      <FeaturedTours tours={tours} />
      <HowItWorks />
      <WhatsAppCTABanner />

      <AiTripAssistant />
    </>
  );
}
