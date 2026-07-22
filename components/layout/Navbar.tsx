"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, ShoppingCart, Globe, User, LayoutDashboard, LogOut, ChevronDown, Phone, ArrowRight } from "lucide-react";
import { WhatsappLogo, InstagramLogo, TiktokLogo } from "@phosphor-icons/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useExperienceBuilderOptional } from "@/lib/experience-builder-context";
import { useCurrency } from "@/lib/currency-context";
import { roleHomePath } from "@/lib/roles";
import { signOut } from "@/app/(auth)/actions";

const navLinks = [
  { label: "Explorar", href: "/tours" },
  { label: "Destinos", href: "/destinos" },
  { label: "Categorías", href: "/categorias" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

const WHATSAPP_NUMBER = "573107788830";
const PHONE_DISPLAY = "(310)-778 8830";
const CALL_NUMBER = "573118681689";
const CALL_DISPLAY = "(311)-868 1689";
const INSTAGRAM_URL = "https://instagram.com";
const TIKTOK_URL = "https://tiktok.com";
const RESERVE_HREF = "/tours";

const iconBtn =
  "relative w-10 h-10 rounded-full flex items-center justify-center text-[#4A5C6A] hover:text-[#0D1B3D] hover:bg-[#F1F3F6] transition-colors";

function isActiveLink(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavUser = {
  name: string | null;
  email: string;
  role: string;
};

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function AdminProfileMenu({ user }: { user: NavUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = getInitials(user.name, user.email);
  const displayName = user.name ?? user.email.split("@")[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-10 pl-1 pr-2.5 rounded-full hover:bg-[#F1F3F6] transition-colors cursor-pointer select-none"
      >
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2BB7A6] text-white text-[11px] font-bold leading-none">
          {initials}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#637489] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-[#E2E8ED] rounded-2xl shadow-lg shadow-[#0D1B3D]/10 py-2 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[#F1F3F6]">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-8 h-8 rounded-full bg-[#2BB7A6] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-body font-semibold text-[#0D1B3D] truncate">{user.name ?? displayName}</p>
                <p className="text-[11px] font-body text-[#9DAAB5] truncate">{user.email}</p>
              </div>
            </div>
            <span className="inline-block text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-[#E8F8F6] text-[#2BB7A6] capitalize mt-1">
              {user.role}
            </span>
          </div>

          {/* Actions */}
          <div className="py-1.5 px-2">
            <Link
              href={roleHomePath(user.role)}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-body font-semibold text-white bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Ir al dashboard
            </Link>
          </div>

          <div className="border-t border-[#F1F3F6] py-1.5 px-2">
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-body text-[#637489] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar({ user }: { user?: NavUser | null }) {
  const [open, setOpen] = useState(false);
  const { currency, setCurrency, toggleCurrency } = useCurrency();
  const builder = useExperienceBuilderOptional();
  const count = builder?.selectedTours.length ?? 0;
  const pathname = usePathname();

  return (
    <>
      {/* ── Utility bar: tagline + socials ── */}
      <div className="hidden md:block bg-[#0D1B3D]">
        <div className="container mx-auto px-4 h-9 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="text-[#FFC97A] font-bold">—</span> Experiencias por toda Colombia
          </span>
          <div className="flex items-center gap-3.5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/70 hover:text-white transition-colors"
            >
              <InstagramLogo size={15} weight="fill" />
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-white/70 hover:text-white transition-colors"
            >
              <TiktokLogo size={15} weight="fill" />
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E2E8ED] shadow-[0_2px_12px_rgba(13,27,61,0.06)]">
        <div className="container mx-auto px-4 h-[70px] flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="shrink-0" aria-label="Medellín Trip Planner - Inicio">
            <Image
              src="/logo_medellin_trip_planner.png"
              alt="Medellín Trip Planner"
              width={168}
              height={56}
              priority
              className="h-9 w-auto md:h-10"
            />
          </Link>

          {/* ── Desktop nav links (rounded pills) ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    active
                      ? "bg-[#E8F8F6] text-[#2BB7A6]"
                      : "text-[#4A5C6A] hover:text-[#0D1B3D] hover:bg-[#F1F3F6]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop right cluster ── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Phone block */}
            <a href={`tel:+${CALL_NUMBER}`} className="hidden lg:flex items-center gap-2.5 group pr-1">
              <span className="w-9 h-9 rounded-full bg-[#2BB7A6]/10 flex items-center justify-center text-[#2BB7A6] group-hover:bg-[#2BB7A6] group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" strokeWidth={2} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] text-[#8A9BAD] font-medium">Llámenos</span>
                <span className="text-sm font-bold text-[#0D1B3D]">{CALL_DISPLAY}</span>
              </span>
            </a>

            <span className="hidden lg:block w-px h-6 bg-[#E2E8ED]" />

            {/* Currency */}
            <button
              onClick={toggleCurrency}
              className="h-10 px-3 rounded-full flex items-center gap-1.5 text-sm font-semibold text-[#4A5C6A] hover:text-[#0D1B3D] hover:bg-[#F1F3F6] transition-colors"
              aria-label="Cambiar moneda"
            >
              <Globe className="h-[18px] w-[18px]" strokeWidth={1.7} />
              {currency}
            </button>

            {/* Cart */}
            <Link href="/experience-builder" className={iconBtn} aria-label="Mi experiencia">
              <ShoppingCart className="h-[19px] w-[19px]" strokeWidth={1.7} />
              {count > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-[#2BB7A6] text-white text-[9px] font-bold flex items-center justify-center px-1 leading-none">
                  {count}
                </span>
              )}
            </Link>

            {/* Profile / account */}
            {user ? (
              <AdminProfileMenu user={user} />
            ) : (
              <Link href="/account" className={iconBtn} aria-label="Mi perfil">
                <User className="h-[19px] w-[19px]" strokeWidth={1.7} />
              </Link>
            )}

            {/* Reservar ahora CTA */}
            <Link
              href={RESERVE_HREF}
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#2BB7A6] text-white text-sm font-bold shadow-lg shadow-[#2BB7A6]/25 hover:bg-[#25A396] hover:shadow-[#2BB7A6]/40 transition-all"
            >
              Reservar ahora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Mobile: Reservar + cart + hamburger ── */}
          <div className="flex items-center gap-1.5 md:hidden">
            <Link
              href={RESERVE_HREF}
              className="inline-flex items-center h-9 px-3.5 rounded-full bg-[#2BB7A6] text-white text-xs font-bold shadow-md shadow-[#2BB7A6]/25"
            >
              Reservar
            </Link>
            <Link href="/experience-builder" className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#4A5C6A] hover:bg-[#F1F3F6] transition-colors" aria-label="Mi experiencia">
              <ShoppingCart className="h-5 w-5" strokeWidth={1.7} />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] rounded-full bg-[#2BB7A6] text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                  {count}
                </span>
              )}
            </Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-[#F1F3F6] transition-colors">
                <Menu className="h-5 w-5 text-[#0D1B3D]" />
                <span className="sr-only">Abrir menú</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-8 px-5 overflow-y-auto">

                {/* Logo in sheet */}
                <Link href="/" onClick={() => setOpen(false)} className="block mb-5">
                  <Image
                    src="/logo_medellin_trip_planner.png"
                    alt="Medellín Trip Planner"
                    width={168}
                    height={56}
                    className="h-9 w-auto"
                  />
                </Link>

                {/* Reservar ahora CTA */}
                <Link
                  href={RESERVE_HREF}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full h-11 rounded-full bg-[#2BB7A6] text-white text-sm font-bold shadow-md shadow-[#2BB7A6]/25 mb-6"
                >
                  Reservar ahora
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <nav className="flex flex-col gap-0.5 mb-6">
                  {navLinks.map((link) => {
                    const active = isActiveLink(pathname, link.href);
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center py-2.5 px-3 text-sm font-semibold rounded-xl transition-colors ${
                          active ? "text-[#2BB7A6] bg-[#E8F8F6]" : "text-[#0D1B3D] hover:text-[#2BB7A6] hover:bg-[#F1F3F6]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Utility links */}
                <div className="flex flex-col gap-1 border-t border-[#E2E8ED] pt-4 mb-5">
                  {user ? (
                    <>
                      {/* Mobile admin user card */}
                      <div className="flex items-center gap-2.5 py-2.5 px-3">
                        <span className="w-7 h-7 rounded-full bg-[#2BB7A6] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {getInitials(user.name, user.email)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-body font-semibold text-[#0D1B3D] truncate">
                            {user.name ?? user.email.split("@")[0]}
                          </p>
                          <p className="text-[11px] text-[#9DAAB5] truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href={roleHomePath(user.role)}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 py-2.5 px-3 text-sm font-semibold text-white bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Ir al dashboard
                      </Link>
                      <form action={signOut}>
                        <button
                          type="submit"
                          className="flex items-center gap-3 w-full py-2.5 px-3 text-sm font-medium text-[#637489] hover:text-[#DC2626] hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar sesión
                        </button>
                      </form>
                    </>
                  ) : (
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium text-[#4A5C6A] hover:text-[#0D1B3D] hover:bg-[#F1F3F6] rounded-xl transition-colors"
                    >
                      <User className="h-4 w-4" strokeWidth={1.6} />
                      Perfil
                    </Link>
                  )}
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
                    href={`tel:+${CALL_NUMBER}`}
                    className="flex items-center gap-2.5 text-sm text-[#4A5C6A] hover:text-[#0D1B3D] transition-colors"
                  >
                    <Phone className="h-4 w-4" strokeWidth={1.6} />
                    <span>Llámenos: {CALL_DISPLAY}</span>
                  </a>
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
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-[#4A5C6A] hover:text-[#0D1B3D] transition-colors"
                  >
                    <InstagramLogo size={15} weight="bold" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-[#4A5C6A] hover:text-[#0D1B3D] transition-colors"
                  >
                    <TiktokLogo size={15} weight="bold" />
                    <span>TikTok</span>
                  </a>
                </div>

              </SheetContent>
            </Sheet>
          </div>

        </div>
      </header>
    </>
  );
}
