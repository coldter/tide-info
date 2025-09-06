import { type ClientRequestOptions, hc } from "hono/client";
import type { app } from "@/routers/main";

export const getHonoRpcClient = (
  url: string,
  options: ClientRequestOptions | undefined
) => {
  return hc<typeof app>(
    url,
    options ?? {
      init: {
        credentials: "include",
      },
    }
  );
};
