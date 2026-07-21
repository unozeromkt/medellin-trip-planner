"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Loader2, CheckCircle2, Layers } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useExperienceBuilder } from "@/lib/experience-builder-context";
import { useCurrency } from "@/lib/currency-context";
import { formatDuration } from "@/lib/mock-data";
import { buildWhatsAppMessage } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  phone: z.string().min(7, "Ingresa un número válido"),
  email: z.string().optional(),
  travelDate: z.string().min(1, "Selecciona una fecha"),
  peopleCount: z.number().min(1, "Mínimo 1 persona").max(100),
  budget: z.string().optional(),
  language: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
  { value: "fr", label: "Français" },
];

const BUDGETS = [
  { value: "hasta-500k", label: "Hasta $500.000 COP" },
  { value: "500k-1m", label: "$500.000 – $1.000.000 COP" },
  { value: "1m-2m", label: "$1.000.000 – $2.000.000 COP" },
  { value: "mas-2m", label: "Más de $2.000.000 COP" },
];

interface LeadFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadFormSheet({ open, onOpenChange }: LeadFormSheetProps) {
  const { selectedTours, totalPrice, totalDurationMinutes, clearAll } = useExperienceBuilder();
  const { formatPrice } = useCurrency();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { language: "es", peopleCount: 2 },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      // Save lead via API
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          tours: selectedTours.map((t) => ({
            id: t.id,
            title: t.title,
            priceFrom: t.priceFrom,
            durationMinutes: t.durationMinutes,
          })),
          totalPrice,
          source: "experience-builder",
          pageUrl: window.location.href,
        }),
      });
    } catch {
      // API unavailable — proceed to WhatsApp anyway
    }

    // Generate WhatsApp URL and open
    const { whatsappUrl } = buildWhatsAppMessage({
      name: values.name,
      phone: values.phone,
      email: values.email ?? undefined,
      travelDate: values.travelDate,
      peopleCount: values.peopleCount,
      budget: values.budget,
      language: LANGUAGES.find((l) => l.value === values.language)?.label,
      selectedTours: selectedTours.map((t) => ({
        title: t.title,
        priceFrom: t.priceFrom ?? undefined,
        duration: t.durationMinutes ? formatDuration(t.durationMinutes) : undefined,
      })),
      source: "experience-builder",
    });

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    setLoading(false);
  }

  function handleClose() {
    onOpenChange(false);
    if (submitted) {
      reset();
      setSubmitted(false);
    }
  }

  function handleStartOver() {
    clearAll();
    reset();
    setSubmitted(false);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto px-6"
      >
        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-xl text-foreground mb-2">
              ¡Listo! Redirigiendo a WhatsApp
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm leading-relaxed">
              Tu solicitud fue enviada. Nuestro equipo te contactará pronto. Si WhatsApp no abrió,{" "}
              <button
                className="text-primary underline"
                onClick={() => {
                  const wUrl = buildWhatsAppMessage({
                    selectedTours: selectedTours.map((t) => ({
                      title: t.title,
                      priceFrom: t.priceFrom ?? undefined,
                    })),
                  }).whatsappUrl;
                  window.open(wUrl, "_blank");
                }}
              >
                haz clic aquí
              </button>
              .
            </p>
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="rounded-full"
            >
              Planear otra experiencia
            </Button>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <SheetHeader className="pb-4">
              <SheetTitle className="font-heading text-xl flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Personaliza tu experiencia
              </SheetTitle>
              <SheetDescription>
                Completa tus datos y enviamos todos los detalles por WhatsApp.
              </SheetDescription>
            </SheetHeader>

            {/* Selected tours summary */}
            <div className="bg-muted/50 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Tu selección
              </p>
              <div className="space-y-1">
                {selectedTours.map((t) => (
                  <div key={t.id} className="flex justify-between text-sm">
                    <span className="text-foreground truncate flex-1 pr-2">{t.title}</span>
                    <span className="text-muted-foreground shrink-0">
                      {t.priceFrom ? formatPrice(t.priceFrom) : "—"}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-foreground">
                  Total ({formatDuration(totalDurationMinutes)})
                </span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Precio estimado · puede variar según disponibilidad
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Nombre completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  className="rounded-xl"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  WhatsApp / Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="+57 300 000 0000"
                  className="rounded-xl"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="rounded-xl"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Date + People (2 col) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="travelDate">
                    Fecha tentativa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="travelDate"
                    type="date"
                    className="rounded-xl"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("travelDate")}
                  />
                  {errors.travelDate && (
                    <p className="text-xs text-destructive">{errors.travelDate.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="peopleCount">
                    Personas <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="peopleCount"
                    type="number"
                    min={1}
                    max={100}
                    className="rounded-xl"
                    {...register("peopleCount", { valueAsNumber: true })}
                  />
                  {errors.peopleCount && (
                    <p className="text-xs text-destructive">{errors.peopleCount.message}</p>
                  )}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <Label htmlFor="budget">Presupuesto total (opcional)</Label>
                <select
                  id="budget"
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  {...register("budget")}
                >
                  <option value="">Seleccionar rango</option>
                  {BUDGETS.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <Label htmlFor="language">Idioma preferido</Label>
                <select
                  id="language"
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  {...register("language")}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message">Mensaje adicional (opcional)</Label>
                <Textarea
                  id="message"
                  placeholder="¿Tienes alguna preferencia especial, restricción o pregunta?"
                  className="rounded-xl resize-none"
                  rows={3}
                  {...register("message")}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold rounded-xl py-3 gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    Enviar solicitud por WhatsApp
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Tus datos no serán compartidos con terceros.
              </p>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
