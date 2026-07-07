"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUserProfile } from "@/lib/auth";
import type { CreateTourState } from "@/app/admin/tours/actions";

const providerTourSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  slug: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  destinationId: z.string().min(1, "Selecciona un destino"),
  operatorId: z.string().min(1),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  priceFrom: z.coerce.number().positive().optional(),
  priceChild: z.coerce.number().positive().optional(),
  duration: z.string().optional(),
  videoUrl: z.string().optional(),
  status: z.enum(["draft", "pending_review"]),
});

async function requireOperator() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "operator" || !profile.operatorId) return null;
  return profile;
}

function extractFormData(formData: FormData) {
  return {
    coverImage: (formData.get("coverImage") as string) || undefined,
    galleryImages: formData.getAll("galleryImage") as string[],
    includes: (formData.getAll("includes") as string[]).filter(Boolean),
    excludes: (formData.getAll("excludes") as string[]).filter(Boolean),
    itinerary: JSON.parse((formData.get("itineraryJson") as string) || "[]") as {
      title: string;
      description: string;
    }[],
    faqs: JSON.parse((formData.get("faqsJson") as string) || "[]") as {
      question: string;
      answer: string;
    }[],
  };
}

export async function createProviderTour(
  _prev: CreateTourState,
  formData: FormData
): Promise<CreateTourState> {
  const profile = await requireOperator();
  if (!profile) return { message: "No autorizado" };

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    destinationId: formData.get("destinationId"),
    operatorId: profile.operatorId,
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    priceFrom: formData.get("priceFrom") || undefined,
    priceChild: formData.get("priceChild") || undefined,
    duration: formData.get("duration") || undefined,
    videoUrl: formData.get("videoUrl") || undefined,
    status: formData.get("status"),
  };

  const parsed = providerTourSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const categoryIds = formData.getAll("categoryIds") as string[];
  if (!categoryIds.length) {
    return { errors: { categoryIds: ["Selecciona al menos una categoría"] } };
  }

  const { coverImage, galleryImages, includes, excludes, itinerary, faqs } =
    extractFormData(formData);
  const { priceFrom, priceChild, ...restData } = parsed.data;

  await db.tour.create({
    data: {
      ...restData,
      priceFrom: priceFrom ?? undefined,
      priceChild: priceChild ?? undefined,
      coverImage,
      includes,
      excludes,
      tourCategories: { create: categoryIds.map((id) => ({ categoryId: id })) },
      images: {
        create: galleryImages.map((url, i) => ({ url, sortOrder: i, isCover: false })),
      },
      itinerary: {
        create: itinerary
          .filter((s) => s.title?.trim())
          .map((s, i) => ({ stepNumber: i + 1, title: s.title, description: s.description || undefined })),
      },
      faqs: {
        create: faqs
          .filter((f) => f.question?.trim() && f.answer?.trim())
          .map((f) => ({ question: f.question, answer: f.answer })),
      },
    },
  });

  redirect("/provider/tours");
}

export async function updateProviderTour(
  id: string,
  _prev: CreateTourState,
  formData: FormData
): Promise<CreateTourState> {
  const profile = await requireOperator();
  if (!profile) return { message: "No autorizado" };

  const existing = await db.tour.findUnique({ where: { id }, select: { operatorId: true } });
  if (!existing || existing.operatorId !== profile.operatorId) {
    return { message: "No tienes permiso para editar este tour" };
  }

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    destinationId: formData.get("destinationId"),
    operatorId: profile.operatorId,
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    priceFrom: formData.get("priceFrom") || undefined,
    priceChild: formData.get("priceChild") || undefined,
    duration: formData.get("duration") || undefined,
    videoUrl: formData.get("videoUrl") || undefined,
    status: formData.get("status"),
  };

  const parsed = providerTourSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const categoryIds = formData.getAll("categoryIds") as string[];
  if (!categoryIds.length) {
    return { errors: { categoryIds: ["Selecciona al menos una categoría"] } };
  }

  const { coverImage, galleryImages, includes, excludes, itinerary, faqs } =
    extractFormData(formData);
  const { priceFrom, priceChild, ...restData } = parsed.data;

  await db.$transaction(async (tx) => {
    await tx.tour.update({
      where: { id },
      data: {
        ...restData,
        priceFrom: priceFrom ?? null,
        priceChild: priceChild ?? null,
        coverImage: coverImage ?? null,
        includes,
        excludes,
      },
    });

    await tx.tourCategory.deleteMany({ where: { tourId: id } });
    await tx.tourCategory.createMany({
      data: categoryIds.map((catId) => ({ tourId: id, categoryId: catId })),
    });

    await tx.tourImage.deleteMany({ where: { tourId: id } });
    if (galleryImages.length) {
      await tx.tourImage.createMany({
        data: galleryImages.map((url, i) => ({ tourId: id, url, sortOrder: i, isCover: false })),
      });
    }

    await tx.tourItineraryItem.deleteMany({ where: { tourId: id } });
    const itineraryItems = itinerary.filter((s) => s.title?.trim());
    if (itineraryItems.length) {
      await tx.tourItineraryItem.createMany({
        data: itineraryItems.map((s, i) => ({
          tourId: id,
          stepNumber: i + 1,
          title: s.title,
          description: s.description || null,
        })),
      });
    }

    await tx.tourFaq.deleteMany({ where: { tourId: id } });
    const faqItems = faqs.filter((f) => f.question?.trim() && f.answer?.trim());
    if (faqItems.length) {
      await tx.tourFaq.createMany({
        data: faqItems.map((f) => ({ tourId: id, question: f.question, answer: f.answer })),
      });
    }
  });

  redirect("/provider/tours");
}
