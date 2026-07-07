import Link from "next/link";
import { db } from "@/lib/db";
import { Map, Compass, Users, MessageSquare, Plus, ArrowRight, Package } from "lucide-react";

async function getStats() {
  const [tours, destinations, operators, leads] = await Promise.all([
    db.tour.count(),
    db.destination.count({ where: { isActive: true } }),
    db.operator.count({ where: { status: "active" } }),
    db.lead.count({ where: { status: "new" } }),
  ]);
  const publishedTours = await db.tour.count({ where: { status: "published" } });
  return { tours, publishedTours, destinations, operators, leads };
}

async function getRecentTours() {
  return db.tour.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      priceFrom: true,
      createdAt: true,
      destination: { select: { name: true } },
    },
  });
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "bg-gray-100 text-gray-600" },
  pending_review: { label: "En revisión", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprobado", color: "bg-blue-100 text-blue-700" },
  published: { label: "Publicado", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rechazado", color: "bg-red-100 text-red-700" },
  archived: { label: "Archivado", color: "bg-gray-100 text-gray-500" },
};

export default async function AdminDashboard() {
  const [stats, recentTours] = await Promise.all([getStats(), getRecentTours()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Dashboard</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Resumen del portal Medellín Trip Planner
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Tours totales",
            value: stats.tours,
            sub: `${stats.publishedTours} publicados`,
            icon: Map,
            color: "text-[#2BB7A6]",
            bg: "bg-[#2BB7A6]/10",
          },
          {
            label: "Destinos activos",
            value: stats.destinations,
            sub: "en catálogo",
            icon: Compass,
            color: "text-[#A8CBE6]",
            bg: "bg-[#A8CBE6]/20",
          },
          {
            label: "Operadores",
            value: stats.operators,
            sub: "activos",
            icon: Users,
            color: "text-[#FFC97A]",
            bg: "bg-[#FFC97A]/20",
          },
          {
            label: "Leads nuevos",
            value: stats.leads,
            sub: "sin contactar",
            icon: MessageSquare,
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 border border-[#E9EEF4]"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-heading text-2xl font-bold text-[#0D1B3D]">{value}</p>
            <p className="text-sm font-body font-medium text-[#0D1B3D] mt-0.5">{label}</p>
            <p className="text-xs font-body text-[#9DAAB5] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent tours + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tours recientes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E9EEF4] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9EEF4]">
            <h2 className="font-heading text-base font-bold text-[#0D1B3D]">
              Tours recientes
            </h2>
            <Link
              href="/admin/tours"
              className="text-sm text-[#2BB7A6] hover:text-[#2BB7A6]/80 font-body font-medium flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#F1F3F6]">
            {recentTours.length === 0 ? (
              <div className="px-6 py-10 text-center text-[#9DAAB5] font-body text-sm">
                No hay tours aún.{" "}
                <Link href="/admin/tours/new" className="text-[#2BB7A6] hover:underline">
                  Crea el primero
                </Link>
              </div>
            ) : (
              recentTours.map((tour) => {
                const status = STATUS_LABELS[tour.status] ?? STATUS_LABELS.draft;
                return (
                  <div
                    key={tour.id}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium text-[#0D1B3D] truncate">
                        {tour.title}
                      </p>
                      <p className="text-xs text-[#9DAAB5] font-body">
                        {tour.destination.name}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-body font-medium px-2.5 py-1 rounded-full ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-2xl border border-[#E9EEF4] p-6">
          <h2 className="font-heading text-base font-bold text-[#0D1B3D] mb-4">
            Acciones rápidas
          </h2>
          <div className="space-y-2.5">
            {[
              { label: "Crear nuevo tour", href: "/admin/tours/new", icon: Plus, primary: true },
              { label: "Ver todos los tours", href: "/admin/tours", icon: Map, primary: false },
              { label: "Ver paquetes", href: "/admin/paquetes", icon: Package, primary: false },
              { label: "Ver leads", href: "/admin/leads", icon: MessageSquare, primary: false },
            ].map(({ label, href, icon: Icon, primary }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-colors ${
                  primary
                    ? "bg-[#2BB7A6] text-white hover:bg-[#2BB7A6]/90"
                    : "text-[#0D1B3D] hover:bg-[#F1F3F6]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

