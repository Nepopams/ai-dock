const test = require("node:test");
const assert = require("node:assert/strict");

const { buildAdapterSelectors, selectorHeuristics } = require("../src/renderer/adapters/selectorHeuristics.js");

test("mergeSelectors removes duplicates and preserves order", () => {
  const primary = ["textarea", "textarea", " div[contenteditable='true'] "];
  const result = selectorHeuristics.mergeSelectors(primary, ["textarea", "[role='textbox']"]);
  assert.deepEqual(result, ["textarea", "div[contenteditable='true']", "[role='textbox']"]);
});

test("buildAdapterSelectors includes overrides first", () => {
  const config = buildAdapterSelectors({
    input: ["#custom-input"],
    sendButton: ["button.send-now"]
  });

  assert.equal(config.input[0], "#custom-input");
  assert.equal(config.sendButton[0], "button.send-now");
  assert.ok(config.input.includes("textarea:not([disabled])"));
  assert.ok(config.messages.length > 0);
});
