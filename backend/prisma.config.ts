// Prisma configuration file
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma configuration for the backend server
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
