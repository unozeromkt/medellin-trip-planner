"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/app/admin/reservas-tours/actions";
import { LEAD_STATUS_OPTIONS } from "@/lib/lead-status";
import type { LeadStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={status}
        disabled={isPending}
        onChange={(e) => startTransition(() => updateLeadStatus(leadId, e.target.value as LeadStatus))}
        className="h-9 rounded-xl border border-[#E2E8ED] bg-white px-3 text-sm font-body text-[#0D1B3D] disabled:opacity-60"
      >
        {LEAD_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {isPending && <Loader2 className="w-4 h-4 animate-spin text-[#637489]" />}
    </div>
  );
}
