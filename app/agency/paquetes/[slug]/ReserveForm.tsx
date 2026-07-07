"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitReservation, type ReserveState } from "./actions";
import { Loader2, CheckCircle } from "lucide-react";

const inputClass =
  "w-full h-11 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition";

type Props = {
  packageId: string;
  packageName: string;
  netRate: number;
  commission: number;
  minPax: number;
  maxPax: number;
  contactName: string;
};

export function ReserveForm({ packageId, packageName, netRate, commission, minPax, maxPax, contactName }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ReserveState, FormData>(submitReservation, {});
  const [minTravelDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);

  useEffect(() => {
    if (state.success) router.push("/agency/reservas?new=1");
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="packageId" value={packageId} />

      {state.error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-body">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-body flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Solicitud enviada. Redirigiendo a tus reservas…
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
            Fecha de viaje *
          </label>
          <input
            name="travelDate"
            type="date"
            required
            min={minTravelDate}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
            Número de pasajeros *
          </label>
          <input
            name="paxCount"
            type="number"
            required
            min={minPax}
            max={maxPax}
            defaultValue={minPax}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-[#9DAAB5] font-body">{minPax}–{maxPax} pax permitidos</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
            Nombre del contacto *
          </label>
          <input
            name="contactName"
            type="text"
            required
            defaultValue={contactName}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
            Teléfono de contacto
          </label>
          <input
            name="contactPhone"
            type="tel"
            placeholder="+57 300 000 0000"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">
          Mensaje / observaciones
        </label>
        <textarea
          name="message"
          rows={3}
          maxLength={500}
          placeholder="Requerimientos especiales, preferencias del grupo, preguntas…"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition resize-none"
        />
      </div>

      {/* Price preview */}
      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8ED] p-4 space-y-2">
        <p className="text-xs font-body font-semibold text-[#637489] uppercase tracking-wide">Estimado de la solicitud</p>
        <p className="text-xs font-body text-[#637489]">
          Tarifa neta: <span className="font-semibold text-[#0D1B3D]">${netRate.toLocaleString("es-CO")} COP/pax</span>
        </p>
        <p className="text-xs font-body text-[#637489]">
          Tu comisión: <span className="font-semibold text-[#2BB7A6]">{commission}%</span> sobre tarifa neta
        </p>
        <p className="text-[10px] font-body text-[#9DAAB5]">
          El precio final será confirmado por nuestro equipo según disponibilidad.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending || state.success}
        className="w-full h-12 flex items-center justify-center gap-2 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white font-body font-semibold text-sm rounded-xl transition-colors"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? "Enviando solicitud…" : `Solicitar reserva — ${packageName}`}
      </button>
    </form>
  );
}
