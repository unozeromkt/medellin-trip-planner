"use client";

import { useActionState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOperator, type OperatorFormState } from "@/app/admin/operadores/actions";
import { Loader2, Info } from "lucide-react";

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

export function CreateOperatorForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<OperatorFormState, FormData>(
    createOperator,
    {}
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const slugEdited = useRef(false);

  useEffect(() => {
    if (state.success && state.id) {
      router.push(`/admin/operadores/${state.id}`);
    }
  }, [state.success, state.id, router]);

  function handleNameChange() {
    if (!slugEdited.current && slugRef.current && nameRef.current) {
      slugRef.current.value = slugify(nameRef.current.value);
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-body text-sm text-red-700">{state.error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-4">
        <h2 className="font-heading text-base font-bold text-[#0D1B3D]">Datos del operador</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameRef}
              name="name"
              type="text"
              required
              onChange={handleNameChange}
              placeholder="Ej. Aventura Antioquia"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Slug (URL)</label>
            <input
              ref={slugRef}
              name="slug"
              type="text"
              onInput={() => { slugEdited.current = true; }}
              placeholder="aventura-antioquia"
              className={inputCls}
            />
            <p className="text-xs text-[#9DAAB5] font-body mt-1">Se genera automáticamente</p>
          </div>
        </div>

        <div>
          <label className={labelCls}>Nombre comercial</label>
          <input
            name="commercialName"
            type="text"
            placeholder="Nombre visible al público (si difiere del nombre)"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Contacto</label>
            <input name="contactName" type="text" placeholder="Nombre del responsable" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Correo de contacto</label>
            <input name="contactEmail" type="email" placeholder="ops@operador.com" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Teléfono</label>
            <input name="contactPhone" type="tel" placeholder="+57 300 000 0000" className={inputCls} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-4">
        <h2 className="font-heading text-base font-bold text-[#0D1B3D]">Comisión</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Tipo</label>
            <select name="commissionType" defaultValue="percentage" className={inputCls}>
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Fija (COP)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Valor</label>
            <input
              name="commissionValue"
              type="number"
              min="0"
              step="0.5"
              defaultValue="10"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-4">
        <div className="flex items-start gap-2">
          <h2 className="font-heading text-base font-bold text-[#0D1B3D]">
            Usuario del portal (opcional)
          </h2>
        </div>
        <div className="flex items-start gap-2 bg-[#F1F3F6] rounded-xl p-3">
          <Info className="w-4 h-4 text-[#637489] shrink-0 mt-0.5" />
          <p className="font-body text-xs text-[#637489]">
            Si el operador ya tiene una cuenta registrada en el sistema, ingresa su correo para
            vincularla al portal y darle acceso con rol <strong>operator</strong>. También puedes
            hacerlo después desde el detalle del operador.
          </p>
        </div>
        <div>
          <label className={labelCls}>Correo de la cuenta del operador</label>
          <input
            name="operatorEmail"
            type="email"
            placeholder="usuario@operador.com"
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/operadores"
          className="h-10 px-6 rounded-xl border border-[#E2E8ED] text-sm font-body font-medium text-[#637489] hover:border-[#0D1B3D] hover:text-[#0D1B3D] transition-colors inline-flex items-center"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="h-10 px-8 rounded-xl bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white text-sm font-body font-semibold transition-colors flex items-center gap-2"
        >
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          {pending ? "Creando…" : "Crear operador"}
        </button>
      </div>
    </form>
  );
}
