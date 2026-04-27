import { NextRequest, NextResponse } from "next/server";
import { getTenantBySlug } from "@/lib/tenants";

const ALLOWED_ORIGIN = process.env.SETUP_ALLOWED_ORIGIN ?? "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { exists: false },
      { status: 400, headers: corsHeaders() },
    );
  }

  const tenant = await getTenantBySlug(slug);
  const exists = tenant !== null && tenant.active;

  return NextResponse.json({ exists }, { headers: corsHeaders() });
}
