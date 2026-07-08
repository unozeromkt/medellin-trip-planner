import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Plus, MapPin, EyeOff, Eye } from "lucide-react";
import { toggleDestinationActive } from "./actions";

export const metadata: Metadata = { title: "Destinos | Admin" };

async function getDestinations() {
  return db.destination.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { tours: true } } },
  });
}

export default async function AdminDestinosPage() {
  const destinations = await getDestinations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Destinos</h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            Lugares que se pueden asignar a los tours. Cada uno tendrá su propia landing page SEO próximamente.
          </p>
        </div>
        <Link
          href="/admin/destinos/nuevo"
          className="flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white text-sm font-semibold font-body px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo destino
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
          <p className="font-body text-sm text-[#9DAAB5] mb-4">No hay destinos todavía.</p>
          <Link
            href="/admin/destinos/nuevo"
            className="inline-flex items-center gap-2 bg-[#2BB7A6] text-white text-sm font-semibold font-body px-5 py-2.5 rounded-xl"
          >
            <Plus className="w-4 h-4" /> Crear primero
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl border border-[#E2E8ED] overflow-hidden flex flex-col"
            >
              <div className="relative aspect-video bg-[#F1F3F6]">
                {dest.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={dest.coverImage}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#9DAAB5]">
                    <MapPin className="w-8 h-8" />
                  </div>
                )}
                {!dest.isActive && (
                  <span className="absolute top-2 left-2 text-[10px] font-body font-semibold px-2 py-1 rounded-full bg-gray-900/70 text-white">
                    Inactivo
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <Link href={`/admin/destinos/${dest.id}`}>
                  <p className="font-heading text-base font-bold text-[#0D1B3D] hover:text-[#2BB7A6] transition-colors">
                    {dest.name}
                  </p>
                  <p className="font-body text-xs text-[#9DAAB5]">/{dest.slug}</p>
                </Link>
                {dest.description && (
                  <p className="font-body text-sm text-[#637489] line-clamp-2">{dest.description}</p>
                )}
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <p className="font-body text-xs text-[#9DAAB5]">{dest._count.tours} tours</p>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/destinos/${dest.id}`}
                      className="text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80 bg-[#2BB7A6]/8 hover:bg-[#2BB7A6]/15 border border-[#2BB7A6]/25 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Editar
                    </Link>
                    <form
                      action={toggleDestinationActive.bind(null, dest.id, !dest.isActive)}
                    >
                      <button
                        type="submit"
                        title={dest.isActive ? "Desactivar" : "Activar"}
                        className="flex items-center gap-1 text-xs font-body font-semibold text-[#637489] bg-[#F1F3F6] hover:bg-[#E2E8ED] border border-[#E2E8ED] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {dest.isActive ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
