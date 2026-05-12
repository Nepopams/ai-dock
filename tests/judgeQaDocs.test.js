const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const readDoc = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

test("Judge MVP QA docs exist", () => {
  for (const relativePath of [
    "docs/qa/judge-mvp-automated-coverage.md",
    "docs/qa/judge-mvp-smoke-suite.md",
    "docs/qa/judge-mvp-smoke-evidence-template.md",
    "docs/qa/judge-mvp-release-confidence.md"
  ]) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, `${relativePath} exists`);
  }
});

test("Judge MVP smoke suite includes required scenario headings", () => {
  const smokeSuite = readDoc("docs/qa/judge-mvp-smoke-suite.md");

  for (const heading of [
    "## A. App startup / navigation",
    "## B. Manual start",
    "## C. Basic Judge run",
    "## D. Custom rubric/instructions",
    "## E. JSON contract check",
    "## F. Save/list/open/delete EvaluationRun",
    "## G. Export",
    "## H. Dynamic criteria",
    "## I. Backend labels",
    "## J. Regression"
  ]) {
    assert.match(smokeSuite, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Judge MVP automated coverage references expected tests", () => {
  const coverage = readDoc("docs/qa/judge-mvp-automated-coverage.md");

  for (const testFile of [
    "tests/judge-types.test.js",
    "tests/judge-preload.test.js",
    "tests/judge-pipeline.test.js",
    "tests/judge-export.test.js",
    "tests/evaluationRun.test.js",
    "tests/evaluationRunStore.test.js",
    "tests/evaluationRunIpc.test.js",
    "tests/evaluationRunPreload.test.js",
    "tests/evaluationPresets.test.js",
    "tests/completionsProfileLabels.test.js",
    "tests/judgeDynamicCriteria.test.js"
  ]) {
    assert.match(coverage, new RegExp(testFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Judge MVP release confidence doc includes required gates", () => {
  const releaseConfidence = readDoc("docs/qa/judge-mvp-release-confidence.md");

  for (const heading of [
    "## Release readiness criteria",
    "## Hard blockers",
    "## Soft blockers",
    "## Acceptable known risks",
    "## Required automated commands",
    "## Required manual smoke scenarios",
    "## Rollback notes",
    "## Next workpacks"
  ]) {
    assert.match(
      releaseConfidence,
      new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  }
});
