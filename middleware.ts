import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, leesAdminToken } from "./lib/adminAuth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new NextResponse("Adminbeveiliging ontbreekt in de serveromgeving.", {
      status: 500,
    });
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const sessie = await leesAdminToken(token, adminPassword);
  const geldig = sessie?.type === "session";

  if (geldig) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      { error: "Adminsessie ontbreekt of is verlopen." },
      { status: 401 }
    );
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
