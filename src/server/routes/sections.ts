import { Hono } from "hono";
import { createCustomSectionSchema, updateCustomSectionSchema } from "../../shared/schemas";
import type { AppDependencies } from "../app";
import { createProjectRepository } from "../services/projects";
import { createSectionRepository } from "../services/sections";

export function createSectionRoutes({ db }: Required<AppDependencies>) {
  const sectionRoutes = new Hono();
  const sections = createSectionRepository(db);

  sectionRoutes.patch("/:id", async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = updateCustomSectionSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid section payload", details: parsed.error.flatten() }, 400);
    }

    const section = await sections.update(c.req.param("id"), parsed.data);

    if (!section) {
      return c.json({ error: "Section not found" }, 404);
    }

    return c.json({ section });
  });

  sectionRoutes.delete("/:id", async (c) => {
    const deleted = await sections.delete(c.req.param("id"));

    if (!deleted) {
      return c.json({ error: "Section not found" }, 404);
    }

    return c.body(null, 204);
  });

  return sectionRoutes;
}

export function createProjectSectionRoutes({ db }: Required<AppDependencies>) {
  const projectSectionRoutes = new Hono();
  const sections = createSectionRepository(db);
  const projects = createProjectRepository(db);

  projectSectionRoutes.get("/", async (c) => {
    const projectId = c.req.param("id");

    if (!projectId) {
      return c.json({ error: "Project not found" }, 404);
    }

    const project = await projects.findById(projectId);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ sections: await sections.listForProject(project.id) });
  });

  projectSectionRoutes.post("/", async (c) => {
    const projectId = c.req.param("id");

    if (!projectId) {
      return c.json({ error: "Project not found" }, 404);
    }

    const project = await projects.findById(projectId);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    const body = await c.req.json().catch(() => null);
    const parsed = createCustomSectionSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid section payload", details: parsed.error.flatten() }, 400);
    }

    return c.json({ section: await sections.create(project.id, parsed.data) }, 201);
  });

  return projectSectionRoutes;
}
