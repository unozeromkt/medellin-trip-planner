import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CreditCard, Mail, Tag } from "lucide-react";

export const metadata: Metadata = { title: "Pagos con Wompi | Admin" };

type OStatus = "pending" | "approved" | "declined" | "voided" | "error";

const STATUS_CFG: Record<OStatus, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { label: "Aprobado", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  declined: { label: "Rechazado", className: "bg-red-50 text-red-700 border-red-200" },
  voided: { label: "Anulado", className: "bg-[#F1F3F6] text-[#637489] border-[#E2E8ED]" },
  error: { label: "Error", className: "bg-red-50 text-red-700 border-red-200" },
};

export default async function AdminPagosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = (["pending", "approved", "declined", "voided", "error"].includes(status ?? "")
    ? status
    : undefined) as OStatus | undefined;

  const [orders, counts] = await Promise.all([
    db.tourOrder.findMany({
      where: filter ? { status: filter } : undefined,
      orderBy: { createdAt: "desc" },
      include: { tour: { select: { title: true, slug: true } } },
      take: 100,
    }),
    Promise.all([
      db.tourOrder.count(),
      db.tourOrder.count({ where: { status: "pending" } }),
      db.tourOrder.count({ where: { status: "approved" } }),
      db.tourOrder.count({ where: { status: "declined" } }),
      db.tourOrder.count({ where: { status: "voided" } }),
      db.tourOrder.count({ where: { status: "error" } }),
    ]),
  ]);

  const [total, pending, approved, declined, voided, error] = counts;

  const TABS = [
    { label: "Todos", value: undefined, count: total },
    { label: "Pendientes", value: "pending" as OStatus, count: pending },
    { label: "Aprobados", value: "approved" as OStatus, count: approved },
    { label: "Rechazados", value: "declined" as OStatus, count: declined },
    { label: "Anulados", value: "voided" as OStatus, count: voided },
    { label: "Error", value: "error" as OStatus, count: error },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Pagos con Wompi</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Órdenes de pago en línea de tours individuales (sandbox)
        </p>
      </div>

      <div className="flex gap-1 bg-white border border-[#E2E8ED] rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(({ label, value, count }) => {
          const isActive = filter === value;
          return (
            <a
              key={label}
              href={value ? `/admin/pagos?status=${value}` : "/admin/pagos"}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                isActive ? "bg-[#0D1B3D] text-white" : "text-[#637489] hover:text-[#0D1B3D] hover:bg-[#F1F3F6]"
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#F1F3F6] text-[#637489]"}`}>
                {count}
              </span>
            </a>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
          <CreditCard className="w-10 h-10 text-[#9DAAB5] mx-auto mb-3" />
          <p className="font-body text-sm text-[#637489]">
            No hay pagos{filter ? ` con estado "${STATUS_CFG[filter].label.toLowerCase()}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const cfg = STATUS_CFG[o.status as OStatus];
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${cfg.className}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs font-body text-[#637489]">
                        {new Intl.DateTimeFormat("es-CO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(o.createdAt))}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#0D1B3D]">{o.tour.title}</h3>
                    <p className="text-sm font-body text-[#637489] mt-0.5">
                      <span className="font-semibold text-[#0D1B3D]">{o.contactName}</span> · {o.contactPhone}
                      {o.contactEmail ? ` · ${o.contactEmail}` : ""}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm font-body text-[#637489]">
                      <span className="text-[#2BB7A6] font-semibold">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: o.currency,
                          maximumFractionDigits: 0,
                        }).format(o.amountInCents / 100)}
                      </span>
                      {o.peopleCount && <span>{o.peopleCount} pax</span>}
                      {o.travelDate && (
                        <span>
                          Viaje:{" "}
                          <strong className="text-[#0D1B3D]">
                            {new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(
                              new Date(o.travelDate)
                            )}
                          </strong>
                        </span>
                      )}
                      <span>Ref: {o.reference}</span>
                    </div>
                    {o.message && (
                      <p className="mt-2 text-sm font-body text-[#637489] bg-[#F8FAFC] rounded-xl px-3 py-2 border border-[#E2E8ED]">
                        &ldquo;{o.message}&rdquo;
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-body text-[#637489]">
                      {o.wompiTransactionId && <span>Wompi ID: {o.wompiTransactionId}</span>}
                      {o.wompiPaymentMethod && <span>Método: {o.wompiPaymentMethod}</span>}
                      {o.confirmationEmailSentAt && (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Mail className="w-3.5 h-3.5" /> Email enviado
                        </span>
                      )}
                      {o.ghlSyncedAt && (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Tag className="w-3.5 h-3.5" /> Sincronizado en GHL
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
