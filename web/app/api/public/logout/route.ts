import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookie = cookies();
  cookie.delete("goat-pen-token");

  const payload = await request.json();

  const baseUrl = payload.origin || "http://localhost:3000";
  const res = NextResponse.redirect(new URL("/login", baseUrl), 303);

  return res;
}
