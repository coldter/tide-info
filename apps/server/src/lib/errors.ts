import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Env } from "@/lib/context";
import { logger } from "@/lib/logger";
import { NoAvailableKeyError } from "@/pkg/key-pooler/client";

export function handleError(err: Error, c: Context<Env>): Response {
  if (err instanceof HTTPException) {
    if (err.status >= 500) {
      logger.error("HTTPException 500", {
        message: err.message,
        status: err.status,
        path: c.req.path,
        method: c.req.method,
        body: c.req.raw.body,
        headers: c.req.raw.headers,
      });
    }
    return c.json(
      {
        error: {
          message: err.message,
        },
      },
      { status: err.status }
    );
  }

  if (err?.constructor) {
    switch (err.constructor) {
      case NoAvailableKeyError: {
        logger.error("NoAvailableKeyError", {
          message: err.message,
        });
        return c.json(
          {
            error: {
              message: "Service is temporarily unavailable",
            },
          },
          { status: 503 }
        );
      }
      default:
        break;
    }
  }

  logger.error("unhandled exception", {
    name: err?.name,
    message: err?.message,
    cause: err?.cause,
    stack: err?.stack,
    constructor: err?.constructor.name,
  });

  return c.json(
    {
      error: {
        message: err.message ?? "something unexpected happened",
      },
    },
    { status: 500 }
  );
}
