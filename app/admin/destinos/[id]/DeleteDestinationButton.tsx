"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteDestination } from "../actions";

export function DeleteDestinationButton({ id, disabled }: { id: string; disabled: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!confirm("¿Eliminar este destino? Esta acción no se puede deshacer.")) return;
    startTransition(async () => {
      const result = await deleteDestination(id);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/destinos");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleDelete}
        disabled={disabled || pending}
        title={disabled ? "No se puede eliminar: hay tours asociados" : "Eliminar destino"}
        className="flex items-center gap-1.5 text-xs font-body font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        Eliminar
      </button>
      {error && <p className="text-xs font-body text-red-600 max-w-[220px] text-right">{error}</p>}
    </div>
  );
}
