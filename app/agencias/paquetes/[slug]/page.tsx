import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { wholesalePackages } from "@/lib/wholesale-packages";
import { PackageDetailClient } from "./PackageDetailClient";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return wholesalePackages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = wholesalePackages.find((p) => p.slug === slug);
  if (!pkg) return {};
  return {
    title: `${pkg.name} — Paquete Mayorista | Medellín Trip Planner`,
    description: pkg.description,
    robots: { index: false, follow: false },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = wholesalePackages.find((p) => p.slug === slug);
  if (!pkg) notFound();

  const related = wholesalePackages
    .filter((p) => p.slug !== slug && p.category === pkg.category)
    .slice(0, 3);

  return <PackageDetailClient pkg={pkg} related={related} />;
}
