import type { Metadata } from "next";
import { getActiveCategories, getCategoryTourCounts } from "@/lib/queries";
import { CategoryCard } from "@/components/categories/CategoryCard";

const TITLE = "Categorías de experiencias";
const DESCRIPTION =
  "Explora tours por categoría: aventura, gastronomía, vida nocturna, cultura y más experiencias en Medellín y Antioquia.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/categorias" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/categorias", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function CategoriasPage() {
  const [categories, tourCounts] = await Promise.all([
    getActiveCategories(),
    getCategoryTourCounts(),
  ]);

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* Hero */}
      <div className="bg-[#0D1B3D] py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-body text-xs font-semibold text-[#2BB7A6] tracking-widest uppercase mb-3">
            Vive a tu manera
          </p>
          <h1 className="font-heading text-4xl font-bold text-white leading-tight">
            ¿Qué tipo de experiencia
            <br />
            <span className="text-[#2BB7A6]">buscas?</span>
          </h1>
          <p className="font-body text-base text-white/60 mt-4 max-w-xl mx-auto">
            De la adrenalina a la buena mesa, de la rumba a la cultura — encuentra tours agrupados por lo que
            realmente te mueve.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} tourCount={tourCounts[category.slug] ?? 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
