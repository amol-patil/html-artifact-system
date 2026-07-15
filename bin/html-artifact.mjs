#!/usr/bin/env node

import { access, cp, lstat, mkdir, readlink, realpath, rename, rm, symlink } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const skillName = "build-html-artifacts";
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillSource = path.join(packageRoot, "skill", skillName);
const supportedHarnesses = new Set(["all", "codex", "claude", "gemini", "pi", "cursor", "antigravity", "generic"]);

function usage() {
  console.log(`HTML Artifact Kit

Usage:
  html-artifact install [--scope user|project] [--harness NAME] [--target DIR] [--force]
  html-artifact doctor [--scope user|project]

Harnesses:
  all            Codex, Claude Code, Gemini CLI, and Antigravity
  codex          Codex and ChatGPT desktop
  claude         Claude Code
  gemini         Gemini CLI
  pi             Pi coding agent
  cursor         Cursor
  antigravity    Antigravity CLI
  generic        Install to the interoperable .agents/skills location

Options:
  --scope        Install for the current user (default) or current project
  --harness      Harness preset to configure (default: all)
  --target       Custom skills directory; installs <target>/${skillName}
  --force        Replace an existing installation of this skill
  --help         Show this help
`);
}

function parseArgs(argv) {
  const args = { command: "install", scope: "user", harness: "all", target: null, force: false };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith("-")) args.command = rest.shift();
  while (rest.length) {
    const flag = rest.shift();
    if (flag === "--help" || flag === "-h") args.command = "help";
    else if (flag === "--force") args.force = true;
    else if (flag === "--scope") args.scope = rest.shift();
    else if (flag === "--harness") args.harness = rest.shift();
    else if (flag === "--target") args.target = rest.shift();
    else throw new Error(`Unknown option: ${flag}`);
  }
  if (!new Set(["install", "doctor", "help"]).has(args.command)) throw new Error(`Unknown command: ${args.command}`);
  if (!new Set(["user", "project"]).has(args.scope)) throw new Error("--scope must be user or project");
  if (!supportedHarnesses.has(args.harness)) throw new Error(`Unsupported harness: ${args.harness}`);
  if (args.target) args.target = path.resolve(args.target);
  return args;
}

async function exists(target) {
  try {
    await lstat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function canonicalRoot(args) {
  if (args.target) return args.target;
  return args.scope === "user"
    ? path.join(homedir(), ".agents", "skills")
    : path.join(process.cwd(), ".agents", "skills");
}

function aliasRoots(args) {
  if (args.target) return [];
  const roots = [];
  const wantsClaude = args.harness === "all" || args.harness === "claude";
  const wantsAntigravity = args.harness === "all" || args.harness === "antigravity";

  if (wantsClaude) {
    roots.push({ harness: "Claude Code", root: args.scope === "user"
      ? path.join(homedir(), ".claude", "skills")
      : path.join(process.cwd(), ".claude", "skills") });
  }
  if (wantsAntigravity && args.scope === "user") {
    roots.push({ harness: "Antigravity CLI", root: path.join(homedir(), ".gemini", "antigravity-cli", "skills") });
  }
  return roots;
}

async function verifySource() {
  await access(path.join(skillSource, "SKILL.md"));
}

async function installCanonical(destination, force) {
  await mkdir(path.dirname(destination), { recursive: true });
  if (await exists(destination)) {
    if (!force) throw new Error(`Skill already exists at ${destination}. Re-run with --force to update it.`);
    await rm(destination, { recursive: true, force: true });
  }

  const temporary = path.join(path.dirname(destination), `.${skillName}.install-${process.pid}`);
  await rm(temporary, { recursive: true, force: true });
  await cp(skillSource, temporary, { recursive: true });
  await rename(temporary, destination);
}

async function ensureAlias(alias, canonical, force) {
  await mkdir(path.dirname(alias), { recursive: true });
  if (await exists(alias)) {
    try {
      const [current, expected] = await Promise.all([realpath(alias), realpath(canonical)]);
      if (current === expected) return "already linked";
    } catch {
      // Replace only when explicitly requested.
    }
    if (!force) throw new Error(`A different skill exists at ${alias}. Re-run with --force to replace it.`);
    await rm(alias, { recursive: true, force: true });
  }
  await symlink(canonical, alias, process.platform === "win32" ? "junction" : "dir");
  return "linked";
}

async function install(args) {
  await verifySource();
  const root = canonicalRoot(args);
  const destination = path.join(root, skillName);
  await installCanonical(destination, args.force);

  console.log(`Installed ${skillName}`);
  console.log(`  canonical: ${destination}`);
  for (const entry of aliasRoots(args)) {
    const alias = path.join(entry.root, skillName);
    const result = await ensureAlias(alias, destination, args.force);
    console.log(`  ${entry.harness}: ${alias} (${result})`);
  }

  console.log("\nTry it:");
  console.log("  Create an executive dashboard using $build-html-artifacts.");
  console.log("\nRestart or refresh your harness if the skill is not discovered immediately.");
}

async function doctor(args) {
  const destination = path.join(canonicalRoot(args), skillName);
  let healthy = true;
  if (await exists(path.join(destination, "SKILL.md"))) console.log(`ok  canonical  ${destination}`);
  else {
    healthy = false;
    console.log(`missing       ${destination}`);
  }

  for (const entry of aliasRoots({ ...args, harness: "all" })) {
    const alias = path.join(entry.root, skillName);
    if (!(await exists(alias))) {
      healthy = false;
      console.log(`missing       ${entry.harness}: ${alias}`);
      continue;
    }
    try {
      const target = await readlink(alias);
      console.log(`ok  linked     ${entry.harness}: ${alias} -> ${target}`);
    } catch {
      console.log(`ok  present    ${entry.harness}: ${alias}`);
    }
  }
  if (!healthy) process.exitCode = 1;
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "help") usage();
  else if (args.command === "doctor") await doctor(args);
  else await install(args);
} catch (error) {
  console.error(`html-artifact: ${error.message}`);
  process.exitCode = 1;
}
