"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  contactName: z.string().min(2, "Nombre requerido (mínimo 2 caracteres)"),
  agencyName: z.string().min(2, "Nombre de agencia requerido"),
  email: z.string().email("Ingresa un email válido"),
  phone: z.string().min(7, "Teléfono requerido (mínimo 7 dígitos)"),
  country: z.string().min(1, "País requerido"),
});

type FormValues = z.infer<typeof schema>;

const perks = [
  "Sin cuota de membresía",
  "Acceso en menos de 24 horas",
  "Comisiones del 18 al 25% garantizadas",
  "Materiales de venta incluidos",
];

export function AgencyRegisterCTA() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    // Save lead to DB (graceful degradation if DB is unavailable)
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${data.contactName} — ${data.agencyName}`,
          phone: data.phone,
          email: data.email,
          travelDate: new Date().toISOString().split("T")[0],
          peopleCount: 1,
          source: "portal-agencias",
          message: `Agencia: ${data.agencyName} | País: ${data.country} | Solicita acceso mayorista`,
          tours: [],
        }),
      });
    } catch {
      // Continue — follow same pattern as experience builder
    }

    // Build WhatsApp message
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";
    const message = [
      `Hola, soy *${data.contactName}* de la agencia *${data.agencyName}* (${data.country}).`,
      ``,
      `Estoy interesado/a en acceder al *catálogo mayorista* de Medellín Trip Planner.`,
      ``,
      `📧 Email: ${data.email}`,
      `📱 Teléfono: ${data.phone}`,
      ``,
      `¿Podrían contactarme para iniciar el proceso de registro de agencia?`,
    ].join("\n");

    setSubmitted(true);
    setIsLoading(false);

    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section id="registro" className="bg-[#2BB7A6] py-20 lg:py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #0D1B3D 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-body text-white/70 text-sm font-semibold tracking-widest uppercase mb-3">
              Únete a la red
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              Empieza a vender Colombia
              <br />
              desde mañana
            </h2>
            <p className="font-body text-white/80 text-lg leading-relaxed mb-8">
              Regístrate ahora y obtén acceso al catálogo mayorista completo, tarifas
              netas y soporte comercial dedicado. Sin compromisos de volumen.
            </p>

            <ul className="space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 font-body text-white">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  {perk}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#0D1B3D]/20">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#2BB7A6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9 text-[#2BB7A6]" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#0D1B3D] mb-2">
                    ¡Solicitud enviada!
                  </h3>
                  <p className="font-body text-[#637489] text-sm leading-relaxed">
                    Te redirigimos a WhatsApp. Nuestro equipo te contactará
                    en menos de 24 horas para activar tu acceso mayorista.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#0D1B3D] mb-1">
                      Solicitar acceso mayorista
                    </h3>
                    <p className="font-body text-sm text-[#637489] mb-5">
                      Sin costo. Activación en menos de 24 horas.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-body text-sm font-medium text-[#0D1B3D] mb-1.5 block">
                        Tu nombre
                      </Label>
                      <Input
                        {...register("contactName")}
                        placeholder="María García"
                        className="rounded-xl border-[#E9EEF4] h-11 focus-visible:ring-[#2BB7A6] focus-visible:border-[#2BB7A6]"
                      />
                      {errors.contactName && (
                        <p className="text-red-500 text-xs mt-1 font-body">
                          {errors.contactName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="font-body text-sm font-medium text-[#0D1B3D] mb-1.5 block">
                        Nombre de la agencia
                      </Label>
                      <Input
                        {...register("agencyName")}
                        placeholder="Viajes Colombia S.A.S."
                        className="rounded-xl border-[#E9EEF4] h-11 focus-visible:ring-[#2BB7A6] focus-visible:border-[#2BB7A6]"
                      />
                      {errors.agencyName && (
                        <p className="text-red-500 text-xs mt-1 font-body">
                          {errors.agencyName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="font-body text-sm font-medium text-[#0D1B3D] mb-1.5 block">
                      Email corporativo
                    </Label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="contacto@miagencia.com"
                      className="rounded-xl border-[#E9EEF4] h-11 focus-visible:ring-[#2BB7A6] focus-visible:border-[#2BB7A6]"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-body text-sm font-medium text-[#0D1B3D] mb-1.5 block">
                        Teléfono / WhatsApp
                      </Label>
                      <Input
                        {...register("phone")}
                        placeholder="+57 300 000 0000"
                        className="rounded-xl border-[#E9EEF4] h-11 focus-visible:ring-[#2BB7A6] focus-visible:border-[#2BB7A6]"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 font-body">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="font-body text-sm font-medium text-[#0D1B3D] mb-1.5 block">
                        País
                      </Label>
                      <Input
                        {...register("country")}
                        placeholder="Colombia"
                        className="rounded-xl border-[#E9EEF4] h-11 focus-visible:ring-[#2BB7A6] focus-visible:border-[#2BB7A6]"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1 font-body">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0D1B3D] hover:bg-[#0D1B3D]/90 text-white font-semibold h-12 rounded-xl text-base mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Procesando...
                      </span>
                    ) : (
                      "Solicitar acceso mayorista →"
                    )}
                  </Button>

                  <p className="font-body text-xs text-[#637489] text-center pt-1">
                    Al enviar serás redirigido a WhatsApp para confirmar tu solicitud.
                    Sin costo de membresía.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
