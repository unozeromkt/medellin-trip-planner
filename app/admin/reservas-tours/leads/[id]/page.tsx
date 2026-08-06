import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, Phone, Mail, Calendar, Users, MessageSquare, ExternalLink } from "lucide-react";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";

export const metadata: Metadata = { title: "Detalle de solicitud | Admin" };

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      leadTours: { include: { tour: { select: { title: true, slug: true } } } },
      agency: { select: { name: true, referralCode: true } },
    },
  });

  if (!lead) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/admin/reservas-tours" className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D]">
        <ArrowLeft className="w-4 h-4" /> Volver a reservas de tours
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">{lead.name || "Sin nombre"}</h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            Solicitud por WhatsApp ·{" "}
            {new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(
              new Date(lead.createdAt)
            )}
          </p>
        </div>
        <LeadStatusSelect leadId={lead.id} status={lead.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5 space-y-3">
          <h2 className="font-heading text-sm font-bold text-[#0D1B3D] uppercase tracking-wide">Contacto</h2>
          {lead.phone && (
            <p className="flex items-center gap-2 text-sm font-body text-[#0D1B3D]">
              <Phone className="w-4 h-4 text-[#637489]" /> {lead.phone}
            </p>
          )}
          {lead.email && (
            <p className="flex items-center gap-2 text-sm font-body text-[#0D1B3D]">
              <Mail className="w-4 h-4 text-[#637489]" /> {lead.email}
            </p>
          )}
          {lead.travelDate && (
            <p className="flex items-center gap-2 text-sm font-body text-[#0D1B3D]">
              <Calendar className="w-4 h-4 text-[#637489]" />
              {new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(lead.travelDate))}
            </p>
          )}
          {lead.peopleCount && (
            <p className="flex items-center gap-2 text-sm font-body text-[#0D1B3D]">
              <Users className="w-4 h-4 text-[#637489]" /> {lead.peopleCount} personas
            </p>
          )}
          {lead.whatsappUrl && (
            <a
              href={lead.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#25D366] hover:text-[#1ebe59]"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir chat de WhatsApp
            </a>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5 space-y-3">
          <h2 className="font-heading text-sm font-bold text-[#0D1B3D] uppercase tracking-wide">Tours de interés</h2>
          {lead.leadTours.length === 0 ? (
            <p className="text-sm font-body text-[#637489]">Sin tours asociados.</p>
          ) : (
            <ul className="space-y-2">
              {lead.leadTours.map((lt) => (
                <li key={lt.id} className="flex justify-between text-sm font-body">
                  <Link href={`/tours/${lt.tour.slug}`} target="_blank" className="text-[#0D1B3D] hover:text-[#2BB7A6] truncate pr-2">
                    {lt.tour.title}
                  </Link>
                  {lt.priceSnapshot && (
                    <span className="text-[#2BB7A6] font-semibold shrink-0">
                      {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
                        lt.priceSnapshot
                      )}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {lead.budgetMin != null && (
            <p className="text-xs font-body text-[#637489] pt-2 border-t border-[#E2E8ED]">
              Presupuesto: {new Intl.NumberFormat("es-CO").format(lead.budgetMin)}
              {lead.budgetMax ? ` – ${new Intl.NumberFormat("es-CO").format(lead.budgetMax)}` : "+"} COP
            </p>
          )}
        </div>
      </div>

      {(lead.message || lead.additionalInfo) && (
        <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5 space-y-2">
          <h2 className="font-heading text-sm font-bold text-[#0D1B3D] uppercase tracking-wide flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Notas del cliente
          </h2>
          {lead.additionalInfo && <p className="text-sm font-body text-[#637489]">{lead.additionalInfo}</p>}
          {lead.message && <p className="text-sm font-body text-[#637489] italic">&ldquo;{lead.message}&rdquo;</p>}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-5 space-y-1 text-xs font-body text-[#9DAAB5]">
        <p>Fuente: {lead.source || "—"}</p>
        {lead.pageUrl && <p>Página de origen: {lead.pageUrl}</p>}
        {lead.agency && (
          <p>
            Referido por agencia: {lead.agency.name} ({lead.agency.referralCode})
          </p>
        )}
        {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
          <p>
            UTM: {lead.utmSource ?? "—"} / {lead.utmMedium ?? "—"} / {lead.utmCampaign ?? "—"}
          </p>
        )}
      </div>
    </div>
  );
}
