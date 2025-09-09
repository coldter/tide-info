import { z } from "@hono/zod-openapi";
import { commonErrorResponses } from "@/lib/common-resonse";
import { createRouteConfig } from "@/lib/route-config";
import { isAuthenticated } from "@/middlewares/guard";
import {
  getTideInfoResponseSchema,
  reverseSearchLocationResponseSchema,
  searchLocationResponseSchema,
} from "@/modules/forecast/schema";

const forecastInfoRoutes = {
  searchLocation: createRouteConfig({
    operationId: "searchLocation",
    method: "get",
    path: "/location/search",
    guard: [isAuthenticated],
    tags: ["forecast"],
    summary: "Search for a location",
    description: "Returns a list of locations",
    request: {
      query: z.object({
        q: z.string().min(3),
      }),
    },
    responses: {
      200: {
        description: "Locations",
        content: {
          "application/json": {
            schema: searchLocationResponseSchema,
          },
        },
      },
    },
  }),
  reverseSearchLocation: createRouteConfig({
    operationId: "reverseSearchLocation",
    method: "get",
    path: "/location/search/reverse",
    guard: [isAuthenticated],
    tags: ["forecast"],
    summary: "Reverse search for a location",
    description: "Returns a location",
    request: {
      query: z.object({
        lat: z.coerce.number().openapi({ type: "number" }),
        lng: z.coerce.number().openapi({ type: "number" }),
      }),
    },
    responses: {
      200: {
        description: "Location",
        content: {
          "application/json": {
            schema: reverseSearchLocationResponseSchema,
          },
        },
      },
      ...commonErrorResponses,
    },
  }),
  getTideInfo: createRouteConfig({
    operationId: "getTideInfo",
    method: "get",
    path: "/tide/info",
    guard: [isAuthenticated],
    tags: ["forecast"],
    summary: "Get tide information",
    description: "Returns tide information",
    request: {
      query: z.object({
        lat: z.coerce.number().openapi({ type: "number" }),
        lng: z.coerce.number().openapi({ type: "number" }),
      }),
    },
    responses: {
      200: {
        description: "Tide information",
        content: {
          "application/json": {
            schema: getTideInfoResponseSchema,
          },
        },
      },
      ...commonErrorResponses,
    },
  }),
} as const;

export default forecastInfoRoutes;
