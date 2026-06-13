import { Hono } from "hono";
import { createCounterSchema, updateCounterSchema } from "../../shared/schemas";
import type { AppDependencies } from "../app";
import { createCounterRepository } from "../services/counters";
import { createProjectRepository } from "../services/projects";

export function createCounterRoutes({ db }: Required<AppDependencies>) {
  const counterRoutes = new Hono();
  const counters = createCounterRepository(db);

  counterRoutes.patch("/:id", async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = updateCounterSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid counter payload", details: parsed.error.flatten() }, 400);
    }

    const counter = await counters.update(c.req.param("id"), parsed.data);

    if (!counter) {
      return c.json({ error: "Counter not found" }, 404);
    }

    return c.json({ counter });
  });

  counterRoutes.delete("/:id", async (c) => {
    const deleted = await counters.delete(c.req.param("id"));

    if (!deleted) {
      return c.json({ error: "Counter not found" }, 404);
    }

    return c.body(null, 204);
  });

  return counterRoutes;
}

export function createProjectCounterRoutes({ db }: Required<AppDependencies>) {
  const projectCounterRoutes = new Hono();
  const counters = createCounterRepository(db);
  const projects = createProjectRepository(db);

  projectCounterRoutes.get("/", async (c) => {
    const projectId = c.req.param("id");

    if (!projectId) {
      return c.json({ error: "Project not found" }, 404);
    }

    const project = await projects.findById(projectId);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ counters: await counters.listForProject(project.id) });
  });

  projectCounterRoutes.post("/", async (c) => {
    const projectId = c.req.param("id");

    if (!projectId) {
      return c.json({ error: "Project not found" }, 404);
    }

    const project = await projects.findById(projectId);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    const body = await c.req.json().catch(() => null);
    const parsed = createCounterSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid counter payload", details: parsed.error.flatten() }, 400);
    }

    return c.json({ counter: await counters.create(project.id, parsed.data) }, 201);
  });

  return projectCounterRoutes;
}
