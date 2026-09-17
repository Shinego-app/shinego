import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "info@shinego.nl")
  .trim()
  .toLowerCase();

export const ADMIN_COOKIE = "shinego_admin_session";

function cookieValue(request: Request, name: string) {
  const header = request.headers.get("cookie") || "";
  const item = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!item) return null;

  try {
    return decodeURIComponent(item.slice(name.length + 1));
  } catch {
    return null;
  }
}

export function bearerToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function isAdminRequest(request: Request) {
  const token = bearerToken(request) || cookieValue(request, ADMIN_COOKIE);
  if (!token) return false;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user?.email) return false;

  return data.user.email.trim().toLowerCase() === ADMIN_EMAIL;
}
