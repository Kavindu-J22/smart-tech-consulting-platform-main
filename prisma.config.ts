import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Prisma doesn't read .env.local on its own, so load it the same way Next does.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Migrations and Studio use the direct string. Not env() because that throws
  // when the key is missing, which would break `prisma generate` in CI.
  datasource: { url: process.env.DIRECT_URL },
});
