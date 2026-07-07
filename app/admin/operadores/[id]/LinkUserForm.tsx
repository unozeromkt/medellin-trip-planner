"use client";

import { useActionState } from "react";
import type { OperatorFormState } from "@/app/admin/operadores/actions";
import { CheckCircle, Loader2, UserPlus } from "lucide-react";

type Action = (prev: OperatorFormState, fd: FormData) => Promise<OperatorFormState>;

export function LinkUserForm({ serverAction }: { serverAction: Action }) {
  const [state, formAction, pending] = useActionState<OperatorFormState, FormData>(
    serverAction,
    {}
  );

  return (
    <div className="space-y-3">
      <p className="font-body text-xs font-semibold text-[#637489]">Vincular usuario por correo</p>

      {state.success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <p className="font-body text-xs font-semibold text-emerald-800">Usuario vinculado</p>
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <p className="font-body text-xs text-red-700">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="flex gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="correo@ejemplo.com"
          className="flex-1 h-9 px-3 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-9 px-3 rounded-xl bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 disabled:opacity-60 text-white flex items-center gap-1.5 text-xs font-body font-semibold shrink-0 transition-colors"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
          Vincular
        </button>
      </form>
    </div>
  );
}
