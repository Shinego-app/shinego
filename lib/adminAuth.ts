export const ADMIN_SESSION_COOKIE = "shinego_admin_session";
export const ADMIN_CHALLENGE_COOKIE = "shinego_admin_challenge";

export type AdminTokenPayload = {
  type: "session" | "challenge";
  exp: number;
  email?: string;
  code_hash?: string;
};

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacBytes(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );

  return new Uint8Array(signature);
}

function veiligGelijk(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let verschil = 0;
  for (let i = 0; i < a.length; i += 1) verschil |= a[i] ^ b[i];
  return verschil === 0;
}

export async function maakAdminToken(payload: AdminTokenPayload, secret: string) {
  const json = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(new TextEncoder().encode(json));
  const signature = await hmacBytes(encodedPayload, secret);
  return `${encodedPayload}.${base64UrlEncode(signature)}`;
}

export async function leesAdminToken(token: string | undefined, secret: string) {
  if (!token) return null;

  try {
    const [encodedPayload, encodedSignature] = token.split(".");
    if (!encodedPayload || !encodedSignature) return null;

    const verwacht = await hmacBytes(encodedPayload, secret);
    const ontvangen = base64UrlDecode(encodedSignature);
    if (!veiligGelijk(verwacht, ontvangen)) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(encodedPayload))
    ) as AdminTokenPayload;

    if (!payload?.type || !payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function hashAdminCode(code: string, secret: string) {
  return base64UrlEncode(await hmacBytes(`admin-code:${code}`, secret));
}

export async function vergelijkAdminCode(
  code: string,
  verwachteHash: string | undefined,
  secret: string
) {
  if (!verwachteHash) return false;
  const berekend = await hashAdminCode(code, secret);
  return berekend === verwachteHash;
}
