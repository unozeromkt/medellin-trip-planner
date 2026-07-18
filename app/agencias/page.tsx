import type { Metadata } from "next";
import { AgencyHero } from "@/components/agency/AgencyHero";
import { PartnerBrands } from "@/components/agency/PartnerBrands";
import { WholesalePackages } from "@/components/agency/WholesalePackages";
import { AgencyDestinations } from "@/components/agency/AgencyDestinations";
import { AgencyLevels } from "@/components/agency/AgencyLevels";
import { WhyPartner } from "@/components/agency/WhyPartner";
import { AgencyProcess } from "@/components/agency/AgencyProcess";
import { AgencyRegisterCTA } from "@/components/agency/AgencyRegisterCTA";
import { getActiveWholesalePackages, getActiveDestinations, getDestinationPackageCounts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Portal Mayorista | Medellín Trip Planner",
  description:
    "Accede al catálogo mayorista de experiencias de Colombia. Tarifas netas, sin intermediarios, comisiones del 18 al 25% garantizadas para agencias de viaje.",
  robots: { index: false, follow: false },
};

export default async function AgenciasPage() {
  const [packages, destinations, packageCounts] = await Promise.all([
    getActiveWholesalePackages(),
    getActiveDestinations(),
    getDestinationPackageCounts(),
  ]);

  return (
    <>
      <AgencyHero />
      <PartnerBrands />
      <WholesalePackages packages={packages} />
      <AgencyDestinations destinations={destinations} packageCounts={packageCounts} />
      <AgencyLevels />
      <WhyPartner />
      <AgencyProcess />
      <AgencyRegisterCTA />
    </>
  );
}
