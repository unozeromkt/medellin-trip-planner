import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserProfile } from "@/lib/auth";

const BUCKET = "tour-images";

export async function GET() {
  const profile = await getCurrentUserProfile();
  if (!profile || !["admin", "editor", "operator"].includes(profile.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET).list("", {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const images = (data ?? [])
    .filter((f) => f.name && f.id) // skip folder placeholders
    .map((f) => ({
      name: f.name,
      url: admin.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      createdAt: f.created_at,
    }));

  return NextResponse.json({ images });
}
