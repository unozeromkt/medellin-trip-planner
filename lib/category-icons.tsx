"use client";

import {
  Moon,
  Buildings,
  Mountains,
  Confetti,
  Leaf,
  ForkKnife,
  Crown,
  Bank,
  Bus,
  Compass,
  type IconProps,
} from "@phosphor-icons/react";

// `Category.icon` stores a Phosphor icon name typed by hand in the seed data.
// A couple of values don't match an actual export (`Mountain` → `Mountains`,
// `Landmark` doesn't exist → `Bank`), so this map is intentionally forgiving
// and falls back to a generic icon instead of crashing on an unknown name.
const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  Moon,
  Buildings,
  Mountain: Mountains,
  Mountains,
  Confetti,
  Leaf,
  ForkKnife,
  Crown,
  Landmark: Bank,
  Bank,
  Bus,
};

export function CategoryIcon({ icon, ...props }: { icon?: string | null } & IconProps) {
  const Icon = (icon && ICON_MAP[icon]) || Compass;
  return <Icon {...props} />;
}

// `Category.description` is empty in the current seed data — this fallback
// copy keeps the categories pages from shipping with blank cards until real
// descriptions are authored via the admin panel.
export const CATEGORY_FALLBACK_COPY: Record<string, string> = {
  nightlife: "La energía de Medellín después del atardecer: rooftops, bares y fiesta hasta el amanecer.",
  "city-tours": "Recorre la ciudad y su transformación con guías locales expertos.",
  adventure: "Adrenalina al aire libre: parapente, senderismo y deportes extremos.",
  party: "Chivas, rumba y celebraciones inolvidables al estilo paisa.",
  nature: "Desconéctate en paisajes verdes, ríos y montañas de Antioquia.",
  gastronomy: "Sabores locales, mercados y experiencias culinarias auténticas.",
  "vip-experiences": "Experiencias privadas y exclusivas para quienes buscan lo mejor.",
  culture: "Historia, arte y tradición paisa en cada esquina.",
  transportation: "Traslados y transporte cómodo para moverte sin preocupaciones.",
};

export function getCategoryDescription(category: { slug: string; description?: string | null }): string {
  return category.description?.trim() || CATEGORY_FALLBACK_COPY[category.slug] || "Descubre experiencias únicas en esta categoría.";
}
