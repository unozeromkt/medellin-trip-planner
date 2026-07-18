"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { label: "Catálogo", href: "#catalogo" },
  { label: "Destinos", href: "#destinos" },
  { label: "Operadores", href: "#operadores" },
  { label: "Cómo Funciona", href: "#proceso" },
];

export function AgencyNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0D1B3D]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/agencias" className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-[#F1F3F6] text-sm font-normal">Medellín</span>
              <span className="font-heading text-[#F1F3F6] text-xl font-bold">Trip</span>
              <span className="font-heading text-[#2BB7A6] text-xl font-bold">Planner</span>
            </div>
            <span className="font-body text-[#FFC97A] text-[9px] font-semibold tracking-[0.16em] uppercase leading-none">
              Portal Mayorista
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-[#A8CBE6] hover:text-white text-sm font-medium transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className={cn(buttonVariants(), "flex items-center gap-1.5 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white text-sm px-5 h-9 rounded-xl font-semibold shadow-md shadow-[#2BB7A6]/20")}
            >
              <LogIn className="w-3.5 h-3.5" />
              Iniciar sesión
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[#F1F3F6] p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0D1B3D] border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block font-body text-[#A8CBE6] hover:text-white text-base py-2.5 font-medium"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 space-y-2 border-t border-white/10 mt-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={cn(buttonVariants(), "w-full flex items-center justify-center gap-1.5 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-semibold rounded-xl h-11")}
            >
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
