import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSearch } from "@/components/marketing/HeroSearch";
import { FeaturedCollections } from "@/components/marketing/FeaturedCollections";
import { BrandValues } from "@/components/marketing/BrandValues";
import { FeaturedDestinations } from "@/components/marketing/FeaturedDestinations";
import { FeaturedTours } from "@/components/marketing/FeaturedTours";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { WhatsAppCTABanner } from "@/components/marketing/WhatsAppCTABanner";
import { mockTours, mockDestinations } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSearch />
        <FeaturedCollections />
        <div className="bg-[#F7F9FC]">
          <div className="container mx-auto px-4">
            <FeaturedDestinations destinations={mockDestinations} />
          </div>
        </div>
        <FeaturedTours tours={mockTours} />
        {/* <BrandValues /> */}
        <HowItWorks />
        <WhatsAppCTABanner />
      </main>
      <Footer />
    </>
  );
}
