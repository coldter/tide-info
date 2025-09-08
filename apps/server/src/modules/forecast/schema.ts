import { z } from "@hono/zod-openapi";

export const getTideInfoResponseSchema = z.object({});

export const searchLocationResponseSchema = z
  .object({
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
    country: z.string(),
    state: z.string(),
  })
  .array();

export const reverseSearchLocationResponseSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  country: z.string(),
  state: z.string(),
});
