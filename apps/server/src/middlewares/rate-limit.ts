import { RedisStore } from "@hono-rate-limiter/redis";
import { kv } from "@vercel/kv";
import { HTTPException } from "hono/http-exception";
import { rateLimiter } from "hono-rate-limiter";
import { ms } from "itty-time";
import type { Env } from "@/lib/context";

export const globalRateLimitMW = rateLimiter<Env>({
  windowMs: ms("1 minutes"),
  limit: 100,
  keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "",
  store: process.env.VERCEL
    ? new RedisStore({
        client: kv,
      })
    : undefined,
  handler: () => {
    throw new HTTPException(429, {
      message: "Too many requests, please try again later.",
    });
  },
});
