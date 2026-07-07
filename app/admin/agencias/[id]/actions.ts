"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminProfile } from "@/lib/auth";

const settingsSchema = z.object({
  commissionPct: z.coerce
    .number()
    .min(0, "Mínimo 0%")
    .max(50, "Máximo 50%"),
  level: z.enum(["bronze", "silver", "gold", "platinum"]),
  notes: z.string().max(1000).optional(),
  websiteUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  taxId: z.string().max(30).optional(),
});

export type SettingsFormState = {
  success?: boolean;
  error?: string;
};

export async function updateAgencySettings(
  agencyId: string,
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const raw = {
    commissionPct: formData.get("commissionPct"),
    level: formData.get("level"),
    notes: formData.get("notes") ?? "",
    websiteUrl: formData.get("websiteUrl") ?? "",
    taxId: formData.get("taxId") ?? "",
  };

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { error: msg };
  }

  const { commissionPct, level, notes, websiteUrl, taxId } = parsed.data;

  await db.agency.update({
    where: { id: agencyId },
    data: {
      commissionPct,
      level,
      notes: notes || null,
      websiteUrl: websiteUrl || null,
      taxId: taxId || null,
    },
  });

  revalidatePath(`/admin/agencias/${agencyId}`);
  revalidatePath("/admin/agencias");
  return { success: true };
}
