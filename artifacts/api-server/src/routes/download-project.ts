import { Router } from "express";
import { spawn } from "node:child_process";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { logger } from "../lib/logger";

const router = Router();

// Workspace root: this module is bundled to artifacts/api-server/dist/index.mjs,
// so import.meta.dirname is artifacts/api-server/dist — go up 3 levels.
function getWorkspaceRoot(): string {
  return path.resolve(import.meta.dirname, "../../..");
}

// Explicit allowlist of project paths to include. Deliberately excludes
// dotfiles/config outside these paths (e.g. .env, .replit, .config) so no
// secret-bearing files can ever be swept in, even by accident.
const ALLOWED_PATHS = [
  "artifacts/mystique/src",
  "artifacts/mystique/public",
  "artifacts/mystique/index.html",
  "artifacts/mystique/package.json",
  "artifacts/mystique/vite.config.ts",
  "artifacts/mystique/tsconfig.json",
  "artifacts/mystique/artifact.toml",
  "artifacts/api-server/src",
  "artifacts/api-server/package.json",
  "artifacts/api-server/build.mjs",
  "artifacts/api-server/tsconfig.json",
  "artifacts/api-server/artifact.toml",
  "lib",
  "package.json",
  "pnpm-workspace.yaml",
  "pnpm-lock.yaml",
  "tsconfig.json",
  "replit.md",
];

// Extra denylist applied within the allowlisted paths, in case any secret-like
// file ever lands inside one of them (e.g. a stray .env committed locally).
const DENY_GLOBS = [
  "*/node_modules/*",
  "*/dist/*",
  "*.env",
  "*.env.*",
  "*.pem",
  "*.key",
  "*secret*",
  "*.log",
];

const MAX_ZIP_MS = 30_000;

router.get("/download-project", async (req, res) => {
  const token = req.query.token;
  const expected = process.env.PROJECT_DOWNLOAD_TOKEN;
  if (!expected || token !== expected) {
    res.status(401).json({ error: "Invalid or missing download token" });
    return;
  }

  const rootDir = getWorkspaceRoot();
  const tmpDir = await mkdtemp(path.join(tmpdir(), "project-export-"));
  const zipPath = path.join(tmpDir, "mystique-compass-project.zip");

  const cleanup = () => {
    void rm(tmpDir, { recursive: true, force: true });
  };

  try {
    await new Promise<void>((resolve, reject) => {
      const args = [
        "-r",
        "-q",
        zipPath,
        ...ALLOWED_PATHS,
        "-x",
        ...DENY_GLOBS,
      ];
      const zipProcess = spawn("zip", args, { cwd: rootDir });

      const timer = setTimeout(() => {
        zipProcess.kill("SIGKILL");
        reject(new Error(`zip timed out after ${MAX_ZIP_MS}ms`));
      }, MAX_ZIP_MS);

      let stderr = "";
      zipProcess.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      zipProcess.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
      zipProcess.on("close", (code) => {
        clearTimeout(timer);
        // zip exits with 12 when nothing matched for one of the allowlisted
        // paths (e.g. an optional file doesn't exist yet) — treat 0 and 12
        // as success as long as the archive was produced.
        if (code === 0 || code === 12) {
          resolve();
        } else {
          reject(new Error(`zip exited with code ${code}: ${stderr}`));
        }
      });
    });

    res.download(zipPath, "mystique-compass-project.zip", (err) => {
      cleanup();
      if (err) {
        logger.error({ err }, "Failed to send project zip");
      }
    });
  } catch (err) {
    cleanup();
    logger.error({ err }, "Failed to build project zip");
    res.status(500).json({ error: "Failed to build project zip" });
  }
});

export default router;
