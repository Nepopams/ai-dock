const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

const requirePipelineWithElectronMock = () => {
  const originalLoad = Module._load;
  Module._load = function loadMock(request, parent, isMain) {
    if (request === "electron") {
      return {
        app: { getPath: () => "" },
        safeStorage: {
          isEncryptionAvailable: () => false,
          encryptString: (value) => Buffer.from(value, "utf8"),
          decryptString: (value) => value.toString("utf8")
        }
      };
    }
    return originalLoad(request, parent, isMain);
  };
  try {
    const modulePath = require.resolve("../src/main/services/judgePipeline.js");
    delete require.cache[modulePath];
    return require(modulePath);
  } finally {
    Module._load = originalLoad;
  }
};

const validInput = {
  requestId: "judge-1",
  judgeProfileId: "default",
  question: "Which answer is better?",
  answers: [
    { agentId: "agent-a", text: "Answer A" },
    { agentId: "agent-b", text: "Answer B" }
  ]
};

test("buildUserPrompt includes custom prompt in a bounded block", () => {
  const { _private } = requirePipelineWithElectronMock();
  const prompt = _private.buildUserPrompt(
    {
      ...validInput,
      customPrompt: "Prefer answers that cite supplied sources."
    },
    "Score clarity and grounding."
  );

  assert.match(prompt, /Additional user judge instructions:/);
  assert.match(prompt, /<<<CUSTOM_JUDGE_INSTRUCTIONS_START>>>/);
  assert.match(prompt, /Prefer answers that cite supplied sources\./);
  assert.match(prompt, /<<<CUSTOM_JUDGE_INSTRUCTIONS_END>>>/);
  assert.ok(
    prompt.lastIndexOf("Return strictly the JSON structure described above") >
      prompt.indexOf("<<<CUSTOM_JUDGE_INSTRUCTIONS_END>>>")
  );
});

test("buildUserPrompt omits the custom prompt block when absent", () => {
  const { _private } = requirePipelineWithElectronMock();
  const prompt = _private.buildUserPrompt(validInput, "Score clarity and grounding.");

  assert.doesNotMatch(prompt, /CUSTOM_JUDGE_INSTRUCTIONS/);
  assert.match(prompt, /Return strictly the JSON structure described above/);
});

test("buildResultMetadata records rubric and custom prompt flags only", () => {
  const { _private } = requirePipelineWithElectronMock();
  const baseMetadata = _private.buildResultMetadata({
    input: validInput,
    profile: { driver: "openai-compatible", defaultModel: "judge-model" },
    completion: { finishReason: "stop", usage: { total_tokens: 12 } },
    durationMs: 24,
    parseState: "strict_json"
  });

  assert.equal(baseMetadata.rubricSource, "default");
  assert.equal(baseMetadata.customPromptApplied, false);

  const customMetadata = _private.buildResultMetadata({
    input: {
      ...validInput,
      rubric: "Custom rubric",
      customPrompt: "Do not copy this prompt into metadata."
    },
    profile: { driver: "generic-http", defaultModel: "local-judge" },
    completion: { finishReason: "stop", usage: { total_tokens: 20 } },
    durationMs: 31,
    parseState: "strict_json"
  });

  assert.equal(customMetadata.rubricSource, "custom");
  assert.equal(customMetadata.customPromptApplied, true);
  assert.equal(customMetadata.driver, "generic-http");
  assert.equal(customMetadata.customPrompt, undefined);
  assert.doesNotMatch(JSON.stringify(customMetadata), /Do not copy this prompt/);
});

test("runJsonContractValidation passes valid JSON and reports missing required keys", () => {
  const { _private } = requirePipelineWithElectronMock();
  const results = _private.runJsonContractValidation({
    ...validInput,
    answers: [
      { agentId: "agent-a", text: "{\"status\":\"ok\",\"items\":[]}" },
      { agentId: "agent-b", text: "{\"items\":[]}" }
    ],
    validation: {
      mode: "json_contract_check",
      enabled: true,
      requiredKeys: ["status", "items"],
      enumValues: { status: ["ok", "error"] }
    }
  });

  assert.equal(
    results.some(
      (item) => item.answerKey === "answer_1" && item.type === "json_parse" && item.status === "pass"
    ),
    true
  );
  assert.equal(
    results.some(
      (item) =>
        item.answerKey === "answer_2" &&
        item.type === "required_keys" &&
        item.key === "status" &&
        item.status === "fail"
    ),
    true
  );
  assert.equal(
    results.some(
      (item) =>
        item.answerKey === "answer_2" &&
        item.type === "enum_values" &&
        item.key === "status" &&
        item.status === "warning"
    ),
    true
  );
  assert.doesNotMatch(JSON.stringify(results), /\[\]/);
});

