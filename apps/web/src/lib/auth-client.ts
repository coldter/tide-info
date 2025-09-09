import { createAuthClient } from "better-auth/react";

const parsedUrl = new URL(import.meta.env.VITE_SERVER_URL);
const pathname = parsedUrl.pathname;
export const authClient = createAuthClient({
  baseURL: parsedUrl.origin,
  basePath: pathname !== "/" ? `${pathname}/api/auth` : "/api/auth",
});
