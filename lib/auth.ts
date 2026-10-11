import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { database } from "./db";

const socialProviders: NonNullable<
  Parameters<typeof betterAuth>[0]
>["socialProviders"] = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

const vercelHosts = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_URL,
]
  .filter((host): host is string => Boolean(host))
  .map((host) =>
    host.startsWith("http") ? host : `https://${host}`
  );

const baseURL =
  process.env.BETTER_AUTH_URL ||
  vercelHosts[0] ||
  "http://localhost:3000";

export const auth = betterAuth({
  database,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins: [
    baseURL,
    ...vercelHosts,
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  socialProviders,
  plugins: [nextCookies()],
});
