import { RequestRateLimitError } from "@/pkg/key-pooler/client";

// Helpers to detect HTTP-like responses and extract Retry-After
export function isResponseLike(
  input: unknown
): input is { status: number; headers?: unknown } {
  if (!input || typeof input !== "object") {
    return false;
  }
  const maybe = input as Record<string, unknown>;
  return typeof maybe.status === "number";
}

export function getHeaderFromWhatwg(
  headersLike: unknown,
  name: string
): string | null {
  const anyHeaders = headersLike as { get?: (n: string) => unknown };
  if (anyHeaders && typeof anyHeaders.get === "function") {
    const v = anyHeaders.get(name);
    if (typeof v === "string") {
      return v;
    }
  }
  return null;
}

export function getHeaderFromEntries(
  headersLike: unknown,
  name: string
): string | null {
  const anyEntries = headersLike as unknown as {
    entries?: () => Iterable<[string, unknown]>;
  };
  const entries =
    typeof anyEntries?.entries === "function" ? anyEntries.entries() : null;
  if (!entries) {
    return null;
  }
  for (const [k, v] of entries) {
    const isTarget =
      typeof k === "string" && k.toLowerCase() === name.toLowerCase();
    if (!isTarget) {
      continue;
    }
    if (typeof v === "string") {
      return v;
    }
    if (Array.isArray(v)) {
      const first = v[0];
      return typeof first === "string" ? first : null;
    }
    return null;
  }
  return null;
}

export function getHeaderFromObject(
  headersLike: unknown,
  name: string
): string | null {
  if (headersLike && typeof headersLike === "object") {
    const record = headersLike as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      if (key.toLowerCase() === name.toLowerCase()) {
        const val = record[key];
        return typeof val === "string" ? val : null;
      }
    }
  }
  return null;
}

export function getHeader(headersLike: unknown, name: string): string | null {
  if (!headersLike) {
    return null;
  }
  const w = getHeaderFromWhatwg(headersLike, name);
  if (w) {
    return w;
  }
  const e = getHeaderFromEntries(headersLike, name);
  if (e) {
    return e;
  }
  return getHeaderFromObject(headersLike, name);
}

export function parseRetryAfterMsFromHeaders(
  headersLike: unknown
): number | null {
  const raw = getHeader(headersLike, "retry-after");
  if (!raw) {
    return null;
  }
  const seconds = Number.parseInt(raw, 10);
  if (Number.isFinite(seconds)) {
    return seconds * 1000;
  }
  // HTTP-date
  const date = new Date(raw);
  const ms = date.getTime() - Date.now();
  if (Number.isFinite(ms) && ms > 0) {
    return ms;
  }
  return null;
}

export function getRetryAfterMs(input: unknown): number | null {
  if (isResponseLike(input)) {
    const anyResp = input as { headers?: unknown };
    return parseRetryAfterMsFromHeaders(anyResp.headers);
  }
  // Common error shapes: { response: ResponseLike }, { status, headers }
  if (input && typeof input === "object") {
    const anyErr = input as Record<string, unknown>;
    if (isResponseLike(anyErr.response)) {
      const resp = anyErr.response as { headers?: unknown };
      return parseRetryAfterMsFromHeaders(resp.headers);
    }
    if (anyErr.headers) {
      return parseRetryAfterMsFromHeaders(anyErr.headers);
    }
  }
  return null;
}

export function defaultIsRateLimitError(error: unknown): boolean {
  if (error instanceof RequestRateLimitError) {
    return true;
  }
  // HTTP 429 via response or error shape
  if (isResponseLike(error) && error.status === 429) {
    return true;
  }
  if (error && typeof error === "object") {
    const anyErr = error as Record<string, unknown>;
    if (typeof anyErr.status === "number" && anyErr.status === 429) {
      return true;
    }
    if (
      isResponseLike(anyErr.response) &&
      // biome-ignore lint/suspicious/noExplicitAny: any
      (anyErr.response as any).status === 429
    ) {
      return true;
    }
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("rate limit") ||
      msg.includes("too many requests") ||
      msg.includes("quota exceeded")
    ) {
      return true;
    }
  }
  return false;
}

export function defaultShouldTreatResultAsRateLimited<T>(result: T): boolean {
  if (!isResponseLike(result)) {
    return false;
  }
  return result.status === 429;
}
