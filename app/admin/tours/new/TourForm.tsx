"use client";

import { useActionState, useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";
import type { CreateTourState } from "@/app/admin/tours/actions";
import { Plus, X, Upload, Loader2, Star } from "lucide-react";
import type { Destination, Category, TourInitialData } from "@/lib/types";
import type { Operator } from "@prisma/client";

type TourAction = (prevState: CreateTourState, formData: FormData) => Promise<CreateTourState>;

interface TourFormProps {
  destinations: Destination[];
  categories: Category[];
  operators: Operator[];
  serverAction: TourAction;
  initialData?: TourInitialData;
  providerMode?: boolean;
}

type ItineraryStep = { title: string; description: string };
type FaqItem = { question: string; answer: string };
type Testimonial = { authorName: string; rating: number; comment: string };

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

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

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^&?\s/]+)/
  );
  return match ? match[1] : null;
}

function FieldError({ errors, name }: { errors?: Record<string, string[]>; name: string }) {
  const msgs = errors?.[name];
  if (!msgs?.length) return null;
  return <p className="text-xs text-red-600 font-body mt-1">{msgs[0]}</p>;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E9EEF4] p-6">
      <h2 className="font-heading text-base font-bold text-[#0D1B3D] mb-5">{title}</h2>
      {children}
    </div>
  );
}

function inputCls(extra = "") {
  return `w-full h-11 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent ${extra}`;
}

// ─── Image Upload ────────────────────────────────────────────────────────────

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

function ImageUpload({ label, value, onChange, hint }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten imágenes.");
        return;
      }
      setUploading(true);
      setError("");
      try {
        const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
        const fd = new FormData();
        fd.append("file", compressed, file.name);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error al subir");
        onChange(data.url as string);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al subir imagen");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  return (
    <div>
      <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">{label}</label>
      {hint && <p className="text-xs text-[#9DAAB5] font-body mb-2">{hint}</p>}

      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#F1F3F6] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
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
          <span className="text-xs">JPG, PNG, WebP · Máx 15MB · Se comprime automáticamente</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {error && <p className="text-xs text-red-600 font-body mt-1">{error}</p>}
    </div>
  );
}

// ─── Gallery Upload ──────────────────────────────────────────────────────────

