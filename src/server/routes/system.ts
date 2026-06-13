import { exec } from "node:child_process";
import { promisify } from "node:util";
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Hono } from "hono";

import type Database from "better-sqlite3";

const execAsync = promisify(exec);

export function createSystemRoutes({ sqlite }: { sqlite: Database.Database }) {
  const router = new Hono();

  router.get("/backup", async (c) => {
    const tempDir = join(process.cwd(), "data", `backup-${Date.now()}`);
    const zipFile = join(process.cwd(), "data", `backup-${Date.now()}.zip`);

    try {
      // Create backup directory structure
      await mkdir(join(tempDir, "data"), { recursive: true });
      await mkdir(join(tempDir, "uploads"), { recursive: true });

      // Run better-sqlite3 backup safely
      await sqlite.backup(join(tempDir, "data", "stitchlet.db"));

      // Copy uploads if folder exists
      const uploadsDir = join(process.cwd(), "uploads");
      if (existsSync(uploadsDir)) {
        await cp(uploadsDir, join(tempDir, "uploads"), { recursive: true });
      }

      // Create ZIP of the temp structure
      await execAsync(`zip -r "${zipFile}" data uploads`, { cwd: tempDir });

      // Read ZIP
      const buffer = await readFile(zipFile);

      // Clean up temp dir and zip file asynchronously
      setTimeout(async () => {
        await rm(tempDir, { recursive: true, force: true });
        await rm(zipFile, { force: true });
      }, 1000);

      // Return ZIP attachment
      c.header("Content-Type", "application/zip");
      c.header(
        "Content-Disposition",
        `attachment; filename="stitchlet-backup-${new Date().toISOString().slice(0, 10)}.zip"`
      );
      return c.body(buffer);
    } catch (error) {
      console.error("Backup failed:", error);
      // Ensure cleanup on failure
      await rm(tempDir, { recursive: true, force: true });
      await rm(zipFile, { force: true });
      return c.json({ error: "Backup failed" }, 500);
    }
  });

  router.post("/restore", async (c) => {
    const formData = await c.req.parseBody();
    const file = formData["backup"];

    if (!file || typeof file === "string") {
      return c.json({ error: "No backup file provided" }, 400);
    }

    const tempZip = join(process.cwd(), "data", `restore-${Date.now()}.zip`);

    try {
      const buffer = await file.arrayBuffer();
      await writeFile(tempZip, Buffer.from(buffer));

      // Schedule extraction and restart
      setTimeout(async () => {
        try {
          // Close SQLite connection to unlock the file
          sqlite.close();

          // Delete existing DB and uploads
          const dbFile = join(process.cwd(), "data", "stitchlet.db");
          if (existsSync(dbFile)) {
            await rm(dbFile, { force: true });
          }

          const uploadsDir = join(process.cwd(), "uploads");
          if (existsSync(uploadsDir)) {
            await rm(uploadsDir, { recursive: true, force: true });
          }

          // Unzip backup
          await execAsync(`unzip -o "${tempZip}" -d "${process.cwd()}"`);

          // Clean up temp ZIP
          await rm(tempZip, { force: true });

          console.log("Stitchlet backup restored successfully. Restarting process...");
          process.exit(0);
        } catch (err) {
          console.error("Restore extraction failed:", err);
          process.exit(1);
        }
      }, 500);

      return c.json({
        success: true,
        message: "Restore initiated. The database and media folder will be replaced, and the server will restart.",
      });
    } catch (error) {
      console.error("Restore failed:", error);
      await rm(tempZip, { force: true });
      return c.json({ error: "Restore failed to initiate" }, 500);
    }
  });

  return router;
}
