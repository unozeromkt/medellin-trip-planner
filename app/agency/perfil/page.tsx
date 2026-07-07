import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";
import {
  Shield,
  Star,
  CalendarDays,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock3,
} from "lucide-react";

export const metadata: Metadata = { title: "Mi perfil | Portal Agencias" };

const LEVEL_CFG = {
  bronze: { label: "Bronze", className: "bg-amber-50 text-amber-700 border-amber-200" },
  silver: { label: "Silver", className: "bg-slate-50 text-slate-600 border-slate-200" },
  gold: { label: "Gold", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  platinum: { label: "Platinum", className: "bg-teal-50 text-teal-700 border-teal-200" },
} as const;

const STATUS_CFG = {
  active: { label: "Activa", icon: CheckCircle, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  suspended: { label: "Suspendida", icon: AlertCircle, className: "bg-red-50 text-red-700 border-red-200" },
  pending: { label: "Pendiente", icon: Clock3, className: "bg-amber-50 text-amber-700 border-amber-200" },
} as const;

export default async function AgencyPerfilPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "agency") redirect("/login");

  // Fetch full agency data (includes level, commissionPct, websiteUrl, taxId)
  const agency = profile.agencyId
    ? await db.agency.findUnique({ where: { id: profile.agencyId } })
    : null;

  if (!agency) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <p className="font-body text-sm text-amber-800">
          Tu cuenta de agencia aún no está vinculada. Contacta a soporte.
        </p>
      </div>
    );
  }

  const levelCfg = LEVEL_CFG[agency.level];
  const statusCfg = STATUS_CFG[agency.status];
  const StatusIcon = statusCfg.icon;

  const memberSince = new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "long",
  }).format(new Date(agency.createdAt));

  const defaults = {
    contactName: agency.contactName ?? "",
    phone: agency.phone ?? "",
    city: agency.city ?? "",
    country: agency.country ?? "",
    websiteUrl: agency.websiteUrl ?? "",
    taxId: agency.taxId ?? "",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Mi perfil</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Información de tu cuenta y datos de contacto
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
              <p className="font-body text-xs text-[#637489]">Agencia</p>
              <p className="font-body text-sm font-semibold text-[#0D1B3D] mt-0.5">
                {agency.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8ED]">
            <div className="w-9 h-9 rounded-lg bg-[#2BB7A6]/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4.5 h-4.5 text-[#2BB7A6]" />
            </div>
            <div>
              <p className="font-body text-xs text-[#637489]">Comisión mayorista</p>
              <p className="font-heading text-lg font-bold text-[#2BB7A6] mt-0.5">
                {agency.commissionPct}%
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8ED]">
            <div className="w-9 h-9 rounded-lg bg-[#FFC97A]/20 flex items-center justify-center shrink-0">
              <Star className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div>
              <p className="font-body text-xs text-[#637489]">Nivel</p>
              <span
                className={`inline-flex items-center mt-1 text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${levelCfg.className}`}
              >
                {levelCfg.label}
              </span>
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
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-body text-[#9DAAB5]">
          <CalendarDays className="w-3.5 h-3.5" />
          Miembro desde {memberSince} · {agency.email}
        </div>
      </div>

      {/* Editable contact info */}
      <ProfileForm defaults={defaults} />
    </div>
  );
}
