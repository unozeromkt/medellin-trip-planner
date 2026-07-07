import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { togglePackageActive, togglePackageHighlight } from "./actions";
import { Plus, Star, Eye, EyeOff, MapPin, Clock, Users } from "lucide-react";

export const metadata: Metadata = { title: "Paquetes mayoristas | Admin" };

export default async function AdminPaquetesPage() {
  const packages = await db.wholesalePackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      destinations: true,
      netRate: true,
      commission: true,
      minPax: true,
      maxPax: true,
      durationDays: true,
      duration: true,
      isActive: true,
      highlight: true,
      badge: true,
      _count: { select: { reservations: true } },
    },
  });

  const active = packages.filter((p) => p.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">
            Paquetes mayoristas
          </h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            {packages.length} paquetes · {active} activos
          </p>
        </div>
        <Link
          href="/admin/paquetes/nuevo"
          className="flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white text-sm font-body font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo paquete
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
          <p className="font-body text-sm text-[#637489] mb-3">No hay paquetes aún.</p>
          <Link
            href="/admin/paquetes/nuevo"
            className="inline-flex items-center gap-2 bg-[#2BB7A6] text-white text-sm font-body font-semibold px-4 py-2.5 rounded-xl"
          >
            <Plus className="w-4 h-4" /> Crear el primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8ED]">
                {["Paquete", "Destinos", "Precio / Comisión", "Pax", "Reservas", "Estado", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-body font-semibold text-[#637489] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F6]">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 max-w-[220px]">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-body text-sm font-semibold text-[#0D1B3D] truncate">
                          {pkg.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-body text-[#637489]">{pkg.category}</span>
                          <span className="flex items-center gap-1 text-xs font-body text-[#9DAAB5]">
                            <Clock className="w-3 h-3" />{pkg.duration}
                          </span>
                        </div>
                        {pkg.badge && (
                          <span className="inline-block mt-1 text-[10px] font-body font-bold bg-[#FFC97A]/20 text-amber-700 px-1.5 py-0.5 rounded-full">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {pkg.destinations.map((d) => (
                        <span key={d} className="flex items-center gap-0.5 text-xs font-body text-[#637489] bg-[#F1F3F6] px-1.5 py-0.5 rounded-md">
                          <MapPin className="w-2.5 h-2.5" />{d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-heading text-sm font-bold text-[#2BB7A6]">
                      ${pkg.netRate.toLocaleString("es-CO")}
                    </p>
                    <p className="text-xs font-body text-[#637489]">{pkg.commission}% comisión</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-xs font-body text-[#637489]">
                      <Users className="w-3 h-3" />{pkg.minPax}–{pkg.maxPax} pax
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-heading text-lg font-bold text-[#0D1B3D]">
                      {pkg._count.reservations}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5">
                      <form action={async () => { "use server"; await togglePackageActive(pkg.id, !pkg.isActive); }}>
                        <button type="submit" className={`flex items-center gap-1 text-xs font-body font-semibold px-2.5 py-1 rounded-lg border transition-colors ${pkg.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-[#F1F3F6] text-[#637489] border-[#E2E8ED] hover:bg-[#E2E8ED]"}`}>
                          {pkg.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {pkg.isActive ? "Activo" : "Inactivo"}
                        </button>
                      </form>
                      <form action={async () => { "use server"; await togglePackageHighlight(pkg.id, !pkg.highlight); }}>
                        <button type="submit" className={`flex items-center gap-1 text-xs font-body font-semibold px-2.5 py-1 rounded-lg border transition-colors ${pkg.highlight ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" : "bg-[#F1F3F6] text-[#637489] border-[#E2E8ED] hover:bg-[#E2E8ED]"}`}>
                          <Star className="w-3 h-3" />
                          {pkg.highlight ? "Destacado" : "Normal"}
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/paquetes/${pkg.id}/editar`}
                      className="text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
