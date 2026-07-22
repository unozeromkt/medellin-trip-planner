import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPublishedTourSlugs, getActiveDestinationSlugs, getActiveCategorySlugs } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tourSlugs, destinationSlugs, categorySlugs] = await Promise.all([
    getPublishedTourSlugs(),
    getActiveDestinationSlugs(),
    getActiveCategorySlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/tours`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/destinos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/categorias`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/experience-builder`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const tourRoutes: MetadataRoute.Sitemap = tourSlugs.map((slug) => ({
    url: `${SITE_URL}/tours/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({
    url: `${SITE_URL}/destinos/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/categorias/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...tourRoutes, ...destinationRoutes, ...categoryRoutes];
}
