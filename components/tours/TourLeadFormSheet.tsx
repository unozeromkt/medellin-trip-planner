"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Loader2, CheckCircle2 } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrency } from "@/lib/currency-context";
import { formatDuration } from "@/lib/mock-data";
import { buildWhatsAppMessage } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  phone: z.string().min(7, "Ingresa un número válido"),
  email: z.string().optional(),
  travelDate: z.string().min(1, "Selecciona una fecha"),
  peopleCount: z.number().min(1, "Mínimo 1 persona").max(100),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface TourLeadFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: {
    id: string;
    slug: string;
    title: string;
    priceFrom?: number | null;
    durationMinutes?: number | null;
  };
}

export function TourLeadFormSheet({ open, onOpenChange, tour }: TourLeadFormSheetProps) {
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
    defaultValues: { peopleCount: 2 },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          tours: [
            {
              id: tour.id,
              title: tour.title,
              priceFrom: tour.priceFrom,
              durationMinutes: tour.durationMinutes,
            },
          ],
          totalPrice: tour.priceFrom ?? undefined,
          source: "tour-detail",
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
      travelDate: values.travelDate,
      peopleCount: values.peopleCount,
      selectedTours: [
        {
          title: tour.title,
          priceFrom: tour.priceFrom ?? undefined,
          duration: tour.durationMinutes ? formatDuration(tour.durationMinutes) : undefined,
        },
      ],
      source: `/tours/${tour.slug}`,
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

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto px-6">
        {submitted ? (
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
                    selectedTours: [{ title: tour.title, priceFrom: tour.priceFrom ?? undefined }],
                    source: `/tours/${tour.slug}`,
                  }).whatsappUrl;
                  window.open(wUrl, "_blank");
                }}
              >
                haz clic aquí
              </button>
              .
            </p>
            <Button variant="outline" onClick={handleClose} className="rounded-full">
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <SheetHeader className="pb-4">
              <SheetTitle className="font-heading text-xl flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Reservar experiencia
              </SheetTitle>
              <SheetDescription>
                Completa tus datos y enviamos todos los detalles por WhatsApp.
              </SheetDescription>
            </SheetHeader>

            <div className="bg-muted/50 rounded-xl p-4 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium truncate flex-1 pr-2">{tour.title}</span>
                {tour.priceFrom && (
                  <span className="text-primary font-semibold shrink-0">
                    {formatPrice(tour.priceFrom)}
                  </span>
                )}
              </div>
              {tour.durationMinutes && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatDuration(tour.durationMinutes)} · precio estimado por persona
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <Input
                  id="phone"
                  placeholder="+57 300 000 0000"
                  className="rounded-xl"
                  {...register("phone")}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="rounded-xl"
                  {...register("email")}
                />
              </div>

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
