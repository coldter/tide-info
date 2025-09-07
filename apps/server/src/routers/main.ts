import authRouteHandler from "@/modules/auth/handler";
import forecastInfoHandler from "@/modules/forecast/handler";
import baseApp from "@/server";

export const app = baseApp
  .route("/api/auth", authRouteHandler)
  .route("/api/forecast", forecastInfoHandler);
