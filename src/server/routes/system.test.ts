import { describe, expect, test } from "vitest";
import { createApp } from "../app";
import { createTestDatabase } from "../test/test-db";

describe("system routes", () => {
  test("generates backup file and returns 200 OK", async () => {
    const testDb = createTestDatabase();
    const app = createApp({ db: testDb.db, sqlite: testDb.sqlite });

    const response = await app.request("/api/system/backup");

    // Since in-memory DB and test environment might not fully support child_process.exec of zip,
    // let's verify either 200 (if zip tool ran successfully) or check if error handling works.
    // However, on this workspace's Linux environment, 'zip' is installed so it will complete successfully!
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/zip");
    expect(response.headers.get("content-disposition")).toContain("attachment; filename=\"stitchlet-backup-");

    testDb.sqlite.close();
  });
});
