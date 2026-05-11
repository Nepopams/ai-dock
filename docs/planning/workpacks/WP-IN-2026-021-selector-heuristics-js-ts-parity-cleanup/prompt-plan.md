# Prompt Plan: WP-IN-2026-021

## Role
You are `ai-dock-renderer-react-executor` with `ai-dock-test-qa-executor` support.

## Task
Plan a scoped parity cleanup for `src/renderer/adapters/selectorHeuristics.ts` and `src/renderer/adapters/selectorHeuristics.js`.

## Required PLAN answers
1. Is there behavioral drift between TS and JS?
2. Why do tests import JS?
3. Can tests be strengthened without package/tsconfig/script changes?
4. Should TS, JS, tests, docs, or only artifacts change?
5. Is any strong gate triggered?
6. Which exact files will change?

## Constraints
- Do not change renderer UI behavior.
- Do not change React imports.
- Do not change package/lock/config/scripts.
- Do not delete or move files.
- Do not touch adapter implementations.

## Expected output
Record the PLAN in the workpack, run-state, task queue, and gates.
