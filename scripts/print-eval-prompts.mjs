import { readFile } from "node:fs/promises";

const provider = process.argv[2];
if (!provider) {
  console.error("Usage: node scripts/print-eval-prompts.mjs <provider-name>");
  process.exit(2);
}

const cases = JSON.parse(await readFile("evals/cases.json", "utf8"));
for (const [index, testCase] of cases.entries()) {
  console.log(`\n--- ${index + 1}. ${testCase.id} ---\n`);
  console.log(`Use $build-html-artifacts for this task. ${testCase.prompt}`);
  console.log(`Save the result to trials/${provider}/${testCase.output}.`);
  console.log("Work from the skill and request only. Do not inspect other generated trials or their scores before finishing this artifact.");
}
