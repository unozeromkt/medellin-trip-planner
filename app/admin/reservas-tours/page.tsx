import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { MessageCircle, CreditCard, ClipboardList, ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Reservas de tours | Admin" };

type PaymentFilter = "pendiente" | "pagado" | "fallido";

type Row = {
  id: string;
  kind: "lead" | "pago";
  createdAt: Date;
  contactName: string;
  contactPhone: string | null;
  tourTitles: string;
  peopleCount: number | null;
  travelDate: Date | null;
  paymentBadge: { label: string; className: string };
  paymentFilter: PaymentFilter;
  methodLabel: string;
  detailHref: string;
};

const ORDER_PAYMENT_BADGE: Record<string, { label: string; className: string; filter: PaymentFilter }> = {
  pending: { label: "Pago pendiente", className: "bg-amber-50 text-amber-700 border-amber-200", filter: "pendiente" },
  approved: { label: "Pagado", className: "bg-emerald-50 text-emerald-700 border-emerald-200", filter: "pagado" },
  declined: { label: "Pago rechazado", className: "bg-red-50 text-red-700 border-red-200", filter: "fallido" },
  voided: { label: "Pago anulado", className: "bg-[#F1F3F6] text-[#637489] border-[#E2E8ED]", filter: "fallido" },
  error: { label: "Error de pago", className: "bg-red-50 text-red-700 border-red-200", filter: "fallido" },
};

const WOMPI_METHOD_LABEL: Record<string, string> = {
  CARD: "Tarjeta",
  PSE: "PSE",
  NEQUI: "Nequi",
  BANCOLOMBIA_TRANSFER: "Transferencia Bancolombia",
};

export default async function AdminReservasToursPage({
  searchParams,
}: {
  searchParams: Promise<{ pago?: string }>;
}) {
  const { pago } = await searchParams;
  const filter = (["pendiente", "pagado", "fallido"].includes(pago ?? "") ? pago : undefined) as
    | PaymentFilter
    | undefined;

  const [leads, orders] = await Promise.all([
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 150,
      include: { leadTours: { include: { tour: { select: { title: true } } } } },
    }),
    db.tourOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: 150,
      include: { items: { include: { tour: { select: { title: true } } } } },
    }),
  ]);

  const leadRows: Row[] = leads.map((l) => ({
    id: l.id,
    kind: "lead",
    createdAt: l.createdAt,
    contactName: l.name || "Sin nombre",
    contactPhone: l.phone,
    tourTitles: l.leadTours.map((lt) => lt.tour.title).join(", ") || "—",
    peopleCount: l.peopleCount,
    travelDate: l.travelDate,
    paymentBadge: { label: "Pendiente (WhatsApp)", className: "bg-amber-50 text-amber-700 border-amber-200" },
    paymentFilter: "pendiente",
    methodLabel: "Solicitud por WhatsApp",
    detailHref: `/admin/reservas-tours/leads/${l.id}`,
  }));

  const orderRows: Row[] = orders.map((o) => {
    const cfg = ORDER_PAYMENT_BADGE[o.status];
    return {
      id: o.id,
      kind: "pago",
      createdAt: o.createdAt,
      contactName: o.contactName,
      contactPhone: o.contactPhone,
      tourTitles: o.items.map((i) => (i.quantity > 1 ? `${i.tour.title} ×${i.quantity}` : i.tour.title)).join(", "),
      peopleCount: o.peopleCount,
      travelDate: o.travelDate,
      paymentBadge: { label: cfg.label, className: cfg.className },
      paymentFilter: cfg.filter,
      methodLabel: o.wompiPaymentMethod
        ? `Wompi · ${WOMPI_METHOD_LABEL[o.wompiPaymentMethod] ?? o.wompiPaymentMethod}`
        : "Pago en línea (Wompi)",
      detailHref: `/admin/reservas-tours/pagos/${o.id}`,
    };
  });

  const allRows = [...leadRows, ...orderRows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const rows = filter ? allRows.filter((r) => r.paymentFilter === filter) : allRows;

  const counts = {
    total: allRows.length,
    pendiente: allRows.filter((r) => r.paymentFilter === "pendiente").length,
    pagado: allRows.filter((r) => r.paymentFilter === "pagado").length,
    fallido: allRows.filter((r) => r.paymentFilter === "fallido").length,
  };

  const TABS: { label: string; value?: PaymentFilter; count: number }[] = [
    { label: "Todas", value: undefined, count: counts.total },
    { label: "Pago pendiente", value: "pendiente", count: counts.pendiente },
    { label: "Pagadas", value: "pagado", count: counts.pagado },
    { label: "Pago fallido", value: "fallido", count: counts.fallido },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Reservas de tours</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Solicitudes por WhatsApp y pagos en línea de tours individuales
        </p>
      </div>

      <div className="flex gap-1 bg-white border border-[#E2E8ED] rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(({ label, value, count }) => {
          const isActive = filter === value;
          return (
            <Link
              key={label}
              href={value ? `/admin/reservas-tours?pago=${value}` : "/admin/reservas-tours"}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                isActive ? "bg-[#0D1B3D] text-white" : "text-[#637489] hover:text-[#0D1B3D] hover:bg-[#F1F3F6]"
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#F1F3F6] text-[#637489]"}`}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
          <ClipboardList className="w-10 h-10 text-[#9DAAB5] mx-auto mb-3" />
          <p className="font-body text-sm text-[#637489]">No hay reservas con este filtro.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-[#E2E8ED] bg-[#F8FAFC] text-left text-xs uppercase tracking-wide text-[#637489]">
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Tour(s)</th>
                  <th className="px-4 py-3 font-semibold">Personas / Viaje</th>
                  <th className="px-4 py-3 font-semibold">Pago</th>
                  <th className="px-4 py-3 font-semibold">Origen</th>
                  <th className="px-4 py-3 font-semibold sr-only">Ver</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.kind}-${r.id}`} className="border-b border-[#E2E8ED] last:border-0 hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 whitespace-nowrap text-[#637489]">
                      {new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(
                        new Date(r.createdAt)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#0D1B3D]">{r.contactName}</div>
                      {r.contactPhone && <div className="text-xs text-[#637489]">{r.contactPhone}</div>}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-[#0D1B3D]" title={r.tourTitles}>
                      {r.tourTitles}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#637489]">
                      {r.peopleCount ? `${r.peopleCount} pax` : "—"}
                      {r.travelDate && (
                        <>
                          {" · "}
                          {new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(new Date(r.travelDate))}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${r.paymentBadge.className}`}>
                        {r.paymentBadge.label}
                      </span>
                      <div className="text-[11px] text-[#9DAAB5] mt-1">{r.methodLabel}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#637489]">
                        {r.kind === "lead" ? (
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5 text-[#2BB7A6]" />
                        )}
                        {r.kind === "lead" ? "WhatsApp" : "Pago en línea"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={r.detailHref}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80"
                      >
                        Ver detalle <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
