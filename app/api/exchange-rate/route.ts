import { NextResponse } from "next/server";
import { getExchangeRate } from "@/lib/currency";

export async function GET() {
  const data = await getExchangeRate();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
