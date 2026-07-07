import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, CheckCircle, Ban, RotateCcw } from "lucide-react";
import { db } from "@/lib/db";
import {
  activateOperator,
  suspendOperator,
  updateOperatorSettings,
  linkUserToOperator,
  unlinkUserFromOperator,
} from "../actions";
import { OperatorSettingsForm } from "./OperatorSettingsForm";
import { LinkUserForm } from "./LinkUserForm";

export const metadata: Metadata = { title: "Operador | Admin" };

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "bg-gray-100 text-gray-600" },
  pending_review: { label: "En revisión", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprobado", color: "bg-blue-100 text-blue-700" },
  published: { label: "Publicado", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rechazado", color: "bg-red-100 text-red-700" },
  archived: { label: "Archivado", color: "bg-gray-100 text-gray-500" },
};

export default async function OperadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const operator = await db.operator.findUnique({
    where: { id },
    include: {
      users: { select: { id: true, email: true, name: true, role: true } },
      tours: {
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: { id: true, title: true, status: true, priceFrom: true, updatedAt: true },
      },
    },
  });

  if (!operator) notFound();

  const tourCount = await db.tour.count({ where: { operatorId: id } });
  const publishedCount = await db.tour.count({
    where: { operatorId: id, status: "published" },
  });

  const defaults = {
    commissionType: operator.commissionType,
    commissionValue: operator.commissionValue,
    contactName: operator.contactName ?? "",
    contactEmail: operator.contactEmail ?? "",
    contactPhone: operator.contactPhone ?? "",
    websiteUrl: operator.websiteUrl ?? "",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb + header */}
      <div>
        <Link
          href="/admin/operadores"
          className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Operadores
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">{operator.name}</h1>
            <p className="font-body text-sm text-[#637489] mt-1">
              /{operator.slug} · {tourCount} tour{tourCount !== 1 ? "s" : ""} ({publishedCount} publicado{publishedCount !== 1 ? "s" : ""})
            </p>
          </div>
          {/* Status actions */}
          <div className="flex items-center gap-2 shrink-0">
            {operator.status !== "active" && (
              <form action={activateOperator.bind(null, id)}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-sm font-body font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Activar
                </button>
              </form>
            )}
            {operator.status === "active" && (
              <form action={suspendOperator.bind(null, id)}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-sm font-body font-semibold text-[#637489] bg-[#F1F3F6] hover:bg-[#E2E8ED] border border-[#E2E8ED] px-4 py-2 rounded-xl transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  Suspender
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: settings */}
        <div className="lg:col-span-2 space-y-6">
          <OperatorSettingsForm
            operatorId={id}
            defaults={defaults}
            serverAction={updateOperatorSettings.bind(null, id)}
          />

          {/* Tours */}
          <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-base font-bold text-[#0D1B3D]">Tours</h2>
              <Link
                href={`/admin/tours?operator=${id}`}
                className="text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80"
              >
                Ver todos ({tourCount}) →
              </Link>
            </div>
            {operator.tours.length === 0 ? (
              <p className="text-sm font-body text-[#9DAAB5] text-center py-8">Sin tours todavía.</p>
            ) : (
              <div className="space-y-2">
                {operator.tours.map((tour) => {
                  const st = STATUS_LABELS[tour.status] ?? STATUS_LABELS.draft;
                  return (
                    <Link
                      key={tour.id}
                      href={`/admin/tours/${tour.id}/edit`}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-[#9DAAB5] shrink-0" />
                        <p className="font-body text-sm text-[#0D1B3D] group-hover:text-[#2BB7A6] transition-colors truncate">
                          {tour.title}
                        </p>
                      </div>
                      <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full shrink-0 ${st.color}`}>
                        {st.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: portal users */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6">
            <h2 className="font-heading text-base font-bold text-[#0D1B3D] mb-5">
              Usuarios del portal
            </h2>
            {operator.users.length > 0 ? (
              <div className="space-y-3 mb-5">
                {operator.users.map((u) => (
                  <div key={u.id} className="flex items-start justify-between gap-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8ED]">
                    <div className="min-w-0">
                      <p className="font-body text-xs font-semibold text-[#0D1B3D] truncate">
                        {u.name ?? u.email}
                      </p>
                      <p className="font-body text-xs text-[#9DAAB5] truncate">{u.email}</p>
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await unlinkUserFromOperator(u.id, id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-[10px] font-body text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                      >
                        Desvincular
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-body text-[#9DAAB5] mb-4">
                Sin usuarios vinculados. El operador no puede acceder al portal.
              </p>
            )}
            <LinkUserForm serverAction={linkUserToOperator.bind(null, id)} />
          </div>

          {/* Info card */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8ED] p-5 space-y-2">
            <p className="font-body text-xs font-semibold text-[#637489] uppercase tracking-wide">
              Información
            </p>
            {[
              { label: "Creado", value: new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(new Date(operator.createdAt)) },
              { label: "Estado", value: operator.status },
              { label: "Comisión", value: operator.commissionType === "percentage" ? `${operator.commissionValue}%` : `$${operator.commissionValue.toLocaleString("es-CO")} COP` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-2">
                <span className="font-body text-xs text-[#9DAAB5]">{label}</span>
                <span className="font-body text-xs text-[#0D1B3D] font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
