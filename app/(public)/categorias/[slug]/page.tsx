import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Compass } from "lucide-react";
import {
  getCategoryBySlug,
  getActiveCategorySlugs,
  getToursByCategorySlug,
} from "@/lib/queries";
import { truncateDescription } from "@/lib/seo";
import { TourCard } from "@/components/tours/TourCard";
import { CategoryIcon, getCategoryDescription } from "@/lib/category-icons";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getActiveCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const title = `${category.name} — Tours y experiencias | Medellín Trip Planner`;
  const description = truncateDescription(getCategoryDescription(category));
  const path = `/categorias/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const [category, tours] = await Promise.all([
    getCategoryBySlug(slug),
    getToursByCategorySlug(slug),
  ]);

  if (!category) notFound();

  const color = category.color ?? "#2BB7A6";

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E2E8ED]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link
            href="/categorias"
            className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Categorías
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="py-14 px-4" style={{ backgroundColor: color }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            <CategoryIcon icon={category.icon} size={32} weight="bold" color="#ffffff" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-white leading-tight">{category.name}</h1>
          <p className="font-body text-base text-white/80 mt-4 max-w-xl mx-auto">
            {getCategoryDescription(category)}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-heading text-2xl font-bold text-[#0D1B3D] mb-5">
          Tours de {category.name}
        </h2>

        {tours.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8ED] p-16 text-center">
            <Compass className="w-10 h-10 text-[#9DAAB5] mx-auto mb-3" />
            <p className="font-body text-sm font-medium text-[#0D1B3D] mb-1">
              Aún no tenemos tours publicados en esta categoría
            </p>
            <p className="font-body text-xs text-[#637489] mb-5">
              Muy pronto sumaremos experiencias aquí. Mientras tanto, explora el resto del catálogo.
            </p>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Ver todos los tours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
