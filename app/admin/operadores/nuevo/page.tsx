import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateOperatorForm } from "./CreateOperatorForm";

export const metadata: Metadata = { title: "Nuevo operador | Admin" };

export default function NuevoOperadorPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/operadores"
          className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Operadores
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">Nuevo operador</h1>
        <p className="text-[#637489] text-sm font-body mt-1">
          Crea el perfil del operador y opcionalmente vincula su cuenta de acceso al portal.
        </p>
      </div>

      <CreateOperatorForm />
    </div>
  );
}
