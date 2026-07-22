import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserProfile } from "@/lib/auth";

const BUCKET = "payment-proofs";
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 80;

async function ensureBucket() {
  const admin = createAdminClient();
  const { error } = await admin.storage.createBucket(BUCKET, {
    public: true,
    allowedMimeTypes: ["image/webp", "application/pdf"],
    fileSizeLimit: "10mb",
  });
  if (error && !error.message.includes("already exists")) {
    console.error("Bucket error:", error.message);
  }
}

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
  if (!profile || !["admin", "editor", "agency"].includes(profile.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";
  if (!isImage && !isPdf) {
    return NextResponse.json({ error: "Solo se permiten imágenes o archivos PDF" }, { status: 400 });
  }
  if (file.size > MAX_INPUT_BYTES) {
    return NextResponse.json({ error: "El archivo supera el tamaño máximo de 10MB" }, { status: 400 });
  }

  await ensureBucket();

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const admin = createAdminClient();

  let outputBuffer: Buffer;
  let contentType: string;
  let extension: string;

  if (isPdf) {
    outputBuffer = inputBuffer;
    contentType = "application/pdf";
    extension = "pdf";
  } else {
    try {
      outputBuffer = await compressImage(inputBuffer, file.type === "image/gif");
    } catch {
      return NextResponse.json({ error: "No se pudo procesar la imagen" }, { status: 400 });
    }
    contentType = "image/webp";
    extension = "webp";
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const { error } = await admin.storage
    .from(BUCKET)
    .upload(fileName, outputBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