function GalleryUpload({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      const remaining = 10 - urls.length;
      if (remaining <= 0) {
        setError("Máximo 10 imágenes en la galería.");
        return;
      }
      const selected = Array.from(files).slice(0, remaining);
      setUploading(true);
      setError("");
      try {
        const newUrls = await Promise.all(
          selected.map(async (file) => {
            const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
            const fd = new FormData();
            fd.append("file", compressed, file.name);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Error");
            return data.url as string;
          })
        );
        onChange([...urls, ...newUrls]);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al subir imágenes");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [urls, onChange]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-body font-medium text-[#0D1B3D]">
          Galería de imágenes
        </label>
        <span className="text-xs text-[#9DAAB5] font-body">{urls.length}/10</span>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-3">
        {urls.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-[#F1F3F6] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Galería ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(urls.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {urls.length < 10 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-[#E2E8ED] hover:border-[#2BB7A6] bg-[#F8FAFC] hover:bg-[#2BB7A6]/5 transition-colors flex flex-col items-center justify-center gap-1 text-[#9DAAB5] hover:text-[#2BB7A6] disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            <span className="text-[10px] font-body text-center px-1">
              {uploading ? "Subiendo..." : "Agregar"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
      />
      {error && <p className="text-xs text-red-600 font-body mt-1">{error}</p>}
    </div>
  );
}

// ─── Main Form ───────────────────────────────────────────────────────────────

const initialState: CreateTourState = {};

export function TourForm({ destinations, categories, operators, serverAction, initialData, providerMode = false }: TourFormProps) {
  const isEdit = !!initialData;
  const [state, action, pending] = useActionState(serverAction, initialState);
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const slugEdited = useRef(isEdit);

  // Media
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    initialData?.images?.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((i) => i.url) ?? []
  );
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl ?? "");

  // Dynamic fields
  const [itinerary, setItinerary] = useState<ItineraryStep[]>(
    initialData?.itinerary?.length
      ? [...initialData.itinerary]
          .sort((a, b) => a.stepNumber - b.stepNumber)
          .map((s) => ({ title: s.title, description: s.description ?? "" }))
      : [{ title: "", description: "" }]
  );
  const [includes, setIncludes] = useState<string[]>(
    initialData?.includes?.length ? initialData.includes : ["", ""]
  );
  const [excludes, setExcludes] = useState<string[]>(
    initialData?.excludes?.length ? initialData.excludes : ["", ""]
  );
  const [faqs, setFaqs] = useState<FaqItem[]>(
    initialData?.faqs?.length
      ? initialData.faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : [{ question: "", answer: "" }]
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialData?.reviews?.map((r) => ({
      authorName: r.authorName,
      rating: r.rating,
      comment: r.comment ?? "",
    })) ?? []
  );

  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null;

  function handleTitleChange() {
    if (!slugEdited.current && slugRef.current && titleRef.current) {
      slugRef.current.value = slugify(titleRef.current.value);
    }
  }

  // Itinerary helpers
  function updateItinerary(i: number, field: keyof ItineraryStep, val: string) {
    setItinerary((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  }
  function addItineraryStep() {
    setItinerary((prev) => [...prev, { title: "", description: "" }]);
  }
  function removeItineraryStep(i: number) {
    setItinerary((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Includes/Excludes helpers
  function updateListItem(setter: React.Dispatch<React.SetStateAction<string[]>>, i: number, val: string) {
    setter((prev) => prev.map((s, idx) => (idx === i ? val : s)));
  }
  function addListItem(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter((prev) => [...prev, ""]);
  }
  function removeListItem(setter: React.Dispatch<React.SetStateAction<string[]>>, i: number) {
    setter((prev) => prev.filter((_, idx) => idx !== i));
  }

  // FAQ helpers
  function updateFaq(i: number, field: keyof FaqItem, val: string) {
    setFaqs((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: val } : f)));
  }
  function addFaq() {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  }
  function removeFaq(i: number) {
    setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Testimonial helpers
  function updateTestimonial(i: number, field: keyof Testimonial, val: string | number) {
    setTestimonials((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: val } : t)));
  }
  function addTestimonial() {
    setTestimonials((prev) => [...prev, { authorName: "", rating: 5, comment: "" }]);
  }
  function removeTestimonial(i: number) {
    setTestimonials((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <form action={action} className="space-y-6">
      {/* ── Hidden serialized fields ── */}
      <input type="hidden" name="coverImage" value={coverImage} />
      <input type="hidden" name="videoUrl" value={videoUrl} />
      {galleryUrls.map((url, i) => (
        <input key={i} type="hidden" name="galleryImage" value={url} />
      ))}
      {includes.filter(Boolean).map((item, i) => (
        <input key={i} type="hidden" name="includes" value={item} />
      ))}
      {excludes.filter(Boolean).map((item, i) => (
        <input key={i} type="hidden" name="excludes" value={item} />
      ))}
      <input type="hidden" name="itineraryJson" value={JSON.stringify(itinerary)} />
      <input type="hidden" name="faqsJson" value={JSON.stringify(faqs)} />
      <input type="hidden" name="testimonialsJson" value={JSON.stringify(testimonials)} />

      {state.message && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-body">
          {state.message}
        </div>
      )}

      {/* ── 1. Información básica ── */}
      <SectionCard title="Información básica">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                ref={titleRef}
                name="title"
                type="text"
                required
                defaultValue={initialData?.title ?? ""}
                onChange={handleTitleChange}
                placeholder="Ej: Tour Guatapé full day con lancha"
                className={inputCls()}
              />
              <FieldError errors={state.errors} name="title" />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <input
                ref={slugRef}
                name="slug"
                type="text"
                required
                defaultValue={initialData?.slug ?? ""}
                onInput={() => { slugEdited.current = true; }}
                placeholder="tour-guatape-full-day"
                className={inputCls()}
              />
              <FieldError errors={state.errors} name="slug" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
              Descripción corta <span className="text-[#9DAAB5] font-normal">(aparece en tarjetas)</span>
            </label>
            <input
              name="shortDescription"
              type="text"
              maxLength={180}
              defaultValue={initialData?.shortDescription ?? ""}
              placeholder="Resumen en 1-2 líneas..."
              className={inputCls()}
            />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
              Descripción completa
            </label>
            <textarea
              name="description"
              rows={6}
              defaultValue={initialData?.description ?? ""}
              placeholder="Descripción detallada del tour, qué vivirá el viajero..."
              className="w-full px-3.5 py-3 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent resize-none"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── 2. Imagen destacada ── */}
      <SectionCard title="Imagen destacada">
        <ImageUpload
          label="Foto principal del tour"
          hint="Esta imagen aparece en la cabecera del tour y en las tarjetas. Se comprime automáticamente."
          value={coverImage}
          onChange={setCoverImage}
        />
      </SectionCard>

      {/* ── 3. Galería ── */}
      <SectionCard title="Galería de imágenes">
        <GalleryUpload urls={galleryUrls} onChange={setGalleryUrls} />
        <p className="text-xs text-[#9DAAB5] font-body mt-2">
          Máximo 10 imágenes. Todas se comprimen automáticamente antes de subir.
        </p>
      </SectionCard>

      {/* ── 4. Video ── */}
      <SectionCard title="Video destacado">
        <div>
          <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
            URL de YouTube
          </label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={inputCls()}
          />
          <p className="text-xs text-[#9DAAB5] font-body mt-1">
            Soporta URLs estándar, shorts y links cortos de youtu.be
          </p>
        </div>

        {videoId && (
          <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
        {videoUrl && !videoId && (
          <p className="text-xs text-amber-600 font-body mt-2">
            URL no reconocida. Usa un link de YouTube válido.
          </p>
        )}
      </SectionCard>

      {/* ── 5. Clasificación ── */}
      <SectionCard title="Clasificación">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
              Destino <span className="text-red-500">*</span>
            </label>
            <select
              name="destinationId"
              required
              defaultValue={initialData?.destinationId ?? ""}
              className={inputCls()}
            >
              <option value="">Selecciona un destino</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <FieldError errors={state.errors} name="destinationId" />
          </div>

          {providerMode ? (
            <input type="hidden" name="operatorId" value={operators[0]?.id ?? ""} />
          ) : (
            <div>
              <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
                Operador <span className="text-red-500">*</span>
              </label>
              <select
                name="operatorId"
                required
                defaultValue={initialData?.operatorId ?? ""}
                className={inputCls()}
              >
                <option value="">Selecciona un operador</option>
                {operators.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
              <FieldError errors={state.errors} name="operatorId" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-2">
            Categorías <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => {
              const checked = initialData?.tourCategories.some((tc) => tc.categoryId === cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-[#E2E8ED] hover:border-[#2BB7A6] hover:bg-[#2BB7A6]/5 transition-colors has-[:checked]:border-[#2BB7A6] has-[:checked]:bg-[#2BB7A6]/10"
                >
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={cat.id}
                    defaultChecked={checked}
                    className="w-4 h-4 accent-[#2BB7A6]"
                  />
                  <span className="text-sm font-body text-[#0D1B3D]">{cat.name}</span>
                </label>
              );
            })}
          </div>
          <FieldError errors={state.errors} name="categoryIds" />
        </div>
      </SectionCard>

      {/* ── 6. Precios y duración ── */}
      <SectionCard title="Precios y duración">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
              Precio adulto (COP)
            </label>
            <input
              name="priceFrom"
              type="number"
              min={0}
              step={1000}
              defaultValue={initialData?.priceFrom ?? ""}
              placeholder="Ej: 85000"
              className={inputCls()}
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
              Precio niño (COP) <span className="text-[#9DAAB5] font-normal">– opcional</span>
            </label>
            <input
              name="priceChild"
              type="number"
              min={0}
              step={1000}
              defaultValue={initialData?.priceChild ?? ""}
              placeholder="Ej: 50000"
              className={inputCls()}
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
              Duración
            </label>
            <input
              name="duration"
              type="text"
              defaultValue={initialData?.duration ?? ""}
              placeholder="Ej: 8 horas · Full day"
              className={inputCls()}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── 7. Itinerario ── */}
      <SectionCard title="Itinerario">
        <div className="space-y-3">
          {itinerary.map((step, i) => (
            <div key={i} className="flex gap-3 items-start group">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#2BB7A6]/10 text-[#2BB7A6] text-xs font-bold font-body shrink-0 mt-2">
                {i + 1}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateItinerary(i, "title", e.target.value)}
                  placeholder={`Paso ${i + 1}: Ej: Salida desde Medellín`}
                  className={inputCls()}
                />
                <textarea
                  value={step.description}
                  onChange={(e) => updateItinerary(i, "description", e.target.value)}
                  placeholder="Descripción del paso (opcional)..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent resize-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItineraryStep(i)}
                className="w-7 h-7 rounded-full text-[#9DAAB5] hover:text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0 mt-2 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItineraryStep}
          className="mt-3 flex items-center gap-2 text-sm font-body font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar paso
        </button>
      </SectionCard>

      {/* ── 8. Incluye / No incluye ── */}
      <div className="grid grid-cols-2 gap-6">
        <SectionCard title="¿Qué incluye?">
          <div className="space-y-2">
            {includes.map((item, i) => (
              <div key={i} className="flex gap-2 group">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 shrink-0 mt-3">
                  <span className="text-[10px] font-bold">✓</span>
                </div>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(setIncludes, i, e.target.value)}
                  placeholder={`Ítem ${i + 1}...`}
                  className={inputCls()}
                />
                <button
                  type="button"
                  onClick={() => removeListItem(setIncludes, i)}
                  className="w-7 h-7 rounded-full text-[#9DAAB5] hover:text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0 mt-2 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem(setIncludes)}
            className="mt-3 flex items-center gap-2 text-sm font-body font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
          >
            <Plus className="w-4 h-4" /> Agregar ítem
          </button>
        </SectionCard>

        <SectionCard title="No incluye">
          <div className="space-y-2">
            {excludes.map((item, i) => (
              <div key={i} className="flex gap-2 group">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-50 text-red-400 shrink-0 mt-3">
                  <span className="text-[10px] font-bold">✗</span>
                </div>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(setExcludes, i, e.target.value)}
                  placeholder={`Ítem ${i + 1}...`}
                  className={inputCls()}
                />
                <button
                  type="button"
                  onClick={() => removeListItem(setExcludes, i)}
                  className="w-7 h-7 rounded-full text-[#9DAAB5] hover:text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0 mt-2 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem(setExcludes)}
            className="mt-3 flex items-center gap-2 text-sm font-body font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
          >
            <Plus className="w-4 h-4" /> Agregar ítem
          </button>
        </SectionCard>
      </div>

      {/* ── 9. Preguntas frecuentes ── */}
      <SectionCard title="Preguntas frecuentes">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="relative bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8ED] group">
              <button
                type="button"
                onClick={() => removeFaq(i)}
                className="absolute top-3 right-3 w-6 h-6 rounded-full text-[#9DAAB5] hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="space-y-2 pr-6">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(i, "question", e.target.value)}
                  placeholder="¿Cuál es la pregunta frecuente?"
                  className={inputCls()}
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(i, "answer", e.target.value)}
                  placeholder="Respuesta clara y concisa..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8ED] bg-white text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent resize-none"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFaq}
          className="mt-3 flex items-center gap-2 text-sm font-body font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar pregunta
        </button>
      </SectionCard>

      {/* ── 10. Testimonios ── */}
      <SectionCard title="Testimonios">
        {testimonials.length === 0 && (
          <p className="text-sm text-[#9DAAB5] font-body mb-4">
            Agrega reseñas reales de clientes que ya hicieron el tour.
          </p>
        )}
        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <div key={i} className="relative bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8ED] group">
              <button
                type="button"
                onClick={() => removeTestimonial(i)}
                className="absolute top-3 right-3 w-6 h-6 rounded-full text-[#9DAAB5] hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="space-y-3 pr-6">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={t.authorName}
                    onChange={(e) => updateTestimonial(i, "authorName", e.target.value)}
                    placeholder="Nombre del cliente"
                    className={inputCls()}
                  />
                  <div>
                    <p className="text-xs font-body text-[#637489] mb-1.5">Calificación</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => updateTestimonial(i, "rating", star)}
                          className="transition-colors"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= t.rating
                                ? "fill-[#FFC97A] text-[#FFC97A]"
                                : "text-[#E2E8ED]"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <textarea
                  value={t.comment}
                  onChange={(e) => updateTestimonial(i, "comment", e.target.value)}
                  placeholder="Comentario del cliente..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8ED] bg-white text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent resize-none"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTestimonial}
          className="mt-3 flex items-center gap-2 text-sm font-body font-medium text-[#2BB7A6] hover:text-[#2BB7A6]/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar testimonio
        </button>
      </SectionCard>

      {/* ── 11. Publicación ── */}
      <SectionCard title="Publicación">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body font-medium text-[#0D1B3D] mb-1.5">
              Estado <span className="text-red-500">*</span>
            </label>
            <select name="status" defaultValue={initialData?.status ?? "draft"} className={inputCls()}>
              <option value="draft">Borrador</option>
              <option value="pending_review">{providerMode ? "Enviar a revisión" : "En revisión"}</option>
              {!providerMode && <option value="approved">Aprobado</option>}
              {!providerMode && <option value="published">Publicado</option>}
            </select>
          </div>
          {!providerMode && (
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-[#E2E8ED] hover:border-[#2BB7A6] hover:bg-[#2BB7A6]/5 transition-colors w-full has-[:checked]:border-[#2BB7A6] has-[:checked]:bg-[#2BB7A6]/10">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={initialData?.isFeatured ?? false}
                  className="w-4 h-4 accent-[#2BB7A6]"
                />
                <div>
                  <p className="text-sm font-body font-medium text-[#0D1B3D]">Tour destacado</p>
                  <p className="text-xs font-body text-[#9DAAB5]">Aparece en la home</p>
                </div>
              </label>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <a
          href={providerMode ? "/provider/tours" : "/admin/tours"}
          className="h-11 px-6 rounded-xl border border-[#E2E8ED] text-sm font-body font-medium text-[#637489] hover:border-[#0D1B3D] hover:text-[#0D1B3D] transition-colors inline-flex items-center"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={pending}
          className="h-11 px-8 rounded-xl bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white text-sm font-body font-semibold transition-colors flex items-center gap-2"
        >
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          {pending
            ? isEdit ? "Guardando cambios..." : "Guardando..."
            : isEdit ? "Guardar cambios" : "Crear tour"}
        </button>
      </div>
    </form>
  );
}
