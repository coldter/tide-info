import { OpenAPIHono, type z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { seconds } from "itty-time";
import type { Env } from "@/lib/context";
import { forecastClient } from "@/modules/forecast/forecast-clients";
import forecastInfoRoutes from "@/modules/forecast/routes";
import type {
  reverseSearchLocationResponseSchema,
  searchLocationResponseSchema,
} from "@/modules/forecast/schema";
import { createCachedStorage } from "@/pkg/storage";
import { defaultHook } from "@/utils/default-hook";

const app = new OpenAPIHono<Env>({ defaultHook });

/**
 * Cache Storage
 */
const cacheStorageSearchLocation = createCachedStorage<
  z.infer<typeof searchLocationResponseSchema>
>("search-location", seconds("1 day"));

const cacheStorageReverseSearchLocation = createCachedStorage<
  z.infer<typeof reverseSearchLocationResponseSchema>
>("reverse-search-location", seconds("1 day"));

/**
 * Handler
 */
const forecastInfoHandler = app
  .openapi(forecastInfoRoutes.getTideInfo, async (c) => {
    const { lat, lng } = c.req.valid("query");
    const extremesPoints = await forecastClient.getTideExtremesPoints({
      lat,
      lng,
    });

    return c.json({ extremesPoints }, 200);
  })

  .openapi(forecastInfoRoutes.searchLocation, async (c) => {
    const { q } = c.req.valid("query");
    const cachedLocations = await cacheStorageSearchLocation.getItem(q);
    if (cachedLocations) {
      return c.json(cachedLocations, 200);
    }
    const locations = await forecastClient.searchLocation(q);

    await cacheStorageSearchLocation.setItem(q, locations);

    return c.json(locations, 200);
  })

  .openapi(forecastInfoRoutes.reverseSearchLocation, async (c) => {
    const { lat, lng } = c.req.valid("query");
    const cachedLocation = await cacheStorageReverseSearchLocation.getItem(
      `${lat}-${lng}`
    );
    if (cachedLocation) {
      return c.json(cachedLocation, 200);
    }
    const location = await forecastClient.reverseSearchLocation({ lat, lng });
    if (!location) {
      throw new HTTPException(404, {
        message: "Location not found",
      });
    }

    await cacheStorageReverseSearchLocation.setItem(`${lat}-${lng}`, location);

    return c.json(location, 200);
  });

export default forecastInfoHandler;
