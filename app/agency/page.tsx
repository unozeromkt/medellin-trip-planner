import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { getActiveWholesalePackages } from "@/lib/queries";
import { db } from "@/lib/db";
import {
  Package,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  MessageSquare,
  Download,
  CheckCircle,
  AlertCircle,
  Clock3,
  TrendingUp,
} from "lucide-react";

function StatusBadge({ status }: { status: "pending" | "active" | "suspended" }) {
  const map = {
    active: {
      label: "Cuenta activa",
      icon: CheckCircle,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    suspended: {
      label: "Cuenta suspendida",
      icon: AlertCircle,
      className: "bg-red-50 text-red-700 border-red-200",
    },
    pending: {
      label: "Cuenta pendiente",
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
  } as const;

  const { label, icon: Icon, className } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full border ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E2E8ED]">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="font-heading text-2xl font-bold text-[#0D1B3D]">{value}</p>
      <p className="font-body text-sm font-medium text-[#0D1B3D] mt-0.5">{label}</p>
      {sub && <p className="font-body text-xs text-[#637489] mt-0.5">{sub}</p>}
    </div>
  );
}

export default async function AgencyDashboardPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "agency") redirect("/login");

  const [packages, reservationsCount] = await Promise.all([
    getActiveWholesalePackages(),
    profile.agencyId
      ? db.packageReservation.count({ where: { agencyId: profile.agencyId } })
      : Promise.resolve(0),
  ]);
  const agency = profile.agency;

  const memberSince = agency?.createdAt
    ? new Intl.DateTimeFormat("es-CO", {
        year: "numeric",
        month: "long",
      }).format(new Date(agency.createdAt))
    : "—";

  const firstName = profile.name?.split(" ")[0] ?? agency?.contactName?.split(" ")[0] ?? "Bienvenido";
  const highlightedPackages = packages.filter((p) => p.highlight).slice(0, 3);
  const displayPackages = highlightedPackages.length > 0 ? highlightedPackages : packages.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">
            Hola, {firstName}
          </h1>
          <p className="font-body text-sm text-[#637489] mt-1">
            Portal mayorista · {agency?.name ?? "Agencia"}
          </p>
        </div>
        {agency?.status && <StatusBadge status={agency.status} />}
      </div>

      {/* Pending notice */}
      {agency?.status === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm font-semibold text-amber-800">
              Tu cuenta está en revisión
            </p>
            <p className="font-body text-sm text-amber-700 mt-1">
              Nuestro equipo está verificando tus datos. Recibirás un correo en 24–48 h.
              Mientras tanto puedes explorar el catálogo de paquetes mayoristas.
            </p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Paquetes disponibles"
          value={packages.length}
          sub="Catálogo activo"
          icon={Package}
          color="bg-[#2BB7A6]/10 text-[#2BB7A6]"
        />
        <StatCard
          label="Destinos cubiertos"
          value={[...new Set(packages.flatMap((p) => p.destinations))].length}
          sub="Colombia"
          icon={MapPin}
          color="bg-[#A8CBE6]/30 text-[#0D1B3D]"
        />
        <StatCard
          label="Días promedio"
          value={
            packages.length > 0
              ? Math.round(packages.reduce((s, p) => s + p.durationDays, 0) / packages.length)
              : 0
          }
          sub="Por paquete"
          icon={Clock}
          color="bg-[#FFC97A]/20 text-amber-700"
        />
        <StatCard
          label="Solicitudes enviadas"
          value={reservationsCount}
          sub={reservationsCount > 0 ? "Ver mis reservas" : "Aún sin solicitudes"}
          icon={TrendingUp}
          color="bg-violet-100 text-violet-600"
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Agency info */}
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-4">
          <h2 className="font-heading text-base font-bold text-[#0D1B3D]">
            Información de la agencia
          </h2>
          <div className="space-y-3">
            {[
              { label: "Agencia", value: agency?.name },
              { label: "Contacto", value: agency?.contactName },
              { label: "Correo", value: agency?.email },
              { label: "Teléfono", value: agency?.phone },
              {
                label: "Ubicación",
                value:
                  [agency?.city, agency?.country].filter(Boolean).join(", ") || null,
              },
              { label: "Miembro desde", value: memberSince },
            ].map(({ label, value }) =>
              value ? (
                <div key={label} className="flex items-start justify-between gap-3">
                  <span className="font-body text-xs text-[#637489] shrink-0">{label}</span>
                  <span className="font-body text-sm text-[#0D1B3D] text-right">{value}</span>
                </div>
              ) : null
            )}
          </div>
          <Link
            href="/agency/perfil"
            className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors mt-2"
          >
            Editar perfil
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-4">
          <h2 className="font-heading text-base font-bold text-[#0D1B3D]">
            Acciones rápidas
          </h2>
          <div className="space-y-2">
            <Link
              href="/agency/paquetes"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8ED] hover:border-[#2BB7A6]/40 hover:bg-[#2BB7A6]/4 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2BB7A6]/10 flex items-center justify-center shrink-0">
                <Package className="w-4.5 h-4.5 text-[#2BB7A6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#0D1B3D]">
                  Ver paquetes mayoristas
                </p>
                <p className="font-body text-xs text-[#637489]">
                  {packages.length} paquetes disponibles
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#637489] group-hover:text-[#2BB7A6] transition-colors shrink-0" />
            </Link>

            <Link
              href="/agency/soporte"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8ED] hover:border-[#2BB7A6]/40 hover:bg-[#2BB7A6]/4 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#A8CBE6]/30 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4.5 h-4.5 text-[#0D1B3D]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#0D1B3D]">
                  Contactar asesor
                </p>
                <p className="font-body text-xs text-[#637489]">
                  Solicitar cotización o soporte
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#637489] group-hover:text-[#2BB7A6] transition-colors shrink-0" />
            </Link>

            <button
              disabled
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8ED] opacity-50 cursor-not-allowed w-full text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-[#FFC97A]/20 flex items-center justify-center shrink-0">
                <Download className="w-4.5 h-4.5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#0D1B3D]">
                  Descargar tarifario
                </p>
                <p className="font-body text-xs text-[#637489]">Próximamente</p>
              </div>
            </button>

            <Link
              href="/agency/paquetes"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8ED] hover:border-[#2BB7A6]/40 hover:bg-[#2BB7A6]/4 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#FFC97A]/20 flex items-center justify-center shrink-0">
                <Users className="w-4.5 h-4.5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#0D1B3D]">
                  Solicitar paquete grupal
                </p>
                <p className="font-body text-xs text-[#637489]">
                  Mínimo 2 pax · desde tarifas netas
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#637489] group-hover:text-[#2BB7A6] transition-colors shrink-0" />
            </Link>
          </div>
        </div>

        {/* Stats placeholder */}
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-[#0D1B3D]">
              Mis solicitudes
            </h2>
            {reservationsCount > 0 ? (
              <Link
                href="/agency/reservas"
                className="text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
              >
                Ver todas →
              </Link>
            ) : (
              <span className="text-xs font-body text-[#637489] bg-[#F1F3F6] px-2.5 py-1 rounded-full">
                Sin solicitudes
              </span>
            )}
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F1F3F6] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#9DAAB5]" />
            </div>
            <div>
              <p className="font-body text-sm font-medium text-[#0D1B3D]">
                Sin solicitudes aún
              </p>
              <p className="font-body text-xs text-[#637489] mt-1 max-w-[200px]">
                Aquí verás el historial de cotizaciones y reservas que gestiones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured packages */}
      {displayPackages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-[#0D1B3D]">
              Paquetes destacados
            </h2>
            <Link
              href="/agency/paquetes"
              className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPackages.map((pkg) => (
              <Link
                key={pkg.id}
                href={`/agency/paquetes/${pkg.slug}`}
                className="bg-white rounded-2xl border border-[#E2E8ED] p-5 hover:border-[#2BB7A6]/40 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-body font-semibold text-[#637489] uppercase tracking-wide">
                    {pkg.category}
                  </span>
                  {pkg.badge && (
                    <span className="text-[10px] font-body font-bold bg-[#FFC97A]/20 text-amber-700 px-2 py-0.5 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-base font-bold text-[#0D1B3D] mb-1 group-hover:text-[#2BB7A6] transition-colors leading-snug">
                  {pkg.name}
                </h3>
                <p className="font-body text-xs text-[#637489] mb-4 line-clamp-2">
                  {pkg.destinations.join(" · ")}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-[10px] text-[#637489]">Tarifa neta desde</p>
                    <p className="font-heading text-lg font-bold text-[#2BB7A6]">
                      ${pkg.netRate.toLocaleString("es-CO")}
                      <span className="text-xs font-body font-normal text-[#637489] ml-1">
                        COP/pax
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-[10px] text-[#637489]">Comisión</p>
                    <p className="font-heading text-base font-bold text-[#0D1B3D]">
                      {pkg.commission}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F1F3F6] flex items-center gap-3 text-[#637489]">
                  <span className="flex items-center gap-1 text-xs font-body">
                    <Clock className="w-3 h-3" />
                    {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-body">
                    <Users className="w-3 h-3" />
                    Mín {pkg.minPax} pax
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
