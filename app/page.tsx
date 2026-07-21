import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSearch } from "@/components/marketing/HeroSearch";
import { FeaturedCollections } from "@/components/marketing/FeaturedCollections";
import { FeaturedDestinations } from "@/components/marketing/FeaturedDestinations";
import { FeaturedTours } from "@/components/marketing/FeaturedTours";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { WhatsAppCTABanner } from "@/components/marketing/WhatsAppCTABanner";
import { OperatorBanner } from "@/components/marketing/OperatorBanner";
import { getPublishedTours, getActiveDestinations, getActiveCategories } from "@/lib/queries";
import { getCurrentUserProfile } from "@/lib/auth";

const ADMIN_ROLES = ["admin", "editor", "operator"];

export default async function HomePage() {
  const [tours, destinations, categories, profile] = await Promise.all([
    getPublishedTours(),
    getActiveDestinations(),
    getActiveCategories(),
    getCurrentUserProfile(),
  ]);

  const navUser =
    profile && ADMIN_ROLES.includes(profile.role)
      ? { name: profile.name, email: profile.email, role: profile.role }
      : null;

  return (
    <>
      <Navbar user={navUser} />
      <main>
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
        <OperatorBanner />
      </main>
      <Footer />
      <Script
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id="6a3cb1d823af83a13c022f61"
        strategy="afterInteractive"
      />
    </>
  );
}
