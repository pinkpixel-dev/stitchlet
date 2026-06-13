import { Hono } from "hono";
import { createProjectSchema, updateProjectSchema } from "../../shared/schemas";
import type { AppDependencies } from "../app";
import { createProjectRepository } from "../services/projects";
import { createProjectCounterRoutes } from "./counters";

export function createProjectRoutes({ db }: Required<AppDependencies>) {
  const projectRoutes = new Hono();
  const projects = createProjectRepository(db);

  projectRoutes.get("/", async (c) => {
    return c.json({ projects: await projects.list() });
  });

  projectRoutes.post("/", async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid project payload", details: parsed.error.flatten() }, 400);
    }

    return c.json({ project: await projects.create(parsed.data) }, 201);
  });

  projectRoutes.get("/:id", async (c) => {
    const project = await projects.findById(c.req.param("id"));

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ project });
  });

  projectRoutes.patch("/:id", async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid project payload", details: parsed.error.flatten() }, 400);
    }

    const project = await projects.update(c.req.param("id"), parsed.data);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ project });
  });

  projectRoutes.delete("/:id", async (c) => {
    const deleted = await projects.delete(c.req.param("id"));

    if (!deleted) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.body(null, 204);
  });

  projectRoutes.route("/:id/counters", createProjectCounterRoutes({ db }));

  return projectRoutes;
}
