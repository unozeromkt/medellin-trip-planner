"use client";

import { useActionState } from "react";
import { updateAgencyProfile, type ProfileState } from "@/app/agency/actions";
import { CheckCircle, Loader2 } from "lucide-react";

type Defaults = {
  contactName: string;
  phone: string;
  city: string;
  country: string;
  websiteUrl: string;
  taxId: string;
};

const inputCls =
  "w-full font-body text-sm text-[#0D1B3D] bg-white border border-[#E2E8ED] rounded-xl px-3.5 py-2.5 placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6]/30 focus:border-[#2BB7A6] transition-colors";
const labelCls = "block font-body text-xs font-semibold text-[#637489] mb-1.5";

export function ProfileForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    updateAgencyProfile,
    {}
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6">
      <h2 className="font-heading text-base font-bold text-[#0D1B3D] mb-5">
        Datos de contacto
      </h2>

      {state.success && (
        <div className="mb-5 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <p className="font-body text-sm font-semibold text-emerald-800">
            Perfil actualizado correctamente
          </p>
        </div>
      )}

      {state.error && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-body text-sm text-red-700">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="contactName" className={labelCls}>
              Nombre de contacto <span className="text-red-400">*</span>
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              defaultValue={defaults.contactName}
              placeholder="Ej. María García"
              className={inputCls}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelCls}>
              Teléfono / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={defaults.phone}
              placeholder="+57 300 000 0000"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="city" className={labelCls}>
              Ciudad
            </label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={defaults.city}
              placeholder="Bogotá"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="country" className={labelCls}>
              País
            </label>
            <input
              id="country"
              name="country"
              type="text"
              defaultValue={defaults.country}
              placeholder="Colombia"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="websiteUrl" className={labelCls}>
              Sitio web
            </label>
            <input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              defaultValue={defaults.websiteUrl}
              placeholder="https://tuagencia.com"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="taxId" className={labelCls}>
              NIT / RUT
            </label>
            <input
              id="taxId"
              name="taxId"
              type="text"
              defaultValue={defaults.taxId}
              placeholder="900.000.000-0"
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white font-body font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {pending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
