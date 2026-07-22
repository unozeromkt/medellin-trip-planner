"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUserProfile } from "@/lib/auth";

const GROUP_LANGUAGES = ["es", "en", "pt", "other"] as const;
const PAYMENT_METHODS = ["bancolombia", "nequi", "llave", "pse"] as const;

const schema = z.object({
  packageId: z.string().min(1),
  travelDate: z.string().min(1, "Selecciona una fecha de viaje"),
  paxCount: z.coerce.number().min(1, "Mínimo 1 pasajero"),
  contactName: z.string().min(2, "Nombre requerido"),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Correo electrónico inválido"),
  message: z.string().max(500).optional(),
  groupLanguage: z.enum(GROUP_LANGUAGES).optional().or(z.literal("")),
  paymentMethod: z.enum(PAYMENT_METHODS),
  paymentProofUrl: z.string().url("Debes adjuntar el comprobante de pago"),
  paymentRef: z.string().optional(),
});

const passengerSchema = z.object({
  fullName: z.string().min(2, "Nombre del pasajero requerido"),
  documentId: z.string().min(3, "Identificación del pasajero requerida"),
  phoneCountryCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Correo del líder inválido").optional().or(z.literal("")),
});

export type ReserveState = { error?: string; success?: boolean };

function parsePassengers(formData: FormData, paxCount: number) {
  const passengers: {
    fullName: string;
    documentId: string;
    isLeader: boolean;
    phoneCountryCode: string | null;
    phone: string | null;
    email: string | null;
  }[] = [];

  for (let i = 0; i < paxCount; i++) {
    const raw = {
      fullName: String(formData.get(`passenger_${i}_fullName`) ?? ""),
      documentId: String(formData.get(`passenger_${i}_documentId`) ?? ""),
      phoneCountryCode: String(formData.get(`passenger_${i}_phoneCountryCode`) ?? ""),
      phone: String(formData.get(`passenger_${i}_phone`) ?? ""),
      email: String(formData.get(`passenger_${i}_email`) ?? ""),
    };
    const parsed = passengerSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: `Pasajero ${i + 1}: ${parsed.error.issues[0]?.message ?? "datos inválidos"}` };
    }
    const isLeader = i === 0;
    if (isLeader && (!parsed.data.phone || !parsed.data.email)) {
      return { error: "El líder del grupo debe incluir teléfono y correo electrónico." };
    }
    passengers.push({
      fullName: parsed.data.fullName,
      documentId: parsed.data.documentId,
      isLeader,
      phoneCountryCode: parsed.data.phoneCountryCode || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
    });
  }

  return { passengers };
}

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
    groupLanguage,
    paymentMethod,
    paymentProofUrl,
    paymentRef,
  } = parsed.data;

  const pkg = await db.wholesalePackage.findUnique({
    where: { id: packageId, isActive: true },
    select: { id: true, netRate: true, minPax: true, maxPax: true },
  });
  if (!pkg) return { error: "El paquete no está disponible." };
  if (paxCount < pkg.minPax) return { error: `Mínimo ${pkg.minPax} pasajeros para este paquete.` };
  if (paxCount > pkg.maxPax) return { error: `Máximo ${pkg.maxPax} pasajeros para este paquete.` };

  const passengerResult = parsePassengers(formData, paxCount);
  if ("error" in passengerResult) return { error: passengerResult.error };

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
      groupLanguage: groupLanguage || null,
      message: message || null,
      paymentMethod,
      paymentProofUrl,
      paymentRef: paymentRef || null,
      totalNet,
      status: "pending",
      passengers: { create: passengerResult.passengers },
    },
  });

  revalidatePath("/agency/reservas");
  return { success: true };
}

export async function updateReservation(
  _prev: ReserveState,
  formData: FormData
): Promise<ReserveState> {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "agency" || !profile.agencyId) {
    return { error: "No tienes permiso para editar esta reserva." };
  }

  const reservationId = String(formData.get("reservationId") ?? "");
  if (!reservationId) return { error: "Reserva inválida." };

  const existing = await db.packageReservation.findUnique({
    where: { id: reservationId },
    select: { agencyId: true, status: true, packageId: true },
  });
  if (!existing || existing.agencyId !== profile.agencyId) {
    return { error: "No tienes permiso para editar esta reserva." };
  }
  if (existing.status !== "pending") {
    return { error: "Solo puedes editar reservas pendientes." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const {
    travelDate,
    paxCount,
    contactName,
    contactPhone,
    contactEmail,
    message,
    groupLanguage,
    paymentMethod,
    paymentProofUrl,
    paymentRef,
  } = parsed.data;

  const pkg = await db.wholesalePackage.findUnique({
    where: { id: existing.packageId, isActive: true },
    select: { id: true, netRate: true, minPax: true, maxPax: true },
  });
  if (!pkg) return { error: "El paquete no está disponible." };
  if (paxCount < pkg.minPax) return { error: `Mínimo ${pkg.minPax} pasajeros para este paquete.` };
  if (paxCount > pkg.maxPax) return { error: `Máximo ${pkg.maxPax} pasajeros para este paquete.` };

  const passengerResult = parsePassengers(formData, paxCount);
  if ("error" in passengerResult) return { error: passengerResult.error };

  const totalNet = pkg.netRate * paxCount;

  await db.$transaction([
    db.passenger.deleteMany({ where: { reservationId } }),
    db.packageReservation.update({
      where: { id: reservationId },
      data: {
        travelDate: new Date(travelDate),
        paxCount,
        contactName,
        contactPhone: contactPhone || null,
        contactEmail,
        groupLanguage: groupLanguage || null,
        message: message || null,
        paymentMethod,
        paymentProofUrl,
        paymentRef: paymentRef || null,
        totalNet,
        passengers: { create: passengerResult.passengers },
      },
    }),
  ]);

  revalidatePath("/agency/reservas");
  return { success: true };
}
