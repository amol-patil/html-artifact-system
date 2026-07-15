import { access, mkdtemp, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const sandbox = await mkdtemp(path.join(tmpdir(), "html-artifact-kit-installer-"));
const target = path.join(sandbox, "custom-skills");
const cleanHome = path.join(sandbox, "home");

try {
  const install = spawnSync(process.execPath, ["bin/html-artifact.mjs", "install", "--target", target], {
    cwd: root,
    encoding: "utf8"
  });
  if (install.status !== 0) throw new Error(install.stderr || install.stdout);
  await access(path.join(target, "build-html-artifacts", "SKILL.md"));
  await access(path.join(target, "build-html-artifacts", "assets", "html-artifact-kit.css"));

  const duplicate = spawnSync(process.execPath, ["bin/html-artifact.mjs", "install", "--target", target], {
    cwd: root,
    encoding: "utf8"
  });
  if (duplicate.status === 0 || !duplicate.stderr.includes("--force")) {
    throw new Error("Existing installs must require --force");
  }

  const update = spawnSync(process.execPath, ["bin/html-artifact.mjs", "install", "--target", target, "--force"], {
    cwd: root,
    encoding: "utf8"
  });
  if (update.status !== 0) throw new Error(update.stderr || update.stdout);

  const allHarnesses = spawnSync(process.execPath, ["bin/html-artifact.mjs", "install", "--harness", "all"], {
    cwd: root,
    env: { ...process.env, HOME: cleanHome },
    encoding: "utf8"
  });
  if (allHarnesses.status !== 0) throw new Error(allHarnesses.stderr || allHarnesses.stdout);

  const canonical = path.join(cleanHome, ".agents", "skills", "build-html-artifacts");
  const aliases = [
    path.join(cleanHome, ".claude", "skills", "build-html-artifacts"),
    path.join(cleanHome, ".gemini", "antigravity-cli", "skills", "build-html-artifacts")
  ];
  const expected = await realpath(canonical);
  for (const alias of aliases) {
    if (await realpath(alias) !== expected) throw new Error(`${alias} does not resolve to the canonical skill`);
  }

  console.log("Installer tests passed");
} finally {
  await rm(sandbox, { recursive: true, force: true });
}
