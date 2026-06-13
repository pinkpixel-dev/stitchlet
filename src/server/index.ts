import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { fileURLToPath } from "node:url";
import { projectRoutes } from "./routes/projects";

const app = new Hono();
const port = Number(process.env.PORT ?? 6497);
const distRoot = fileURLToPath(new URL("../../dist", import.meta.url));

app.use(logger());

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    name: "Stitchlet",
    storage: "self-hosted",
  }),
);

app.route("/api/projects", projectRoutes);

app.use("/*", serveStatic({ root: distRoot }));
app.use("*", serveStatic({ path: `${distRoot}/index.html` }));

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Stitchlet is running on http://localhost:${info.port}`);
  },
);
