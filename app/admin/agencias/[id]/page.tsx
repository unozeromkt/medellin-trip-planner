import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";
import {
  approveAgency,
  rejectAgency,
  suspendAgency,
  reactivateAgency,
} from "../actions";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Ban,
  RotateCcw,
} from "lucide-react";

type AgencyStatus = "pending" | "active" | "suspended";
type AgencyLevel = "bronze" | "silver" | "gold" | "platinum";

const STATUS_CONFIG: Record<AgencyStatus, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  active: { label: "Activa", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  suspended: { label: "Suspendida", className: "bg-red-50 text-red-700 border-red-200" },
};

const LEVEL_CONFIG: Record<AgencyLevel, { label: string; className: string; dot: string }> = {
  bronze: { label: "Bronce", className: "bg-amber-50 text-amber-700 border-amber-300", dot: "bg-amber-500" },
  silver: { label: "Plata", className: "bg-slate-50 text-slate-600 border-slate-300", dot: "bg-slate-400" },
  gold: { label: "Oro", className: "bg-yellow-50 text-yellow-700 border-yellow-300", dot: "bg-yellow-500" },
  platinum: { label: "Platino", className: "bg-[#2BB7A6]/5 text-[#2BB7A6] border-[#2BB7A6]/40", dot: "bg-[#2BB7A6]" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agency = await db.agency.findUnique({ where: { id }, select: { name: true } });
  return { title: agency ? `${agency.name} | Admin` : "Agencia | Admin" };
}

export default async function AgencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const agency = await db.agency.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true, email: true, name: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!agency) notFound();

  const st = (agency.status as AgencyStatus) ?? "pending";
  const lv = (agency.level as AgencyLevel) ?? "bronze";
  const statusCfg = STATUS_CONFIG[st] ?? STATUS_CONFIG.pending;
  const levelCfg = LEVEL_CONFIG[lv] ?? LEVEL_CONFIG.bronze;

  const infoRows = [
    { icon: Mail, label: "Correo", value: agency.email },
    { icon: Phone, label: "Teléfono", value: agency.phone },
    { icon: MapPin, label: "Ubicación", value: [agency.city, agency.country].filter(Boolean).join(", ") || null },
    { icon: Globe, label: "Sitio web", value: agency.websiteUrl },
    { icon: FileText, label: "NIT / Tax ID", value: agency.taxId },
    {
      icon: Calendar,
      label: "Registrada",
      value: new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(agency.createdAt)),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/admin/agencias"
          className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Todas las agencias
        </Link>

        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0D1B3D]/8 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-[#0D1B3D]" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-[#0D1B3D] leading-tight">
                {agency.name}
              </h1>
              {agency.contactName && (
                <p className="text-[#637489] text-sm font-body mt-0.5">
                  {agency.contactName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full border ${levelCfg.className}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${levelCfg.dot}`} />
              {levelCfg.label}
            </span>
            <span className={`inline-flex items-center text-xs font-body font-semibold px-3 py-1.5 rounded-full border ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Status actions */}
      <div className="bg-white rounded-2xl border border-[#E2E8ED] px-5 py-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-body font-medium text-[#637489] mr-2">Estado:</span>

        {st === "pending" && (
          <>
            <form action={async () => { "use server"; await approveAgency(id); }}>
              <button type="submit" className="flex items-center gap-1.5 text-sm font-body font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-colors">
                <CheckCircle className="w-4 h-4" /> Aprobar agencia
              </button>
            </form>
            <form action={async () => { "use server"; await rejectAgency(id, "Solicitud revisada y no aprobada."); }}>
              <button type="submit" className="flex items-center gap-1.5 text-sm font-body font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl transition-colors">
                <XCircle className="w-4 h-4" /> Rechazar
              </button>
            </form>
          </>
        )}
        {st === "active" && (
          <form action={async () => { "use server"; await suspendAgency(id); }}>
            <button type="submit" className="flex items-center gap-1.5 text-sm font-body font-semibold text-[#637489] hover:text-[#0D1B3D] bg-[#F1F3F6] hover:bg-[#E2E8ED] border border-[#E2E8ED] px-4 py-2 rounded-xl transition-colors">
              <Ban className="w-4 h-4" /> Suspender acceso
            </button>
          </form>
        )}
        {st === "suspended" && (
          <form action={async () => { "use server"; await reactivateAgency(id); }}>
            <button type="submit" className="flex items-center gap-1.5 text-sm font-body font-semibold text-[#2BB7A6] bg-[#2BB7A6]/10 hover:bg-[#2BB7A6]/20 border border-[#2BB7A6]/30 px-4 py-2 rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> Reactivar agencia
            </button>
          </form>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left col: info + users */}
        <div className="space-y-5">
          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
            <h2 className="font-heading text-sm font-bold text-[#0D1B3D] mb-4">
              Información de contacto
            </h2>
            <ul className="space-y-3">
              {infoRows.map(({ icon: Icon, label, value }) =>
                value ? (
                  <li key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-[#9DAAB5] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-body text-[#9DAAB5] uppercase tracking-wide">
                        {label}
                      </p>
                      <p className="text-sm font-body text-[#0D1B3D] break-all">{value}</p>
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          </div>

          {/* Users */}
          <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-sm font-bold text-[#0D1B3D]">
                Usuarios vinculados
              </h2>
              <span className="text-xs font-body text-[#637489] bg-[#F1F3F6] px-2 py-0.5 rounded-full">
                {agency.users.length}
              </span>
            </div>
            {agency.users.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center gap-2">
                <Users className="w-7 h-7 text-[#9DAAB5]" />
                <p className="text-xs font-body text-[#637489]">Sin usuarios aún</p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {agency.users.map((u) => (
                  <li key={u.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8FAFC]">
                    <div className="w-7 h-7 rounded-full bg-[#2BB7A6]/15 flex items-center justify-center shrink-0">
                      <span className="text-[#2BB7A6] text-[11px] font-bold uppercase">
                        {u.email[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-body font-medium text-[#0D1B3D] truncate">
                        {u.name ?? u.email}
                      </p>
                      {u.name && (
                        <p className="text-xs font-body text-[#637489] truncate">{u.email}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right col: settings form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8ED] p-6">
          <h2 className="font-heading text-base font-bold text-[#0D1B3D] mb-1">
            Configuración comercial
          </h2>
          <p className="text-sm font-body text-[#637489] mb-6">
            Ajusta la comisión, nivel de fidelización y datos adicionales de la agencia.
          </p>
          <SettingsForm
            agencyId={agency.id}
            commissionPct={agency.commissionPct}
            level={lv}
            notes={agency.notes}
            websiteUrl={agency.websiteUrl}
            taxId={agency.taxId}
          />
        </div>
      </div>
    </div>
  );
}
