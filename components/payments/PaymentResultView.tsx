"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock3 } from "lucide-react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppMessage } from "@/lib/whatsapp";

export interface OrderResult {
  reference: string;
  status: "pending" | "approved" | "declined" | "voided" | "error";
  amountInCents: number;
  currency: string;
  contactName: string;
  travelDate: string | null;
  peopleCount: number | null;
  tour: { title: string; slug: string };
}

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

const STATUS_CONFIG = {
  approved: {
    icon: CheckCircle2,
    color: "text-primary",
    bg: "bg-primary/10",
    title: "¡Pago confirmado!",
    description: "Tu reserva quedó pagada. Te enviamos un correo con los detalles y nuestro equipo te contactará por WhatsApp.",
  },
  pending: {
    icon: Clock3,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Estamos confirmando tu pago",
    description: "Esto puede tardar unos segundos. No cierres ni recargues esta página.",
  },
  declined: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    title: "El pago fue rechazado",
    description: "Tu banco o método de pago rechazó la transacción. Puedes intentar de nuevo o reservar por WhatsApp.",
  },
  voided: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    title: "El pago fue anulado",
    description: "La transacción fue anulada. Puedes intentar de nuevo o reservar por WhatsApp.",
  },
  error: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    title: "Ocurrió un error con el pago",
    description: "No pudimos procesar la transacción. Puedes intentar de nuevo o reservar por WhatsApp.",
  },
} as const;

function formatAmount(amountInCents: number, currency: string) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    amountInCents / 100
  );
}

export function PaymentResultView({ initialOrder }: { initialOrder: OrderResult }) {
  const [order, setOrder] = useState(initialOrder);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (order.status !== "pending" || attempts >= MAX_POLL_ATTEMPTS) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/payments/wompi/order/${order.reference}`);
        if (res.ok) {
          const { order: fresh } = await res.json();
          setOrder(fresh);
        }
      } finally {
        setAttempts((a) => a + 1);
      }
    }, POLL_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [order.status, order.reference, attempts]);

  const cfg = STATUS_CONFIG[order.status];
  const Icon = cfg.icon;
  const showWhatsappFallback = order.status !== "approved" && order.status !== "pending";

  const whatsappUrl = buildWhatsAppMessage({
    name: order.contactName,
    selectedTours: [{ title: order.tour.title }],
    source: `/pago/resultado (ref ${order.reference})`,
  }).whatsappUrl;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className={`w-16 h-16 rounded-full ${cfg.bg} flex items-center justify-center mx-auto mb-5`}>
        <Icon className={`h-8 w-8 ${cfg.color}`} />
      </div>
      <h1 className="font-heading font-bold text-2xl text-foreground mb-2">{cfg.title}</h1>
      <p className="text-muted-foreground text-sm mb-6">{cfg.description}</p>

      <div className="bg-muted/50 rounded-xl p-4 text-left text-sm space-y-1.5 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tour</span>
          <span className="font-medium text-foreground">{order.tour.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Referencia</span>
          <span className="font-medium text-foreground">{order.reference}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-semibold text-primary">{formatAmount(order.amountInCents, order.currency)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {showWhatsappFallback && (
          <Button
            className="bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold rounded-xl gap-2"
            render={
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo size={18} weight="fill" />
                Reservar por WhatsApp
              </a>
            }
          />
        )}
        <Button variant="outline" className="rounded-xl" render={<Link href={`/tours/${order.tour.slug}`}>Volver al tour</Link>} />
      </div>
    </div>
  );
}
