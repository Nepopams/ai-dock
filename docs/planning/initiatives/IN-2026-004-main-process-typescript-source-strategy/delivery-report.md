# Delivery Report - IN-2026-004

## Summary
Completed L2 architecture/docs planning initiative. The current main-process runtime source-of-truth is JavaScript under `src/main/**`; TypeScript files under `src/main/**` are excluded from `tsconfig.json` and are not part of the current runtime/build pipeline. ADR-002 records the proposed strategy: use JS as source-of-truth now, keep TS counterparts as non-runtime parity/reference artifacts, add drift controls before major feature work, and plan any TS migration through future gated workpacks.

## Workpacks completed
| Workpack ID | Status | REVIEW verdict | Notes |
| --- | --- | --- | --- |
| `WP-IN-2026-004-main-process-typescript-source-strategy` | Done | GO | Docs-only; runtime APPLY forbidden and not performed |

## Inventory summary
- Main JS files: 34.
- Main TS files: 24.
- JS/TS path pairs: 24.
- JS-only main files: 10.
- TS-only main files: 0.
- Runtime-reachable JS from `package.json` main: 34.
- Main TS files included by `tsconfig.json`: 0.
- TS wrappers over JS runtime: 18.
- TS parallel implementations or type-bearing counterparts: 6.

## Options considered
- Option A: JS as source-of-truth now; TS counterparts legacy/parity-only. Recommendation: yes, short term.
- Option B: staged migration main-process to TypeScript. Recommendation: target state, but not now.
- Option C: temporary dual files with parity checks. Recommendation: use only as transition control before migration.
- Option D: remove TS counterparts as misleading artifacts. Recommendation: not now; requires strong human gate and staged deletion workpack.

## Recommendation
- Recommended now: JS runtime files are source-of-truth for `src/main/**`; TS counterparts are non-runtime reference/parity artifacts.
- Target state: staged main-process TypeScript migration with explicit build pipeline, entrypoint, tests, rollback, and one-source-of-truth policy.
- Not now: immediate TS migration, deleting TS counterparts, package/tsconfig/build changes, runtime import changes.
- Next workpacks: main TS parity audit, main TS build strategy spike, migration slice plan, stale counterpart retirement plan, and feature preflight for n8n/Judge/cross-history.

## ADR
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`

## Files consulted
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/source-of-truth.md`
- `scripts/workflow/validate-initiative.mjs`
- `scripts/workflow/validate-workpack.mjs`
- `package.json`
- `tsconfig.json`
- `vite.config.js`
- `scripts/**`
- `src/main/**/*.js`
- `src/main/**/*.ts`
- `src/preload/**`
- `src/shared/**`
- `docs/architecture/service-catalog.md`
- `docs/_indexes/ipc-index.md`
- `docs/planning/initiatives/IN-2026-003-adapter-bridge-typescript-parity/delivery-report.md`

## Files changed
- `docs/planning/initiatives/IN-2026-004-main-process-typescript-source-strategy/initiative.md`
- `docs/planning/initiatives/IN-2026-004-main-process-typescript-source-strategy/orchestration-plan.md`
- `docs/planning/initiatives/IN-2026-004-main-process-typescript-source-strategy/task-queue.md`
- `docs/planning/initiatives/IN-2026-004-main-process-typescript-source-strategy/run-state.md`
- `docs/planning/initiatives/IN-2026-004-main-process-typescript-source-strategy/gates.md`
- `docs/planning/initiatives/IN-2026-004-main-process-typescript-source-strategy/delivery-report.md`
- `docs/planning/workpacks/WP-IN-2026-004-main-process-typescript-source-strategy/workpack.md`
- `docs/planning/workpacks/WP-IN-2026-004-main-process-typescript-source-strategy/prompt-plan.md`
- `docs/planning/workpacks/WP-IN-2026-004-main-process-typescript-source-strategy/prompt-apply.md`
- `docs/planning/workpacks/WP-IN-2026-004-main-process-typescript-source-strategy/prompt-review.md`
- `docs/planning/workpacks/WP-IN-2026-004-main-process-typescript-source-strategy/prompt-fixpack.md`
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
- `docs/_indexes/source-of-truth.md`

## Commands run
| Command | Purpose | Result |
| --- | --- | --- |
| `Get-Content -Raw <required governance/workflow files>` | Read required instruction sources | PASS |
| `Get-Content -Raw package.json` | Confirm runtime entry and scripts | PASS |
| `Get-Content -Raw tsconfig.json` | Confirm TS include scope | PASS |
| `Get-Content -Raw vite.config.js` | Confirm Vite renderer-only build | PASS |
| `Get-Content -Raw scripts/**` | Read scripts and smoke docs | PASS |
| `rg --files src/main -g "*.js"` | Inventory main JS | PASS |
| `rg --files src/main -g "*.ts"` | Inventory main TS | PASS |
| `Get-ChildItem ... Select-String` | Inspect main require/import/export patterns | PASS after quote-safe retry |
| `rg --files src/preload` | Inventory preload | PASS |
| `rg --files src/shared` | Inventory shared | PASS |
| `node <inline inventory script>` | Compute JS/TS pairs, runtime reachability, tsconfig inclusion | PASS |
| `node <inline ts classifier>` | Classify main TS wrappers vs parallel implementations | PASS |
| `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-004-main-process-typescript-source-strategy` | Validate initiative | PASS |
| `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-004-main-process-typescript-source-strategy/workpack.md` | Validate workpack | PASS |
| `git status --short` | Check working tree | PASS |
| `git diff --stat` | Check diff summary | PASS |
| `git diff --check` | Check whitespace/conflict markers | PASS |
| `git status --short -- src/main src/preload src/renderer src/shared package.json package-lock.json tsconfig.json` | Confirm forbidden runtime/config paths unchanged | PASS |

## Test results
- Initiative validator: PASS.
- Workpack validator: PASS.
- Diff check: PASS.
- Runtime tests/build: not run; initiative is docs-only and runtime APPLY is forbidden.

## Review results
- GO/NO-GO: GO.
- Must fix: none.
- Should fix: none.
- ADR link: delivery report links ADR path.

## Runtime scope check
- `src/main/**`: unchanged.
- `src/preload/**`: unchanged.
- `src/renderer/**`: unchanged.
- `src/shared/**`: unchanged.
- `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`, `scripts/**`: unchanged.
- Dependencies: unchanged.
- IPC contracts: unchanged.

## Risks
- Drift risk remains until a follow-up parity-check or migration strategy workpack is implemented.
- ADR is Proposed, not an approved runtime migration.
- Some TS counterparts are wrappers while others are parallel implementations; future work must classify them before editing.

## Follow-ups
- `WP-FUTURE-main-ts-parity-audit`: classify every `src/main/**/*.ts` counterpart as wrapper, parity implementation, stale counterpart, or migration candidate.
- `WP-FUTURE-main-ts-build-strategy-spike`: design build/entrypoint/test/rollback plan for staged TS migration.
- `WP-FUTURE-main-ts-parity-checks`: add non-runtime drift detection, only after deciding check strategy and allowed tooling.
- `WP-FUTURE-main-ts-retirement-plan`: decide whether stale TS counterparts should be deleted, generated, or migrated; strong human gate required.
- For n8n/Judge/cross-history work: preflight each workpack with explicit JS source-of-truth and TS counterpart handling.

## Merge recommendation
GO for docs-only merge. No runtime behavior changes were made.
