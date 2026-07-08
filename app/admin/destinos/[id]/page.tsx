import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { DestinationForm } from "../DestinationForm";
import { updateDestination } from "../actions";
import { DeleteDestinationButton } from "./DeleteDestinationButton";

export const metadata: Metadata = { title: "Editar destino | Admin" };

export default async function EditDestinoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await db.destination.findUnique({
    where: { id },
    include: { _count: { select: { tours: true } } },
  });

  if (!destination) notFound();

  const updateAction = updateDestination.bind(null, destination.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/destinos"
            className="inline-flex items-center gap-1.5 text-sm font-body text-[#637489] hover:text-[#0D1B3D] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Destinos
          </Link>
          <h1 className="font-heading text-2xl font-bold text-[#0D1B3D]">{destination.name}</h1>
          <p className="text-[#637489] text-sm font-body mt-1">
            {destination._count.tours} tour(s) asociados
          </p>
        </div>
        <DeleteDestinationButton id={destination.id} disabled={destination._count.tours > 0} />
      </div>

      <DestinationForm
        serverAction={updateAction}
        cancelHref="/admin/destinos"
        initialData={{
          name: destination.name,
          slug: destination.slug,
          description: destination.description ?? "",
          coverImage: destination.coverImage ?? "",
          region: destination.region ?? "",
        }}
      />
    </div>
  );
}
