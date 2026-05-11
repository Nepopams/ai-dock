# Workpack - WP-IN-2026-004 Main Process TypeScript Source Strategy

## Workpack ID
`WP-IN-2026-004-main-process-typescript-source-strategy`

## Title
Main Process TypeScript Source Strategy

## Status
Done

## Owner
Human + Codex

## Mode
PLAN -> Gate Evaluation -> Docs-only APPLY -> REVIEW under L2 architecture/docs autonomy.

## Type
`architecture-docs-planning`

## Selected executor
- `ai-dock-initiative-runner`

## Primary skill
- `ai-dock-initiative-runner`

## Secondary executors
- `ai-dock-main-process-executor` as architecture review lens only.

## Sources of truth
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

## Goal
Create a docs-only architectural decision for the current and future source-of-truth strategy of JS and TS files under `src/main/**`.

## User value
Future contributors can tell which files to edit today, where drift risks live, and which gated workpacks are needed before changing build/runtime strategy.

## In scope
- Read-only inventory of `src/main/**/*.js` and `src/main/**/*.ts`.
- Runtime source-of-truth analysis.
- TypeScript counterpart classification.
- Options A-D analysis.
- Recommendation and ADR draft.
- Initiative/workpack artifacts.
- Source-of-truth index link to ADR.

## Out of scope
- Runtime code changes.
- Main-process TypeScript migration.
- Deleting `.ts` files.
- Build pipeline, package scripts, dependency, or tsconfig changes.
- Runtime import or Electron entrypoint changes.
- IPC/preload/shared/renderer contract changes.

## Current architecture context
`package.json` declares `src/main/main.js` as the Electron main entry. `src/main/main.js` uses CommonJS `require` to load `TabManager`, services, and IPC bootstrap. `src/main/ipc/bootstrap.js` loads JS IPC modules through extensionless CommonJS requires that resolve to `.js` files. `tsconfig.json` includes `src/renderer/react` and `src/types`, not `src/main/**`. `vite.config.js` builds the renderer app, and `scripts/build-preload.js` bundles only `src/preload/index.ts`. There is no current main-process TypeScript build.

## Allowed files
- `docs/planning/initiatives/IN-2026-004-main-process-typescript-source-strategy/**`
- `docs/planning/workpacks/WP-IN-2026-004-main-process-typescript-source-strategy/**`
- `docs/architecture/decisions/**`
- `docs/_indexes/source-of-truth.md` only for ADR link
- `docs/architecture/service-catalog.md` only if docs-only clarification is necessary
- `docs/_indexes/executor-index.md` only if docs-only clarification is necessary

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/renderer/**`
- `src/shared/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Expected file changes
- Initiative artifacts.
- Workpack prompt-pack.
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
- `docs/_indexes/source-of-truth.md` ADR link.

## Step-by-step plan
1. Read required governance, workflow, validators, package/build config, scripts, architecture docs, and prior initiative report.
2. Inventory JS/TS files under `src/main/**`.
3. Compare JS/TS pairs and identify runtime-reachable JS from `package.json` main.
4. Confirm `tsconfig.json` and scripts do not compile `src/main/**` TS.
5. Classify TS counterparts as wrappers or parallel implementations.
6. Analyze options A-D.
7. Record recommendation.
8. Create ADR draft and link it from source-of-truth index.
9. Validate initiative/workpack and run diff/path checks.
10. REVIEW for docs-only scope and no forbidden changes.

## Acceptance criteria
- [x] Main JS/TS inventory recorded.
- [x] Runtime source-of-truth identified.
- [x] Main TS build status identified.
- [x] Options A-D analyzed.
- [x] Recommendation recorded in requested format.
- [x] ADR draft created with required sections.
- [x] No runtime/config/package/script changes.
- [x] Validators pass.

## Test plan
- Validate initiative artifacts.
- Validate workpack.
- Run git status/diff checks.
- Verify forbidden runtime/config paths remain unchanged.
- No runtime tests/build because this is docs-only and runtime APPLY is forbidden.

## Security impact
No runtime/security impact. Security-relevant guardrail: future TS migration, deletion, package/build, IPC, preload/shared/renderer changes all require separate strong gates.

## IPC impact
None. No channels, contracts, handlers, preload exposure, or renderer consumers changed.

## Docs impact
Creates ADR and planning artifacts. Updates source-of-truth index with an architecture decisions entry.

## Rollback
Remove the IN-2026-004 initiative folder, WP-IN-2026-004 workpack folder, ADR-002 file, and the source-of-truth index ADR link.

## Done criteria
- [x] Initiative validator PASS.
- [x] Workpack validator PASS.
- [x] ADR created and linked from delivery report.
- [x] Source-of-truth index link added.
- [x] Forbidden path status check clean.
- [x] REVIEW = GO.

## Risks
- ADR is Proposed and does not by itself enforce parity checks.
- Future runtime work can still drift if it ignores the recommended follow-up workpacks.
- Deleting or migrating TS counterparts is intentionally deferred to strong-gated work.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
