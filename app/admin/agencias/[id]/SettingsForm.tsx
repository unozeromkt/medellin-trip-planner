"use client";

import { useActionState, useState } from "react";
import { updateAgencySettings, regenerateReferralCode, type SettingsFormState } from "./actions";
import { Loader2, CheckCircle, Copy, RefreshCw } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Level = "bronze" | "silver" | "gold" | "platinum";

const LEVELS: { value: Level; label: string; desc: string }[] = [
  { value: "bronze", label: "Bronce", desc: "Nivel inicial" },
  { value: "silver", label: "Plata", desc: "Programa intermedio" },
  { value: "gold", label: "Oro", desc: "Programa avanzado" },
  { value: "platinum", label: "Platino", desc: "Nivel premium" },
];

const LEVEL_STYLES: Record<Level, string> = {
  bronze: "border-amber-300 bg-amber-50 text-amber-800 ring-amber-400",
  silver: "border-slate-300 bg-slate-50 text-slate-700 ring-slate-400",
  gold: "border-yellow-300 bg-yellow-50 text-yellow-800 ring-yellow-400",
  platinum: "border-[#2BB7A6]/50 bg-[#2BB7A6]/5 text-[#2BB7A6] ring-[#2BB7A6]",
};

const inputClass =
  "w-full h-10 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition";

type Props = {
  agencyId: string;
  commissionPct: number;
  level: Level;
  notes: string | null;
  websiteUrl: string | null;
  taxId: string | null;
  referralCode: string | null;
  logoUrl: string | null;
  referralUrl: string | null;
};

export function SettingsForm({
  agencyId,
  commissionPct,
  level,
  notes,
  websiteUrl,
  taxId,
  referralCode,
  logoUrl,
  referralUrl,
}: Props) {
  const action = updateAgencySettings.bind(null, agencyId);
  const [state, formAction, isPending] = useActionState<SettingsFormState, FormData>(
    action,
    {}
  );
  const [logo, setLogo] = useState(logoUrl ?? "");
  const [copied, setCopied] = useState(false);

  async function handleRegenerate() {
    await regenerateReferralCode(agencyId);
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-body">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-body flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Configuración guardada correctamente.
        </div>
      )}

      {/* Commission */}
      <div>
        <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
          Comisión de la agencia
        </label>
        <p className="text-xs text-[#637489] font-body mb-3">
          Porcentaje que recibe la agencia sobre cada venta. Rango recomendado: 18–25%.
        </p>
        <div className="flex items-center gap-3">
          <div className="relative w-36">
            <input
              name="commissionPct"
              type="number"
              min={0}
              max={50}
              step={0.5}
              defaultValue={commissionPct}
              className={`${inputClass} pr-8`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-body text-[#637489]">
              %
            </span>
          </div>
          <span className="text-xs text-[#637489] font-body">
            Rango permitido: 0% – 50%
          </span>
        </div>
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
          Nivel de fidelización
        </label>
        <p className="text-xs text-[#637489] font-body mb-3">
          Determina los beneficios del programa de fidelización. Las agencias nuevas inician en Bronce.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {LEVELS.map(({ value, label, desc }) => (
            <label
              key={value}
              className={`relative flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all has-[:checked]:ring-2 ${LEVEL_STYLES[value]}`}
            >
              <input
                type="radio"
                name="level"
                value={value}
                defaultChecked={level === value}
                className="sr-only"
              />
              <span className="text-sm font-semibold font-body">{label}</span>
              <span className="text-[11px] font-body opacity-70">{desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Referral code */}
      <div>
        <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
          Código de afiliado
        </label>
        <p className="text-xs text-[#637489] font-body mb-3">
          Se usa para generar el link de referido que la agencia comparte con sus clientes.
        </p>
        <div className="flex items-center gap-2">
          <input
            name="referralCode"
            type="text"
            defaultValue={referralCode ?? ""}
            placeholder="mi-agencia"
            className={inputClass}
          />
          <button
            type="submit"
            formAction={handleRegenerate}
            className="flex items-center gap-1.5 shrink-0 text-sm font-body font-semibold text-[#0D1B3D] bg-[#F1F3F6] hover:bg-[#E2E8ED] border border-[#E2E8ED] px-3.5 h-10 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerar
          </button>
        </div>
        {referralUrl && (
          <div className="flex items-center gap-2 mt-2">
            <input
              readOnly
              value={referralUrl}
              className={`${inputClass} text-[#637489]`}
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(referralUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 shrink-0 text-sm font-body font-semibold text-[#2BB7A6] bg-[#2BB7A6]/10 hover:bg-[#2BB7A6]/20 border border-[#2BB7A6]/30 px-3.5 h-10 rounded-xl transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        )}
      </div>

      {/* Logo */}
      <div>
        <ImageUpload
          label="Logo de la agencia"
          value={logo}
          onChange={setLogo}
          hint="Se muestra en el banner que ve el cliente cuando llega con el link de referido."
        />
        <input type="hidden" name="logoUrl" value={logo} />
      </div>

      {/* Optional fields */}
      <div className="grid sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
            Sitio web
          </label>
          <input
            name="websiteUrl"
            type="url"
            defaultValue={websiteUrl ?? ""}
            placeholder="https://agencia.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
            NIT / Tax ID
          </label>
          <input
            name="taxId"
            type="text"
            defaultValue={taxId ?? ""}
            placeholder="900.123.456-7"
            className={inputClass}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
          Notas internas
        </label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={notes ?? ""}
          placeholder="Observaciones del equipo de ventas o administración…"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition resize-none"
        />
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white font-body font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Guardando…" : "Guardar configuración"}
        </button>
      </div>
    </form>
  );
}
