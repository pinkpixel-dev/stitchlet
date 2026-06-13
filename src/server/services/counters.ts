import { asc, eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { Counter, CreateCounterInput, UpdateCounterInput } from "../../shared/schemas";
import * as schema from "../db/schema";

type Database = BetterSQLite3Database<typeof schema>;
type CounterRow = typeof schema.counters.$inferSelect;

export function createCounterRepository(db: Database) {
  return {
    async listForProject(projectId: string) {
      const rows = await db.select().from(schema.counters).where(eq(schema.counters.projectId, projectId)).orderBy(asc(schema.counters.sortOrder));
      return rows.map(rowToCounter);
    },

    async create(projectId: string, input: CreateCounterInput) {
      const now = new Date().toISOString();
      const existingCounters = await this.listForProject(projectId);
      const counter: typeof schema.counters.$inferInsert = {
        id: crypto.randomUUID(),
        projectId,
        name: input.name,
        type: input.type,
        currentValue: input.currentValue,
        targetValue: input.targetValue,
        notes: input.notes,
        isCompleted: false,
        sortOrder: existingCounters.length,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(schema.counters).values(counter);

      return rowToCounter(counter as CounterRow);
    },

    async findById(id: string) {
      const [row] = await db.select().from(schema.counters).where(eq(schema.counters.id, id)).limit(1);
      return row ? rowToCounter(row) : null;
    },

    async update(id: string, input: UpdateCounterInput) {
      const existing = await this.findById(id);

      if (!existing) {
        return null;
      }

      await db
        .update(schema.counters)
        .set({
          ...counterInputToRow(input),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.counters.id, id));

      return this.findById(id);
    },

    async delete(id: string) {
      const existing = await this.findById(id);

      if (!existing) {
        return false;
      }

      await db.delete(schema.counters).where(eq(schema.counters.id, id));
      return true;
    },
  };
}

function counterInputToRow(input: UpdateCounterInput): Partial<typeof schema.counters.$inferInsert> {
  return {
    name: input.name,
    type: input.type,
    currentValue: input.currentValue,
    targetValue: input.targetValue,
    notes: input.notes,
    isCompleted: input.isCompleted,
    sortOrder: input.sortOrder,
  };
}

function rowToCounter(row: CounterRow): Counter {
  return {
    id: row.id,
    projectId: row.projectId,
    name: row.name,
    type: row.type as Counter["type"],
    currentValue: row.currentValue,
    targetValue: row.targetValue ?? undefined,
    notes: row.notes ?? undefined,
    isCompleted: row.isCompleted,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
