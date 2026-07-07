"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { roleHomePath } from "@/lib/roles";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const params = new URLSearchParams({ error: error.message });
    if (next) params.set("next", next);
    redirect(`/login?${params.toString()}`);
  }

  // Honor explicit destinations that aren't the default portals
  const defaultPortals = ["/admin", "/agency", "/provider"];
  if (next && !defaultPortals.includes(next)) {
    redirect(next);
  }

  // Role-based redirect
  const profile = await db.user.findUnique({
    where: { email },
    select: { role: true },
  });

  redirect(roleHomePath(profile?.role ?? "customer"));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
