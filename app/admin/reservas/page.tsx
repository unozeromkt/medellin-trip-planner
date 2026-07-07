import type { Metadata } from "next";
import { db } from "@/lib/db";
import { confirmReservation, cancelReservation, completeReservation } from "./actions";
import { CalendarDays, CheckCircle, XCircle, Flag, Clock3 } from "lucide-react";

export const metadata: Metadata = { title: "Reservas de agencias | Admin" };

type RStatus = "pending" | "confirmed" | "cancelled" | "completed";

const STATUS_CFG: Record<RStatus, { label: string; className: string }> = {
  pending:   { label: "Pendiente",   className: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmada",  className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelada",   className: "bg-red-50 text-red-700 border-red-200" },
  completed: { label: "Completada",  className: "bg-blue-50 text-blue-700 border-blue-200" },
};

export default async function AdminReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = (["pending", "confirmed", "cancelled", "completed"].includes(status ?? "")
    ? status : undefined) as RStatus | undefined;

  const [reservations, counts] = await Promise.all([
    db.packageReservation.findMany({
      where: filter ? { status: filter } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        agency: { select: { name: true, email: true } },
        package: { select: { name: true, slug: true, commission: true } },
      },
    }),
    Promise.all([
      db.packageReservation.count(),
      db.packageReservation.count({ where: { status: "pending" } }),
      db.packageReservation.count({ where: { status: "confirmed" } }),
      db.packageReservation.count({ where: { status: "cancelled" } }),
      db.packageReservation.count({ where: { status: "completed" } }),
    ]),
  ]);

  const [total, pending, confirmed, cancelled, completed] = counts;

  const TABS = [
    { label: "Todas", value: undefined, count: total },
    { label: "Pendientes", value: "pending" as RStatus, count: pending },
    { label: "Confirmadas", value: "confirmed" as RStatus, count: confirmed },
    { label: "Completadas", value: "completed" as RStatus, count: completed },
    { label: "Canceladas", value: "cancelled" as RStatus, count: cancelled },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Reservas de agencias</h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            Solicitudes de paquetes mayoristas recibidas de las agencias
          </p>
        </div>
        {pending > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-body font-semibold px-3 py-1.5 rounded-full">
            <Clock3 className="w-3.5 h-3.5" />
            {pending} pendiente{pending !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#E2E8ED] rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(({ label, value, count }) => {
          const isActive = filter === value;
          return (
            <a key={label} href={value ? `/admin/reservas?status=${value}` : "/admin/reservas"}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${isActive ? "bg-[#0D1B3D] text-white" : "text-[#637489] hover:text-[#0D1B3D] hover:bg-[#F1F3F6]"}`}>
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#F1F3F6] text-[#637489]"}`}>{count}</span>
            </a>
          );
        })}
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
          <CalendarDays className="w-10 h-10 text-[#9DAAB5] mx-auto mb-3" />
          <p className="font-body text-sm text-[#637489]">No hay reservas{filter ? ` con estado "${STATUS_CFG[filter].label.toLowerCase()}"` : ""}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => {
            const st = r.status as RStatus;
            const cfg = STATUS_CFG[st];
            const commissionAmount = r.totalNet ? r.totalNet * (r.package.commission / 100) : null;
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${cfg.className}`}>{cfg.label}</span>
                      <span className="text-xs font-body text-[#637489]">
                        {new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(r.createdAt))}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#0D1B3D]">{r.package.name}</h3>
                    <p className="text-sm font-body text-[#637489] mt-0.5">
                      <span className="font-semibold text-[#0D1B3D]">{r.agency.name}</span> · {r.agency.email}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm font-body text-[#637489]">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Viaje: <strong className="text-[#0D1B3D]">{new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(r.travelDate))}</strong>
                      </span>
                      <span>{r.paxCount} pax</span>
                      {r.totalNet && (
                        <span className="text-[#2BB7A6] font-semibold">
                          Net: ${r.totalNet.toLocaleString("es-CO")} COP
                          {commissionAmount && ` · Comisión: $${commissionAmount.toLocaleString("es-CO")}`}
                        </span>
                      )}
                    </div>
                    {r.message && (
                      <p className="mt-2 text-sm font-body text-[#637489] bg-[#F8FAFC] rounded-xl px-3 py-2 border border-[#E2E8ED]">
                        &ldquo;{r.message}&rdquo;
                      </p>
                    )}
                    {r.adminNotes && (
                      <p className="mt-1 text-xs font-body text-red-600">Nota admin: {r.adminNotes}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {st === "pending" && (
                      <>
                        <form action={async () => { "use server"; await confirmReservation(r.id); }}>
                          <button type="submit" className="flex items-center gap-1.5 text-sm font-body font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-colors w-full justify-center">
                            <CheckCircle className="w-4 h-4" /> Confirmar
                          </button>
                        </form>
                        <form action={async () => { "use server"; await cancelReservation(r.id); }}>
                          <button type="submit" className="flex items-center gap-1.5 text-sm font-body font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl transition-colors w-full justify-center">
                            <XCircle className="w-4 h-4" /> Cancelar
                          </button>
                        </form>
                      </>
                    )}
                    {st === "confirmed" && (
                      <form action={async () => { "use server"; await completeReservation(r.id); }}>
                        <button type="submit" className="flex items-center gap-1.5 text-sm font-body font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl transition-colors w-full justify-center">
                          <Flag className="w-4 h-4" /> Marcar completada
                        </button>
                      </form>
                    )}
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
