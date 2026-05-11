const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

const requireWithElectronMock = () => {
  const originalLoad = Module._load;
  Module._load = function loadMock(request, parent, isMain) {
    if (request === "electron") {
      return {
        ipcMain: { handle: () => undefined },
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
    const modulePath = require.resolve("../src/main/ipc/judge.ipc.js");
    delete require.cache[modulePath];
    return require(modulePath);
  } finally {
    Module._load = originalLoad;
  }
};

test("Judge IPC fail helper returns stable code and redacted details", () => {
  const { _private } = requireWithElectronMock();
  const response = _private.fail(new Error("Provider failed token=abc123"), {
    code: "provider_failed",
    details: "Authorization: Bearer secret-token\n    at internal.js:1:1"
  });

  assert.equal(response.ok, false);
  assert.equal(response.code, "provider_failed");
  assert.match(response.error, /token=\[redacted\]/);
  assert.match(response.details, /Bearer \[redacted\]/);
  assert.doesNotMatch(response.details, /internal\.js/);
});

test("Judge IPC error code normalization maps provider-like failures", () => {
  const { _private } = requireWithElectronMock();

  assert.equal(_private.normalizeJudgeErrorCode({ code: "profile_not_found" }), "profile_not_found");
  assert.equal(_private.normalizeJudgeErrorCode({ code: "timeout" }), "provider_failed");
  assert.equal(_private.normalizeJudgeErrorCode({ code: "http_500" }), "provider_failed");
  assert.equal(_private.normalizeJudgeErrorCode({ code: "invalid_json" }), "judge_failed");
  assert.equal(_private.normalizeJudgeErrorCode({ code: "surprise" }), "unknown");
});
