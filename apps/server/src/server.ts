import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { db } from "@/db";
import type { Env } from "@/lib/context";
import { handleError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { authContextMiddleware } from "@/middlewares/auth-context";

const baseApp = new OpenAPIHono<Env>().basePath(
  (process.env.BASE_PATH || "") as ""
);

baseApp.use(trimTrailingSlash());
baseApp.use(
  httpLogger((str, ...rest) => {
    logger.child({ label: "Http-Request" }).info(str, ...rest);
  })
);

baseApp.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE", "PUT"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

baseApp.get("/ping", async (c) => {
  const dbResponse = await db.$client.execute("SELECT 1 AS one");

  if (!dbResponse.rows.length) {
    return c.json(
      {
        message: "pong::dbStatus=error",
        dbStatus: false,
      },
      500
    );
  }

  let isDbOk = false;
  if (dbResponse?.rows[0]?.one === 1) {
    isDbOk = true;
  }

  return c.json(
    {
      message: `pong::dbStatus=${
        // biome-ignore lint/nursery/noUnnecessaryConditions: false positive
        isDbOk ? "ok" : "error"
      }`,
      dbStatus: isDbOk,
    },
    // biome-ignore lint/nursery/noUnnecessaryConditions: false positive
    isDbOk ? 200 : 500
  );
});

baseApp.use(authContextMiddleware);

baseApp.notFound(() => {
  throw new HTTPException(404, {
    message: "Not Found",
  });
});
baseApp.onError(handleError);

export default baseApp;
