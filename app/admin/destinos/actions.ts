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

const destinationSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z
    .string()
    .optional()
    .transform((v) => v?.trim() || undefined),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  region: z.string().optional(),
});

export type DestinationFormState = { error?: string; success?: boolean; id?: string };

export async function createDestination(
  _prev: DestinationFormState,
  formData: FormData
): Promise<DestinationFormState> {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = destinationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const d = parsed.data;
  const slug = d.slug || slugify(d.name);

  const existing = await db.destination.findUnique({ where: { slug } });
  if (existing) return { error: "Ya existe un destino con ese slug." };

  const destination = await db.destination.create({
    data: {
      name: d.name,
      slug,
      description: d.description || null,
      coverImage: d.coverImage || null,
      region: d.region || null,
    },
  });

  revalidatePath("/admin/destinos");
  return { success: true, id: destination.id };
}

export async function updateDestination(
  id: string,
  _prev: DestinationFormState,
  formData: FormData
): Promise<DestinationFormState> {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = destinationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const d = parsed.data;
  const slug = d.slug || slugify(d.name);

  const existing = await db.destination.findUnique({ where: { slug } });
  if (existing && existing.id !== id) return { error: "Ya existe un destino con ese slug." };

  await db.destination.update({
    where: { id },
    data: {
      name: d.name,
      slug,
      description: d.description || null,
      coverImage: d.coverImage || null,
      region: d.region || null,
    },
  });

  revalidatePath("/admin/destinos");
  revalidatePath(`/admin/destinos/${id}`);
  return { success: true, id };
}

export async function toggleDestinationActive(id: string, isActive: boolean) {
  if (!(await requireAdminProfile())) return;
  await db.destination.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/destinos");
}

export async function deleteDestination(id: string): Promise<{ error?: string }> {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const toursCount = await db.tour.count({ where: { destinationId: id } });
  if (toursCount > 0) {
    return { error: "No se puede eliminar: hay tours asociados a este destino." };
  }

  await db.destination.delete({ where: { id } });
  revalidatePath("/admin/destinos");
  return {};
}
