import type { Metadata } from "next";
import { getActiveDestinations, getDestinationTourCounts } from "@/lib/queries";
import { DestinationCard } from "@/components/destinations/DestinationCard";

const TITLE = "Destinos en Antioquia";
const DESCRIPTION =
  "Explora Medellín, Guatapé, Santa Fe de Antioquia, Jardín y más destinos de Antioquia con tours y experiencias verificadas.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/destinos" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/destinos", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function DestinosPage() {
  const [destinations, tourCounts] = await Promise.all([
    getActiveDestinations(),
    getDestinationTourCounts(),
  ]);

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* Hero */}
      <div className="bg-[#0D1B3D] py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-body text-xs font-semibold text-[#2BB7A6] tracking-widest uppercase mb-3">
            Explora Antioquia
          </p>
          <h1 className="font-heading text-4xl font-bold text-white leading-tight">
            Elige tu próximo
            <br />
            <span className="text-[#2BB7A6]">destino</span>
          </h1>
          <p className="font-body text-base text-white/60 mt-4 max-w-xl mx-auto">
            Desde la transformación urbana de Medellín hasta los pueblos más coloridos de Colombia — cada destino
            tiene tours y experiencias verificadas esperando por ti.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              tourCount={tourCounts[destination.slug] ?? 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
