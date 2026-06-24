"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/types";

interface CategoryPillsProps {
  categories: Category[];
  activeSlug?: string | null;
}

export function CategoryPills({ categories, activeSlug }: CategoryPillsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/tours?${params.toString()}`);
  }

  const isActive = (slug: string | null) =>
    slug === null ? !activeSlug : activeSlug === slug;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
      {/* "Todos" pill */}
      <button
        onClick={() => handleSelect(null)}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          isActive(null)
            ? "bg-[#0D1B3D] text-white shadow-sm"
            : "bg-white text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground"
        }`}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.slug)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            isActive(cat.slug)
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