test("runJsonContractValidation fails invalid JSON and supports fenced JSON when enabled", () => {
  const { _private } = requirePipelineWithElectronMock();
  const invalidResults = _private.runJsonContractValidation({
    ...validInput,
    answers: [
      { agentId: "agent-a", text: "{bad json" },
      { agentId: "agent-b", text: "{\"status\":\"ok\"}" }
    ],
    validation: {
      mode: "json_contract_check",
      enabled: true
    }
  });

  assert.equal(
    invalidResults.some(
      (item) => item.answerKey === "answer_1" && item.type === "json_parse" && item.status === "fail"
    ),
    true
  );

  const fencedResults = _private.runJsonContractValidation({
    ...validInput,
    answers: [
      { agentId: "agent-a", text: "```json\n{\"status\":\"ok\"}\n```" },
      { agentId: "agent-b", text: "```json\n{\"status\":\"error\"}\n```" }
    ],
    validation: {
      mode: "json_contract_check",
      enabled: true,
      allowMarkdownFence: true,
      requiredKeys: ["status"]
    }
  });

  assert.equal(
    fencedResults.filter((item) => item.type === "json_parse" && item.status === "pass").length,
    2
  );
});

test("runJsonContractValidation reports enum mismatches without exposing raw values", () => {
  const { _private } = requirePipelineWithElectronMock();
  const results = _private.runJsonContractValidation({
    ...validInput,
    answers: [
      { agentId: "agent-a", text: "{\"status\":\"secret-state\"}" },
      { agentId: "agent-b", text: "{\"status\":\"ok\"}" }
    ],
    validation: {
      mode: "json_contract_check",
      enabled: true,
      enumValues: { status: ["ok", "error"] }
    }
  });

  const mismatch = results.find(
    (item) =>
      item.answerKey === "answer_1" && item.type === "enum_values" && item.status === "fail"
  );
  assert.equal(mismatch.actual, "[string]");
  assert.doesNotMatch(JSON.stringify(results), /secret-state/);
});

test("buildUserPrompt includes deterministic validation findings before strict JSON instruction", () => {
  const { _private } = requirePipelineWithElectronMock();
  const validatorResults = [
    {
      type: "required_keys",
      status: "fail",
      answerKey: "answer_1",
      key: "status",
      message: "Required top-level key \"status\" is missing."
    }
  ];
  const prompt = _private.buildUserPrompt(validInput, "Score JSON correctness.", validatorResults);

  assert.match(prompt, /Deterministic validation findings:/);
  assert.match(prompt, /required_keys\/fail/);
  assert.ok(
    prompt.lastIndexOf("Return strictly the JSON structure described above") >
      prompt.indexOf("Deterministic validation findings:")
  );
});

test("metadata and fallback results include validation compatibility fields", () => {
  const { _private } = requirePipelineWithElectronMock();
  const input = {
    ...validInput,
    validation: {
      mode: "json_contract_check",
      enabled: true
    }
  };
  const metadata = _private.buildResultMetadata({
    input,
    profile: { driver: "openai-compatible", defaultModel: "judge-model" },
    completion: { finishReason: "stop" },
    durationMs: 24,
    parseState: "strict_json"
  });
  const fallback = _private.buildFallbackResult(
    input,
    "{}",
    "Judge response is not valid JSON",
    metadata,
    [
      {
        type: "json_parse",
        status: "pass",
        answerKey: "answer_1",
        message: "Answer parses as JSON."
      }
    ]
  );

  assert.equal(metadata.validationApplied, true);
  assert.equal(metadata.validationMode, "json_contract_check");
  assert.equal(fallback.validatorResults.length, 1);
});
