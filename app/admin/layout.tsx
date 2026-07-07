import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth";
import { roleHomePath } from "@/lib/roles";
import { signOut } from "@/app/(auth)/actions";
import { db } from "@/lib/db";
import {
  LayoutDashboard,
  Map,
  Package,
  Users,
  MessageSquare,
  LogOut,
  Plus,
  Building2,
  CalendarDays,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile, pendingAgencies, pendingReservations] = await Promise.all([
    getCurrentUserProfile(),
    db.agency.count({ where: { status: "pending" } }),
    db.packageReservation.count({ where: { status: "pending" } }),
  ]);
  // If no Prisma User record exists yet, send to home to avoid a login redirect loop.
  if (!profile) redirect("/");
  // "operator" is a marketplace tour-supplier role with its own scoped
  // portal at /provider — it must never get full /admin access.
  const adminRoles = ["admin", "editor"];
  if (!adminRoles.includes(profile.role)) {
    redirect(roleHomePath(profile.role));
  }

  return (
    <div className="min-h-screen flex bg-[#F1F3F6]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#0D1B3D] flex flex-col">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/admin" className="block">
            <span className="font-body text-[10px] font-normal text-white/40 tracking-widest uppercase">
              Medellín
            </span>
            <div className="font-heading text-xl font-bold leading-tight mt-0.5">
              <span className="text-white">Trip </span>
              <span className="text-[#2BB7A6]">Planner</span>
            </div>
            <span className="text-white/40 text-[10px] font-body">Admin Portal</span>
          </Link>
        </div>

        {/* Quick action */}
        <div className="px-4 pt-5 pb-3">
          <Link
            href="/admin/tours/new"
            className="flex items-center gap-2 w-full bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white text-sm font-semibold font-body px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo tour
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {[
            { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { label: "Tours", href: "/admin/tours", icon: Map },
            { label: "Paquetes mayoristas", href: "/admin/paquetes", icon: Package },
            { label: "Reservas", href: "/admin/reservas", icon: CalendarDays, badge: pendingReservations },
            { label: "Leads", href: "/admin/leads", icon: MessageSquare },
            { label: "Operadores", href: "/admin/operadores", icon: Users },
            { label: "Agencias", href: "/admin/agencias", icon: Building2, badge: pendingAgencies },
          ].map(({ label, href, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white hover:bg-white/8 transition-colors group"
            >
              <Icon className="w-4 h-4 shrink-0 group-hover:text-[#2BB7A6] transition-colors" />
              <span className="flex-1">{label}</span>
              {badge != null && badge > 0 && (
                <span className="text-[10px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full leading-none">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2BB7A6]/20 flex items-center justify-center shrink-0">
              <span className="text-[#2BB7A6] text-xs font-bold font-body uppercase">
                {user.email?.[0] ?? "A"}
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

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
