import { mkdtemp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createApp } from "../app";
import { createTestDatabase } from "../test/test-db";

describe("system routes", () => {
  let root: string;

  // The backup route reads and writes real folders, so every test runs against
  // a throwaway root. Pointing it at the repo would archive (and clean up
  // inside) the developer's own library.
  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "stitchlet-test-"));
    await mkdir(join(root, "data"), { recursive: true });
    await mkdir(join(root, "uploads", "projects", "swatch"), { recursive: true });
    await writeFile(join(root, "uploads", "projects", "swatch", "pattern.pdf"), "%PDF-1.4 test\n");
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  test("generates a backup archive and returns 200 OK", async () => {
    const testDb = createTestDatabase();
    const app = createApp({ db: testDb.db, root, sqlite: testDb.sqlite });

    const response = await app.request("/api/system/backup");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/zip");
    expect(response.headers.get("content-disposition")).toContain('attachment; filename="stitchlet-backup-');

    // A real zip, not an empty or error body
    const body = Buffer.from(await response.arrayBuffer());
    expect(body.byteLength).toBeGreaterThan(0);
    expect(body.subarray(0, 2).toString()).toBe("PK");

    testDb.sqlite.close();
  });

  test("leaves no staging files behind in data/", async () => {
    const testDb = createTestDatabase();
    const app = createApp({ db: testDb.db, root, sqlite: testDb.sqlite });

    const response = await app.request("/api/system/backup");
    expect(response.status).toBe(200);
    await response.arrayBuffer();

    // Staging used to survive on a 1s timer that never fired if the process
    // exited first, dropping fake "backup-*" archives into the live data dir.
    const entries = await readdir(join(root, "data"));
    expect(entries.filter((name) => name.startsWith("backup-"))).toEqual([]);

    testDb.sqlite.close();
  });

  test("does not touch the source uploads folder", async () => {
    const testDb = createTestDatabase();
    const app = createApp({ db: testDb.db, root, sqlite: testDb.sqlite });

    const response = await app.request("/api/system/backup");
    expect(response.status).toBe(200);
    await response.arrayBuffer();

    const projects = await readdir(join(root, "uploads", "projects"));
    expect(projects).toContain("swatch");
    expect(await readdir(join(root, "uploads", "projects", "swatch"))).toEqual(["pattern.pdf"]);

    testDb.sqlite.close();
  });
});
