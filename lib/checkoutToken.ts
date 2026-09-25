import { createHmac, timingSafeEqual } from "crypto";

function signingSecret() {
  const secret = process.env.CHECKOUT_SIGNING_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    throw new Error("Checkout signing secret ontbreekt.");
  }
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", signingSecret()).update(payload).digest("base64url");
}

export function maakCheckoutToken(
  bookingId: string | number,
  bedrag: number,
  geldigheidMs = 30 * 60 * 1000
) {
  const payload = Buffer.from(
    JSON.stringify({
      bookingId: String(bookingId),
      amountCents: Math.round(Number(bedrag) * 100),
      expiresAt: Date.now() + geldigheidMs,
    }),
    "utf8"
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function controleerCheckoutToken(
  token: string,
  bookingId: string | number,
  bedrag: number
) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return (
      data.bookingId === String(bookingId) &&
      data.amountCents === Math.round(Number(bedrag) * 100) &&
      Number(data.expiresAt) > Date.now()
    );
  } catch {
    return false;
  }
}
