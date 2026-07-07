"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminProfile } from "@/lib/auth";
import type { ItineraryDay, PaxPricing, OperatorInPackage } from "@/lib/wholesale-packages";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const packageSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones").optional(),
  duration: z.string().min(1, "Requerido"),
  durationDays: z.coerce.number().min(1),
  category: z.string().min(1, "Requerido"),
  destinations: z.string().min(1, "Al menos un destino"),
  netRate: z.coerce.number().min(0),
  commission: z.coerce.number().min(0).max(100),
  minPax: z.coerce.number().min(1),
  maxPax: z.coerce.number().min(1),
  highlight: z.coerce.boolean().default(false),
  badge: z.string().optional(),
  coverImage: z.string().optional(),
  audiences: z.string().optional(),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  operatorCount: z.coerce.number().min(0).default(0),
  experiences: z.string().optional(),
  included: z.string().optional(),
  excluded: z.string().optional(),
  cancelPolicy: z.string().min(1, "Requerido"),
  isActive: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
  // JSON fields come as serialized strings from the client
  itinerary: z.string().optional(),
  paxPricing: z.string().optional(),
  operatorBreakdown: z.string().optional(),
});

export async function createPackage(_prev: { error?: string }, formData: FormData) {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = packageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const d = parsed.data;
  const slug = d.slug || slugify(d.name);

  const existing = await db.wholesalePackage.findUnique({ where: { slug } });
  if (existing) return { error: "Ya existe un paquete con ese slug." };

  let itinerary: ItineraryDay[] = [];
  let paxPricing: PaxPricing[] = [];
  let operatorBreakdown: OperatorInPackage[] = [];

  try {
    if (d.itinerary) itinerary = JSON.parse(d.itinerary);
    if (d.paxPricing) paxPricing = JSON.parse(d.paxPricing);
    if (d.operatorBreakdown) operatorBreakdown = JSON.parse(d.operatorBreakdown);
  } catch {
    return { error: "Error al procesar itinerario o precios." };
  }

  const toLines = (v?: string) =>
    (v ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

  await db.wholesalePackage.create({
    data: {
      slug,
      name: d.name,
      duration: d.duration,
      durationDays: d.durationDays,
      category: d.category,
      destinations: toLines(d.destinations),
      operatorCount: d.operatorCount,
      experiences: toLines(d.experiences),
      netRate: d.netRate,
      commission: d.commission,
      minPax: d.minPax,
      maxPax: d.maxPax,
      highlight: d.highlight,
      badge: d.badge || null,
      coverImage: d.coverImage || null,
      audiences: JSON.parse(d.audiences || "[]") as string[],
      description: d.description,
      itinerary,
      included: toLines(d.included),
      excluded: toLines(d.excluded),
      paxPricing,
      operatorBreakdown,
      cancelPolicy: d.cancelPolicy,
      isActive: d.isActive,
      sortOrder: d.sortOrder,
    },
  });

  revalidatePath("/admin/paquetes");
  return { success: true, slug };
}

export async function togglePackageActive(id: string, isActive: boolean) {
  if (!(await requireAdminProfile())) return;
  await db.wholesalePackage.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/paquetes");
}

export async function togglePackageHighlight(id: string, highlight: boolean) {
  if (!(await requireAdminProfile())) return;
  await db.wholesalePackage.update({ where: { id }, data: { highlight } });
  revalidatePath("/admin/paquetes");
}

export async function deletePackage(id: string) {
  if (!(await requireAdminProfile())) return;
  await db.wholesalePackage.delete({ where: { id } });
  revalidatePath("/admin/paquetes");
}

export async function updatePackage(
  id: string,
  _prev: { error?: string },
  formData: FormData
) {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = packageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const d = parsed.data;
  const slug = d.slug || slugify(d.name);

  const existing = await db.wholesalePackage.findUnique({ where: { slug } });
  if (existing && existing.id !== id) return { error: "Ya existe otro paquete con ese slug." };

  let itinerary: ItineraryDay[] = [];
  let paxPricing: PaxPricing[] = [];
  let operatorBreakdown: OperatorInPackage[] = [];

  try {
    if (d.itinerary) itinerary = JSON.parse(d.itinerary);
    if (d.paxPricing) paxPricing = JSON.parse(d.paxPricing);
    if (d.operatorBreakdown) operatorBreakdown = JSON.parse(d.operatorBreakdown);
  } catch {
    return { error: "Error al procesar itinerario o precios." };
  }

  const toLines = (v?: string) =>
    (v ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

  await db.wholesalePackage.update({
    where: { id },
    data: {
      slug,
      name: d.name,
      duration: d.duration,
      durationDays: d.durationDays,
      category: d.category,
      destinations: toLines(d.destinations),
      operatorCount: d.operatorCount,
      experiences: toLines(d.experiences),
      netRate: d.netRate,
      commission: d.commission,
      minPax: d.minPax,
      maxPax: d.maxPax,
      highlight: d.highlight,
      badge: d.badge || null,
      coverImage: d.coverImage || null,
      audiences: JSON.parse(d.audiences || "[]") as string[],
      description: d.description,
      itinerary,
      included: toLines(d.included),
      excluded: toLines(d.excluded),
      paxPricing,
      operatorBreakdown,
      cancelPolicy: d.cancelPolicy,
      isActive: d.isActive,
      sortOrder: d.sortOrder,
    },
  });

  revalidatePath("/admin/paquetes");
  revalidatePath(`/admin/paquetes/${id}/editar`);
  return { success: true, slug };
}
