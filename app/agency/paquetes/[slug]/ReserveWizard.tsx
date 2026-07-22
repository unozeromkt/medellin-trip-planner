"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { submitReservation, updateReservation, type ReserveState } from "./actions";
import { Loader2, CheckCircle, ChevronLeft, ChevronRight, Crown } from "lucide-react";
import { formatCOP } from "@/lib/utils";
import { PAYMENT_METHODS, getPaymentMethod } from "@/lib/payment-info";
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/lib/country-codes";
import { PaymentProofUpload } from "@/components/agency/PaymentProofUpload";

const inputClass =
  "w-full h-11 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition";

type PassengerValue = {
  fullName: string;
  documentId: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
};

const emptyPassenger: PassengerValue = { fullName: "", documentId: "", phoneCountryCode: DEFAULT_COUNTRY_CODE, phone: "", email: "" };

type InitialData = {
  travelDate: string;
  paxCount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message: string;
  groupLanguage: string;
  paymentMethod: string;
  paymentProofUrl: string;
  paymentRef: string;
  passengers: PassengerValue[];
};

type Props = {
  packageId: string;
  packageName: string;
  netRate: number;
  commission: number;
  minPax: number;
  maxPax: number;
  contactName: string;
  mode?: "create" | "edit";
  reservationId?: string;
  initialData?: InitialData;
};

const STEP_LABELS = ["Viaje", "Pasajeros", "Pago", "Revisión"];

