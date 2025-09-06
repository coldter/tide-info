import authRouteHandler from "@/modules/auth/handler";
import baseApp from "@/server";

export const app = baseApp.route("/api/auth", authRouteHandler);
