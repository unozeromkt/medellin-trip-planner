import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { PackageForm } from "./PackageForm";

export const metadata: Metadata = { title: "Nuevo paquete mayorista | Admin" };

export default async function NuevoPaquetePage() {
  const destinations = await db.destination.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { name: true },
  });
  const destinationOptions = destinations.map((d) => d.name);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/paquetes" className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Paquetes mayoristas
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Nuevo paquete mayorista</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Completa la información. Las agencias activas podrán verlo y solicitar reservas.
        </p>
      </div>
      <PackageForm destinationOptions={destinationOptions} />
    </div>
  );
}
