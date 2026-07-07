"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUserProfile } from "@/lib/auth";

const profileSchema = z.object({
  contactName: z.string().min(2, "Mínimo 2 caracteres"),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  websiteUrl: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || v.startsWith("http"), {
      message: "La URL debe comenzar con http:// o https://",
    }),
  taxId: z.string().optional(),
});

export type ProfileState = { error?: string; success?: boolean };

export async function updateAgencyProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "agency" || !profile.agencyId) {
    return { error: "No autorizado" };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const d = parsed.data;

  await db.agency.update({
    where: { id: profile.agencyId },
    data: {
      contactName: d.contactName || null,
      phone: d.phone || null,
      city: d.city || null,
      country: d.country || null,
      websiteUrl: d.websiteUrl || null,
      taxId: d.taxId || null,
    },
  });

  revalidatePath("/agency/perfil");
  revalidatePath("/agency");
  return { success: true };
}
