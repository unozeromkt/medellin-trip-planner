"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminProfile } from "@/lib/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function generateUniqueReferralCode(name: string, excludeAgencyId: string) {
  const base = slugify(name) || "agencia";
  let code = base;
  let suffix = 2;
  while (
    await db.agency.findFirst({
      where: { referralCode: code, NOT: { id: excludeAgencyId } },
      select: { id: true },
    })
  ) {
    code = `${base}-${suffix}`;
    suffix += 1;
  }
  return code;
}

const settingsSchema = z.object({
  commissionPct: z.coerce
    .number()
    .min(0, "Mínimo 0%")
    .max(50, "Máximo 50%"),
  level: z.enum(["bronze", "silver", "gold", "platinum"]),
  notes: z.string().max(1000).optional(),
  websiteUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  taxId: z.string().max(30).optional(),
  referralCode: z
    .string()
    .max(40)
    .regex(/^[a-z0-9-]+$/i, "Solo letras, números y guiones")
    .optional()
    .or(z.literal("")),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
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
    referralCode: formData.get("referralCode") ?? "",
    logoUrl: formData.get("logoUrl") ?? "",
  };

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { error: msg };
  }

  const { commissionPct, level, notes, websiteUrl, taxId, logoUrl } = parsed.data;
  const referralCode = parsed.data.referralCode ? parsed.data.referralCode.toLowerCase() : "";

  if (referralCode) {
    const existing = await db.agency.findFirst({
      where: { referralCode, NOT: { id: agencyId } },
      select: { id: true },
    });
    if (existing) return { error: "Ese código de afiliado ya está en uso." };
  }

  await db.agency.update({
    where: { id: agencyId },
    data: {
      commissionPct,
      level,
      notes: notes || null,
      websiteUrl: websiteUrl || null,
      taxId: taxId || null,
      referralCode: referralCode || null,
      logoUrl: logoUrl || null,
    },
  });

  revalidatePath(`/admin/agencias/${agencyId}`);
  revalidatePath("/admin/agencias");
  return { success: true };
}

export async function regenerateReferralCode(agencyId: string): Promise<SettingsFormState> {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const agency = await db.agency.findUnique({ where: { id: agencyId }, select: { name: true } });
  if (!agency) return { error: "Agencia no encontrada" };

  const referralCode = await generateUniqueReferralCode(agency.name, agencyId);

  await db.agency.update({ where: { id: agencyId }, data: { referralCode } });

  revalidatePath(`/admin/agencias/${agencyId}`);
  revalidatePath("/admin/agencias");
  return { success: true };
}
