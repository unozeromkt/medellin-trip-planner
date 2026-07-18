import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/auth";
import { getWholesalePackageBySlug } from "@/lib/queries";
import { formatCOP } from "@/lib/utils";
import { ReserveForm } from "./ReserveForm";
import {
  ArrowLeft, MapPin, Clock, Users, CheckCircle, XCircle,
  CalendarDays, Star,
} from "lucide-react";

export default async function AgencyPackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [profile, pkg] = await Promise.all([
    getCurrentUserProfile(),
    getWholesalePackageBySlug(slug),
  ]);

  if (!profile || profile.role !== "agency") redirect("/login");
  if (!pkg) notFound();

  const canReserve = profile.agency?.status === "active";

  return (
    <div className="max-w-5xl space-y-6">
      <Link href="/agency/paquetes" className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Todos los paquetes
      </Link>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Detail — left */}
        <div className="lg:col-span-3 space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-body font-semibold bg-[#F1F3F6] text-[#637489] px-2.5 py-1 rounded-full">{pkg.category}</span>
              {pkg.highlight && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
              {pkg.badge && <span className="text-[10px] font-body font-bold bg-[#FFC97A]/20 text-amber-700 px-2 py-0.5 rounded-full">{pkg.badge}</span>}
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">{pkg.name}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm font-body text-[#637489]">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{pkg.duration}</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{pkg.minPax}–{pkg.maxPax} pax</span>
              {pkg.destinations.map((d) => (
                <span key={d} className="flex items-center gap-1"><MapPin className="w-3 h-3" />{d}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
            <h2 className="font-heading text-sm font-bold text-[#0D1B3D] mb-3">Descripción</h2>
            <p className="font-body text-sm text-[#637489] leading-relaxed">{pkg.description}</p>
          </div>

          {/* Included / excluded */}
          <div className="grid sm:grid-cols-2 gap-4">
            {pkg.included.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
                <h2 className="font-heading text-sm font-bold text-[#0D1B3D] mb-3">Incluye</h2>
                <ul className="space-y-2">
                  {pkg.included.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2BB7A6] shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-[#637489]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pkg.excluded && pkg.excluded.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
                <h2 className="font-heading text-sm font-bold text-[#0D1B3D] mb-3">No incluye</h2>
                <ul className="space-y-2">
                  {pkg.excluded.map((item: string) => (
                    <li key={item} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-[#9DAAB5] shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-[#637489]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Itinerary */}
          {pkg.itinerary.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5">
              <h2 className="font-heading text-sm font-bold text-[#0D1B3D] mb-4">Itinerario</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="w-7 h-7 rounded-full bg-[#2BB7A6]/10 flex items-center justify-center text-[#2BB7A6] text-xs font-bold font-body shrink-0">
                        {day.day}
                      </span>
                      <div className="w-px flex-1 bg-[#E2E8ED] my-1" />
                    </div>
                    <div className="pb-4 min-w-0">
                      <p className="font-body text-sm font-bold text-[#0D1B3D] mb-1.5">{day.title}</p>
                      <ul className="space-y-1">
                        {day.activities.map((a, i) => (
                          <li key={i} className="font-body text-xs text-[#637489] flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#9DAAB5] shrink-0" />{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancel policy */}
          {pkg.cancelPolicy && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <CalendarDays className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-sm font-semibold text-amber-800 mb-1">Política de cancelación</p>
                  <p className="font-body text-sm text-amber-700">{pkg.cancelPolicy}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reservation form — right */}
        <div className="lg:col-span-2 lg:sticky lg:top-6 space-y-4">
          {/* Price summary */}
          <div className="bg-[#0D1B3D] rounded-2xl p-5 text-white">
            <p className="font-body text-xs text-white/50 uppercase tracking-wide mb-1">{pkg.name}</p>
            <p className="font-heading text-3xl font-bold text-[#2BB7A6]">
              {formatCOP(pkg.netRate)}
              <span className="text-sm font-body font-normal text-white/40 ml-1">por persona</span>
            </p>
            <p className="font-body text-sm text-white/60 mt-1">
              Comisión para tu agencia: <span className="text-white font-semibold">{pkg.commission}%</span>
            </p>
          </div>

          <div id="reservar" className="bg-white rounded-2xl border border-[#E2E8ED] p-5 scroll-mt-6">
            <h2 className="font-heading text-base font-bold text-[#0D1B3D] mb-1">Solicitar reserva</h2>
            <p className="font-body text-xs text-[#637489] mb-5">
              Tu solicitud será revisada y confirmada en 24–48 h.
            </p>

            {!canReserve ? (
              <div className="text-center py-6">
                <p className="font-body text-sm text-[#637489]">
                  Tu cuenta debe estar <strong>activa</strong> para realizar reservas.
                </p>
              </div>
            ) : (
              <ReserveForm
                packageId={pkg.id}
                packageName={pkg.name}
                netRate={pkg.netRate}
                commission={pkg.commission}
                minPax={pkg.minPax}
                maxPax={pkg.maxPax}
                contactName={profile.agency?.contactName ?? profile.name ?? ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
