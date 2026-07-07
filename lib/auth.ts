import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "editor" | "operator" | "agency" | "customer";
  agencyId: string | null;
  operatorId: string | null;
  operator: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    description: string | null;
    commercialName: string | null;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    websiteUrl: string | null;
    instagramUrl: string | null;
    facebookUrl: string | null;
    certifications: string[];
    status: "pending" | "active" | "suspended" | "inactive";
    commissionType: "percentage" | "fixed";
    commissionValue: number;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  agency: {
    id: string;
    name: string;
    contactName: string | null;
    email: string;
    phone: string | null;
    country: string | null;
    city: string | null;
    websiteUrl: string | null;
    taxId: string | null;
    status: "pending" | "active" | "suspended";
    level: "bronze" | "silver" | "gold" | "platinum";
    commissionPct: number;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const profile = await db.user.findUnique({
    where: { email: user.email },
    include: { agency: true, operator: true },
  });

  if (!profile) return null;

  return profile as UserProfile;
}

/**
 * Guards mutating admin Server Actions. Server Actions are reachable as
 * direct POST endpoints regardless of what the /admin layout renders, so
 * every admin mutation must re-check the role itself rather than relying
 * on page-level access control.
 */
export async function requireAdminProfile(): Promise<UserProfile | null> {
  const profile = await getCurrentUserProfile();
  if (!profile || !["admin", "editor"].includes(profile.role)) return null;
  return profile;
}
