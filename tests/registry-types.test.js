const test = require("node:test");
const assert = require("node:assert/strict");
const {
  isServiceCategory,
  isServiceClient,
  isRegistryFile
} = require("../src/shared/types/registry.js");

test("service category guard", () => {
  assert.equal(isServiceCategory("chat"), true);
  assert.equal(isServiceCategory("invalid"), false);
});

test("service client guard accepts valid client", () => {
  const client = {
    id: "new-client",
    title: "New Client",
    category: "chat",
    urlPatterns: ["https://example.com/*"],
    adapterId: "adapter.test",
    enabled: true
  };
  assert.equal(isServiceClient(client), true);
});

test("service client guard rejects invalid client", () => {
  const client = {
    id: " ",
    title: "Broken",
    category: "unknown",
    urlPatterns: [],
    adapterId: "",
    enabled: true
  };
  assert.equal(isServiceClient(client), false);
});

test("registry file guard", () => {
  const registry = {
    version: 1,
    updatedAt: new Date().toISOString(),
    clients: [
      {
        id: "foo",
        title: "Foo",
        category: "chat",
        urlPatterns: ["https://foo.com/*"],
        adapterId: "foo.adapter",
        enabled: true
      }
    ]
  };
  assert.equal(isRegistryFile(registry), true);
  assert.equal(isRegistryFile({}), false);
});
