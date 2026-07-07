import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { OperatorProfileForm } from "./OperatorProfileForm";
import { Shield, TrendingUp, CalendarDays, CheckCircle, AlertCircle, Clock3 } from "lucide-react";

export const metadata: Metadata = { title: "Mi perfil | Portal Operadores" };

const STATUS_CFG = {
  active: { label: "Activo", icon: CheckCircle, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  suspended: { label: "Suspendido", icon: AlertCircle, className: "bg-red-50 text-red-700 border-red-200" },
  inactive: { label: "Inactivo", icon: AlertCircle, className: "bg-gray-50 text-gray-600 border-gray-200" },
  pending: { label: "Pendiente", icon: Clock3, className: "bg-amber-50 text-amber-700 border-amber-200" },
} as const;

export default async function ProviderPerfilPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "operator" || !profile.operatorId) redirect("/login");

  const operator = await db.operator.findUnique({ where: { id: profile.operatorId } });
  if (!operator) redirect("/provider");

  const statusCfg = STATUS_CFG[operator.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.pending;
  const StatusIcon = statusCfg.icon;

  const memberSince = new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "long",
  }).format(new Date(operator.createdAt));

  const commissionLabel =
    operator.commissionType === "percentage"
      ? `${operator.commissionValue}%`
      : `$${operator.commissionValue.toLocaleString("es-CO")} COP`;

  const defaults = {
    description: operator.description ?? "",
    commercialName: operator.commercialName ?? "",
    contactName: operator.contactName ?? "",
    contactEmail: operator.contactEmail ?? "",
    contactPhone: operator.contactPhone ?? "",
    websiteUrl: operator.websiteUrl ?? "",
    instagramUrl: operator.instagramUrl ?? "",
    facebookUrl: operator.facebookUrl ?? "",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Mi perfil</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Información pública de tu operador y datos de contacto
        </p>
      </div>

      {/* Account info — read-only */}
      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6">
        <h2 className="font-heading text-base font-bold text-[#0D1B3D] mb-5">
          Información de la cuenta
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8ED]">
            <div className="w-9 h-9 rounded-lg bg-[#0D1B3D]/5 flex items-center justify-center shrink-0">
              <Shield className="w-4.5 h-4.5 text-[#0D1B3D]" />
            </div>
            <div>
              <p className="font-body text-xs text-[#637489]">Operador</p>
              <p className="font-body text-sm font-semibold text-[#0D1B3D] mt-0.5">
                {operator.name}
              </p>
              <p className="font-body text-xs text-[#9DAAB5] mt-0.5">/{operator.slug}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8ED]">
            <div className="w-9 h-9 rounded-lg bg-[#2BB7A6]/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4.5 h-4.5 text-[#2BB7A6]" />
            </div>
            <div>
              <p className="font-body text-xs text-[#637489]">Comisión</p>
              <p className="font-heading text-lg font-bold text-[#2BB7A6] mt-0.5">
                {commissionLabel}
              </p>
              <p className="font-body text-xs text-[#9DAAB5]">
                {operator.commissionType === "percentage" ? "Porcentaje" : "Fija"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8ED]">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${statusCfg.className} border`}
            >
              <StatusIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-body text-xs text-[#637489]">Estado</p>
              <p className="font-body text-sm font-semibold text-[#0D1B3D] mt-0.5">
                {statusCfg.label}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8ED]">
            <div className="w-9 h-9 rounded-lg bg-[#A8CBE6]/30 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4.5 h-4.5 text-[#0D1B3D]" />
            </div>
            <div>
              <p className="font-body text-xs text-[#637489]">Miembro desde</p>
              <p className="font-body text-sm font-semibold text-[#0D1B3D] mt-0.5">
                {memberSince}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editable public profile */}
      <OperatorProfileForm operatorId={operator.id} defaults={defaults} />
    </div>
  );
}
