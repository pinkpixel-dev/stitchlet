import { createReadStream, existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Hono } from "hono";
import { createProjectSchema, updateProjectSchema } from "../../shared/schemas";
import type { AppDependencies } from "../app";
import { createProjectRepository } from "../services/projects";
import { createProjectCounterRoutes } from "./counters";
import { createProjectSectionRoutes } from "./sections";

const uploadsRoot = fileURLToPath(new URL("../../../uploads", import.meta.url));

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

  // Photo: upload
  projectRoutes.post("/:id/photo", async (c) => {
    const project = await projects.findById(c.req.param("id"));

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    const formData = await c.req.parseBody();
    const file = formData["photo"];

    if (!file || typeof file === "string") {
      return c.json({ error: "No photo file provided" }, 400);
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return c.json({ error: "Unsupported image type. Use JPEG, PNG, WebP, or GIF." }, 400);
    }

    const projectDir = join(uploadsRoot, "projects", project.id);
    await mkdir(projectDir, { recursive: true });

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
    const filename = `photo.${ext}`;
    const filePath = join(projectDir, filename);

    // Remove any existing photo with a different extension
    for (const old of ["photo.jpg", "photo.png", "photo.webp", "photo.gif"]) {
      const oldPath = join(projectDir, old);
      if (oldPath !== filePath && existsSync(oldPath)) {
        await rm(oldPath);
      }
    }

    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    const relativePath = `projects/${project.id}/${filename}`;
    const updated = await projects.updatePhotoPath(project.id, relativePath);

    return c.json({ project: updated }, 200);
  });

  // Photo: serve
  projectRoutes.get("/:id/photo", async (c) => {
    const project = await projects.findById(c.req.param("id"));

    if (!project || !project.photoPath) {
      return c.json({ error: "No photo found" }, 404);
    }

    const filePath = join(uploadsRoot, project.photoPath);

    if (!existsSync(filePath)) {
      return c.json({ error: "Photo file missing" }, 404);
    }

    const ext = filePath.split(".").pop() ?? "jpg";
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
    };
    const contentType = mimeMap[ext] ?? "image/jpeg";

    const stream = createReadStream(filePath);
    return new Response(stream as unknown as ReadableStream, {
      headers: { "content-type": contentType },
    });
  });

  // Photo: delete
  projectRoutes.delete("/:id/photo", async (c) => {
    const project = await projects.findById(c.req.param("id"));

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    if (project.photoPath) {
      const filePath = join(uploadsRoot, project.photoPath);
      if (existsSync(filePath)) {
        await rm(filePath);
      }
      await projects.updatePhotoPath(project.id, null);
    }

    return c.body(null, 204);
  });

  projectRoutes.route("/:id/counters", createProjectCounterRoutes({ db }));
  projectRoutes.route("/:id/sections", createProjectSectionRoutes({ db }));

  return projectRoutes;
}

