import { NextResponse } from "next/server";
import {
  ADMIN_CHALLENGE_COOKIE,
  ADMIN_SESSION_COOKIE,
} from "@/lib/adminAuth";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));

  for (const naam of [ADMIN_SESSION_COOKIE, ADMIN_CHALLENGE_COOKIE]) {
    response.cookies.set(naam, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
  }

  response.headers.set("Cache-Control", "no-store");
  return response;
}
