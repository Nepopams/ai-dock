# IN-2026-021: SelectorHeuristics JS/TS Parity Cleanup

## Initiative ID
`IN-2026-021-selector-heuristics-js-ts-parity-cleanup`

## Title
SelectorHeuristics JS/TS Parity Cleanup

## Status
Done

## Owner
Human + Codex

## Goal
Reduce silent drift risk between the TypeScript runtime-support file `src/renderer/adapters/selectorHeuristics.ts` and the CommonJS test-facing parity file `src/renderer/adapters/selectorHeuristics.js` without changing React adapter runtime behavior.

## User value
Selector heuristic tests stay stable, and future workpacks get explicit rules for changing the TS/JS pair safely.

## Problem
React adapter runtime imports the TypeScript selector heuristics file. The Node test runner imports the CommonJS JavaScript parity file. Both files duplicate selector defaults and merge/uniq behavior, so a future change can silently update one side but not the other.

## Success criteria
- [x] Initiative artifacts exist and validate.
- [x] Scoped workpack and prompt pack exist and validate.
- [x] PLAN states whether behavioral drift exists between JS and TS.
- [x] Minimal APPLY does not change adapter runtime behavior.
- [x] Tests guard selector default parity and JS merge behavior.
- [x] Documentation states that the JS file is a test-facing parity artifact.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] No workpack-related forbidden path changes are present.

## In scope
- Create initiative artifacts.
- Create a scoped workpack and prompt pack.
- Compare `selectorHeuristics.ts` and `selectorHeuristics.js`.
- Strengthen Node tests for selector defaults, override ordering, trimming, duplicate removal, and JS falsy handling.
- Add explicit parity comments/documentation.
- Update delivery report and run-state.

## Out of scope
- Deleting `selectorHeuristics.js`.
- Moving files.
- Changing React imports.
- Changing adapter implementations under `src/renderer/adapters/impl/**`.
- Changing package, Vite, TypeScript, or script configuration.
- Adding dependencies or a TypeScript test loader.
- Changing renderer UI behavior.

## Constraints
- Allowed runtime/test files:
  - `src/renderer/adapters/selectorHeuristics.ts`
  - `src/renderer/adapters/selectorHeuristics.js`
  - `tests/selectorHeuristics.test.js`
- Allowed docs/planning files:
  - `docs/architecture/non-react-renderer-support-ownership.md`
  - `docs/planning/initiatives/IN-2026-021-selector-heuristics-js-ts-parity-cleanup/**`
  - `docs/planning/workpacks/WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup/**`
- Forbidden paths include `src/main/**`, `src/preload/**`, `src/shared/**`, `src/renderer/react/**`, `src/renderer/adapters/impl/**`, package/lock/config/script files, build outputs, release outputs, and dependencies.

## Strong human gate triggers
- A required package, lockfile, Vite, TypeScript, or script change.
- A required file deletion or move.
- A required React runtime import path change.
- A required adapter runtime behavior change.
- A required change outside allowed files.
- A recommendation that immediate migration is necessary instead of scoped parity cleanup.

## Candidate epics
- Epic 1: Parity PLAN and drift evidence.
- Epic 2: Scoped test/docs parity APPLY.
- Epic 3: REVIEW, verification, and delivery report.

## Risks
- Risk: Parsing TypeScript source from a CommonJS test could become brittle if selector arrays stop being simple literals.
  - Mitigation: Keep the test focused on current literal defaults and document future TS test strategy as a follow-up.
- Risk: The JS parity file remains duplicated source.
  - Mitigation: Add guard tests and explicit comments until a gated test/build strategy replaces it.
- Risk: Falsy tolerance is present in JS but not in TS runtime types.
  - Mitigation: Do not change TS runtime behavior in this initiative; document the supported-input boundary.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup/workpack.md`
