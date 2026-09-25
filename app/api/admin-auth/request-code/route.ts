import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import {
  ADMIN_CHALLENGE_COOKIE,
  hashAdminCode,
  leesAdminToken,
  maakAdminToken,
} from "@/lib/adminAuth";

const resend = new Resend(process.env.RESEND_API_KEY!);

function maakCode() {
  const waarden = new Uint32Array(1);
  crypto.getRandomValues(waarden);
  return String(waarden[0] % 1000000).padStart(6, "0");
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(
    `admin-code:${clientIp(request)}`,
    5,
    10 * 60 * 1000
  );
  if (!rate.toegestaan) {
    return NextResponse.json(
      { error: "Te veel code-aanvragen. Probeer het later opnieuw." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Adminbeveiliging is niet geconfigureerd." },
      { status: 500 }
    );
  }

  // ADMIN_PASSWORD wordt uitsluitend server-side gebruikt om de tijdelijke
  // codes en sessiecookies cryptografisch te ondertekenen. De beheerder
  // hoeft dit geheim niet te kennen of in te voeren.
  const adminEmail = (process.env.ADMIN_LOGIN_EMAIL || "info@shinego.nl")
    .trim()
    .toLowerCase();

  const bestaandeChallenge = await leesAdminToken(
    request.cookies.get(ADMIN_CHALLENGE_COOKIE)?.value,
    adminPassword
  );
  if (
    bestaandeChallenge?.type === "challenge" &&
    bestaandeChallenge.iat &&
    Date.now() - bestaandeChallenge.iat < 60 * 1000
  ) {
    return NextResponse.json(
      { error: "Wacht 1 minuut voordat je een nieuwe code aanvraagt." },
      { status: 429 }
    );
  }

  const code = maakCode();
  const nu = Date.now();
  const exp = nu + 10 * 60 * 1000;
  const codeHash = await hashAdminCode(code, adminPassword);
  const challenge = await maakAdminToken(
    {
      type: "challenge",
      exp,
      iat: nu,
      attempts: 0,
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
      <p>Heb je dit niet zelf aangevraagd? Deel deze code dan niet. Zonder toegang tot deze mailbox kan niemand de beheeromgeving openen.</p>
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
