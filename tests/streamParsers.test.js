import test from "node:test";
import assert from "node:assert/strict";
import { TextEncoder } from "node:util";

import {
  readLines,
  parseSSELine,
  isDoneToken
} from "../src/main/utils/streamParsers.js";

const encoder = new TextEncoder();

const createReader = (chunks, delays = []) => {
  let index = 0;
  return {
    read() {
      if (index >= chunks.length) {
        return Promise.resolve({ done: true, value: undefined });
      }
      const value =
        typeof chunks[index] === "string" ? encoder.encode(chunks[index]) : chunks[index];
      const delay = delays[index] ?? 0;
      index += 1;
      if (delay > 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ done: false, value });
          }, delay);
        });
      }
      return Promise.resolve({ done: false, value });
    },
    releaseLock() {
      return undefined;
    }
  };
};

test("readLines splits mixed newline sequences", async () => {
  const lines = [];
  const reader = createReader(["hello\r\nworld\nchunk"]);
  await readLines(reader, (line) => {
    lines.push(line);
  });
  assert.deepEqual(lines, ["hello", "world", "chunk"]);
});

test("readLines flushes trailing line without newline", async () => {
  const lines = [];
  const reader = createReader(["first\nsecond", "\nthird"]);
  await readLines(reader, (line) => {
    lines.push(line);
  });
  assert.deepEqual(lines, ["first", "second", "third"]);
});

test("readLines triggers idle timeout callback", async () => {
  let triggered = false;
  const reader = createReader(["slow"], [20]);
  await readLines(reader, () => {}, {
    idleTimeoutMs: 5,
    onIdleTimeout: () => {
      triggered = true;
    }
  });
  assert.equal(triggered, true);
});

test("parseSSELine extracts data payloads", () => {
  assert.equal(parseSSELine("data: payload"), "payload");
  assert.equal(parseSSELine("event: message"), null);
});

test("isDoneToken identifies terminal marker", () => {
  assert.equal(isDoneToken("[DONE]"), true);
  assert.equal(isDoneToken(" [DONE] "), false);
});
