import { readFile } from "node:fs/promises";
import path from "node:path";

const file = path.join(process.cwd(), "examples", "html-artifact-kit-showroom.html");
const html = await readFile(file, "utf8");
const checks = [
  ["HTML doctype", /^<!doctype html>/i.test(html)],
  ["language declaration", /<html[^>]+lang=/i.test(html)],
  ["viewport metadata", /name="viewport"/i.test(html)],
  ["document title", /<title>[^<]+<\/title>/i.test(html)],
  ["inline styles", /<style\b[^>]*>[^]*<\/style>/i.test(html)],
  ["inline behavior", /<script>[^]*<\/script>/i.test(html)],
  ["main landmark", /<main[\s>]/i.test(html)],
  ["skip link", /href="#main"/i.test(html)],
  ["no stylesheet dependency", !/<link[^>]+rel=["']stylesheet/i.test(html)],
  ["no remote script dependency", !/<script[^>]+src=/i.test(html)],
  ["no unresolved build marker", !html.includes("ARTIFACT_STYLES")],
  ["showroom uses canonical primary actions", /class="art-button art-button--primary"[^>]*>Publish report<\/button>/.test(html)],
  ["no duplicate showroom button system", !/\bbutton-(?:primary|secondary|quiet|danger)\b/.test(html)],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? "✓" : "✗"} ${name}`);
  failed ||= !passed;
}

if (failed) process.exitCode = 1;
else console.log(`Validated ${path.relative(process.cwd(), file)}`);
