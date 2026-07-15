import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { auditArtifact } from "../skill/build-html-artifacts/scripts/audit-artifact.mjs";

const provider = process.argv[2];
if (!provider) {
  console.error("Usage: node scripts/run-evals.mjs <provider-name>");
  process.exit(2);
}

const root = process.cwd();
const cases = JSON.parse(await readFile(path.join(root, "evals", "cases.json"), "utf8"));
const reports = [];

for (const testCase of cases) {
  const file = path.join(root, "trials", provider, testCase.output);
  try {
    await access(file);
    const html = await readFile(file, "utf8");
    reports.push({ id: testCase.id, ...auditArtifact(html, path.relative(root, file)) });
  } catch {
    reports.push({ id: testCase.id, file: path.relative(root, file), missing: true, passed: false, score: 0, maximum: 100 });
  }
}

console.log(`\n${provider} evaluation`);
console.log("Case                     Score     Result");
console.log("------------------------------------------");
for (const report of reports) {
  console.log(`${report.id.padEnd(24)} ${String(report.score).padStart(3)}/100   ${report.missing ? "MISSING" : report.passed ? "PASS" : "FAIL"}`);
}

const completed = reports.filter((report) => !report.missing);
const average = completed.length ? Math.round(completed.reduce((sum, report) => sum + report.score, 0) / completed.length) : 0;
console.log(`\nCompleted: ${completed.length}/${reports.length} · Average: ${average}/100`);
if (reports.some((report) => !report.passed)) process.exitCode = 1;
