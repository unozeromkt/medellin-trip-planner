import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUserProfile } from "@/lib/auth";

const ADMIN_ROLES = ["admin", "editor", "operator"];

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();
  const navUser =
    profile && ADMIN_ROLES.includes(profile.role)
      ? { name: profile.name, email: profile.email, role: profile.role }
      : null;

  return (
    <>
      <Navbar user={navUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
