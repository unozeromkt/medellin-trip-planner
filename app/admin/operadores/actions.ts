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

const createSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z
    .string()
    .optional()
    .transform((v) => v?.trim() || undefined),
  commercialName: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Correo inválido").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  commissionType: z.enum(["percentage", "fixed"]).default("percentage"),
  commissionValue: z.coerce.number().min(0).default(10),
  operatorEmail: z.string().email("Correo inválido").optional().or(z.literal("")),
});

export type OperatorFormState = { error?: string; success?: boolean; id?: string };

export async function createOperator(
  _prev: OperatorFormState,
  formData: FormData
): Promise<OperatorFormState> {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const d = parsed.data;
  const slug = d.slug || slugify(d.name);

  const existing = await db.operator.findUnique({ where: { slug } });
  if (existing) return { error: "Ya existe un operador con ese slug." };

  const operator = await db.operator.create({
    data: {
      name: d.name,
      slug,
      commercialName: d.commercialName || null,
      contactName: d.contactName || null,
      contactEmail: d.contactEmail || null,
      contactPhone: d.contactPhone || null,
      commissionType: d.commissionType,
      commissionValue: d.commissionValue,
    },
  });

  // Link portal user if email provided
  if (d.operatorEmail) {
    await db.user.updateMany({
      where: { email: d.operatorEmail },
      data: { operatorId: operator.id, role: "operator" },
    });
  }

  revalidatePath("/admin/operadores");
  return { success: true, id: operator.id };
}

const settingsSchema = z.object({
  commissionType: z.enum(["percentage", "fixed"]),
  commissionValue: z.coerce.number().min(0),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Correo inválido").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  websiteUrl: z.string().optional(),
});

export async function updateOperatorSettings(
  id: string,
  _prev: OperatorFormState,
  formData: FormData
): Promise<OperatorFormState> {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const d = parsed.data;
  await db.operator.update({
    where: { id },
    data: {
      commissionType: d.commissionType,
      commissionValue: d.commissionValue,
      contactName: d.contactName || null,
      contactEmail: d.contactEmail || null,
      contactPhone: d.contactPhone || null,
      websiteUrl: d.websiteUrl || null,
    },
  });

  revalidatePath(`/admin/operadores/${id}`);
  revalidatePath("/admin/operadores");
  return { success: true };
}

export async function activateOperator(id: string) {
  if (!(await requireAdminProfile())) return;
  await db.operator.update({ where: { id }, data: { status: "active" } });
  revalidatePath("/admin/operadores");
  revalidatePath(`/admin/operadores/${id}`);
}

export async function suspendOperator(id: string) {
  if (!(await requireAdminProfile())) return;
  await db.operator.update({ where: { id }, data: { status: "suspended" } });
  revalidatePath("/admin/operadores");
  revalidatePath(`/admin/operadores/${id}`);
}

export async function linkUserToOperator(
  operatorId: string,
  _prev: OperatorFormState,
  formData: FormData
): Promise<OperatorFormState> {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const email = (formData.get("email") as string)?.trim();
  if (!email) return { error: "Ingresa un correo" };

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { error: "No existe un usuario con ese correo" };

  await db.user.update({
    where: { email },
    data: { operatorId, role: "operator" },
  });

  revalidatePath(`/admin/operadores/${operatorId}`);
  return { success: true };
}

export async function unlinkUserFromOperator(userId: string, operatorId: string) {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };
  await db.user.update({
    where: { id: userId },
    data: { operatorId: null, role: "customer" },
  });
  revalidatePath(`/admin/operadores/${operatorId}`);
}
