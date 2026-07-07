import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Plus, CheckCircle, Ban, RotateCcw } from "lucide-react";
import { activateOperator, suspendOperator } from "./actions";

export const metadata: Metadata = { title: "Operadores | Admin" };

type OStatus = "pending" | "active" | "suspended" | "inactive";

const STATUS_CFG: Record<OStatus, { label: string; className: string }> = {
  pending:   { label: "Pendiente",  className: "bg-amber-50 text-amber-700 border-amber-200" },
  active:    { label: "Activo",     className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  suspended: { label: "Suspendido", className: "bg-red-50 text-red-700 border-red-200" },
  inactive:  { label: "Inactivo",   className: "bg-gray-50 text-gray-600 border-gray-200" },
};

async function getOperators(status?: OStatus) {
  return db.operator.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      users: { select: { id: true, email: true } },
      _count: { select: { tours: true } },
    },
  });
}

export default async function AdminOperadoresPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter = (["pending", "active", "suspended", "inactive"].includes(status ?? "")
    ? status
    : undefined) as OStatus | undefined;

  const [operators, counts] = await Promise.all([
    getOperators(activeFilter),
    Promise.all([
      db.operator.count(),
      db.operator.count({ where: { status: "pending" } }),
      db.operator.count({ where: { status: "active" } }),
      db.operator.count({ where: { status: "suspended" } }),
    ]),
  ]);

  const [total, pending, active, suspended] = counts;

  const TABS = [
    { label: "Todos", value: undefined, count: total },
    { label: "Pendientes", value: "pending" as OStatus, count: pending },
    { label: "Activos", value: "active" as OStatus, count: active },
    { label: "Suspendidos", value: "suspended" as OStatus, count: suspended },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Operadores</h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            Empresas y personas que operan los tours
          </p>
        </div>
        <Link
          href="/admin/operadores/nuevo"
          className="flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white text-sm font-semibold font-body px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo operador
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-[#E2E8ED] rounded-xl p-1 w-fit">
        {TABS.map(({ label, value, count }) => {
          const isActive = activeFilter === value;
          return (
            <a
              key={label}
              href={value ? `/admin/operadores?status=${value}` : "/admin/operadores"}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                isActive
                  ? "bg-[#0D1B3D] text-white"
                  : "text-[#637489] hover:text-[#0D1B3D] hover:bg-[#F1F3F6]"
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

      {operators.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
          <p className="font-body text-sm text-[#9DAAB5] mb-4">No hay operadores todavía.</p>
          <Link
            href="/admin/operadores/nuevo"
            className="inline-flex items-center gap-2 bg-[#2BB7A6] text-white text-sm font-semibold font-body px-5 py-2.5 rounded-xl"
          >
            <Plus className="w-4 h-4" /> Crear primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8ED] bg-[#F8FAFC]">
                {["Operador", "Contacto", "Comisión", "Tours", "Usuario portal", "Estado", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-body font-semibold text-[#637489] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F6]">
              {operators.map((op) => {
                const st = op.status as OStatus;
                const cfg = STATUS_CFG[st] ?? STATUS_CFG.pending;
                const portalUser = op.users[0];
                return (
                  <tr key={op.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/operadores/${op.id}`}>
                        <p className="font-body text-sm font-semibold text-[#0D1B3D] hover:text-[#2BB7A6] transition-colors">
                          {op.name}
                        </p>
                        <p className="font-body text-xs text-[#9DAAB5]">/{op.slug}</p>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-[#0D1B3D]">{op.contactName ?? "—"}</p>
                      <p className="font-body text-xs text-[#9DAAB5]">{op.contactEmail ?? op.contactPhone ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-[#0D1B3D] font-medium">
                        {op.commissionType === "percentage"
                          ? `${op.commissionValue}%`
                          : `$${op.commissionValue.toLocaleString("es-CO")}`}
                      </p>
                      <p className="font-body text-xs text-[#9DAAB5]">
                        {op.commissionType === "percentage" ? "Porcentaje" : "Fija"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-[#0D1B3D]">{op._count.tours}</p>
                    </td>
                    <td className="px-5 py-4">
                      {portalUser ? (
                        <p className="font-body text-xs text-[#637489] truncate max-w-[140px]">
                          {portalUser.email}
                        </p>
                      ) : (
                        <span className="font-body text-xs text-[#9DAAB5] italic">Sin usuario</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/operadores/${op.id}`}
                          className="text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 bg-[#2BB7A6]/8 hover:bg-[#2BB7A6]/15 border border-[#2BB7A6]/25 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Ver
                        </Link>
                        {st === "pending" || st === "suspended" || st === "inactive" ? (
                          <form action={activateOperator.bind(null, op.id)}>
                            <button type="submit" className="flex items-center gap-1 text-xs font-body font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Activar
                            </button>
                          </form>
                        ) : (
                          <form action={suspendOperator.bind(null, op.id)}>
                            <button type="submit" className="flex items-center gap-1 text-xs font-body font-semibold text-[#637489] bg-[#F1F3F6] hover:bg-[#E2E8ED] border border-[#E2E8ED] px-3 py-1.5 rounded-lg transition-colors">
                              <Ban className="w-3.5 h-3.5" />
                              Suspender
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
