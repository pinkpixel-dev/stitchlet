import { asc, eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { CreateCustomSectionInput, CustomSection, UpdateCustomSectionInput } from "../../shared/schemas";
import * as schema from "../db/schema";

type Database = BetterSQLite3Database<typeof schema>;
type SectionRow = typeof schema.customSections.$inferSelect;

export function createSectionRepository(db: Database) {
  return {
    async listForProject(projectId: string) {
      const rows = await db
        .select()
        .from(schema.customSections)
        .where(eq(schema.customSections.projectId, projectId))
        .orderBy(asc(schema.customSections.sortOrder));
      return rows.map(rowToSection);
    },

    async create(projectId: string, input: CreateCustomSectionInput) {
      const now = new Date().toISOString();
      const existing = await this.listForProject(projectId);
      const section: typeof schema.customSections.$inferInsert = {
        id: crypto.randomUUID(),
        projectId,
        title: input.title,
        content: input.content ?? "",
        sortOrder: existing.length,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(schema.customSections).values(section);
      return rowToSection(section as SectionRow);
    },

    async findById(id: string) {
      const [row] = await db
        .select()
        .from(schema.customSections)
        .where(eq(schema.customSections.id, id))
        .limit(1);
      return row ? rowToSection(row) : null;
    },

    async update(id: string, input: UpdateCustomSectionInput) {
      const existing = await this.findById(id);

      if (!existing) {
        return null;
      }

      await db
        .update(schema.customSections)
        .set({
          ...(input.title !== undefined && { title: input.title }),
          ...(input.content !== undefined && { content: input.content }),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.customSections.id, id));

      return this.findById(id);
    },

    async delete(id: string) {
      const existing = await this.findById(id);

      if (!existing) {
        return false;
      }

      await db.delete(schema.customSections).where(eq(schema.customSections.id, id));
      return true;
    },
  };
}

function rowToSection(row: SectionRow): CustomSection {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    content: row.content,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
