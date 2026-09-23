import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  ADMIN_CHALLENGE_COOKIE,
  hashAdminCode,
  maakAdminToken,
} from "@/lib/adminAuth";

const resend = new Resend(process.env.RESEND_API_KEY!);

function maakCode() {
  const waarden = new Uint32Array(1);
  crypto.getRandomValues(waarden);
  return String(waarden[0] % 1000000).padStart(6, "0");
}

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Adminbeveiliging is niet geconfigureerd." },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  if (!body.password || body.password !== adminPassword) {
    return NextResponse.json(
      { error: "Het adminwachtwoord is onjuist." },
      { status: 401 }
    );
  }

  const adminEmail = (process.env.ADMIN_LOGIN_EMAIL || "info@shinego.nl")
    .trim()
    .toLowerCase();
  const code = maakCode();
  const exp = Date.now() + 10 * 60 * 1000;
  const codeHash = await hashAdminCode(code, adminPassword);
  const challenge = await maakAdminToken(
    {
      type: "challenge",
      exp,
      email: adminEmail,
      code_hash: codeHash,
    },
    adminPassword
  );

  const { error: emailError } = await resend.emails.send({
    from: "ShineGo <noreply@shinego.nl>",
    to: adminEmail,
    subject: "ShineGo admin inlogcode",
    html: `
      <p>Er is zojuist geprobeerd in te loggen op de ShineGo-beheeromgeving.</p>
      <p>Je eenmalige inlogcode is:</p>
      <p style="font-size:30px;font-weight:800;letter-spacing:6px;margin:20px 0;">${code}</p>
      <p>Deze code is 10 minuten geldig.</p>
      <p>Heb je dit niet zelf aangevraagd? Deel de code dan niet en wijzig het adminwachtwoord.</p>
    `,
  });

  if (emailError) {
    console.error("Admin inlogcode versturen mislukt:", emailError);
    return NextResponse.json(
      { error: "De verificatiecode kon niet worden verstuurd." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Verificatiecode verstuurd.",
  });

  response.cookies.set(ADMIN_CHALLENGE_COOKIE, challenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 10 * 60,
  });

  response.headers.set("Cache-Control", "no-store");
  return response;
}
