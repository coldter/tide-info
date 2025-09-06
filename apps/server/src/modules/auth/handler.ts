import { OpenAPIHono } from "@hono/zod-openapi";
import { auth } from "@/lib/auth";
import type { Env } from "@/lib/context";
import { defaultHook } from "@/utils/default-hook";

const authRouteHandler = new OpenAPIHono<Env>({ defaultHook });

authRouteHandler.on(["POST", "GET"], "*", (c) => auth.handler(c.req.raw));

export default authRouteHandler;
