#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [, , inputArg, outputArg] = process.argv;
if (!inputArg || !outputArg) {
  console.error("Usage: bundle-html.mjs <authoring.html> <artifact.html>");
  process.exit(2);
}

const input = path.resolve(inputArg);
const output = path.resolve(outputArg);
const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(skillRoot, "assets", "html-artifact-kit.css");
const [html, css] = await Promise.all([readFile(input, "utf8"), readFile(cssPath, "utf8")]);
const linkPattern = /<link\s+[^>]*data-html-artifact-kit-css[^>]*>/i;
if (!linkPattern.test(html)) {
  console.error("Missing <link ... data-html-artifact-kit-css> in authoring HTML.");
  process.exit(1);
}

const bundled = html.replace(linkPattern, `<style id="html-artifact-kit-styles">${css}</style>`);
await writeFile(output, bundled);
console.log(`Bundled ${path.relative(process.cwd(), output)} (${Math.round(Buffer.byteLength(bundled) / 1024)} kB)`);
