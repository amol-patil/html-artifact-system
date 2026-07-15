#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const file = process.argv[2];
if (!file) {
  console.error("Usage: validate-html.mjs <artifact.html>");
  process.exit(2);
}

const html = await readFile(file, "utf8");
const assertions = {
  doctype: /^<!doctype html>/i.test(html),
  title: /<title>[^<]+<\/title>/i.test(html),
  viewport: /name=["']viewport["']/i.test(html),
  language: /<html[^>]+lang=/i.test(html),
  main: /<main[\s>]/i.test(html),
  inlineStyles: /<style[\s>]/i.test(html),
  noRemoteScripts: !/<script[^>]+src=/i.test(html),
  noRemoteStylesheets: !/<link[^>]+rel=["']stylesheet/i.test(html),
  noPlaceholders: !/(TODO|ARTIFACT_STYLES|lorem ipsum)/i.test(html),
};

for (const [name, ok] of Object.entries(assertions)) console.log(`${ok ? "✓" : "✗"} ${name}`);
if (Object.values(assertions).some((ok) => !ok)) process.exit(1);
