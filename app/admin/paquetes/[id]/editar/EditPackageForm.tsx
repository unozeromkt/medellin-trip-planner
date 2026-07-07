"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { updatePackage } from "../../actions";

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().regex(/^[a-z0-9-]*$/, "Solo minúsculas, números y guiones").optional(),
  duration: z.string().min(1, "Requerido"),
  durationDays: z.coerce.number().min(1),
  category: z.string().min(1, "Requerido"),
  destinations: z.string().min(1, "Al menos un destino"),
  netRate: z.coerce.number().min(0),
  commission: z.coerce.number().min(0).max(100),
  minPax: z.coerce.number().min(1),
  maxPax: z.coerce.number().min(1),
  highlight: z.boolean().default(false),
  badge: z.string().optional(),
  coverImage: z.string().optional(),
  audiences: z.array(z.string()).default([]),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  operatorCount: z.coerce.number().min(0).default(0),
  experiences: z.string().optional(),
  included: z.string().optional(),
  excluded: z.string().optional(),
  cancelPolicy: z.string().min(1, "Requerido"),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string().min(1, "Título requerido"),
    activities: z.string().min(1, "Al menos una actividad"),
  })).default([]),
  paxPricing: z.array(z.object({
    label: z.string().min(1),
    netRatePP: z.coerce.number().nullable(),
    commission: z.coerce.number().nullable(),
    note: z.string().optional(),
  })).default([]),
  operatorBreakdown: z.array(z.object({
    name: z.string().min(1),
    experience: z.string().min(1),
  })).default([]),
});

type FormValues = z.infer<typeof schema>;

type Defaults = {
  name: string; slug: string; duration: string; durationDays: number;
  category: string; destinations: string; netRate: number; commission: number;
  minPax: number; maxPax: number; highlight: boolean; badge: string;
  coverImage: string; audiences: string[];
  description: string; operatorCount: number; experiences: string;
  included: string; excluded: string; cancelPolicy: string; isActive: boolean;
  sortOrder: number;
  itinerary: { day: number; title: string; activities: string }[];
  paxPricing: { label: string; netRatePP: number | null; commission: number | null; note?: string }[];
  operatorBreakdown: { name: string; experience: string }[];
};

