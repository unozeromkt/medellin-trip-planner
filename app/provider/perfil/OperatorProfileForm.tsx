"use client";

import { useActionState } from "react";
import { updateOperatorProfile, type OperatorProfileState } from "./actions";
import { CheckCircle, Loader2 } from "lucide-react";

type Defaults = {
  description: string;
  commercialName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  instagramUrl: string;
  facebookUrl: string;
};

const inputCls =
  "w-full font-body text-sm text-[#0D1B3D] bg-white border border-[#E2E8ED] rounded-xl px-3.5 py-2.5 placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6]/30 focus:border-[#2BB7A6] transition-colors";
const labelCls = "block font-body text-xs font-semibold text-[#637489] mb-1.5";

export function OperatorProfileForm({
  operatorId,
  defaults,
}: {
  operatorId: string;
  defaults: Defaults;
}) {
  const [state, formAction, pending] = useActionState<OperatorProfileState, FormData>(
    updateOperatorProfile.bind(null, operatorId),
    {}
  );

  return (
    <div className="space-y-5">
      {/* Public profile */}
      <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6">
        <h2 className="font-heading text-base font-bold text-[#0D1B3D] mb-5">
          Perfil público
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
          <div>
            <label htmlFor="description" className={labelCls}>
              Descripción del operador
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={defaults.description}
              placeholder="Cuéntale a los viajeros qué hace especial a tu operadora, qué tipo de experiencias ofreces..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="commercialName" className={labelCls}>
              Nombre comercial
            </label>
            <input
              id="commercialName"
              name="commercialName"
              type="text"
              defaultValue={defaults.commercialName}
              placeholder="Nombre visible para los viajeros"
              className={inputCls}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contactName" className={labelCls}>
                Nombre de contacto
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                defaultValue={defaults.contactName}
                placeholder="Responsable de ventas"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className={labelCls}>
                Correo de contacto
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={defaults.contactEmail}
                placeholder="ventas@tuoperadora.com"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className={labelCls}>
                Teléfono / WhatsApp
              </label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                defaultValue={defaults.contactPhone}
                placeholder="+57 300 000 0000"
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
                placeholder="https://tuoperadora.com"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="instagramUrl" className={labelCls}>
                Instagram
              </label>
              <input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                defaultValue={defaults.instagramUrl}
                placeholder="https://instagram.com/tuoperadora"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="facebookUrl" className={labelCls}>
                Facebook
              </label>
              <input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                defaultValue={defaults.facebookUrl}
                placeholder="https://facebook.com/tuoperadora"
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
    </div>
  );
}
