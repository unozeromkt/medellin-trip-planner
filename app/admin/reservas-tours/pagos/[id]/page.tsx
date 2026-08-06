import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, Phone, Mail, Calendar, Users, MessageSquare, CreditCard, Mail as MailIcon, Tag } from "lucide-react";

export const metadata: Metadata = { title: "Detalle de pago | Admin" };

const STATUS_CFG: Record<string, { label: string; className: string }> = {
  pending: { label: "Pago pendiente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { label: "Pagado", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  declined: { label: "Rechazado", className: "bg-red-50 text-red-700 border-red-200" },
  voided: { label: "Anulado", className: "bg-[#F1F3F6] text-[#637489] border-[#E2E8ED]" },
  error: { label: "Error", className: "bg-red-50 text-red-700 border-red-200" },
};

export default async function PagoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await db.tourOrder.findUnique({
    where: { id },
    include: { items: { include: { tour: { select: { title: true, slug: true } } } } },
  });

  if (!order) notFound();

  const cfg = STATUS_CFG[order.status];

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/admin/reservas-tours" className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D]">
        <ArrowLeft className="w-4 h-4" /> Volver a reservas de tours
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">{order.contactName}</h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            Pago en línea (Wompi) ·{" "}
            {new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(
              new Date(order.createdAt)
            )}
          </p>
        </div>
        <span className={`text-xs font-body font-semibold px-3 py-1.5 rounded-full border ${cfg.className}`}>{cfg.label}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5 space-y-3">
          <h2 className="font-heading text-sm font-bold text-[#0D1B3D] uppercase tracking-wide">Contacto</h2>
          <p className="flex items-center gap-2 text-sm font-body text-[#0D1B3D]">
            <Phone className="w-4 h-4 text-[#637489]" /> {order.contactPhone}
          </p>
          {order.contactEmail && (
            <p className="flex items-center gap-2 text-sm font-body text-[#0D1B3D]">
              <Mail className="w-4 h-4 text-[#637489]" /> {order.contactEmail}
            </p>
          )}
          {order.contactDocument && <p className="text-sm font-body text-[#637489]">Documento: {order.contactDocument}</p>}
          {order.travelDate && (
            <p className="flex items-center gap-2 text-sm font-body text-[#0D1B3D]">
              <Calendar className="w-4 h-4 text-[#637489]" />
              {new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(order.travelDate))}
            </p>
          )}
          {order.peopleCount && (
            <p className="flex items-center gap-2 text-sm font-body text-[#0D1B3D]">
              <Users className="w-4 h-4 text-[#637489]" /> {order.peopleCount} personas
            </p>
          )}
          {order.pickup && <p className="text-sm font-body text-[#637489]">Recogida: {order.pickup}</p>}
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5 space-y-3">
          <h2 className="font-heading text-sm font-bold text-[#0D1B3D] uppercase tracking-wide">Tours pagados</h2>
          <ul className="space-y-2">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between text-sm font-body">
                <Link href={`/tours/${i.tour.slug}`} target="_blank" className="text-[#0D1B3D] hover:text-[#2BB7A6] truncate pr-2">
                  {i.tour.title} {i.quantity > 1 && `×${i.quantity}`}
                </Link>
                {i.priceSnapshot && (
                  <span className="text-[#637489] shrink-0">
                    {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
                      i.priceSnapshot
                    )}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[#E2E8ED]">
            <span className="text-[#0D1B3D]">Total pagado</span>
            <span className="text-[#2BB7A6]">
              {new Intl.NumberFormat("es-CO", { style: "currency", currency: order.currency, maximumFractionDigits: 0 }).format(
                order.amountInCents / 100
              )}
            </span>
          </div>
        </div>
      </div>

      {order.message && (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5 space-y-2">
          <h2 className="font-heading text-sm font-bold text-[#0D1B3D] uppercase tracking-wide flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Mensaje del cliente
          </h2>
          <p className="text-sm font-body text-[#637489] italic">&ldquo;{order.message}&rdquo;</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5 space-y-2">
        <h2 className="font-heading text-sm font-bold text-[#0D1B3D] uppercase tracking-wide flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Detalle de la transacción
        </h2>
        <div className="text-xs font-body text-[#637489] space-y-1">
          <p>Referencia: {order.reference}</p>
          {order.wompiTransactionId && <p>ID de transacción Wompi: {order.wompiTransactionId}</p>}
          {order.wompiPaymentMethod && <p>Método: {order.wompiPaymentMethod}</p>}
          {order.paidAt && (
            <p>
              Pagado el:{" "}
              {new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(
                new Date(order.paidAt)
              )}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3 pt-2 border-t border-[#E2E8ED] text-xs font-body">
          <span className={`flex items-center gap-1 ${order.confirmationEmailSentAt ? "text-emerald-700" : "text-[#9DAAB5]"}`}>
            <MailIcon className="w-3.5 h-3.5" /> {order.confirmationEmailSentAt ? "Email enviado" : "Email no enviado"}
          </span>
          <span className={`flex items-center gap-1 ${order.ghlSyncedAt ? "text-emerald-700" : "text-[#9DAAB5]"}`}>
            <Tag className="w-3.5 h-3.5" /> {order.ghlSyncedAt ? "Sincronizado en GHL" : "No sincronizado en GHL"}
          </span>
        </div>
        {order.ghlSyncError && <p className="text-xs font-body text-red-600">GHL: {order.ghlSyncError}</p>}
      </div>
    </div>
  );
}
