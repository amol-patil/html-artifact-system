import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "node_modules", "@tailwindcss", "cli", "dist", "index.mjs");
const result = spawnSync(process.execPath, [
  cli,
  "-i", path.join(root, "src", "styles.css"),
  "-o", path.join(root, ".tmp", "artifact.css"),
  "--minify"
], {
  cwd: root,
  stdio: ["ignore", "inherit", "inherit"]
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
