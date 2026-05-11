# WP-IN-2026-021: SelectorHeuristics JS/TS Parity Cleanup

## Workpack ID
`WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup`

## Title
SelectorHeuristics JS/TS Parity Cleanup

## Status
Done

## Owner
Human + Codex

## Mode
PLAN -> APPLY -> REVIEW

## Selected executor
`ai-dock-renderer-react-executor`

## Secondary executor
`ai-dock-test-qa-executor`

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/architecture/decisions/ADR-004-renderer-support-namespace-strategy.md`
- `docs/architecture/non-react-renderer-support-ownership.md`
- `src/renderer/adapters/selectorHeuristics.ts`
- `src/renderer/adapters/selectorHeuristics.js`
- `tests/selectorHeuristics.test.js`
- `package.json`
- `tsconfig.json`

## Goal
Reduce silent drift risk between `selectorHeuristics.ts` and `selectorHeuristics.js` while preserving React adapter runtime behavior.

## User value
Future renderer/adapter work can update selector defaults with clear parity rules and tests that catch JS/TS drift.

## In scope
- PLAN and parity evidence.
- Minimal comments/docs clarifying the JS parity artifact.
- Node test coverage for selector groups, TS/JS default parity, override ordering, duplicate removal, trimming, and empty/falsy JS handling.
- Initiative and delivery artifacts.

## Out of scope
- Deleting `selectorHeuristics.js`.
- Moving files.
- Changing React imports.
- Changing adapter implementations.
- Changing package/lock/config/scripts.
- Adding dependencies or TS test transpilation.
- Changing renderer UI behavior.

## Current architecture context
ADR-003 makes React the default renderer. ADR-004 keeps top-level renderer support in place for now. IN-2026-014 classified `selectorHeuristics.ts` as adapter runtime support and `selectorHeuristics.js` as migration residue because runtime imports TS while tests import JS.

Current reference scan:
- `src/renderer/adapters/impl/*.adapter.ts` imports `../selectorHeuristics.ts`.
- `tests/selectorHeuristics.test.js` imports `../src/renderer/adapters/selectorHeuristics.js`.
- `package.json` runs `node --test tests/**/*.test.js`.
- `tsconfig.json` includes `src/renderer/react` and `src/types`, and no TS test runner is configured.

## PLAN answers
1. Behavioral drift:
   - No supported-input behavioral drift was found. TS and JS selector defaults match for `input`, `sendButton`, `messages`, `assistantMessage`, and `userMessage`.
   - JS has broader falsy tolerance in `uniq`; TS is typed as `string[]` and should not be changed here.
2. Why tests import JS:
   - Node tests run as CommonJS via `node --test`.
   - There is no TS test loader/transpilation in scope.
3. Can tests be safely strengthened:
   - Yes. The test can require JS and read TS source text to compare literal defaults.
4. Need to change TS, JS, or only tests/docs:
   - No logic changes.
   - Add comments to TS/JS, update tests and docs.
5. Strong gate:
   - None triggered.
6. Exact files to change:
   - `src/renderer/adapters/selectorHeuristics.ts`
   - `src/renderer/adapters/selectorHeuristics.js`
   - `tests/selectorHeuristics.test.js`
   - `docs/architecture/non-react-renderer-support-ownership.md`
   - Initiative/workpack artifacts for IN-2026-021.

## Allowed files
- `src/renderer/adapters/selectorHeuristics.ts`
- `src/renderer/adapters/selectorHeuristics.js`
- `tests/selectorHeuristics.test.js`
- `docs/architecture/non-react-renderer-support-ownership.md`
- `docs/planning/initiatives/IN-2026-021-selector-heuristics-js-ts-parity-cleanup/**`
- `docs/planning/workpacks/WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/react/**`
- `src/renderer/adapters/impl/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Read required governance and source-of-truth docs.
2. Inspect TS/JS selector heuristic files and current tests.
3. Scan references for selector heuristic usage.
4. Confirm whether TS/JS defaults and behavior drift.
5. Create initiative and workpack artifacts.
6. Add parity comments without logic changes.
7. Strengthen Node selector tests.
8. Update ownership docs with parity artifact rule.
9. Run validators, targeted tests, full tests, build, diff checks, and forbidden-path checks.
10. Update run-state, task queue, gates, and delivery report.

## Acceptance criteria
- [x] Workpack validates.
- [x] Initiative validates.
- [x] Tests prove all five default groups exist.
- [x] Tests compare JS defaults against TS source arrays.
- [x] Tests prove overrides are first.
- [x] Tests prove duplicates are removed.
- [x] Tests prove whitespace is trimmed.
- [x] Tests prove empty/falsy selectors are ignored by JS behavior.
- [x] Documentation states that JS is a test-facing parity artifact.
- [x] No workpack-related forbidden path changes.
- [x] `npm test` passes.
- [x] `npm run build` passes.

## Test plan
- `node --test tests/selectorHeuristics.test.js`
- `npm test`
- `npm run build`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/react src/renderer/adapters/impl package.json package-lock.json tsconfig.json vite.config.js scripts`

## Security impact
- No sandbox/contextIsolation impact.
- No token/secrets impact.
- No new dependency or renderer Node access.

## IPC impact
- None.

## Docs impact
- Update `docs/architecture/non-react-renderer-support-ownership.md` with JS parity artifact rules.
- Create initiative/workpack delivery artifacts.

## Rollback
Revert this workpack's changes to the allowed files. No data migration, package, build, or runtime config rollback is required.

## Done criteria
- Initiative/workpack validators pass.
- Targeted selector test passes.
- Full `npm test` passes.
- `npm run build` passes.
- Forbidden-path status check is clean except for pre-existing unrelated changes, if any.
- Delivery report records REVIEW verdict and residual risks.

## Risks
- JS remains duplicated with TS.
  - Mitigation: Guard defaults with tests and explicit comments.
- TS source parsing in tests is lightweight and assumes literal arrays.
  - Mitigation: If selector defaults become computed, create a gated TS-native test strategy workpack.
- Existing unrelated dirty files may remain in `git status`.
  - Mitigation: Do not edit or stage unrelated changes.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
