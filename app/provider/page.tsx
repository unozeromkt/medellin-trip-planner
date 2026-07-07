import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  MapPin,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock3,
  Eye,
  FileEdit,
  Send,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard | Portal Operadores" };

const STATUS_LABELS: Record<string, { label: string; color: string; icon: typeof Clock3 }> = {
  draft: { label: "Borrador", color: "bg-gray-100 text-gray-600", icon: FileEdit },
  pending_review: { label: "En revisión", color: "bg-amber-100 text-amber-700", icon: Send },
  approved: { label: "Aprobado", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  published: { label: "Publicado", color: "bg-emerald-100 text-emerald-700", icon: Eye },
  rejected: { label: "Rechazado", color: "bg-red-100 text-red-700", icon: AlertCircle },
  archived: { label: "Archivado", color: "bg-gray-100 text-gray-500", icon: Clock3 },
};

export default async function ProviderDashboardPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "operator" || !profile.operatorId) redirect("/login");

  const operator = profile.operator;

  const tours = await db.tour.findMany({
    where: { operatorId: profile.operatorId },
    select: { id: true, title: true, slug: true, status: true, priceFrom: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const statusCounts = await db.tour.groupBy({
    by: ["status"],
    where: { operatorId: profile.operatorId },
    _count: true,
  });

  const countByStatus = Object.fromEntries(statusCounts.map((s) => [s.status, s._count]));
  const totalTours = Object.values(countByStatus).reduce((a, b) => a + b, 0);
  const publishedCount = (countByStatus["published"] ?? 0) + (countByStatus["approved"] ?? 0);
  const pendingCount = countByStatus["pending_review"] ?? 0;
  const draftCount = countByStatus["draft"] ?? 0;

  const firstName =
    profile.name?.split(" ")[0] ??
    operator?.contactName?.split(" ")[0] ??
    "Bienvenido";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">
            Hola, {firstName}
          </h1>
          <p className="font-body text-sm text-[#637489] mt-1">
            Portal operadores · {operator?.name ?? "Operador"}
          </p>
        </div>
        {operator?.status === "pending" && (
          <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
            <Clock3 className="w-3.5 h-3.5" />
            Cuenta pendiente
          </span>
        )}
        {operator?.status === "active" && (
          <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Cuenta activa
          </span>
        )}
      </div>

      {/* Pending notice */}
      {operator?.status === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm font-semibold text-amber-800">
              Tu cuenta está en revisión
            </p>
            <p className="font-body text-sm text-amber-700 mt-1">
              El equipo admin está verificando tu información. Mientras tanto puedes crear tours en
              modo borrador y enviarlos a revisión cuando estés listo.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tours en total", value: totalTours, color: "bg-[#2BB7A6]/10 text-[#2BB7A6]" },
          { label: "Publicados", value: publishedCount, color: "bg-emerald-100 text-emerald-700" },
          { label: "En revisión", value: pendingCount, color: "bg-amber-100 text-amber-700" },
          { label: "Borradores", value: draftCount, color: "bg-slate-100 text-slate-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-[#E2E8ED]">
            <p className="font-heading text-2xl font-bold text-[#0D1B3D]">{value}</p>
            <p className="font-body text-sm font-medium text-[#0D1B3D] mt-0.5">{label}</p>
            <div className={`mt-2 inline-block w-2 h-2 rounded-full ${color.split(" ")[0]}`} />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent tours */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8ED] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-base font-bold text-[#0D1B3D]">Mis tours recientes</h2>
            <Link
              href="/provider/tours"
              className="text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {tours.length === 0 ? (
            <div className="py-10 text-center">
              <MapPin className="w-8 h-8 text-[#9DAAB5] mx-auto mb-3" />
              <p className="font-body text-sm font-medium text-[#0D1B3D] mb-1">Sin tours aún</p>
              <p className="font-body text-xs text-[#637489] mb-4">
                Crea tu primer tour y envíalo a revisión.
              </p>
              <Link
                href="/provider/tours/nuevo"
                className="inline-flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Crear tour
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {tours.map((tour) => {
                const st = STATUS_LABELS[tour.status] ?? STATUS_LABELS.draft;
                return (
                  <Link
                    key={tour.id}
                    href={`/provider/tours/${tour.id}/editar`}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm font-semibold text-[#0D1B3D] truncate group-hover:text-[#2BB7A6] transition-colors">
                        {tour.title}
                      </p>
                      <p className="font-body text-xs text-[#9DAAB5] mt-0.5">
                        {new Intl.DateTimeFormat("es-CO", {
                          day: "numeric",
                          month: "short",
                        }).format(new Date(tour.updatedAt))}
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

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-4">
          <h2 className="font-heading text-base font-bold text-[#0D1B3D]">Acciones rápidas</h2>
          <div className="space-y-2">
            <Link
              href="/provider/tours/nuevo"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8ED] hover:border-[#2BB7A6]/40 hover:bg-[#2BB7A6]/4 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2BB7A6]/10 flex items-center justify-center shrink-0">
                <Plus className="w-4.5 h-4.5 text-[#2BB7A6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#0D1B3D]">Crear tour</p>
                <p className="font-body text-xs text-[#637489]">Nuevo borrador</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#637489] group-hover:text-[#2BB7A6] transition-colors shrink-0" />
            </Link>

            <Link
              href="/provider/tours"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8ED] hover:border-[#2BB7A6]/40 hover:bg-[#2BB7A6]/4 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#A8CBE6]/30 flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5 text-[#0D1B3D]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#0D1B3D]">Ver mis tours</p>
                <p className="font-body text-xs text-[#637489]">{totalTours} en total</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#637489] group-hover:text-[#2BB7A6] transition-colors shrink-0" />
            </Link>

            <Link
              href="/provider/perfil"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8ED] hover:border-[#2BB7A6]/40 hover:bg-[#2BB7A6]/4 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#FFC97A]/20 flex items-center justify-center shrink-0">
                <FileEdit className="w-4.5 h-4.5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#0D1B3D]">Editar perfil</p>
                <p className="font-body text-xs text-[#637489]">Descripción y contacto</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#637489] group-hover:text-[#2BB7A6] transition-colors shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
