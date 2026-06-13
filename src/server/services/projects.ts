import { desc, eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { CreateProjectInput, Project, UpdateProjectInput } from "../../shared/schemas";
import * as schema from "../db/schema";

type Database = BetterSQLite3Database<typeof schema>;
type ProjectRow = typeof schema.projects.$inferSelect;

export function createProjectRepository(db: Database) {
  return {
    async list() {
      const rows = await db.select().from(schema.projects).orderBy(desc(schema.projects.updatedAt));
      return rows.map(rowToProject);
    },

    async create(input: CreateProjectInput) {
      const now = new Date().toISOString();
      const project: typeof schema.projects.$inferInsert = {
        id: slugify(input.title),
        title: input.title,
        status: input.status,
        yarnType: input.yarnType,
        yarnWeight: input.yarnWeight,
        colorsUsed: input.colorsUsed,
        hookSize: input.hookSize,
        finishedSize: input.finishedSize,
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(schema.projects).values(project);

      return rowToProject(project as ProjectRow);
    },

    async findById(id: string) {
      const [row] = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
      return row ? rowToProject(row) : null;
    },

    async update(id: string, input: UpdateProjectInput) {
      const existing = await this.findById(id);

      if (!existing) {
        return null;
      }

      const updatedAt = new Date().toISOString();

      await db
        .update(schema.projects)
        .set({
          ...projectInputToRow(input),
          updatedAt,
        })
        .where(eq(schema.projects.id, id));

      return this.findById(id);
    },

    async updatePhotoPath(id: string, photoPath: string | null) {
      await db
        .update(schema.projects)
        .set({ photoPath: photoPath ?? undefined, updatedAt: new Date().toISOString() })
        .where(eq(schema.projects.id, id));
      return this.findById(id);
    },

    async delete(id: string) {
      const existing = await this.findById(id);

      if (!existing) {
        return false;
      }

      await db.delete(schema.projects).where(eq(schema.projects.id, id));
      return true;
    },
  };
}

function projectInputToRow(input: Partial<CreateProjectInput>): Partial<typeof schema.projects.$inferInsert> {
  return {
    title: input.title,
    status: input.status,
    yarnType: input.yarnType,
    yarnWeight: input.yarnWeight,
    colorsUsed: input.colorsUsed,
    hookSize: input.hookSize,
    finishedSize: input.finishedSize,
    notes: input.notes,
  };
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    status: row.status as Project["status"],
    yarnType: row.yarnType ?? undefined,
    yarnWeight: row.yarnWeight ?? undefined,
    colorsUsed: row.colorsUsed ?? undefined,
    hookSize: row.hookSize ?? undefined,
    finishedSize: row.finishedSize ?? undefined,
    notes: row.notes ?? undefined,
    photoPath: row.photoPath ?? undefined,
    pdfPath: row.pdfPath ?? undefined,
    pdfFilename: row.pdfFilename ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
