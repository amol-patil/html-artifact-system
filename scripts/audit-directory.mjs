import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { auditArtifact } from "../skill/build-html-artifacts/scripts/audit-artifact.mjs";

const directory = process.argv[2];
if (!directory) {
  console.error("Usage: node scripts/audit-directory.mjs <trials-directory>");
  process.exit(2);
}

async function findHtmlFiles(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(folder, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(target);
    return entry.isFile() && entry.name.toLowerCase().endsWith(".html") ? [target] : [];
  }));
  return nested.flat().sort();
}

const root = path.resolve(directory);
const files = await findHtmlFiles(root);
if (!files.length) {
  console.error(`No HTML files found in ${root}`);
  process.exit(1);
}

const reports = [];
for (const file of files) {
  const html = await readFile(file, "utf8");
  reports.push(auditArtifact(html, path.relative(root, file)));
}

console.log(`\nArtifact directory audit: ${root}`);
console.log("File                                      Score     Result");
console.log("------------------------------------------------------------");
for (const report of reports) {
  const name = report.file.length > 40 ? `…${report.file.slice(-39)}` : report.file;
  console.log(`${name.padEnd(42)} ${String(report.score).padStart(3)}/100   ${report.passed ? "PASS" : "FAIL"}`);
}

const average = Math.round(reports.reduce((sum, report) => sum + report.score, 0) / reports.length);
console.log(`\nFiles: ${reports.length} · Average: ${average}/100 · Passed: ${reports.filter((report) => report.passed).length}/${reports.length}`);
if (reports.some((report) => !report.passed)) process.exitCode = 1;
