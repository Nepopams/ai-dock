import test from "node:test";
import assert from "node:assert/strict";

import {
  joinURL,
  headersToObject,
  isJsonContent,
  redactHeaders
} from "../src/main/utils/httpHelpers.js";

test("joinURL combines base and path with correct slashes", () => {
  assert.equal(joinURL("https://api.example.com/", "/v1/test"), "https://api.example.com/v1/test");
  assert.equal(joinURL("https://api.example.com", "v1/test"), "https://api.example.com/v1/test");
  assert.equal(joinURL("https://api.example.com/", "v1/test"), "https://api.example.com/v1/test");
  assert.equal(joinURL("https://api.example.com", "/v1/test"), "https://api.example.com/v1/test");
  assert.equal(joinURL("", "/v1/test"), "/v1/test");
  assert.equal(joinURL("https://api.example.com", ""), "https://api.example.com");
});

test("headersToObject copies Header entries into plain object", () => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-Custom": "value"
  });
  const result = headersToObject(headers);
  assert.deepEqual(result, {
    "content-type": "application/json",
    "x-custom": "value"
  });
});

test("isJsonContent detects application/json content-type", () => {
  assert.equal(isJsonContent("application/json"), true);
  assert.equal(isJsonContent("application/json; charset=utf-8"), true);
  assert.equal(isJsonContent("text/plain"), false);
  assert.equal(isJsonContent(undefined), false);
});

test("redactHeaders masks sensitive header values", () => {
  const result = redactHeaders({
    Authorization: "Bearer secret",
    "X-Token": "123",
    Accept: "application/json"
  });
  assert.equal(result.Authorization, "***");
  assert.equal(result["X-Token"], "***");
  assert.equal(result.Accept, "application/json");
});
