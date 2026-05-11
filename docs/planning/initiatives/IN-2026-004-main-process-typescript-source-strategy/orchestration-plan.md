# Orchestration Plan - IN-2026-004

## Initiative summary
IN-2026-004 is an L2 architecture/docs planning initiative. It produces a docs-only strategy for main-process JavaScript and TypeScript files, with no runtime APPLY. The deliverable is a planning workpack, inventory, recommendation, and ADR draft.

## Assumptions
- Safe assumption: because `docs/architecture/decisions/` did not exist, `ADR-002-main-process-typescript-source-strategy.md` is available and uses the user-requested number.
- Safe assumption: `src/main/**/*.js` is current runtime source where reachable from `package.json` main and CommonJS `require`.
- Safe assumption: `src/main/**/*.ts` is not compiled by current `tsconfig.json` and is not current runtime source.
- Blocking assumption: deleting TS files, changing build config, or migrating runtime to TS requires a future strong human gate and separate runtime/build workpacks.

## Selected delivery mode
L2 architecture/docs planning initiative. Runtime APPLY forbidden.

## Epic breakdown
- Epic ID: `E-IN-2026-004-1`
  Title: Inventory and source strategy.
  Scope: Inventory `src/main/**` JS/TS, classify source-of-truth, analyze options, draft ADR.
  Risk profile: Low for repository runtime because only docs are changed; medium architectural risk if future work ignores the ADR.
  Success criteria: ADR Proposed, validators pass, no forbidden path changes.

## Sprint mapping
- Sprint / slice: Architecture cleanup / pre-refactoring sprint.
- Workpack candidates: `WP-IN-2026-004-main-process-typescript-source-strategy`.
- Dependencies: IN-2026-003 delivery report.
- Exit criteria: Workpack done, ADR created, source-of-truth index links ADR, verification passes.

## Workpack queue
- Workpack ID: `WP-IN-2026-004-main-process-typescript-source-strategy`
  Type: Architecture/docs planning.
  Purpose: Record main-process JS/TS source strategy.
  Dependency: None after reading IN-2026-003 report.
  Expected status: Done.

## Executor routing
- Workpack ID: `WP-IN-2026-004-main-process-typescript-source-strategy`
  Selected executor: `ai-dock-initiative-runner`
  Primary skill: `ai-dock-initiative-runner`
  Secondary executors: `ai-dock-main-process-executor` as review lens only; no runtime changes.
  Rationale: The work is docs-only architecture planning over main-process ownership.

## Gate plan
- Soft gates: ADR numbering, source-of-truth index link, no-op service catalog decision.
- Strong human gates: runtime source edits, deletion, package/lock/tsconfig/build changes, immediate TS migration, IPC contract changes.
- Gate owner: Human for strong gates; Codex may close soft gates under L2 autonomy.
- Expected decision point: PLAN confirms recommendation does not require immediate runtime/build changes.

## Verification strategy
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-004-main-process-typescript-source-strategy`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-004-main-process-typescript-source-strategy/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/renderer src/shared package.json package-lock.json tsconfig.json`
- Confirm delivery report links the ADR.

## Risk register
- Risk: Proposed ADR may be mistaken for permission to change runtime.
  Impact: Unauthorized runtime/build work.
  Mitigation: ADR records strong gates and next workpacks; final report states no runtime APPLY.
  Owner: Codex/Human.
  Status: Mitigated by docs.
- Risk: Dual JS/TS files continue to drift.
  Impact: Future wrong imports or false typing confidence.
  Mitigation: Recommend JS-as-source now plus future parity-check and migration planning workpacks.
  Owner: Human + future executor.
  Status: Open follow-up.
