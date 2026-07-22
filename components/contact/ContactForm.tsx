"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildWhatsAppMessage } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  phone: z.string().min(7, "Ingresa un número válido"),
  email: z.string().optional(),
  message: z.string().min(5, "Cuéntanos brevemente qué necesitas"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          tours: [],
          source: "contact-page",
          pageUrl: window.location.href,
        }),
      });
    } catch {
      // API unavailable — proceed to WhatsApp anyway
    }

    const { whatsappUrl } = buildWhatsAppMessage({
      name: values.name,
      phone: values.phone,
      email: values.email ?? undefined,
      message: values.message,
      selectedTours: [],
      source: "/contacto",
    });

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    setLoading(false);
    reset();
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white rounded-2xl border border-[#E2E8ED]">
        <div className="w-16 h-16 rounded-full bg-[#2BB7A6]/10 flex items-center justify-center mb-5">
          <CheckCircle2 className="h-8 w-8 text-[#2BB7A6]" />
        </div>
        <h3 className="font-heading font-bold text-xl text-[#0D1B3D] mb-2">
          ¡Listo! Redirigiendo a WhatsApp
        </h3>
        <p className="text-[#637489] text-sm mb-6 max-w-sm leading-relaxed">
          Tu mensaje fue enviado. Nuestro equipo te contactará pronto.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-full">
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white rounded-2xl border border-[#E2E8ED] p-6">
      <div className="space-y-1.5">
        <Label htmlFor="name">
          Nombre completo <span className="text-destructive">*</span>
        </Label>
        <Input id="name" placeholder="Tu nombre" className="rounded-xl" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">
          WhatsApp / Teléfono <span className="text-destructive">*</span>
        </Label>
        <Input id="phone" placeholder="+57 300 000 0000" className="rounded-xl" {...register("phone")} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email (opcional)</Label>
        <Input id="email" type="email" placeholder="tu@email.com" className="rounded-xl" {...register("email")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">
          ¿En qué te podemos ayudar? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Cuéntanos qué experiencia buscas, fechas tentativas o cualquier pregunta…"
          className="rounded-xl resize-none"
          rows={4}
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-semibold rounded-xl py-3 gap-2 mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar mensaje por WhatsApp
          </>
        )}
      </Button>

      <p className="text-xs text-[#9DAAB5] text-center">Tus datos no serán compartidos con terceros.</p>
    </form>
  );
}
