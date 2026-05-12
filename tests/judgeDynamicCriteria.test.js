const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const vm = require("node:vm");

const loadScoreCriteriaModule = () => {
  const source = fs.readFileSync(
    path.join(__dirname, "../src/renderer/react/views/evaluation/scoreCriteria.ts"),
    "utf8"
  );
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(
    output,
    {
      module,
      exports: module.exports,
      require
    },
    { filename: "scoreCriteria.js" }
  );
  return module.exports;
};

const { discoverScoreCriteria } = loadScoreCriteriaModule();

const criteria = (result) => Array.from(discoverScoreCriteria(result));

const createResult = (scores) => ({
  requestId: "judge-run-1",
  scores,
  verdict: "Tie",
  summary: "Summary"
});

test("discoverScoreCriteria keeps preferred defaults ordered first", () => {
  const result = createResult({
    answer_1: [
      { criterion: "helpfulness", score: 8 },
      { criterion: "depth", score: 7 }
    ],
    answer_2: [
      { criterion: "coherence", score: 9 },
      { criterion: "factuality", score: 8 }
    ]
  });

  assert.deepEqual(criteria(result), [
    "coherence",
    "factuality",
    "helpfulness",
    "depth"
  ]);
});

test("discoverScoreCriteria appends extra criteria in first-seen order", () => {
  const result = createResult({
    answer_1: [
      { criterion: "depth", score: 8 },
      { criterion: "evidence", score: 7 }
    ],
    answer_2: [
      { criterion: "clarity", score: 9 },
      { criterion: "prompt_adherence", score: 8 }
    ]
  });

  assert.deepEqual(criteria(result), [
    "depth",
    "evidence",
    "clarity",
    "prompt_adherence"
  ]);
});

test("discoverScoreCriteria trims and removes duplicate criteria", () => {
  const result = createResult({
    answer_1: [
      { criterion: " depth ", score: 8 },
      { criterion: "depth", score: 7 },
      { criterion: " coherence ", score: 6 }
    ],
    answer_2: [
      { criterion: "coherence", score: 9 },
      { criterion: "security", score: 8 }
    ]
  });

  assert.deepEqual(criteria(result), ["coherence", "depth", "security"]);
});

test("discoverScoreCriteria ignores empty and invalid criteria", () => {
  const result = createResult({
    answer_1: [
      { criterion: "", score: 8 },
      { criterion: "   ", score: 7 },
      { criterion: null, score: 6 },
      { score: 5 },
      null,
      "depth"
    ],
    answer_2: "not-a-bucket",
    answer_3: [{ criterion: "json_validity", score: 9 }]
  });

  assert.deepEqual(criteria(result), ["json_validity"]);
});

test("discoverScoreCriteria returns empty array for no scores", () => {
  assert.deepEqual(criteria(createResult({})), []);
  assert.deepEqual(criteria(createResult({ answer_1: [] })), []);
  assert.deepEqual(criteria(null), []);
});
