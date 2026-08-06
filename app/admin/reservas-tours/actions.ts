"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminProfile } from "@/lib/auth";
import type { LeadStatus } from "@prisma/client";

export async function updateLeadStatus(id: string, status: LeadStatus) {
  if (!(await requireAdminProfile())) return;
  await db.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reservas-tours");
  revalidatePath(`/admin/reservas-tours/leads/${id}`);
}
