"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Star, MapPin, ArrowRight, ImageIcon } from "lucide-react";
import type { Destination } from "@/lib/types";

interface DestinationCardProps {
  destination: Destination;
  tourCount: number;
}

export function DestinationCard({ destination, tourCount }: DestinationCardProps) {
  return (
    <motion.div whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}>
      <Link
        href={`/destinos/${destination.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-[#E2E8ED] shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F1F3F6]">
          {destination.coverImage ? (
            <Image
              src={destination.coverImage}
              alt={destination.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#9DAAB5]">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Star className="h-3 w-3 text-[#FFC97A] fill-[#FFC97A]" />
            <span className="text-xs font-body font-semibold text-white">
              {destination.rating?.toFixed(1) ?? "4.7"}
            </span>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-4">
            <h3 className="font-heading font-bold text-xl text-white leading-tight">{destination.name}</h3>
            {destination.region && (
              <p className="flex items-center gap-1 text-white/70 text-xs font-body mt-0.5">
                <MapPin className="w-3 h-3" /> {destination.region}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          {destination.description && (
            <p className="text-sm font-body text-[#637489] line-clamp-2">{destination.description}</p>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-full bg-[#F1F3F6] text-[#637489]">
              {tourCount > 0 ? `${tourCount} tour${tourCount !== 1 ? "s" : ""}` : "Próximamente"}
            </span>
            <span className="flex items-center gap-1 text-xs font-body font-semibold text-[#2BB7A6] group-hover:gap-1.5 transition-all">
              Ver tours <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
