import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { seconds } from "itty-time";
import { db } from "../db";
import * as schema from "../db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",

    schema,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    cookies: {
      session_token: {
        name: "session_token_v1",
        attributes: {
          httpOnly: true,
          secure: true,
        },
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: seconds("5 minutes"),
      },
    },
  },
  plugins: [
    openAPI({
      disableDefaultReference: true,
    }),
  ],
});
