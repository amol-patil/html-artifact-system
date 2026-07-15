import { readFile } from "node:fs/promises";
import { auditArtifact } from "../skill/build-html-artifacts/scripts/audit-artifact.mjs";

const good = await readFile("examples/html-artifact-kit-showroom.html", "utf8");
const bad = "<!doctype html><html><head><title>Bad</title><link rel=\"stylesheet\" href=\"https://example.com/x.css\"></head><body><button></button></body></html>";
const goodReport = auditArtifact(good, "examples/html-artifact-kit-showroom.html");
const badReport = auditArtifact(bad, "inline-negative-fixture.html");

if (!goodReport.passed) throw new Error(`Expected showroom to pass, scored ${goodReport.score}`);
if (badReport.passed) throw new Error(`Expected negative fixture to fail, scored ${badReport.score}`);
console.log(`✓ positive fixture passes (${goodReport.score}/100)`);
console.log(`✓ negative fixture fails (${badReport.score}/100)`);
