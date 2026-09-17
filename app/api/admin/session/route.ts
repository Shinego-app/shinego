import { NextResponse } from "next/server";
import { ADMIN_COOKIE, bearerToken, isAdminRequest } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token || !(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Geen toegang." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
