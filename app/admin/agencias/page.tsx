import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { approveAgency, rejectAgency, suspendAgency, reactivateAgency } from "./actions";
import { Building2, CheckCircle, Clock3, XCircle, RotateCcw, Ban, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Agencias | Admin" };

type Status = "pending" | "active" | "suspended";
type Level = "bronze" | "silver" | "gold" | "platinum";

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  active: { label: "Activa", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  suspended: { label: "Suspendida", className: "bg-red-50 text-red-700 border-red-200" },
};

const LEVEL_CONFIG: Record<Level, { label: string; dot: string }> = {
  bronze: { label: "Bronce", dot: "bg-amber-500" },
  silver: { label: "Plata", dot: "bg-slate-400" },
  gold: { label: "Oro", dot: "bg-yellow-500" },
  platinum: { label: "Platino", dot: "bg-[#2BB7A6]" },
};

async function getAgencies(status?: Status) {
  return db.agency.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { users: { select: { id: true } } },
  });
}

export default async function AdminAgenciasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter = (["pending", "active", "suspended"].includes(status ?? "")
    ? status
    : undefined) as Status | undefined;

  const [agencies, counts] = await Promise.all([
    getAgencies(activeFilter),
    Promise.all([
      db.agency.count(),
      db.agency.count({ where: { status: "pending" } }),
      db.agency.count({ where: { status: "active" } }),
      db.agency.count({ where: { status: "suspended" } }),
    ]),
  ]);

  const [total, pending, active, suspended] = counts;

  const TABS = [
    { label: "Todas", value: undefined, count: total },
    { label: "Pendientes", value: "pending" as Status, count: pending },
    { label: "Activas", value: "active" as Status, count: active },
    { label: "Suspendidas", value: "suspended" as Status, count: suspended },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Agencias</h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            Solicitudes de registro y gestión de cuentas mayoristas
          </p>
        </div>
        {pending > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-body font-semibold px-3 py-1.5 rounded-full">
            <Clock3 className="w-3.5 h-3.5" />
            {pending} pendiente{pending !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-[#E2E8ED] rounded-xl p-1 w-fit">
        {TABS.map(({ label, value, count }) => {
          const isActive = activeFilter === value;
          return (
            <a
              key={label}
              href={value ? `/admin/agencias?status=${value}` : "/admin/agencias"}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                isActive
                  ? "bg-[#0D1B3D] text-white"
                  : "text-[#637489] hover:text-[#0D1B3D] hover:bg-[#F1F3F6]"
              }`}
            >
              {label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-[#F1F3F6] text-[#637489]"
                }`}
              >
                {count}
              </span>
            </a>
          );
        })}
      </div>

      {/* Table */}
      {agencies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
          <Building2 className="w-10 h-10 text-[#9DAAB5] mx-auto mb-3" />
          <p className="font-body text-sm font-medium text-[#0D1B3D]">
            No hay agencias{activeFilter ? ` con estado "${STATUS_CONFIG[activeFilter].label.toLowerCase()}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8ED]">
                {["Agencia", "Contacto", "Ubicación", "Registro", "Nivel", "Estado", "Acciones"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-body font-semibold text-[#637489] uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F6]">
              {agencies.map((agency) => {
                const st = agency.status as Status;
                const cfg = STATUS_CONFIG[st];
                return (
                  <tr key={agency.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/agencias/${agency.id}`} className="group">
                        <p className="font-body text-sm font-semibold text-[#0D1B3D] group-hover:text-[#2BB7A6] transition-colors">
                          {agency.name}
                        </p>
                        <p className="font-body text-xs text-[#637489]">{agency.email}</p>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-[#0D1B3D]">
                        {agency.contactName ?? "—"}
                      </p>
                      <p className="font-body text-xs text-[#637489]">
                        {agency.phone ?? "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-[#637489]">
                        {[agency.city, agency.country].filter(Boolean).join(", ") || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-xs text-[#637489]">
                        {new Intl.DateTimeFormat("es-CO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(agency.createdAt))}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {(() => {
                        const lv = (agency.level as Level) ?? "bronze";
                        const lvcfg = LEVEL_CONFIG[lv] ?? LEVEL_CONFIG.bronze;
                        return (
                          <span className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-[#637489]">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${lvcfg.dot}`} />
                            {lvcfg.label}
                          </span>
                        );
                      })()}
                      <p className="font-body text-xs text-[#9DAAB5] mt-0.5">
                        {(agency.commissionPct ?? 18)}% comisión
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${cfg.className}`}
                      >
                        {cfg.label}
                      </span>
                      {agency.notes && st === "suspended" && (
                        <p className="font-body text-xs text-[#637489] mt-1 max-w-[160px] truncate" title={agency.notes}>
                          {agency.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/agencias/${agency.id}`}
                          className="flex items-center gap-1 text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 bg-[#2BB7A6]/8 hover:bg-[#2BB7A6]/15 border border-[#2BB7A6]/25 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          Ver
                        </Link>
                        {st === "pending" && (
                          <>
                            <form
                              action={async () => {
                                "use server";
                                await approveAgency(agency.id);
                              }}
                            >
                              <button
                                type="submit"
                                className="flex items-center gap-1 text-xs font-body font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Aprobar
                              </button>
                            </form>
                            <form
                              action={async () => {
                                "use server";
                                await rejectAgency(agency.id, "Solicitud no aprobada.");
                              }}
                            >
                              <button
                                type="submit"
                                className="flex items-center gap-1 text-xs font-body font-semibold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Rechazar
                              </button>
                            </form>
                          </>
                        )}
                        {st === "active" && (
                          <form
                            action={async () => {
                              "use server";
                              await suspendAgency(agency.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="flex items-center gap-1 text-xs font-body font-semibold text-[#637489] hover:text-[#0D1B3D] bg-[#F1F3F6] hover:bg-[#E2E8ED] border border-[#E2E8ED] px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Suspender
                            </button>
                          </form>
                        )}
                        {st === "suspended" && (
                          <form
                            action={async () => {
                              "use server";
                              await reactivateAgency(agency.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="flex items-center gap-1 text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 bg-[#2BB7A6]/10 hover:bg-[#2BB7A6]/20 border border-[#2BB7A6]/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Reactivar
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
