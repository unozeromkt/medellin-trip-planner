"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Heart, ShoppingCart, Globe, User } from "lucide-react";
import { WhatsappLogo, InstagramLogo } from "@phosphor-icons/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useExperienceBuilderOptional } from "@/lib/experience-builder-context";

const navLinks = [
  { label: "Explorar", href: "/tours" },
  { label: "Destinos", href: "/destinations" },
  { label: "Categorías", href: "/categories" },
  { label: "Blog", href: "/blog" },
];

const WHATSAPP_NUMBER = "573107788830";
const PHONE_DISPLAY = "(310)-778 8830";

type Currency = "COP" | "USD";

interface NavActionProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: number;
}

function NavAction({ icon, label, href, onClick, badge }: NavActionProps) {
  const cls =
    "relative flex flex-col items-center gap-[3px] px-3 py-2 text-[#5C6E7A] hover:text-[#0D1B3D] transition-colors cursor-pointer select-none";

  const inner = (
    <>
      <span className="h-[22px] w-[22px] flex items-center justify-center">{icon}</span>
      <span className="text-[10px] font-medium leading-none whitespace-nowrap tracking-wide">{label}</span>
      {badge != null && badge > 0 && (
        <span className="absolute top-1 right-1.5 min-w-[15px] h-[15px] rounded-full bg-[#2BB7A6] text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
          {badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("COP");
  const builder = useExperienceBuilderOptional();
  const count = builder?.selectedTours.length ?? 0;

  function toggleCurrency() {
    setCurrency((c) => (c === "COP" ? "USD" : "COP"));
  }

  const currencyLabel = `ES / ${currency} $`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8ED] shadow-[0_1px_4px_rgba(13,27,61,0.06)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex flex-col leading-none group shrink-0">
          <span className="text-[8.5px] font-medium text-[#8A9BAD] tracking-[0.2em] uppercase select-none">
            Medellín
          </span>
          <span className="font-heading font-bold text-[1.1rem] leading-tight">
            <span className="text-[#0D1B3D] group-hover:text-[#0D1B3D]/80 transition-colors">Trip </span>
            <span className="text-[#2BB7A6]">Planner</span>
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-[#4A5C6A] hover:text-[#0D1B3D] hover:bg-[#F1F3F6] rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop action icons ── */}
        <div className="hidden md:flex items-center divide-x divide-[#E2E8ED]">
          <NavAction
            icon={<Heart className="h-[18px] w-[18px]" strokeWidth={1.6} />}
            label="Favoritos"
            href="/favorites"
          />
          <NavAction
            icon={<ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.6} />}
            label="Carrito"
            href="/experience-builder"
            badge={count}
          />
          <NavAction
            icon={<Globe className="h-[18px] w-[18px]" strokeWidth={1.6} />}
            label={currencyLabel}
            onClick={toggleCurrency}
          />
          <NavAction
            icon={<User className="h-[18px] w-[18px]" strokeWidth={1.6} />}
            label="Perfil"
            href="/account"
          />
        </div>

        {/* ── Mobile: cart badge + hamburger ── */}
        <div className="flex items-center gap-1 md:hidden">
          <NavAction
            icon={<ShoppingCart className="h-5 w-5" strokeWidth={1.6} />}
            label="Carrito"
            href="/experience-builder"
            badge={count}
          />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md w-9 h-9 hover:bg-[#F1F3F6] transition-colors">
              <Menu className="h-5 w-5 text-[#0D1B3D]" />
              <span className="sr-only">Abrir menú</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-8 px-5">

              {/* Logo in sheet */}
              <div className="mb-6">
                <span className="text-[8.5px] font-medium text-[#8A9BAD] tracking-[0.2em] uppercase">Medellín</span>
                <p className="font-heading font-bold text-xl">
                  <span className="text-[#0D1B3D]">Trip </span>
                  <span className="text-[#2BB7A6]">Planner</span>
                </p>
              </div>

              <nav className="flex flex-col gap-0.5 mb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center py-2.5 px-3 text-sm font-medium text-[#0D1B3D] hover:text-[#2BB7A6] hover:bg-[#F1F3F6] rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Utility links */}
              <div className="flex flex-col gap-1 border-t border-[#E2E8ED] pt-4 mb-5">
                <Link
                  href="/favorites"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium text-[#4A5C6A] hover:text-[#0D1B3D] hover:bg-[#F1F3F6] rounded-md transition-colors"
                >
                  <Heart className="h-4 w-4" strokeWidth={1.6} />
                  Favoritos
                </Link>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium text-[#4A5C6A] hover:text-[#0D1B3D] hover:bg-[#F1F3F6] rounded-md transition-colors"
                >
                  <User className="h-4 w-4" strokeWidth={1.6} />
                  Perfil
                </Link>
              </div>

              {/* Currency + contact */}
              <div className="border-t border-[#E2E8ED] pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#8A9BAD]" strokeWidth={1.6} />
                  <span className="text-xs text-[#8A9BAD]">Moneda:</span>
                  {(["COP", "USD"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`text-xs px-2.5 py-0.5 rounded-full border transition-colors ${
                        currency === c
                          ? "bg-[#0D1B3D] text-white border-[#0D1B3D]"
                          : "border-[#D0D9E0] text-[#4A5C6A] hover:border-[#0D1B3D]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-[#4A5C6A] hover:text-[#0D1B3D] transition-colors"
                >
                  <WhatsappLogo size={16} weight="fill" color="#25D366" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-[#4A5C6A] hover:text-[#0D1B3D] transition-colors"
                >
                  <InstagramLogo size={15} weight="bold" />
                  <span>Instagram</span>
                </a>
              </div>

            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
