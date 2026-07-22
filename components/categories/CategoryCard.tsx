"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { CategoryIcon, getCategoryDescription } from "@/lib/category-icons";

interface CategoryCardProps {
  category: Category;
  tourCount: number;
}

export function CategoryCard({ category, tourCount }: CategoryCardProps) {
  const color = category.color ?? "#2BB7A6";

  return (
    <motion.div whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}>
      <Link
        href={`/categorias/${category.slug}`}
        className="group flex flex-col h-full bg-white rounded-2xl border border-[#E2E8ED] p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: `${color}1A` }}
        >
          <CategoryIcon icon={category.icon} size={24} weight="bold" color={color} />
        </div>

        <h3 className="font-heading font-bold text-base text-[#0D1B3D] mb-1.5">{category.name}</h3>
        <p className="text-sm font-body text-[#637489] line-clamp-2 flex-1">
          {getCategoryDescription(category)}
        </p>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F1F3F6]">
          <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-full bg-[#F1F3F6] text-[#637489]">
            {tourCount > 0 ? `${tourCount} tour${tourCount !== 1 ? "s" : ""}` : "Próximamente"}
          </span>
          <span className="flex items-center gap-1 text-xs font-body font-semibold text-[#2BB7A6] group-hover:gap-1.5 transition-all">
            Explorar <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
