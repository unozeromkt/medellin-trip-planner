"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUserProfile } from "@/lib/auth";

const GROUP_LANGUAGES = ["es", "en", "pt", "other"] as const;

const schema = z.object({
  packageId: z.string().min(1),
  travelDate: z.string().min(1, "Selecciona una fecha de viaje"),
  paxCount: z.coerce.number().min(1, "Mínimo 1 pasajero"),
  contactName: z.string().min(2, "Nombre requerido"),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Correo electrónico inválido"),
  message: z.string().max(500).optional(),
  passengerName: z.string().max(200).optional(),
  groupLanguage: z.enum(GROUP_LANGUAGES).optional().or(z.literal("")),
});

export type ReserveState = { error?: string; success?: boolean };

export async function submitReservation(
  _prev: ReserveState,
  formData: FormData
): Promise<ReserveState> {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "agency" || !profile.agencyId) {
    return { error: "No tienes permiso para realizar reservas." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const {
    packageId,
    travelDate,
    paxCount,
    contactName,
    contactPhone,
    contactEmail,
    message,
    passengerName,
    groupLanguage,
  } = parsed.data;

  const pkg = await db.wholesalePackage.findUnique({
    where: { id: packageId, isActive: true },
    select: { id: true, netRate: true, minPax: true, maxPax: true },
  });
  if (!pkg) return { error: "El paquete no está disponible." };
  if (paxCount < pkg.minPax) return { error: `Mínimo ${pkg.minPax} pasajeros para este paquete.` };
  if (paxCount > pkg.maxPax) return { error: `Máximo ${pkg.maxPax} pasajeros para este paquete.` };

  const totalNet = pkg.netRate * paxCount;

  await db.packageReservation.create({
    data: {
      agencyId: profile.agencyId,
      packageId,
      travelDate: new Date(travelDate),
      paxCount,
      contactName,
      contactPhone: contactPhone || null,
      contactEmail,
      passengerName: passengerName || null,
      groupLanguage: groupLanguage || null,
      message: message || null,
      totalNet,
      status: "pending",
    },
  });

  revalidatePath("/agency/reservas");
  return { success: true };
}
