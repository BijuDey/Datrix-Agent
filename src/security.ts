import net from "node:net";

const BLOCKED_EXACT_HOSTS = new Set(["0.0.0.0", "localhost.localdomain"]);
const BLOCKED_PREFIXES = ["169.254."];
const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);

export type UrlValidationResult =
  | { ok: true; parsed: URL }
  | { ok: false; reason: string };

export type MethodNormalizationResult =
  | { ok: true; method: string }
  | { ok: false; reason: string };

export function isIp(hostname: string): boolean {
  return net.isIP(hostname) !== 0;
}

function isDangerousHost(hostname: string): boolean {
  const lowered = String(hostname || "").toLowerCase();
  if (!lowered) return true;

  if (BLOCKED_EXACT_HOSTS.has(lowered)) return true;
  for (const prefix of BLOCKED_PREFIXES) {
    if (lowered.startsWith(prefix)) return true;
  }

  return false;
}

export function validateTargetUrl(rawUrl: string): UrlValidationResult {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "Invalid URL" };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, reason: "Only http and https protocols are allowed" };
  }

  const host = parsed.hostname;
  if (isDangerousHost(host)) {
    return { ok: false, reason: `Host is blocked: ${host}` };
  }

  return { ok: true, parsed };
}

export function normalizeMethod(method: string | undefined): MethodNormalizationResult {
  const normalized = String(method || "GET").toUpperCase();
  if (!ALLOWED_METHODS.has(normalized)) {
    return { ok: false, reason: `Unsupported HTTP method: ${normalized}` };
  }

  return { ok: true, method: normalized };
}

export function resolveAllowedOrigins(originsArg: string | undefined): string[] {
  const defaults = ["http://localhost:3000", "https://yourwebapp.com"];
  if (!originsArg) return defaults;

  const resolved = String(originsArg)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return resolved.length > 0 ? resolved : defaults;
}
