"use client";

import { useActionState, useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { Loader2, Upload, X } from "lucide-react";
import type { DestinationFormState } from "./actions";

type DestinationAction = (
  prevState: DestinationFormState,
  formData: FormData
) => Promise<DestinationFormState>;

interface DestinationFormProps {
  serverAction: DestinationAction;
  initialData?: {
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    region: string;
  };
  cancelHref: string;
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

const inputCls =
  "w-full h-10 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent";
const labelCls = "block text-sm font-body font-medium text-[#0D1B3D] mb-1.5";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function DestinationForm({ serverAction, initialData, cancelHref }: DestinationFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<DestinationFormState, FormData>(
    serverAction,
    {}
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const slugEdited = useRef(Boolean(initialData));

  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/destinos");
      router.refresh();
    }
  }, [state.success, router]);

  function handleNameChange() {
    if (!slugEdited.current && slugRef.current && nameRef.current) {
      slugRef.current.value = slugify(nameRef.current.value);
    }
  }

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Solo se permiten imágenes.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
      const fd = new FormData();
      fd.append("file", compressed, file.name);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir");
      setCoverImage(data.url as string);
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  }, []);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-body text-sm text-red-700">{state.error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-4">
        <h2 className="font-heading text-base font-bold text-[#0D1B3D]">Datos del destino</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              Título <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameRef}
              name="name"
              type="text"
              required
              defaultValue={initialData?.name}
              onChange={handleNameChange}
              placeholder="Ej. Guatapé"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Slug (URL)</label>
            <input
              ref={slugRef}
              name="slug"
              type="text"
              defaultValue={initialData?.slug}
              onInput={() => {
                slugEdited.current = true;
              }}
              placeholder="guatape"
              className={inputCls}
            />
            <p className="text-xs text-[#9DAAB5] font-body mt-1">
              Se usará para la futura landing page SEO
            </p>
          </div>
        </div>

        <div>
          <label className={labelCls}>Región</label>
          <input
            name="region"
            type="text"
            defaultValue={initialData?.region}
            placeholder="Ej. Oriente antioqueño"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Descripción</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initialData?.description}
            placeholder="Breve descripción del destino…"
            className={`${inputCls} h-auto py-2.5 resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Foto de portada</label>
          <input type="hidden" name="coverImage" value={coverImage} />
          {coverImage ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#F1F3F6] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-[#E2E8ED] hover:border-[#2BB7A6] bg-[#F8FAFC] hover:bg-[#2BB7A6]/5 transition-colors flex flex-col items-center justify-center gap-2 text-[#9DAAB5] hover:text-[#2BB7A6] disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
              <span className="text-sm font-body">
                {uploading ? "Comprimiendo y subiendo..." : "Haz clic o arrastra una imagen"}
              </span>
              <span className="text-xs">JPG, PNG, WebP · Máx 10MB · Se comprime automáticamente</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {uploadError && <p className="text-xs text-red-600 font-body mt-1">{uploadError}</p>}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link
          href={cancelHref}
          className="h-10 px-6 rounded-xl border border-[#E2E8ED] text-sm font-body font-medium text-[#637489] hover:border-[#0D1B3D] hover:text-[#0D1B3D] transition-colors inline-flex items-center"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending || uploading}
          className="h-10 px-8 rounded-xl bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white text-sm font-body font-semibold transition-colors flex items-center gap-2"
        >
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          {pending ? "Guardando…" : initialData ? "Guardar cambios" : "Crear destino"}
        </button>
      </div>
    </form>
  );
}
