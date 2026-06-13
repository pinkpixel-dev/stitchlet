import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL?.replace("file:", "") ?? "./data/stitchlet.db";

mkdirSync(dirname(databaseUrl), { recursive: true });

export const sqlite = new Database(databaseUrl);
export const db = drizzle(sqlite, { schema });
