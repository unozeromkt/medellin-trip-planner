import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserProfile } from "@/lib/auth";

const BUCKET = "tour-images";
const MAX_INPUT_BYTES = 15 * 1024 * 1024; // raw upload safety cap, pre-compression
const MAX_DIMENSION = 1920; // px, longest side
const WEBP_QUALITY = 80;

async function ensureBucket() {
  const admin = createAdminClient();
  const { error } = await admin.storage.createBucket(BUCKET, {
    public: true,
    allowedMimeTypes: ["image/webp"],
    fileSizeLimit: "5mb",
  });
  // Ignore "already exists" error
  if (error && !error.message.includes("already exists")) {
    console.error("Bucket error:", error.message);
  }
}

// Every image is normalized to WebP server-side so client-side compression
// (which can be skipped or bypassed) is never the only thing keeping the
// bucket in check.
async function compressImage(buffer: Buffer, isAnimated: boolean) {
  return sharp(buffer, { animated: isAnimated })
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
}

export async function POST(request: NextRequest) {
  const profile = await getCurrentUserProfile();
  if (!profile || !["admin", "editor", "operator"].includes(profile.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
  }
  if (file.size > MAX_INPUT_BYTES) {
    return NextResponse.json({ error: "La imagen supera el tamaño máximo de 15MB" }, { status: 400 });
  }

  await ensureBucket();

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let outputBuffer: Buffer;
  try {
    outputBuffer = await compressImage(inputBuffer, file.type === "image/gif");
  } catch {
    return NextResponse.json({ error: "No se pudo procesar la imagen" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const admin = createAdminClient();

  const { error } = await admin.storage
    .from(BUCKET)
    .upload(fileName, outputBuffer, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
