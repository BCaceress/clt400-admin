import { NextRequest, NextResponse } from "next/server";
import { validateSessionVersion } from "@/lib/tenants";

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
  const v = searchParams.get("v");

  if (!slug || !v) {
    return NextResponse.json(
      { valid: false },
      { status: 400, headers: corsHeaders() },
    );
  }

  const version = parseInt(v, 10);
  if (isNaN(version)) {
    return NextResponse.json(
      { valid: false },
      { status: 400, headers: corsHeaders() },
    );
  }

  const valid = await validateSessionVersion(slug, version);
  return NextResponse.json({ valid }, { headers: corsHeaders() });
}
