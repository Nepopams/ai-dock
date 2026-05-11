# Orchestration Plan: IN-2026-021

## Initiative summary
IN-2026-021 stabilizes the dual JS/TS selector heuristic state by proving current parity, adding guard coverage, and documenting why the CommonJS file remains while Node tests run without a TypeScript loader.

## Assumptions
- Safe assumption: The Node test runner should continue importing `selectorHeuristics.js` because package and TypeScript test configuration changes are out of scope.
- Safe assumption: Selector default arrays are simple string literals and can be compared from the TS source in a Node test without adding dependencies.
- Blocking assumption: If parity cleanup requires package/tsconfig/script changes, the initiative must stop for a strong human gate.

## Selected delivery mode
Runtime single-layer / Test+Docs scoped APPLY.

The runtime source touched by this initiative is limited to non-behavioral comments in `selectorHeuristics.ts` and the CommonJS parity file. Behavioral APPLY is limited to tests and documentation.

## Epic breakdown
### Epic 1
- Epic ID: `E-IN-2026-021-1`
- Title: Parity PLAN and evidence
- Scope: Read required governance/source docs, compare JS and TS defaults/behavior, and define safe edit set.
- Risk profile: Low.
- Success criteria: PLAN answers the six required questions.

### Epic 2
- Epic ID: `E-IN-2026-021-2`
- Title: Scoped parity guard APPLY
- Scope: Add parity comments, strengthen Node tests, and update ownership docs.
- Risk profile: Medium-low because test behavior changes but runtime UI behavior does not.
- Success criteria: Tests cover defaults, override ordering, duplicate removal, trimming, and JS falsy ignoring.

### Epic 3
- Epic ID: `E-IN-2026-021-3`
- Title: REVIEW and delivery
- Scope: Run validators, tests, build, forbidden-path checks, and delivery report.
- Risk profile: Low.
- Success criteria: Validators/tests/build pass and no forbidden path changes exist.

## Sprint mapping
- Sprint / slice: Renderer consolidation / pre legacy archive.
- Workpack candidates:
  - `WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup`
- Dependencies:
  - ADR-003 renderer mode strategy.
  - ADR-004 renderer support namespace strategy.
  - IN-2026-014 non-React renderer support ownership audit.
- Exit criteria:
  - Workpack REVIEW is GO.
  - Delivery report records verification and residual risks.

## Workpack queue
- Workpack ID: `WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup`
- Type: Test/QA + scoped renderer docs/apply.
- Purpose: Stabilize JS/TS selector heuristic parity without changing React adapter behavior.
- Dependency: Current initiative PLAN.
- Expected status: Done.

## Executor routing
- Workpack ID: `WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup`
- Selected executor: `ai-dock-renderer-react-executor`
- Primary skill: Renderer support ownership and adapter runtime awareness.
- Secondary executors: `ai-dock-test-qa-executor`
- Rationale: The TS file is adapter runtime support, while the highest-value APPLY is Node test coverage.

## PLAN conclusion
1. Behavioral drift:
   - No behavioral drift was found for supported selector inputs and defaults. All five TS default arrays match the JS defaults.
   - The only material delta is input tolerance: JS `uniq` ignores empty/falsy values with `(item || "").trim()`, while TS `uniq` is typed as `string[]` and uses `item.trim()`.
2. Why tests import JS:
   - `package.json` runs `node --test tests/**/*.test.js`.
   - There is no TypeScript test loader, no transpilation step for tests, and config changes are out of scope.
   - The CommonJS file allows Node tests to exercise selector behavior without changing package/tsconfig/scripts.
3. Can tests be strengthened safely:
   - Yes. A CommonJS test can require the JS parity module and read the TS source text to compare literal selector arrays without dependency or config changes.
4. What should change:
   - Change tests and docs.
   - Add parity comments to TS and JS files.
   - Do not change TS or JS logic.
5. Strong gate:
   - No strong gate is triggered because the edit set stays inside allowed files and does not require runtime behavior, import, config, or package changes.
6. Exact files to change:
   - `src/renderer/adapters/selectorHeuristics.ts`
   - `src/renderer/adapters/selectorHeuristics.js`
   - `tests/selectorHeuristics.test.js`
   - `docs/architecture/non-react-renderer-support-ownership.md`
   - Initiative/workpack artifacts under this initiative.

## Gate plan
- Soft gates:
  - Keep JS parity file because tests import it and deletion is forbidden.
  - Treat TS runtime behavior as unchanged because no logic changes are planned.
- Strong human gates:
  - Any package/tsconfig/script/import/path move/delete/runtime behavior change.
- Gate owner: Human.
- Expected decision point: None, unless verification reveals a required forbidden change.

## Verification strategy
- Docs/workflow validation:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-021-selector-heuristics-js-ts-parity-cleanup`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup/workpack.md`
- Runtime tests:
  - `node --test tests/selectorHeuristics.test.js`
  - `npm test`
- Build:
  - `npm run build`
- Scope checks:
  - `git status --short`
  - `git diff --stat`
  - `git diff --check`
  - `git status --short -- src/main src/preload src/shared src/renderer/react src/renderer/adapters/impl package.json package-lock.json tsconfig.json vite.config.js scripts`

## Risk register
- Risk: The JS parity file remains a duplicate implementation.
  - Impact: Future drift remains possible.
  - Mitigation: Guard defaults against TS source and document update rules.
  - Owner: Codex + Human.
  - Status: Mitigated, not eliminated.
- Risk: Future selector arrays become non-literal expressions.
  - Impact: The parity test will need a better TS loading strategy.
  - Mitigation: Treat that as a future gated test/build strategy decision.
  - Owner: Human + future workpack.
  - Status: Open residual risk.
