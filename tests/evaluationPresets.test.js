const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  isEvaluationPresetCatalog,
  isEvaluationValidatorType
} = require("../src/shared/types/evaluationPreset.js");

const catalogPath = path.join(
  __dirname,
  "..",
  "src",
  "shared",
  "presets",
  "evaluation",
  "catalog.json"
);

const requiredPresetIds = [
  "general-answer-quality",
  "research-quality",
  "json-contract-check",
  "prompt-adherence",
  "factuality-grounding",
  "code-review",
  "security-review",
  "ux-product-review",
  "summarization-quality",
  "custom-user-rubric"
];

const loadCatalog = () => JSON.parse(fs.readFileSync(catalogPath, "utf8"));

const findPreset = (catalog, id) => catalog.presets.find((preset) => preset.id === id);

test("evaluation preset catalog JSON parses and matches the shared guard", () => {
  const catalog = loadCatalog();

  assert.equal(typeof catalog.schemaVersion, "string");
  assert.equal(isEvaluationPresetCatalog(catalog), true);
});

test("evaluation preset catalog includes unique required MVP preset ids", () => {
  const catalog = loadCatalog();
  const ids = catalog.presets.map((preset) => preset.id);

  assert.equal(new Set(ids).size, ids.length);
  for (const id of requiredPresetIds) {
    assert.ok(ids.includes(id), `missing preset id ${id}`);
  }
});

test("each evaluation preset has required metadata and unique criteria", () => {
  const catalog = loadCatalog();

  for (const preset of catalog.presets) {
    assert.equal(typeof preset.title, "string", `${preset.id} title`);
    assert.equal(typeof preset.purpose, "string", `${preset.id} purpose`);
    assert.equal(typeof preset.evaluationType, "string", `${preset.id} evaluationType`);
    assert.equal(typeof preset.version, "string", `${preset.id} version`);
    assert.equal(typeof preset.status, "string", `${preset.id} status`);

    const criterionIds = preset.defaultCriteria.map((criterion) => criterion.id);
    assert.equal(
      new Set(criterionIds).size,
      criterionIds.length,
      `${preset.id} criteria ids must be unique`
    );
  }
});

test("criterion weights are finite numbers and validators use known types", () => {
  const catalog = loadCatalog();

  for (const preset of catalog.presets) {
    for (const criterion of preset.defaultCriteria) {
      assert.equal(
        Number.isFinite(criterion.weight),
        true,
        `${preset.id}.${criterion.id} weight must be finite`
      );
    }
    for (const validator of preset.defaultValidators) {
      assert.equal(
        isEvaluationValidatorType(validator.type),
        true,
        `${preset.id} validator ${validator.type} must be known`
      );
    }
  }
});

test("custom and validator-oriented presets expose expected semantics", () => {
  const catalog = loadCatalog();
  const customRubric = findPreset(catalog, "custom-user-rubric");
  const jsonContract = findPreset(catalog, "json-contract-check");
  const securityReview = findPreset(catalog, "security-review");

  assert.equal(customRubric.allowsUserDefinedCriteria, true);
  assert.ok(jsonContract.defaultValidators.some((validator) => validator.type === "json_parse"));
  assert.ok(
    securityReview.defaultValidators.some(
      (validator) => validator.type === "forbidden_secret_pattern"
    )
  );
});

test("catalog validation does not require main, preload, or renderer imports", () => {
  const loadedPaths = Object.keys(require.cache).map((entry) =>
    path.relative(path.join(__dirname, ".."), entry).replace(/\\/g, "/")
  );

  assert.equal(loadedPaths.some((entry) => entry.startsWith("src/main/")), false);
  assert.equal(loadedPaths.some((entry) => entry.startsWith("src/preload/")), false);
  assert.equal(loadedPaths.some((entry) => entry.startsWith("src/renderer/")), false);
});
