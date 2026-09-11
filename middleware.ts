import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Inloggen vereist", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ShineGo Admin"',
    },
  });
}

export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new NextResponse("ADMIN_PASSWORD ontbreekt in de serveromgeving.", {
      status: 500,
    });
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const encoded = authorization.slice(6);
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return unauthorized();
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    if (username !== "admin" || password !== adminPassword) {
      return unauthorized();
    }

    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
