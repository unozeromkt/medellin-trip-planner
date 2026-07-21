"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, ShoppingCart, Globe, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { WhatsappLogo, InstagramLogo } from "@phosphor-icons/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useExperienceBuilderOptional } from "@/lib/experience-builder-context";
import { useCurrency } from "@/lib/currency-context";
import { roleHomePath } from "@/lib/roles";
import { signOut } from "@/app/(auth)/actions";

const navLinks = [
  { label: "Explorar", href: "/tours" },
  { label: "Destinos", href: "/tours" },
  { label: "Categorías", href: "/categories" },
  { label: "Blog", href: "/blog" },
];

const WHATSAPP_NUMBER = "573107788830";
const PHONE_DISPLAY = "(310)-778 8830";

type NavUser = {
  name: string | null;
  email: string;
  role: string;
};

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
        className="relative flex flex-col items-center gap-[3px] px-3 py-2 text-[#5C6E7A] hover:text-[#0D1B3D] transition-colors cursor-pointer select-none"
      >
        <span className="h-[22px] w-[22px] flex items-center justify-center rounded-full bg-[#2BB7A6] text-white text-[9px] font-bold leading-none">
          {initials}
        </span>
        <span className="text-[10px] font-medium leading-none whitespace-nowrap tracking-wide flex items-center gap-0.5">
          {displayName.split(" ")[0]}
          <ChevronDown className={`w-2.5 h-2.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] w-56 bg-white border border-[#E2E8ED] rounded-2xl shadow-lg shadow-[#0D1B3D]/10 py-2 z-50">
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

  const currencyLabel = `ES / ${currency} $`;

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
              key={link.label}
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
          <div className="pl-0 border-l border-[#E2E8ED]">
            {user ? (
              <AdminProfileMenu user={user} />
            ) : (
              <NavAction
                icon={<User className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                label="Perfil"
                href="/account"
              />
            )}
          </div>
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
                    key={link.label}
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
                        className="flex items-center gap-3 w-full py-2.5 px-3 text-sm font-medium text-[#637489] hover:text-[#DC2626] hover:bg-red-50 rounded-md transition-colors"
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
                    className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium text-[#4A5C6A] hover:text-[#0D1B3D] hover:bg-[#F1F3F6] rounded-md transition-colors"
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
