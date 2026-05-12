const { before, test } = require("node:test");
const assert = require("node:assert/strict");

let inferCompletionsProfileLabels;

before(async () => {
  ({ inferCompletionsProfileLabels } = await import(
    "../src/shared/utils/completionsProfileLabels.js"
  ));
});

const labelFor = (profile) => inferCompletionsProfileLabels(profile);

test("OpenAI-compatible hosted URL is labeled as cloud/API", () => {
  const labels = labelFor({
    driver: "openai-compatible",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini"
  });

  assert.equal(labels.driverLabel, "OpenAI-compatible");
  assert.equal(labels.backendKind, "cloud-api");
  assert.equal(labels.endpointLabel, "Cloud/API endpoint");
  assert.match(labels.summaryLabel, /gpt-4o-mini/);
});

test("localhost and loopback OpenAI-compatible URLs are labeled as local", () => {
  for (const baseUrl of [
    "http://localhost:11434/v1",
    "http://127.0.0.1:1234/v1",
    "http://[::1]:8080/v1"
  ]) {
    const labels = labelFor({
      driver: "openai-compatible",
      baseUrl,
      defaultModel: "local-model"
    });

    assert.equal(labels.backendKind, "local", `${baseUrl} should be local`);
    assert.equal(labels.endpointLabel, "Local endpoint");
  }
});

test("private network hosts are labeled as private network endpoints", () => {
  for (const baseUrl of [
    "http://192.168.1.22:8000/v1",
    "http://10.0.0.9:8000/v1",
    "http://172.16.0.5:8000/v1",
    "http://172.31.255.10:8000/v1",
    "http://llm-box.local:8000/v1"
  ]) {
    const labels = labelFor({
      driver: "openai-compatible",
      baseUrl,
      defaultModel: "lan-model"
    });

    assert.equal(labels.backendKind, "private-network", `${baseUrl} should be private network`);
    assert.equal(labels.endpointLabel, "Private network endpoint");
  }
});

test("generic HTTP local profile keeps Generic HTTP driver label and local endpoint label", () => {
  const labels = labelFor({
    driver: "generic-http",
    baseUrl: "http://localhost:9999",
    defaultModel: "custom-local"
  });

  assert.equal(labels.driverLabel, "Generic HTTP");
  assert.equal(labels.backendKind, "local");
  assert.equal(labels.endpointLabel, "Local endpoint");
  assert.match(labels.summaryLabel, /Generic HTTP/);
});

test("invalid or missing base URLs are labeled as unknown", () => {
  for (const baseUrl of ["not a url", "", undefined]) {
    const labels = labelFor({
      driver: "openai-compatible",
      baseUrl,
      defaultModel: "model"
    });

    assert.equal(labels.backendKind, "unknown");
    assert.equal(labels.endpointLabel, "Unknown endpoint");
  }
});

test("labels do not include token or auth material", () => {
  const labels = labelFor({
    driver: "openai-compatible",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    auth: {
      token: "sk-sensitive-value",
      tokenRef: "enc_sensitive_ref"
    },
    headers: {
      Authorization: "Bearer sk-sensitive-value"
    }
  });

  const serialized = JSON.stringify(labels);
  assert.doesNotMatch(serialized, /sk-sensitive-value/);
  assert.doesNotMatch(serialized, /enc_sensitive_ref/);
  assert.doesNotMatch(serialized, /Authorization/);
});

test("privacy hints use inferred non-guarantee wording", () => {
  const localLabels = labelFor({
    driver: "openai-compatible",
    baseUrl: "http://localhost:11434/v1",
    defaultModel: "local"
  });

  assert.match(localLabels.privacyHint, /inferred/i);
  assert.match(localLabels.privacyHint, /not a privacy guarantee/i);
});
