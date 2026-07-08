import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DestinationForm } from "../DestinationForm";
import { createDestination } from "../actions";

export const metadata: Metadata = { title: "Nuevo destino | Admin" };

export default function NuevoDestinoPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/destinos"
          className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Destinos
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Nuevo destino</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Crea un destino para poder asignarlo a los tours.
        </p>
      </div>

      <DestinationForm serverAction={createDestination} cancelHref="/admin/destinos" />
    </div>
  );
}