export function ReserveWizard({
  packageId,
  packageName,
  netRate,
  commission,
  minPax,
  maxPax,
  contactName,
  mode = "create",
  reservationId,
  initialData,
}: Props) {
  const router = useRouter();
  const action = mode === "edit" ? updateReservation : submitReservation;
  const [state, formAction, isPending] = useActionState<ReserveState, FormData>(action, {});
  const [minTravelDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [step, setStep] = useState(1);

  const [travelDate, setTravelDate] = useState(initialData?.travelDate ?? "");
  const [paxCount, setPaxCount] = useState(initialData?.paxCount ?? minPax);
  const [groupLanguage, setGroupLanguage] = useState(initialData?.groupLanguage ?? "");
  const [message, setMessage] = useState(initialData?.message ?? "");
  const [contactNameValue, setContactNameValue] = useState(initialData?.contactName ?? contactName);
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone ?? "");

  const [passengers, setPassengers] = useState<PassengerValue[]>(() => {
    const base = initialData?.passengers ?? [];
    const count = initialData?.paxCount ?? minPax;
    return Array.from({ length: count }, (_, i) => base[i] ?? emptyPassenger);
  });

  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod ?? "");
  const [paymentProofUrl, setPaymentProofUrl] = useState(initialData?.paymentProofUrl ?? "");
  const [paymentRef, setPaymentRef] = useState(initialData?.paymentRef ?? "");

  const totalNet = netRate * paxCount;
  const commissionAmount = (totalNet * commission) / 100;

  useEffect(() => {
    setPassengers((prev) => {
      if (paxCount === prev.length) return prev;
      if (paxCount > prev.length) {
        return [...prev, ...Array.from({ length: paxCount - prev.length }, () => emptyPassenger)];
      }
      return prev.slice(0, paxCount);
    });
  }, [paxCount]);

  useEffect(() => {
    if (state.success) router.push(mode === "edit" ? "/agency/reservas?updated=1" : "/agency/reservas?new=1");
  }, [state.success, router, mode]);

  const updatePassenger = (index: number, patch: Partial<PassengerValue>) => {
    setPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const step1Valid = travelDate.length > 0 && paxCount >= minPax && paxCount <= maxPax && contactNameValue.trim().length >= 2 && contactEmail.includes("@");
  const step2Valid = useMemo(() => {
    return passengers.every((p, i) => {
      if (!p.fullName.trim() || !p.documentId.trim()) return false;
      if (i === 0) return p.phone.trim().length > 0 && p.email.includes("@");
      return true;
    });
  }, [passengers]);
  const step3Valid = paymentMethod.length > 0 && paymentMethod !== "pse" && paymentProofUrl.length > 0;

  const canAdvance = (from: number) => {
    if (from === 1) return step1Valid;
    if (from === 2) return step2Valid;
    if (from === 3) return step3Valid;
    return true;
  };

  const stepClass = (n: number) => (step === n ? "block" : "hidden");

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="packageId" value={packageId} />
      {mode === "edit" && reservationId && <input type="hidden" name="reservationId" value={reservationId} />}

      {/* Progress */}
      <div className="flex items-center gap-1.5">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${active || done ? "bg-[#2BB7A6]" : "bg-[#E2E8ED]"}`} />
              <p className={`mt-1 text-[10px] font-body text-center ${active ? "text-[#0D1B3D] font-semibold" : "text-[#9DAAB5]"}`}>{label}</p>
            </div>
          );
        })}
      </div>

      {state.error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-body">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-body flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {mode === "edit" ? "Reserva actualizada. Redirigiendo…" : "Solicitud enviada. Redirigiendo a tus reservas…"}
        </div>
      )}

      {/* Step 1 — Viaje */}
      <div className={`space-y-4 ${stepClass(1)}`}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">Fecha de viaje *</label>
            <input
              name="travelDate"
              type="date"
              required
              min={minTravelDate}
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">Número de pasajeros *</label>
            <input
              name="paxCount"
              type="number"
              required
              min={minPax}
              max={maxPax}
              value={paxCount}
              onChange={(e) => setPaxCount(Math.min(maxPax, Math.max(minPax, Number(e.target.value) || minPax)))}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-[#9DAAB5] font-body">{minPax}–{maxPax} pax permitidos</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">Nombre del contacto de la agencia *</label>
          <input
            name="contactName"
            type="text"
            required
            value={contactNameValue}
            onChange={(e) => setContactNameValue(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">Correo electrónico *</label>
            <input
              name="contactEmail"
              type="email"
              required
              placeholder="contacto@agencia.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">Teléfono de contacto</label>
            <input
              name="contactPhone"
              type="tel"
              placeholder="+57 300 000 0000"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">Idioma del grupo</label>
          <select name="groupLanguage" value={groupLanguage} onChange={(e) => setGroupLanguage(e.target.value)} className={inputClass}>
            <option value="">Selecciona un idioma</option>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="pt">Portugués</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">Mensaje, observaciones o requerimientos especiales</label>
          <textarea
            name="message"
            rows={3}
            maxLength={500}
            placeholder="Requerimientos especiales, preferencias del grupo, preguntas…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition resize-none"
          />
        </div>
      </div>

      {/* Step 2 — Pasajeros */}
      <div className={`space-y-4 ${stepClass(2)}`}>
        <p className="text-xs font-body text-[#637489]">
          Ingresa nombre e identificación de cada pasajero. El líder del grupo debe incluir además teléfono y correo.
        </p>
        {passengers.map((p, i) => {
          const isLeader = i === 0;
          return (
            <div key={i} className="rounded-xl border border-[#E2E8ED] p-4 space-y-3">
              <div className="flex items-center gap-1.5">
                {isLeader && <Crown className="w-3.5 h-3.5 text-[#FFC97A]" />}
                <span className="text-sm font-body font-semibold text-[#0D1B3D]">
                  {isLeader ? "Líder del grupo" : `Pasajero ${i + 1}`}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#637489] font-body mb-1">Nombre completo *</label>
                  <input
                    name={`passenger_${i}_fullName`}
                    type="text"
                    required
                    value={p.fullName}
                    onChange={(e) => updatePassenger(i, { fullName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#637489] font-body mb-1">Identificación *</label>
                  <input
                    name={`passenger_${i}_documentId`}
                    type="text"
                    required
                    value={p.documentId}
                    onChange={(e) => updatePassenger(i, { documentId: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              {isLeader && (
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#637489] font-body mb-1">Indicativo *</label>
                    <select
                      name={`passenger_${i}_phoneCountryCode`}
                      value={p.phoneCountryCode}
                      onChange={(e) => updatePassenger(i, { phoneCountryCode: e.target.value })}
                      className={inputClass}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#637489] font-body mb-1">Teléfono *</label>
                    <input
                      name={`passenger_${i}_phone`}
                      type="tel"
                      required
                      value={p.phone}
                      onChange={(e) => updatePassenger(i, { phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#637489] font-body mb-1">Correo electrónico *</label>
                    <input
                      name={`passenger_${i}_email`}
                      type="email"
                      required
                      value={p.email}
                      onChange={(e) => updatePassenger(i, { email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step 3 — Pago */}
      <div className={`space-y-4 ${stepClass(3)}`}>
        <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8ED] p-4 space-y-2">
          <p className="text-xs font-body text-[#637489]">Total a pagar</p>
          <p className="font-heading text-xl font-bold text-[#0D1B3D]">{formatCOP(totalNet)}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-2">Método de pago *</label>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex flex-col gap-2 rounded-xl border p-3 transition-colors ${
                  m.enabled ? "cursor-pointer hover:border-[#2BB7A6]" : "opacity-60 cursor-not-allowed"
                } ${paymentMethod === m.id ? "border-[#2BB7A6] bg-[#2BB7A6]/5" : "border-[#E2E8ED]"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-body font-semibold text-[#0D1B3D]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      disabled={!m.enabled}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                    />
                    {m.label}
                  </span>
                  {m.note && (
                    <span className="text-[10px] font-body font-bold bg-[#FFC97A]/20 text-amber-700 px-2 py-0.5 rounded-full">{m.note}</span>
                  )}
                </div>
                {paymentMethod === m.id && m.fields.length > 0 && (
                  <div className="pl-6 space-y-0.5">
                    {m.fields.map((f) => (
                      <p key={f.label} className="text-xs font-body text-[#637489]">
                        {f.label}: <span className="font-semibold text-[#0D1B3D]">{f.value}</span>
                      </p>
                    ))}
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">Comprobante de pago *</label>
          <PaymentProofUpload value={paymentProofUrl} onChange={setPaymentProofUrl} />
          <input type="hidden" name="paymentProofUrl" value={paymentProofUrl} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0D1B3D] font-body mb-1.5">Número de referencia (opcional)</label>
          <input
            name="paymentRef"
            type="text"
            placeholder="Número de comprobante o transacción"
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Step 4 — Revisión */}
      <div className={`space-y-4 ${stepClass(4)}`}>
        <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8ED] p-4 space-y-2">
          <p className="text-xs font-body font-semibold text-[#637489] uppercase tracking-wide">Resumen de la solicitud</p>
          <p className="text-xs font-body text-[#637489]">
            Viaje: <span className="font-semibold text-[#0D1B3D]">{travelDate}</span> · Pasajeros: <span className="font-semibold text-[#0D1B3D]">{paxCount}</span>
          </p>
          <p className="text-xs font-body text-[#637489]">
            Líder del grupo: <span className="font-semibold text-[#0D1B3D]">{passengers[0]?.fullName || "—"}</span>
          </p>
          <p className="text-xs font-body text-[#637489]">
            Método de pago: <span className="font-semibold text-[#0D1B3D]">{getPaymentMethod(paymentMethod)?.label ?? "—"}</span>
          </p>
          <p className="text-xs font-body text-[#637489]">
            Comprobante: <span className="font-semibold text-[#0D1B3D]">{paymentProofUrl ? "Adjuntado" : "Sin adjuntar"}</span>
          </p>
          <p className="text-xs font-body text-[#637489]">
            Total estimado: <span className="font-semibold text-[#0D1B3D]">{formatCOP(totalNet)}</span>
          </p>
          <p className="text-xs font-body text-[#637489]">
            Tu comisión: <span className="font-semibold text-[#2BB7A6]">{commission}%</span> · Recibes <span className="font-semibold text-[#2BB7A6]">{formatCOP(commissionAmount)}</span>
          </p>
          <p className="text-[10px] font-body text-[#9DAAB5]">El precio final será confirmado por nuestro equipo según disponibilidad.</p>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center gap-3 pt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 h-12 px-4 rounded-xl border border-[#E2E8ED] text-sm font-body font-semibold text-[#637489] hover:text-[#0D1B3D] hover:bg-[#F1F3F6] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            disabled={!canAdvance(step)}
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 flex items-center justify-center gap-1.5 h-12 bg-[#0D1B3D] hover:bg-[#0D1B3D]/90 disabled:opacity-40 text-white font-body font-semibold text-sm rounded-xl transition-colors"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending || state.success}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white font-body font-semibold text-sm rounded-xl transition-colors"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Enviando…" : mode === "edit" ? "Guardar cambios" : `Solicitar reserva — ${packageName}`}
          </button>
        )}
      </div>
    </form>
  );
}
