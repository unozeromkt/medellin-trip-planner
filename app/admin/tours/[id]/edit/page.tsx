import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { updateTour } from "@/app/admin/tours/actions";
import { TourForm } from "@/app/admin/tours/new/TourForm";

async function getPageData(id: string) {
  const [tour, destinations, categories, operators] = await Promise.all([
    db.tour.findUnique({
      where: { id },
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
    db.operator.findMany({
      where: { status: "active" },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!tour) notFound();
  return { tour, destinations, categories, operators };
}

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { tour, destinations, categories, operators } = await getPageData(id);

  const boundUpdateTour = updateTour.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/tours"
          className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a tours
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Editar tour</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Modifica la información del tour. Los cambios reemplazan el contenido anterior.
        </p>
      </div>

      <TourForm
        destinations={destinations}
        categories={categories}
        operators={operators}
        serverAction={boundUpdateTour}
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
      />
    </div>
  );
}
