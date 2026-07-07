"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

const schema = z
  .object({
    name: z.string().min(2, "Mínimo 2 caracteres"),
    contactName: z.string().min(2, "Mínimo 2 caracteres"),
    email: z.string().email("Correo inválido"),
    phone: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterAgencyInput = z.infer<typeof schema>;

export async function registerAgency(
  data: RegisterAgencyInput
): Promise<{ error?: string }> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Datos inválidos" };
  }

  const { name, contactName, email, phone, country, city, password } =
    parsed.data;

  const existing = await db.agency.findUnique({ where: { email } });
  if (existing) return { error: "Ya existe una cuenta registrada con ese correo." };

  // Create Supabase auth user
  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) return { error: authError.message };

  // Create Agency (pending) and User records
  const agency = await db.agency.create({
    data: {
      name,
      contactName,
      email,
      phone: phone || null,
      country: country || null,
      city: city || null,
      status: "pending",
    },
  });

  await db.user.upsert({
    where: { email },
    update: { role: "agency", agencyId: agency.id },
    create: { email, name: contactName, role: "agency", agencyId: agency.id },
  });

  return {};
}
