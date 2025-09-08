import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import type { Env } from "@/lib/context";
import { forecastClient } from "@/modules/forecast/forecast-clients";
import forecastInfoRoutes from "@/modules/forecast/routes";
import { defaultHook } from "@/utils/default-hook";

const app = new OpenAPIHono<Env>({ defaultHook });

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
    const locations = await forecastClient.searchLocation(q);
    return c.json(locations, 200);
  })

  .openapi(forecastInfoRoutes.reverseSearchLocation, async (c) => {
    const { lat, lng } = c.req.valid("query");
    const location = await forecastClient.reverseSearchLocation({ lat, lng });

    if (!location) {
      throw new HTTPException(404, {
        message: "Location not found",
      });
    }

    return c.json(location, 200);
  });

export default forecastInfoHandler;
