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
