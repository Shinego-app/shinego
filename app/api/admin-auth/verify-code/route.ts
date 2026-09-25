import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_CHALLENGE_COOKIE,
  ADMIN_SESSION_COOKIE,
  vergelijkAdminCode,
  leesAdminToken,
  maakAdminToken,
} from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Adminbeveiliging is niet geconfigureerd." },
      { status: 500 }
    );
  }

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const code = String(body.code || "").replace(/\D/g, "");
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { error: "Vul de 6-cijferige verificatiecode in." },
      { status: 400 }
    );
  }

  const challengeToken = request.cookies.get(ADMIN_CHALLENGE_COOKIE)?.value;
  const challenge = await leesAdminToken(challengeToken, adminPassword);

  if (!challenge || challenge.type !== "challenge") {
    return NextResponse.json(
      { error: "De verificatieaanvraag is verlopen. Vraag een nieuwe code aan." },
      { status: 401 }
    );
  }

  const codeKlopt = await vergelijkAdminCode(
    code,
    challenge.code_hash,
    adminPassword
  );

  if (!codeKlopt) {
    const attempts = Number(challenge.attempts || 0) + 1;

    if (attempts >= 5) {
      const response = NextResponse.json(
        { error: "Te veel onjuiste pogingen. Vraag een nieuwe code aan." },
        { status: 429 }
      );
      response.cookies.set(ADMIN_CHALLENGE_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const vernieuwdeChallenge = await maakAdminToken(
      {
        ...challenge,
        attempts,
      },
      adminPassword
    );

    const response = NextResponse.json(
      { error: "De verificatiecode is onjuist." },
      { status: 401 }
    );
    response.cookies.set(ADMIN_CHALLENGE_COOKIE, vernieuwdeChallenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Math.max(1, Math.floor((challenge.exp - Date.now()) / 1000)),
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const sessieDuurMs = 12 * 60 * 60 * 1000;
  const sessionToken = await maakAdminToken(
    {
      type: "session",
      exp: Date.now() + sessieDuurMs,
      email: challenge.email,
    },
    adminPassword
  );

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(sessieDuurMs / 1000),
  });
  response.cookies.set(ADMIN_CHALLENGE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
