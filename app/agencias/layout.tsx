import { AgencyNavbar } from "@/components/agency/AgencyNavbar";
import { Footer } from "@/components/layout/Footer";

export default function AgenciasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AgencyNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
