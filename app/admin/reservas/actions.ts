"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminProfile } from "@/lib/auth";

export async function confirmReservation(id: string) {
  if (!(await requireAdminProfile())) return;
  await db.packageReservation.update({ where: { id }, data: { status: "confirmed" } });
  revalidatePath("/admin/reservas");
}

export async function cancelReservation(id: string, adminNotes?: string) {
  if (!(await requireAdminProfile())) return;
  await db.packageReservation.update({
    where: { id },
    data: { status: "cancelled", adminNotes: adminNotes ?? null },
  });
  revalidatePath("/admin/reservas");
}

export async function completeReservation(id: string) {
  if (!(await requireAdminProfile())) return;
  await db.packageReservation.update({ where: { id }, data: { status: "completed" } });
  revalidatePath("/admin/reservas");
}
