import { Hono } from "hono";
import { createProjectSchema } from "../../shared/schemas";
import { sampleProjects } from "../../shared/sample-data";

export const projectRoutes = new Hono();

projectRoutes.get("/", (c) => {
  return c.json({ projects: sampleProjects });
});

projectRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid project payload", details: parsed.error.flatten() }, 400);
  }

  return c.json(
    {
      project: {
        ...parsed.data,
        id: parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    201,
  );
});

projectRoutes.get("/:id", (c) => {
  const project = sampleProjects.find((item) => item.id === c.req.param("id"));

  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }

  return c.json({ project });
});
