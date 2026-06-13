import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { db as defaultDb } from "./db";
import * as schema from "./db/schema";
import { createCounterRoutes } from "./routes/counters";
import { createProjectRoutes } from "./routes/projects";

export type AppDependencies = {
  db?: BetterSQLite3Database<typeof schema>;
};

export function createApp(dependencies: AppDependencies = {}) {
  const app = new Hono();
  const db = dependencies.db ?? defaultDb;

  app.use(logger());

  app.get("/api/health", (c) =>
    c.json({
      ok: true,
      name: "Stitchlet",
      storage: "self-hosted",
    }),
  );

  app.route("/api/projects", createProjectRoutes({ db }));
  app.route("/api/counters", createCounterRoutes({ db }));

  return app;
}
