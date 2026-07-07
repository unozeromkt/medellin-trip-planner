"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminProfile } from "@/lib/auth";

export async function setTourStatus(
  id: string,
  status: "published" | "draft"
): Promise<{ error?: string }> {
  if (!(await requireAdminProfile())) return { error: "No autorizado" };
  await db.tour.update({ where: { id }, data: { status } });
  revalidatePath("/admin/tours");
  return {};
}

const tourSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  slug: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  destinationId: z.string().min(1, "Selecciona un destino"),
  operatorId: z.string().min(1, "Selecciona un operador"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  priceFrom: z.coerce.number().positive().optional(),
  priceChild: z.coerce.number().positive().optional(),
  duration: z.string().optional(),
  videoUrl: z.string().optional(),
  status: z.enum(["draft", "pending_review", "approved", "published"]),
  isFeatured: z.boolean().default(false),
});

export type CreateTourState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createTour(
  _prev: CreateTourState,
  formData: FormData
): Promise<CreateTourState> {
  if (!(await requireAdminProfile())) return { message: "No autorizado" };

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    destinationId: formData.get("destinationId"),
    operatorId: formData.get("operatorId"),
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    priceFrom: formData.get("priceFrom") || undefined,
    priceChild: formData.get("priceChild") || undefined,
    duration: formData.get("duration") || undefined,
    videoUrl: formData.get("videoUrl") || undefined,
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "on",
  };

  const parsed = tourSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  // Dynamic array fields
  const categoryIds = formData.getAll("categoryIds") as string[];
  if (!categoryIds.length) {
    return { errors: { categoryIds: ["Selecciona al menos una categoría"] } };
  }

  const coverImage = (formData.get("coverImage") as string) || undefined;
  const galleryImages = formData.getAll("galleryImage") as string[];
  const includes = (formData.getAll("includes") as string[]).filter(Boolean);
  const excludes = (formData.getAll("excludes") as string[]).filter(Boolean);

  // JSON-encoded dynamic arrays
  const itinerary: { title: string; description: string }[] = JSON.parse(
    (formData.get("itineraryJson") as string) || "[]"
  );
  const faqs: { question: string; answer: string }[] = JSON.parse(
    (formData.get("faqsJson") as string) || "[]"
  );
  const testimonials: { authorName: string; rating: number; comment: string }[] = JSON.parse(
    (formData.get("testimonialsJson") as string) || "[]"
  );

  const { priceFrom, priceChild, ...restData } = parsed.data;

  await db.tour.create({
    data: {
      ...restData,
      priceFrom: priceFrom ?? undefined,
      priceChild: priceChild ?? undefined,
      coverImage,
      includes,
      excludes,
      tourCategories: {
        create: categoryIds.map((id) => ({ categoryId: id })),
      },
      images: {
        create: galleryImages.map((url, i) => ({
          url,
          sortOrder: i,
          isCover: false,
        })),
      },
      itinerary: {
        create: itinerary
          .filter((s) => s.title?.trim())
          .map((s, i) => ({
            stepNumber: i + 1,
            title: s.title,
            description: s.description || undefined,
          })),
      },
      faqs: {
        create: faqs
          .filter((f) => f.question?.trim() && f.answer?.trim())
          .map((f) => ({ question: f.question, answer: f.answer })),
      },
      reviews: {
        create: testimonials
          .filter((t) => t.authorName?.trim())
          .map((t) => ({
            authorName: t.authorName,
            rating: t.rating || 5,
            comment: t.comment || undefined,
            isApproved: true,
          })),
      },
    },
  });

  redirect("/admin/tours");
}

export async function updateTour(
  id: string,
  _prev: CreateTourState,
  formData: FormData
): Promise<CreateTourState> {
  if (!(await requireAdminProfile())) return { message: "No autorizado" };

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    destinationId: formData.get("destinationId"),
    operatorId: formData.get("operatorId"),
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    priceFrom: formData.get("priceFrom") || undefined,
    priceChild: formData.get("priceChild") || undefined,
    duration: formData.get("duration") || undefined,
    videoUrl: formData.get("videoUrl") || undefined,
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "on",
  };

  const parsed = tourSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const categoryIds = formData.getAll("categoryIds") as string[];
  if (!categoryIds.length) {
    return { errors: { categoryIds: ["Selecciona al menos una categoría"] } };
  }

  const coverImage = (formData.get("coverImage") as string) || null;
  const galleryImages = formData.getAll("galleryImage") as string[];
  const includes = (formData.getAll("includes") as string[]).filter(Boolean);
  const excludes = (formData.getAll("excludes") as string[]).filter(Boolean);

  const itinerary: { title: string; description: string }[] = JSON.parse(
    (formData.get("itineraryJson") as string) || "[]"
  );
  const faqs: { question: string; answer: string }[] = JSON.parse(
    (formData.get("faqsJson") as string) || "[]"
  );
  const testimonials: { authorName: string; rating: number; comment: string }[] = JSON.parse(
    (formData.get("testimonialsJson") as string) || "[]"
  );

  const { priceFrom, priceChild, ...restData } = parsed.data;

  await db.$transaction(async (tx) => {
    await tx.tour.update({
      where: { id },
      data: {
        ...restData,
        priceFrom: priceFrom ?? null,
        priceChild: priceChild ?? null,
        coverImage,
        includes,
        excludes,
      },
    });

    await tx.tourCategory.deleteMany({ where: { tourId: id } });
    if (categoryIds.length) {
      await tx.tourCategory.createMany({
        data: categoryIds.map((catId) => ({ tourId: id, categoryId: catId })),
      });
    }

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

    await tx.tourReview.deleteMany({ where: { tourId: id } });
    const reviewItems = testimonials.filter((t) => t.authorName?.trim());
    if (reviewItems.length) {
      await tx.tourReview.createMany({
        data: reviewItems.map((t) => ({
          tourId: id,
          authorName: t.authorName,
          rating: t.rating || 5,
          comment: t.comment || null,
          isApproved: true,
        })),
      });
    }
  });

  redirect("/admin/tours");
}
