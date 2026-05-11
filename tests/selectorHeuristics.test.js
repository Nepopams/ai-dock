const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const { buildAdapterSelectors, selectorHeuristics } = require("../src/renderer/adapters/selectorHeuristics.js");

const tsSource = fs.readFileSync(
  path.join(__dirname, "../src/renderer/adapters/selectorHeuristics.ts"),
  "utf8"
);

const selectorGroupMap = {
  input: "visibleTextInputs",
  sendButton: "sendButtonSelectors",
  messages: "messageListSelectors",
  assistantMessage: "assistantMessageSelectors",
  userMessage: "userMessageSelectors"
};

const readTsSelectorArray = (constName) => {
  const match = tsSource.match(new RegExp(`const ${constName} = (\\[[\\s\\S]*?\\]);`));
  assert.ok(match, `missing TS selector array ${constName}`);

  const value = vm.runInNewContext(match[1], Object.create(null));
  assert.ok(Array.isArray(value), `${constName} should be an array`);
  value.forEach((item) => assert.equal(typeof item, "string"));
  return Array.from(value);
};

test("defaults expose all selector groups", () => {
  Object.keys(selectorGroupMap).forEach((group) => {
    assert.ok(Array.isArray(selectorHeuristics.defaults[group]), `${group} defaults should be an array`);
    assert.ok(selectorHeuristics.defaults[group].length > 0, `${group} defaults should not be empty`);
  });
});

test("js defaults mirror ts selector arrays", () => {
  Object.entries(selectorGroupMap).forEach(([group, constName]) => {
    assert.deepEqual(selectorHeuristics.defaults[group], readTsSelectorArray(constName));
  });
});

test("mergeSelectors removes duplicates, trims whitespace, and ignores empty or falsy selectors", () => {
  const primary = ["textarea", "textarea", " div[contenteditable='true'] ", "", " ", null, undefined, false];
  const result = selectorHeuristics.mergeSelectors(primary, ["textarea", " [role='textbox'] ", "", null]);
  assert.deepEqual(result, ["textarea", "div[contenteditable='true']", "[role='textbox']"]);
});

test("buildAdapterSelectors includes overrides first", () => {
  const config = buildAdapterSelectors({
    input: [" #custom-input ", "textarea:not([disabled])", ""],
    sendButton: ["button.send-now", "button[type='submit']"]
  });

  assert.equal(config.input[0], "#custom-input");
  assert.equal(config.input[1], "textarea:not([disabled])");
  assert.equal(config.sendButton[0], "button.send-now");
  assert.equal(config.sendButton[1], "button[type='submit']");
  assert.ok(config.input.includes("textarea:not([disabled])"));
  assert.ok(config.messages.length > 0);
  assert.equal(config.input.filter((selector) => selector === "textarea:not([disabled])").length, 1);
});
