#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonicalCss = readFileSync(path.join(skillRoot, "assets", "html-artifact-kit.css"), "utf8").trim();

function testUnlabelledButtons(html) {
  const buttons = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi) ?? [];
  return buttons.every((button) => {
    const opening = button.match(/^<button\b[^>]*>/i)?.[0] ?? "";
    const content = button.replace(/^<button\b[^>]*>/i, "").replace(/<\/button>$/i, "").replace(/<[^>]+>/g, "").trim();
    return /aria-label\s*=|aria-labelledby\s*=/i.test(opening) || content.length > 0;
  });
}

function testFormLabels(html) {
  const controls = [...html.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)]
    .filter((match) => !/type\s*=\s*["']?(hidden|submit|button|reset)/i.test(match[2]));
  return controls.every(([, , attrs]) => {
    if (/aria-label\s*=|aria-labelledby\s*=/i.test(attrs)) return true;
    const id = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
    return Boolean(id && new RegExp(`<label\\b[^>]*for\\s*=\\s*["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(html));
  });
}

function testNoSemanticEdgeAccents(html) {
  const styleBlocks = [...html.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi)]
    .filter((match) => !/\bid=["']html-artifact-kit-styles["']/i.test(match[1]))
    .map((match) => match[2]);
  const semanticRule = /([^{}]*(?:callout|decision|insight|takeaway|conclusion|summary|notice)[^{}]*)\{([^{}]*)\}/gi;
  const bannedBorder = /(?:border-left|border-inline-start)\s*:\s*(?!0(?:\D|$)|1px(?:\D|$)|none\b|initial\b|inherit\b|unset\b)[^;}]*/i;

  for (const css of styleBlocks) {
    let match;
    while ((match = semanticRule.exec(css))) {
      if (bannedBorder.test(match[2])) return false;
    }
  }

  const semanticInlineStyle = /<[^>]+\bclass=["'][^"']*(?:callout|decision|insight|takeaway|conclusion|summary|notice)[^"']*["'][^>]*\bstyle=["'][^"']*(?:border-left|border-inline-start)\s*:\s*(?!0(?:\D|$)|1px(?:\D|$)|none\b)[^"']*["']/i;
  return !semanticInlineStyle.test(html);
}

export function auditArtifact(html, file = "artifact.html") {
  const versionMeta = html.match(/<meta\s+[^>]*name=["']html-artifact-kit["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1];
  const versionData = html.match(/<html\s+[^>]*data-html-artifact-kit=["']([^"']+)["']/i)?.[1];
  const canonicalBlock = html.match(/<style\s+[^>]*id=["']html-artifact-kit-styles["'][^>]*>([\s\S]*?)<\/style>/i)?.[1]?.trim();
  const remoteImages = [...html.matchAll(/<(?:img|source)\b[^>]*\bsrc(?:set)?=["']([^"']+)["']/gi)]
    .map((match) => match[1]).filter((src) => /^(?:https?:|\/\/|file:)/i.test(src));
  const placeholderPattern = /(?:\bTODO\b|lorem ipsum|replace this|artifact title|ARTIFACT_STYLES|ARTIFACT_SYSTEM_CSS)/i;
  const hasInteractive = /<(?:button|input|select|textarea|dialog)\b|role=["'](?:tab|button|switch)["']/i.test(html);
  const hasInlineScript = /<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/i.test(html);

  const checks = [
    { category: "Portability", name: "HTML doctype", points: 2, critical: true, pass: /^<!doctype html>/i.test(html) },
    { category: "Portability", name: "Canonical CSS is inline", points: 8, critical: true, pass: /<style\s+[^>]*id=["']html-artifact-kit-styles["']/i.test(html) },
    { category: "Portability", name: "No external stylesheet", points: 5, critical: true, pass: !/<link\b[^>]*rel=["']stylesheet["']/i.test(html) },
    { category: "Portability", name: "No external script", points: 5, critical: true, pass: !/<script\b[^>]*\bsrc=/i.test(html) },
    { category: "Portability", name: "No remote image dependency", points: 5, critical: true, pass: remoteImages.length === 0, detail: remoteImages.join(", ") },

    { category: "Identity", name: "Artifact version metadata", points: 4, critical: true, pass: Boolean(versionMeta) },
    { category: "Identity", name: "Artifact version attribute", points: 4, critical: true, pass: Boolean(versionData) },
    { category: "Identity", name: "Version markers agree", points: 4, critical: true, pass: Boolean(versionMeta && versionData && versionMeta === versionData), detail: `${versionMeta ?? "missing"} / ${versionData ?? "missing"}` },
    { category: "Identity", name: "Canonical CSS integrity", points: 8, critical: true, pass: canonicalBlock === canonicalCss, detail: canonicalBlock ? "inline CSS differs from the canonical asset" : "canonical style block missing" },
    { category: "Identity", name: "Canonical component classes", points: 3, critical: false, pass: /class=["'][^"']*\bart-/i.test(html) },
    { category: "Identity", name: "No semantic edge-accent callouts", points: 2, critical: true, pass: testNoSemanticEdgeAccents(html), detail: "remove thick border-left or border-inline-start styling from decisions, insights, takeaways, conclusions, summaries, notices, and callouts" },

    { category: "Structure", name: "Language declaration", points: 3, critical: true, pass: /<html\b[^>]*\blang=["'][^"']+/i.test(html) },
    { category: "Structure", name: "Viewport metadata", points: 3, critical: true, pass: /<meta\b[^>]*name=["']viewport["']/i.test(html) },
    { category: "Structure", name: "Descriptive title", points: 3, critical: false, pass: /<title>\s*[^<]{4,}\s*<\/title>/i.test(html) },
    { category: "Structure", name: "Main landmark", points: 3, critical: true, pass: /<main\b/i.test(html) },
    { category: "Structure", name: "Single primary heading", points: 3, critical: false, pass: (html.match(/<h1\b/gi) ?? []).length === 1 },

    { category: "Accessibility", name: "Skip link", points: 4, critical: false, pass: /<a\b[^>]*href=["']#main["']/i.test(html) },
    { category: "Accessibility", name: "Visible focus rule", points: 4, critical: true, pass: /:focus-visible/i.test(html) },
    { category: "Accessibility", name: "Reduced-motion rule", points: 4, critical: false, pass: /prefers-reduced-motion/i.test(html) },
    { category: "Accessibility", name: "Buttons have names", points: 4, critical: true, pass: testUnlabelledButtons(html) },
    { category: "Accessibility", name: "Form controls have labels", points: 4, critical: true, pass: testFormLabels(html) },

    { category: "Resilience", name: "Print behavior", points: 5, critical: false, pass: /@media\s+print/i.test(html) },
    { category: "Resilience", name: "No unresolved placeholders", points: 5, critical: true, pass: !placeholderPattern.test(html) },
    { category: "Resilience", name: "Interactive behavior is local", points: 3, critical: false, pass: !hasInteractive || hasInlineScript || !/(aria-expanded|role=["']tab|<dialog\b)/i.test(html) },
    { category: "Resilience", name: "Artifact type declared", points: 2, critical: false, pass: /<html\b[^>]*data-artifact-kind=["'][^"']+/i.test(html) },
  ];

  const score = checks.reduce((sum, check) => sum + (check.pass ? check.points : 0), 0);
  const criticalFailures = checks.filter((check) => check.critical && !check.pass);
  return { file, score, maximum: 100, passed: score >= 85 && criticalFailures.length === 0, criticalFailures: criticalFailures.length, checks };
}

function printReport(report) {
  console.log(`\nArtifact conformance: ${report.file}`);
  let currentCategory = "";
  for (const check of report.checks) {
    if (check.category !== currentCategory) {
      currentCategory = check.category;
      console.log(`\n${currentCategory}`);
    }
    const detail = !check.pass && check.detail ? ` — ${check.detail}` : "";
    console.log(` ${check.pass ? "✓" : "✗"} ${check.name} (${check.pass ? check.points : 0}/${check.points})${detail}`);
  }
  console.log(`\nScore: ${report.score}/${report.maximum} · ${report.passed ? "PASS" : "FAIL"}`);
}

const isDirect = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirect) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const file = args.find((arg) => !arg.startsWith("--"));
  if (!file) {
    console.error("Usage: audit-artifact.mjs <artifact.html> [--json]");
    process.exit(2);
  }
  const html = await readFile(file, "utf8");
  const report = auditArtifact(html, path.relative(process.cwd(), file));
  if (json) console.log(JSON.stringify(report, null, 2));
  else printReport(report);
  if (!report.passed) process.exitCode = 1;
}
