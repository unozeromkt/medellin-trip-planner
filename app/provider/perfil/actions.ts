"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUserProfile } from "@/lib/auth";

const operatorProfileSchema = z.object({
  description: z.string().optional(),
  commercialName: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Correo inválido").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  websiteUrl: z
    .string()
    .optional()
    .refine((v) => !v || v.startsWith("http"), { message: "URL debe comenzar con http://" }),
  instagramUrl: z
    .string()
    .optional()
    .refine((v) => !v || v.startsWith("http"), { message: "URL de Instagram inválida" }),
  facebookUrl: z
    .string()
    .optional()
    .refine((v) => !v || v.startsWith("http"), { message: "URL de Facebook inválida" }),
});

export type OperatorProfileState = { error?: string; success?: boolean };

export async function updateOperatorProfile(
  operatorId: string,
  _prev: OperatorProfileState,
  formData: FormData
): Promise<OperatorProfileState> {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "operator" || profile.operatorId !== operatorId) {
    return { error: "No autorizado" };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = operatorProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const d = parsed.data;

  await db.operator.update({
    where: { id: operatorId },
    data: {
      description: d.description || null,
      commercialName: d.commercialName || null,
      contactName: d.contactName || null,
      contactEmail: d.contactEmail || null,
      contactPhone: d.contactPhone || null,
      websiteUrl: d.websiteUrl || null,
      instagramUrl: d.instagramUrl || null,
      facebookUrl: d.facebookUrl || null,
    },
  });

  revalidatePath("/provider/perfil");
  revalidatePath("/provider");
  return { success: true };
}
