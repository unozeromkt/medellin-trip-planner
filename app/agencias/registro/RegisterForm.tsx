"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerAgency } from "./actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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

type FormValues = z.infer<typeof schema>;

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0D1B3D] font-body mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-body">{error}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full h-11 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const result = await registerAgency(values);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    router.push("/agencias/registro/exito");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-body">
          {serverError}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nombre de la agencia" error={errors.name?.message} required>
          <input
            {...register("name")}
            placeholder="Aventuras Colombia SAS"
            className={inputClass}
          />
        </Field>
        <Field label="Nombre del contacto" error={errors.contactName?.message} required>
          <input
            {...register("contactName")}
            placeholder="Juan Pérez"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Correo electrónico" error={errors.email?.message} required>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="contacto@agencia.com"
          className={inputClass}
        />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Teléfono" error={errors.phone?.message}>
          <input
            {...register("phone")}
            placeholder="+57 300 000 0000"
            className={inputClass}
          />
        </Field>
        <Field label="País" error={errors.country?.message}>
          <input
            {...register("country")}
            placeholder="Colombia"
            className={inputClass}
          />
        </Field>
        <Field label="Ciudad" error={errors.city?.message}>
          <input
            {...register("city")}
            placeholder="Bogotá"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="border-t border-[#E2E8ED] pt-5 grid sm:grid-cols-2 gap-4">
        <Field label="Contraseña" error={errors.password?.message} required>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DAAB5] hover:text-[#637489]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
        <Field label="Confirmar contraseña" error={errors.confirmPassword?.message} required>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DAAB5] hover:text-[#637489]"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
      </div>

      <p className="text-xs text-[#637489] font-body">
        Al registrarte aceptas nuestros{" "}
        <a href="/terminos" className="text-[#2BB7A6] hover:underline">
          Términos y condiciones
        </a>{" "}
        y{" "}
        <a href="/privacidad" className="text-[#2BB7A6] hover:underline">
          Política de privacidad
        </a>
        .
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white font-body font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? "Enviando solicitud…" : "Enviar solicitud de registro"}
      </button>
    </form>
  );
}
