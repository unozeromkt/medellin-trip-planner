import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWholesalePackageBySlug, getRelatedWholesalePackages, getActiveWholesalePackages } from "@/lib/queries";
import { PackageDetailClient } from "./PackageDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const packages = await getActiveWholesalePackages();
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getWholesalePackageBySlug(slug);
  if (!pkg) return {};
  return {
    title: `${pkg.name} — Paquete Mayorista | Medellín Trip Planner`,
    description: pkg.description,
    robots: { index: false, follow: false },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getWholesalePackageBySlug(slug);
  if (!pkg) notFound();

  const related = await getRelatedWholesalePackages(slug, pkg.category);

  return <PackageDetailClient pkg={pkg} related={related} />;
}
