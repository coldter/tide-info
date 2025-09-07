import {
  defaultIsRateLimitError,
  defaultShouldTreatResultAsRateLimited,
  getRetryAfterMs,
} from "@/pkg/key-pooler/utils";
import { KeyPool } from "./key-pool";
import type { APIKey } from "./types";

export class NoAvailableKeyError extends Error {
  constructor(message = "No available API keys in pool") {
    super(message);
    this.name = "NoAvailableKeyError";
  }
}

export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterRatio: number;
}

export interface RequestHooks<T> {
  onBeforeRequest?: (attempt: number, key: APIKey) => void | Promise<void>;
  onSuccess?: (attempt: number, key: APIKey, result: T) => void | Promise<void>;
  onRateLimited?: (
    attempt: number,
    key: APIKey,
    error: unknown
  ) => void | Promise<void>;
  onError?: (
    attempt: number,
    key: APIKey | null,
    error: unknown
  ) => void | Promise<void>;
}

export interface RequestClassifier<T> {
  isRateLimitError?: (error: unknown) => boolean;
  shouldTreatResultAsRateLimited?: (result: T) => boolean;
}

export interface RequestOptions<T>
  extends RequestHooks<T>,
    RequestClassifier<T> {
  retry?: Partial<RetryOptions>;
}

export type RequestFn<T> = (key: APIKey) => Promise<T>;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function computeDelayMs(attempt: number, opts: RetryOptions): number {
  const expo = opts.baseDelayMs * 2 ** (attempt - 1);
  const capped = expo > opts.maxDelayMs ? opts.maxDelayMs : expo;
  const jitter = capped * opts.jitterRatio * Math.random();
  return capped + jitter;
}

/**
 * KeyPoolClient extends KeyPool with a DX-friendly request() helper that:
 * - Picks an available key
 * - Executes the provided request function
 * - Records success or marks the key as rate-limited on failures classified as 429
 * - Retries with exponential backoff and jitter
 * @example
 * const storage = createCachedStorage("key-pool", 0);
 * const store = new KeyPoolStore(storage);
 * const client = new KeyPoolClient(store, { maxRequestsPerKey: 100, coolDownPeriodMs: 60_000 });
 *
 * await client.initialize(["key1", "key2", "key3"]);
 *
 * const result = await client.request(async (key) => {
 *   // perform your API call using the provided key
 *   return fetchSomeApi(key);
 * }, {
 *   retry: { maxAttempts: 5, baseDelayMs: 200, maxDelayMs: 3000 },
 *   isRateLimitError: (err) => err instanceof Error && err.message.includes("429"),
 *   onBeforeRequest: (attempt, key) => {},
 *   onSuccess: (attempt, key, data) => {},
 *   onRateLimited: (attempt, key, err) => {},
 *   onError: (attempt, key, err) => {},
 * });
 */
export class KeyPoolClient extends KeyPool {
  private readonly defaultRetry: RetryOptions = {
    maxAttempts: 30,
    baseDelayMs: 25,
    maxDelayMs: 2000,
    jitterRatio: 0.15,
  };

  async request<T>(fn: RequestFn<T>, options?: RequestOptions<T>): Promise<T> {
    const retry: RetryOptions = {
      ...this.defaultRetry,
      ...options?.retry,
    };

    const isRateLimitError =
      options?.isRateLimitError ?? defaultIsRateLimitError;
    const shouldTreatResultAsRateLimited =
      options?.shouldTreatResultAsRateLimited ??
      defaultShouldTreatResultAsRateLimited;

    const attemptRequest = async (attempt: number): Promise<T> => {
      const key = await this.acquireKeyOrDelay(attempt, retry);

      if (options?.onBeforeRequest) {
        await options.onBeforeRequest(attempt, key);
      }

      try {
        const result = await fn(key);
        if (shouldTreatResultAsRateLimited(result)) {
          await this.afterRateLimited(
            attempt,
            key,
            { retry, options },
            new Error("Rate limited result")
          );
          return attemptRequest(attempt + 1);
        }
        await this.afterSuccess(attempt, key, options, result);
        return result;
      } catch (error) {
        if (isRateLimitError(error)) {
          await this.afterRateLimited(attempt, key, { retry, options }, error);
          return attemptRequest(attempt + 1);
        }
        if (options?.onError) {
          await options.onError(attempt, key, error);
        }
        throw error instanceof Error ? error : new Error("Request failed");
      }
    };

    return attemptRequest(1);
  }

  private async acquireKeyOrDelay(
    attempt: number,
    retry: RetryOptions
  ): Promise<APIKey> {
    const key = await this.getAvailableKey();
    if (key) {
      return key;
    }
    if (attempt >= retry.maxAttempts) {
      throw new NoAvailableKeyError();
    }
    const delay = computeDelayMs(attempt, retry);
    await sleep(delay);
    return this.acquireKeyOrDelay(attempt + 1, retry);
  }

  private async afterSuccess<T>(
    attempt: number,
    key: APIKey,
    options: RequestHooks<T> | undefined,
    result: T
  ): Promise<void> {
    await this.recordSuccess(key);
    if (options?.onSuccess) {
      await options.onSuccess(attempt, key, result);
    }
  }

  private async afterRateLimited<T>(
    attempt: number,
    key: APIKey,
    context: { retry: RetryOptions; options?: RequestHooks<T> },
    error: unknown
  ): Promise<void> {
    await this.markRateLimited(key);
    if (context.options?.onRateLimited) {
      await context.options.onRateLimited(attempt, key, error);
    }
    if (attempt >= context.retry.maxAttempts) {
      throw error instanceof Error ? error : new Error("Rate limit error");
    }
    // Respect Retry-After header if present
    const retryAfter = getRetryAfterMs(error);
    const delay =
      typeof retryAfter === "number"
        ? retryAfter
        : computeDelayMs(attempt, context.retry);
    await sleep(delay);
  }
}
