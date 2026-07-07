"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminProfile } from "@/lib/auth";

export async function approveAgency(agencyId: string) {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };
  await db.agency.update({
    where: { id: agencyId },
    data: { status: "active", notes: null },
  });
  revalidatePath("/admin/agencias");
}

export async function rejectAgency(agencyId: string, notes: string) {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };
  await db.agency.update({
    where: { id: agencyId },
    data: { status: "suspended", notes: notes || "Solicitud rechazada por el administrador." },
  });
  revalidatePath("/admin/agencias");
}

export async function suspendAgency(agencyId: string) {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };
  await db.agency.update({
    where: { id: agencyId },
    data: { status: "suspended" },
  });
  revalidatePath("/admin/agencias");
}

export async function reactivateAgency(agencyId: string) {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };
  await db.agency.update({
    where: { id: agencyId },
    data: { status: "active", notes: null },
  });
  revalidatePath("/admin/agencias");
}
