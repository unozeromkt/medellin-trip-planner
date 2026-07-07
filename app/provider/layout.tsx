import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth";
import { roleHomePath } from "@/lib/roles";
import { signOut } from "@/app/(auth)/actions";
import {
  LayoutDashboard,
  MapPin,
  User,
  LogOut,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/provider", icon: LayoutDashboard },
  { label: "Mis tours", href: "/provider/tours", icon: MapPin },
  { label: "Mi perfil", href: "/provider/perfil", icon: User },
];

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/");
  if (profile.role !== "operator") {
    redirect(roleHomePath(profile.role));
  }

  const operatorName = profile.operator?.name ?? profile.email;
  const operatorStatus = profile.operator?.status ?? "pending";

  return (
    <div className="min-h-screen flex bg-[#F1F3F6]">
      <aside className="w-60 shrink-0 bg-[#0D1B3D] flex flex-col">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/provider" className="block">
            <span className="font-body text-[10px] font-normal text-white/40 tracking-widest uppercase">
              Medellín
            </span>
            <div className="font-heading text-xl font-bold leading-tight mt-0.5">
              <span className="text-white">Trip </span>
              <span className="text-[#2BB7A6]">Planner</span>
            </div>
            <span className="text-white/40 text-[10px] font-body">Portal Operadores</span>
          </Link>
        </div>

        {/* Operator chip */}
        <div className="px-4 pt-5 pb-3">
          <div className="bg-white/5 rounded-xl px-3 py-2.5">
            <p className="text-white/40 text-[10px] font-body uppercase tracking-wider mb-0.5">
              Operador
            </p>
            <p className="text-white text-sm font-body font-medium truncate">{operatorName}</p>
            <span
              className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${
                operatorStatus === "active"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : operatorStatus === "suspended" || operatorStatus === "inactive"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-amber-500/15 text-amber-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {operatorStatus === "active"
                ? "Activo"
                : operatorStatus === "suspended"
                  ? "Suspendido"
                  : operatorStatus === "inactive"
                    ? "Inactivo"
                    : "Pendiente"}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white hover:bg-white/8 transition-colors group"
            >
              <Icon className="w-4 h-4 shrink-0 group-hover:text-[#2BB7A6] transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2BB7A6]/20 flex items-center justify-center shrink-0">
              <span className="text-[#2BB7A6] text-xs font-bold font-body uppercase">
                {user.email?.[0] ?? "P"}
              </span>
            </div>
            <p className="text-white/70 text-xs font-body truncate">{user.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 w-full text-white/40 hover:text-white text-sm font-body px-2 py-1.5 rounded-lg hover:bg-white/8 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
