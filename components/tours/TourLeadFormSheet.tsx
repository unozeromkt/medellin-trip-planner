"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Loader2, CheckCircle2, CreditCard } from "lucide-react";
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
import { openWompiCheckout } from "@/lib/wompi-client";

const PICKUP_OPTIONS = [
  { value: "no", label: "No, no necesito recogida" },
  { value: "poblado", label: "Sí, recogerme en El Poblado" },
  { value: "laureles", label: "Sí, recogerme en Laureles" },
] as const;

const PICKUP_LABELS: Record<string, string> = Object.fromEntries(
  PICKUP_OPTIONS.map((o) => [o.value, o.label])
);

const PAYMENT_OPTIONS = [
  { value: "efectivo", label: "Efectivo en USD o COP (al momento del tour)" },
  { value: "tarjeta", label: "Tarjeta débito o crédito (+5% comisión bancaria adicional)" },
] as const;

const PAYMENT_LABELS: Record<string, string> = Object.fromEntries(
  PAYMENT_OPTIONS.map((o) => [o.value, o.label])
);

function formatAdditionalInfo(values: {
  pickup: string;
  paymentMethod: string;
  contactDocument: string;
}) {
  return [
    `Recogida en hotel: ${PICKUP_LABELS[values.pickup]}`,
    `Método de pago: ${PAYMENT_LABELS[values.paymentMethod]}`,
    `Documento de contacto: ${values.contactDocument}`,
  ].join(" | ");
}

const schema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  phone: z.string().min(7, "Ingresa un número válido"),
  email: z.string().optional(),
  travelDate: z.string().min(1, "Selecciona una fecha"),
  peopleCount: z.number().min(1, "Mínimo 1 persona").max(100),
  pickup: z.enum(["no", "poblado", "laureles"], { message: "Selecciona una opción" }),
  paymentMethod: z.enum(["efectivo", "tarjeta"], { message: "Selecciona un método de pago" }),
  contactDocument: z.string().min(3, "Ingresa el número de documento"),
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
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payingOnline, setPayingOnline] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { peopleCount: 2 },
  });

  async function onPayOnline(values: FormValues) {
    setPaymentError(null);
    setPayingOnline(true);
    try {
      const res = await fetch("/api/payments/wompi/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          peopleCount: values.peopleCount,
          travelDate: values.travelDate,
          contactName: values.name,
          contactPhone: values.phone,
          contactEmail: values.email || undefined,
          contactDocument: values.contactDocument,
          pickup: values.pickup,
          message: values.message,
          pageUrl: window.location.href,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const detail = body?.error || body?.issues?.[0]?.message;
        throw new Error(detail ? `Error al crear la orden: ${detail}` : `Error al crear la orden (HTTP ${res.status})`);
      }

      const order = await res.json();
      const result = await openWompiCheckout(order);

      if (result.transaction) {
        router.push(`/pago/resultado?ref=${order.reference}`);
        onOpenChange(false);
      }
    } catch (err) {
      const detail = err instanceof Error ? err.message : "Error desconocido";
      setPaymentError(`No pudimos iniciar el pago en línea (${detail}). Intenta de nuevo o reserva por WhatsApp.`);
    } finally {
      setPayingOnline(false);
    }
  }

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const additionalInfo = formatAdditionalInfo(values);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          additionalInfo,
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
      additionalInfo,
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
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto px-6">
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                <div className="space-y-1.5 min-w-0">
                  <Label htmlFor="travelDate">
                    Fecha tentativa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="travelDate"
                    type="date"
                    className="rounded-xl w-full"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("travelDate")}
                  />
                  {errors.travelDate && (
                    <p className="text-xs text-destructive">{errors.travelDate.message}</p>
                  )}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <Label htmlFor="peopleCount">
                    Personas <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="peopleCount"
                    type="number"
                    min={1}
                    max={100}
                    className="rounded-xl w-full"
                    {...register("peopleCount", { valueAsNumber: true })}
                  />
                  {errors.peopleCount && (
                    <p className="text-xs text-destructive">{errors.peopleCount.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pickup">
                  ¿Desea ser recogido en su hotel? <span className="text-destructive">*</span>
                </Label>
                <select
                  id="pickup"
                  defaultValue=""
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  {...register("pickup")}
                >
                  <option value="" disabled>
                    Seleccionar
                  </option>
                  {PICKUP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Recogida disponible solo en El Poblado y Laureles.
                </p>
                {errors.pickup && <p className="text-xs text-destructive">{errors.pickup.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="paymentMethod">
                  Método de pago <span className="text-destructive">*</span>
                </Label>
                <select
                  id="paymentMethod"
                  defaultValue=""
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  {...register("paymentMethod")}
                >
                  <option value="" disabled>
                    Seleccionar
                  </option>
                  {PAYMENT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactDocument">
                  Documento de la persona de contacto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactDocument"
                  placeholder="Cédula o pasaporte"
                  className="rounded-xl"
                  {...register("contactDocument")}
                />
                {errors.contactDocument && (
                  <p className="text-xs text-destructive">{errors.contactDocument.message}</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">
                Nota: todos nuestros tours finalizan en el parque de El Poblado.
              </p>

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
                disabled={loading || payingOnline}
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

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex-1 h-px bg-border" />
                o paga en línea ahora
                <span className="flex-1 h-px bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={loading || payingOnline}
                onClick={handleSubmit(onPayOnline)}
                className="w-full border-primary/30 text-primary hover:bg-primary/5 font-semibold rounded-xl py-3 gap-2"
              >
                {payingOnline ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Abriendo pasarela de pago...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pagar ahora con tarjeta / PSE
                  </>
                )}
              </Button>
              {paymentError && <p className="text-xs text-destructive text-center">{paymentError}</p>}

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
