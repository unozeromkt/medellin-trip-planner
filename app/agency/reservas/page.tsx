import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { CalendarDays, Package, ArrowRight, Clock3, Users, Pencil } from "lucide-react";
import { getPaymentMethod } from "@/lib/payment-info";

export const metadata: Metadata = { title: "Mis reservas | Portal Agencias" };

type RStatus = "pending" | "confirmed" | "cancelled" | "completed";

const STATUS_CFG: Record<RStatus, { label: string; className: string }> = {
  pending:   { label: "Pendiente de confirmación", className: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmada",               className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelada",                className: "bg-red-50 text-red-700 border-red-200" },
  completed: { label: "Completada",               className: "bg-blue-50 text-blue-700 border-blue-200" },
};

export default async function AgencyReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; updated?: string }>;
}) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "agency" || !profile.agencyId) redirect("/login");

  const { new: isNew, updated: isUpdated } = await searchParams;

  const reservations = await db.packageReservation.findMany({
    where: { agencyId: profile.agencyId },
    orderBy: { createdAt: "desc" },
    include: {
      package: {
        select: { name: true, slug: true, duration: true, category: true, commission: true },
      },
      passengers: { where: { isLeader: true }, take: 1 },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Mis reservas</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Historial de solicitudes de paquetes mayoristas
        </p>
      </div>

      {isNew === "1" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <Clock3 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-body text-sm font-semibold text-emerald-800">Solicitud enviada correctamente</p>
            <p className="font-body text-xs text-emerald-700 mt-0.5">
              Recibirás confirmación en 24–48 horas. Puedes seguir el estado aquí abajo.
            </p>
          </div>
        </div>
      )}

      {isUpdated === "1" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <Clock3 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-body text-sm font-semibold text-emerald-800">Reserva actualizada correctamente</p>
          </div>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
          <Package className="w-10 h-10 text-[#9DAAB5] mx-auto mb-3" />
          <p className="font-body text-sm font-medium text-[#0D1B3D] mb-1">Sin reservas aún</p>
          <p className="font-body text-xs text-[#637489] mb-5">
            Explora el catálogo y solicita tu primera reserva.
          </p>
          <Link
            href="/agency/paquetes"
            className="inline-flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Ver paquetes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => {
            const st = r.status as RStatus;
            const cfg = STATUS_CFG[st];
            const commissionAmount = r.totalNet
              ? (r.totalNet * r.package.commission) / 100
              : null;
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${cfg.className}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs font-body text-[#9DAAB5]">
                        {new Intl.DateTimeFormat("es-CO", {
                          day: "numeric", month: "short", year: "numeric",
                        }).format(new Date(r.createdAt))}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-[#0D1B3D]">
                      {r.package.name}
                    </h3>
                    <p className="font-body text-xs text-[#637489]">
                      {r.package.category} · {r.package.duration}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm font-body text-[#637489]">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Viaje:{" "}
                        <strong className="text-[#0D1B3D]">
                          {new Intl.DateTimeFormat("es-CO", {
                            day: "numeric", month: "long", year: "numeric",
                          }).format(new Date(r.travelDate))}
                        </strong>
                      </span>
                      <span>{r.paxCount} pax</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-body text-[#637489]">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        Líder: <strong className="text-[#0D1B3D]">{r.passengers[0]?.fullName ?? "—"}</strong>
                      </span>
                      {r.paymentMethod && (
                        <span>
                          Pago: <strong className="text-[#0D1B3D]">{getPaymentMethod(r.paymentMethod)?.label ?? r.paymentMethod}</strong>
                        </span>
                      )}
                      {r.paymentProofUrl && (
                        <a
                          href={r.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80"
                        >
                          Ver comprobante
                        </a>
                      )}
                    </div>

                    {r.totalNet && (
                      <div className="flex gap-4 text-xs font-body">
                        <span className="text-[#637489]">
                          Net total:{" "}
                          <span className="font-semibold text-[#0D1B3D]">
                            ${r.totalNet.toLocaleString("es-CO")} COP
                          </span>
                        </span>
                        {commissionAmount && (
                          <span className="text-[#637489]">
                            Tu comisión estimada:{" "}
                            <span className="font-semibold text-[#2BB7A6]">
                              ${commissionAmount.toLocaleString("es-CO")} COP
                            </span>
                          </span>
                        )}
                      </div>
                    )}

                    {r.message && (
                      <p className="text-xs font-body text-[#637489] bg-[#F8FAFC] rounded-xl px-3 py-2 border border-[#E2E8ED]">
                        &ldquo;{r.message}&rdquo;
                      </p>
                    )}

                    {r.adminNotes && st === "cancelled" && (
                      <p className="text-xs font-body text-red-600 bg-red-50 rounded-xl px-3 py-2 border border-red-100">
                        Motivo: {r.adminNotes}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {st === "pending" && (
                      <Link
                        href={`/agency/reservas/${r.id}/editar`}
                        className="flex items-center gap-1.5 text-xs font-body font-semibold text-[#0D1B3D] bg-[#F1F3F6] hover:bg-[#E2E8ED] px-3 py-1.5 rounded-full transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Editar
                      </Link>
                    )}
                    <Link
                      href={`/agency/paquetes/${r.package.slug}`}
                      className="flex items-center gap-1.5 text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
                    >
                      Ver paquete <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
