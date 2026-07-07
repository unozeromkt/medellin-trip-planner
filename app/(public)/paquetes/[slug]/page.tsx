import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWholesalePackageBySlug, getActiveWholesalePackages } from "@/lib/queries";
import { PackagePublicClient } from "./PackagePublicClient";

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
    title: `${pkg.name} — Medellín Trip Planner`,
    description: pkg.description,
    robots: { index: false, follow: false },
  };
}

export default async function PackagePublicPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getWholesalePackageBySlug(slug);
  if (!pkg) notFound();

  return <PackagePublicClient pkg={pkg} />;
}
