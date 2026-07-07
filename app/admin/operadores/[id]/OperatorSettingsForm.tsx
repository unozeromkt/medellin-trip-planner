"use client";

import { useActionState } from "react";
import type { OperatorFormState } from "@/app/admin/operadores/actions";
import { CheckCircle, Loader2 } from "lucide-react";

type Defaults = {
  commissionType: "percentage" | "fixed";
  commissionValue: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
};

type Action = (prev: OperatorFormState, fd: FormData) => Promise<OperatorFormState>;

const inputCls =
  "w-full h-10 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent";
const labelCls = "block text-sm font-body font-medium text-[#0D1B3D] mb-1.5";

export function OperatorSettingsForm({
  operatorId,
  defaults,
  serverAction,
}: {
  operatorId: string;
  defaults: Defaults;
  serverAction: Action;
}) {
  const [state, formAction, pending] = useActionState<OperatorFormState, FormData>(
    serverAction,
    {}
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8ED] p-6 space-y-5">
      <h2 className="font-heading text-base font-bold text-[#0D1B3D]">Configuración</h2>

      {state.success && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <p className="font-body text-sm font-semibold text-emerald-800">Cambios guardados</p>
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-body text-sm text-red-700">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Tipo de comisión</label>
            <select name="commissionType" defaultValue={defaults.commissionType} className={inputCls}>
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
              defaultValue={defaults.commissionValue}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nombre de contacto</label>
            <input name="contactName" type="text" defaultValue={defaults.contactName} placeholder="Responsable" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Correo de contacto</label>
            <input name="contactEmail" type="email" defaultValue={defaults.contactEmail} placeholder="ops@operador.com" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Teléfono</label>
            <input name="contactPhone" type="tel" defaultValue={defaults.contactPhone} placeholder="+57 300 000 0000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Sitio web</label>
            <input name="websiteUrl" type="url" defaultValue={defaults.websiteUrl} placeholder="https://operador.com" className={inputCls} />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="h-10 px-6 rounded-xl bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white text-sm font-body font-semibold transition-colors flex items-center gap-2"
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
