import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("active"),
  yarnType: text("yarn_type"),
  yarnWeight: text("yarn_weight"),
  colorsUsed: text("colors_used"),
  hookSize: text("hook_size"),
  finishedSize: text("finished_size"),
  notes: text("notes"),
  photoPath: text("photo_path"),
  pdfPath: text("pdf_path"),
  pdfFilename: text("pdf_filename"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const counters = sqliteTable("counters", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull().default("row"),
  currentValue: integer("current_value").notNull().default(0),
  targetValue: integer("target_value"),
  notes: text("notes"),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const customSections = sqliteTable("custom_sections", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const appSettings = sqliteTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
