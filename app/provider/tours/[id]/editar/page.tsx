import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { TourForm } from "@/app/admin/tours/new/TourForm";
import { updateProviderTour } from "@/app/provider/tours/actions";

export const metadata: Metadata = { title: "Editar tour | Portal Operadores" };

export default async function ProviderEditarTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "operator" || !profile.operatorId) redirect("/login");

  const [tour, destinations, categories, operator] = await Promise.all([
    db.tour.findUnique({
      where: { id, operatorId: profile.operatorId },
      include: {
        tourCategories: { select: { categoryId: true } },
        images: { orderBy: { sortOrder: "asc" }, select: { url: true, sortOrder: true } },
        itinerary: { orderBy: { stepNumber: "asc" } },
        faqs: true,
        reviews: true,
      },
    }),
    db.destination.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, description: true, coverImage: true, region: true },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, description: true, icon: true, color: true },
    }),
    db.operator.findUnique({ where: { id: profile.operatorId } }),
  ]);

  if (!tour || !operator) notFound();

  // Published/approved tours can't be edited by the provider — must go through admin
  if (tour.status === "published" || tour.status === "approved" || tour.status === "archived") {
    return (
      <div className="max-w-2xl">
        <Link
          href="/provider/tours"
          className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Mis tours
        </Link>
        <div className="bg-[#F8FAFC] border border-[#E2E8ED] rounded-2xl p-8 text-center">
          <p className="font-heading text-base font-bold text-[#0D1B3D] mb-2">
            Este tour no es editable
          </p>
          <p className="font-body text-sm text-[#637489]">
            Los tours publicados o aprobados solo pueden ser modificados por el equipo admin.
            Contacta a soporte si necesitas hacer cambios.
          </p>
        </div>
      </div>
    );
  }

  const boundUpdate = updateProviderTour.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/provider/tours"
          className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Mis tours
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Editar tour</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          {tour.status === "rejected"
            ? "Este tour fue rechazado. Corrige los cambios necesarios y envíalo de nuevo a revisión."
            : "Edita el contenido y guarda los cambios."}
        </p>
      </div>

      {tour.status === "rejected" && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-red-600 text-xs font-bold">!</span>
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-red-800">Tour rechazado</p>
            <p className="font-body text-sm text-red-700 mt-1">
              Revisa el contenido, realiza las correcciones necesarias y cambia el estado a
              &ldquo;Enviar a revisión&rdquo; para que el equipo lo revise nuevamente.
            </p>
          </div>
        </div>
      )}

      <TourForm
        destinations={destinations}
        categories={categories}
        operators={[operator]}
        serverAction={boundUpdate}
        initialData={{
          id: tour.id,
          title: tour.title,
          slug: tour.slug,
          shortDescription: tour.shortDescription,
          description: tour.description,
          coverImage: tour.coverImage,
          videoUrl: tour.videoUrl,
          priceFrom: tour.priceFrom,
          priceChild: tour.priceChild,
          duration: tour.duration,
          destinationId: tour.destinationId,
          operatorId: tour.operatorId,
          status: tour.status,
          isFeatured: tour.isFeatured,
          includes: tour.includes,
          excludes: tour.excludes,
          tourCategories: tour.tourCategories,
          images: tour.images,
          itinerary: tour.itinerary,
          faqs: tour.faqs,
          reviews: tour.reviews,
        }}
        providerMode
      />
    </div>
  );
}
