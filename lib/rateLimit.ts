type Bucket = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __shinegoRateLimit: Map<string, Bucket> | undefined;
}

const buckets =
  globalThis.__shinegoRateLimit ??
  (globalThis.__shinegoRateLimit = new Map<string, Bucket>());

function cleanup(nu: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= nu) buckets.delete(key);
  }
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  key: string,
  maxAantal: number,
  vensterMs: number
) {
  const nu = Date.now();
  cleanup(nu);

  const huidig = buckets.get(key);
  if (!huidig || huidig.resetAt <= nu) {
    buckets.set(key, { count: 1, resetAt: nu + vensterMs });
    return { toegestaan: true, retryAfterSeconds: 0 };
  }

  if (huidig.count >= maxAantal) {
    return {
      toegestaan: false,
      retryAfterSeconds: Math.max(1, Math.ceil((huidig.resetAt - nu) / 1000)),
    };
  }

  huidig.count += 1;
  buckets.set(key, huidig);
  return { toegestaan: true, retryAfterSeconds: 0 };
}