const inputClass = "w-full h-10 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition";
const textareaClass = "w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition resize-none";

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1">{label}</label>
      {hint && <p className="text-xs text-[#637489] font-body mb-1.5">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-xs text-red-600 font-body">{error}</p>}
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#E2E8ED] rounded-2xl overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center justify-between w-full px-5 py-4 bg-[#F8FAFC] hover:bg-[#F1F3F6] transition-colors">
        <span className="font-heading text-sm font-bold text-[#0D1B3D]">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#637489]" /> : <ChevronDown className="w-4 h-4 text-[#637489]" />}
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

export function EditPackageForm({ packageId, defaults }: { packageId: string; defaults: Defaults }) {
  const router = useRouter();
  const [serverState, setServerState] = useState<{ error?: string; success?: boolean; slug?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      ...defaults,
      badge: defaults.badge ?? "",
    },
  });

  const nameValue = watch("name");
  useEffect(() => {
    const slug = nameValue
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") ?? "";
    setValue("slug", slug);
  }, [nameValue, setValue]);

  const { fields: itDays, append: addDay, remove: removeDay } = useFieldArray({ control, name: "itinerary" });
  const { fields: paxRows, append: addPax, remove: removePax } = useFieldArray({ control, name: "paxPricing" });
  const { fields: opRows, append: addOp, remove: removeOp } = useFieldArray({ control, name: "operatorBreakdown" });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const fd = new FormData();

    const scalars = ["name", "slug", "duration", "durationDays", "category", "destinations",
      "netRate", "commission", "minPax", "maxPax", "badge", "description",
      "operatorCount", "experiences", "included", "excluded", "cancelPolicy", "sortOrder"] as const;
    scalars.forEach((k) => fd.set(k, String(values[k] ?? "")));
    fd.set("highlight", values.highlight ? "true" : "false");
    fd.set("isActive", values.isActive ? "true" : "false");
    fd.set("coverImage", values.coverImage ?? "");
    fd.set("audiences", JSON.stringify(values.audiences));

    fd.set("itinerary", JSON.stringify(
      values.itinerary.map((d, i) => ({
        day: i + 1,
        title: d.title,
        activities: d.activities.split("\n").map((a: string) => a.trim()).filter(Boolean),
      }))
    ));
    fd.set("paxPricing", JSON.stringify(values.paxPricing));
    fd.set("operatorBreakdown", JSON.stringify(values.operatorBreakdown));

    const result = await updatePackage(packageId, {}, fd);
    setServerState(result);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverState.error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-body">
          {serverState.error}
        </div>
      )}
      {serverState.success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-body flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Paquete actualizado correctamente.
        </div>
      )}

      <Section title="Información básica">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre del paquete *" error={errors.name?.message}>
            <input {...register("name")} className={inputClass} />
          </Field>
          <Field label="Slug (URL)" error={errors.slug?.message} hint="Auto-generado desde el nombre">
            <input {...register("slug")} className={inputClass} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Duración (texto) *" error={errors.duration?.message}>
            <input {...register("duration")} className={inputClass} />
          </Field>
          <Field label="Días (número) *" error={errors.durationDays?.message}>
            <input {...register("durationDays")} type="number" min={1} className={inputClass} />
          </Field>
          <Field label="Categoría *" error={errors.category?.message}>
            <input {...register("category")} className={inputClass} />
          </Field>
        </div>
        <Field label="Badge (opcional)" error={errors.badge?.message}>
          <input {...register("badge")} placeholder="Nuevo, Exclusivo, Top ventas…" className={inputClass} />
        </Field>
        <Field label="Imagen destacada (URL)" error={errors.coverImage?.message} hint="URL de imagen 800×480px aprox.">
          <input {...register("coverImage")} type="url" placeholder="https://..." className={inputClass} />
        </Field>
        <div>
          <p className="text-sm font-semibold text-[#0D1B3D] font-body mb-2">Audiencias</p>
          <div className="flex flex-wrap gap-2">
            {["Familias", "Parejas", "Entre amigos", "Grupos", "Relax", "Adrenalina", "Cultura", "Premium"].map((tag) => {
              const current = (watch("audiences") ?? []) as string[];
              const checked = current.includes(tag);
              return (
                <label key={tag} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-body font-semibold cursor-pointer transition-colors ${checked ? "bg-[#2BB7A6] border-[#2BB7A6] text-white" : "bg-white border-[#E2E8ED] text-[#637489] hover:border-[#2BB7A6]"}`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked ? [...current, tag] : current.filter((t) => t !== tag);
                      setValue("audiences", next);
                    }}
                  />
                  {tag}
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("isActive")} className="w-4 h-4 rounded accent-[#2BB7A6]" />
            <span className="text-sm font-body text-[#0D1B3D]">Activo (visible para agencias)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("highlight")} className="w-4 h-4 rounded accent-[#2BB7A6]" />
            <span className="text-sm font-body text-[#0D1B3D]">Destacado en dashboard</span>
          </label>
        </div>
      </Section>

      <Section title="Precios y disponibilidad">
        <div className="grid sm:grid-cols-4 gap-4">
          <Field label="Tarifa neta (COP) *" error={errors.netRate?.message}>
            <input {...register("netRate")} type="number" min={0} className={inputClass} />
          </Field>
          <Field label="Comisión %" error={errors.commission?.message}>
            <input {...register("commission")} type="number" min={0} max={100} step={0.5} className={inputClass} />
          </Field>
          <Field label="Mín pax *" error={errors.minPax?.message}>
            <input {...register("minPax")} type="number" min={1} className={inputClass} />
          </Field>
          <Field label="Máx pax *" error={errors.maxPax?.message}>
            <input {...register("maxPax")} type="number" min={1} className={inputClass} />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-[#0D1B3D] font-body">Precios por tramo de pax</label>
            <button type="button" onClick={() => addPax({ label: "", netRatePP: null, commission: null, note: "" })} className="flex items-center gap-1 text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80">
              <Plus className="w-3.5 h-3.5" /> Añadir tramo
            </button>
          </div>
          {paxRows.length === 0 && <p className="text-xs text-[#9DAAB5] font-body">Sin tramos definidos.</p>}
          {paxRows.map((row, i) => (
            <div key={row.id} className="grid grid-cols-4 gap-2 mb-2 items-end">
              <input {...register(`paxPricing.${i}.label`)} placeholder="2-4 pax" className={inputClass} />
              <input {...register(`paxPricing.${i}.netRatePP`)} type="number" placeholder="Net/pax" className={inputClass} />
              <input {...register(`paxPricing.${i}.commission`)} type="number" placeholder="Comisión %" className={inputClass} />
              <div className="flex gap-2">
                <input {...register(`paxPricing.${i}.note`)} placeholder="Nota (opcional)" className={inputClass} />
                <button type="button" onClick={() => removePax(i)} className="shrink-0 text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Destinos y operadores">
        <Field label="Destinos *" error={errors.destinations?.message} hint="Un destino por línea">
          <textarea {...register("destinations")} rows={3} className={textareaClass} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nº de operadores" error={errors.operatorCount?.message}>
            <input {...register("operatorCount")} type="number" min={0} className={inputClass} />
          </Field>
          <Field label="Experiencias incluidas" error={errors.experiences?.message} hint="Una por línea">
            <textarea {...register("experiences")} rows={3} className={textareaClass} />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-[#0D1B3D] font-body">Detalle de operadores</label>
            <button type="button" onClick={() => addOp({ name: "", experience: "" })} className="flex items-center gap-1 text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80">
              <Plus className="w-3.5 h-3.5" /> Añadir operador
            </button>
          </div>
          {opRows.map((row, i) => (
            <div key={row.id} className="grid grid-cols-2 gap-2 mb-2 items-end">
              <input {...register(`operatorBreakdown.${i}.name`)} placeholder="Nombre del operador" className={inputClass} />
              <div className="flex gap-2">
                <input {...register(`operatorBreakdown.${i}.experience`)} placeholder="Qué experiencia aporta" className={inputClass} />
                <button type="button" onClick={() => removeOp(i)} className="shrink-0 text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Descripción y contenido">
        <Field label="Descripción *" error={errors.description?.message}>
          <textarea {...register("description")} rows={4} className={textareaClass} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Incluye" hint="Una línea por ítem">
            <textarea {...register("included")} rows={5} className={textareaClass} />
          </Field>
          <Field label="No incluye" hint="Una línea por ítem">
            <textarea {...register("excluded")} rows={5} className={textareaClass} />
          </Field>
        </div>
        <Field label="Política de cancelación *" error={errors.cancelPolicy?.message}>
          <textarea {...register("cancelPolicy")} rows={3} className={textareaClass} />
        </Field>
      </Section>

      <Section title="Itinerario" defaultOpen={false}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-[#637489] font-body">Un día por bloque. Actividades: una por línea.</p>
          <button type="button" onClick={() => addDay({ day: itDays.length + 1, title: "", activities: "" })} className="flex items-center gap-1 text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80">
            <Plus className="w-3.5 h-3.5" /> Añadir día
          </button>
        </div>
        {itDays.map((day, i) => (
          <div key={day.id} className="border border-[#E2E8ED] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-body font-bold text-[#637489] uppercase tracking-wide">Día {i + 1}</span>
              <button type="button" onClick={() => removeDay(i)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input {...register(`itinerary.${i}.title`)} placeholder="Título del día" className={inputClass} />
            <textarea {...register(`itinerary.${i}.activities`)} rows={4} placeholder={"Check-in hotel\nTour por El Poblado\nCena libre"} className={textareaClass} />
          </div>
        ))}
        {itDays.length === 0 && <p className="text-xs text-[#9DAAB5] font-body text-center py-4">Sin días añadidos.</p>}
      </Section>

      <div className="flex items-center justify-between pt-2">
        <a
          href="/admin/paquetes"
          className="px-5 py-2.5 rounded-xl border border-[#E2E8ED] text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors"
        >
          Cancelar
        </a>
        <div className="flex items-center gap-3">
          {serverState.success && (
            <a
              href={`/agency/paquetes/${serverState.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-body text-[#2BB7A6] hover:underline"
            >
              Ver en portal agencias →
            </a>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white font-body font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  );
}
