# Orchestration Plan - IN-2026-017

## Initiative summary
Create a docs-only namespace strategy for active top-level renderer support modules. The outcome is ADR-004 with Option A recommended now and C/D deferred as possible future target states.

## Assumptions
- Safe assumption: ADR-004 is the next free ADR number because the decisions directory currently contains ADR-002 and ADR-003.
- Safe assumption: The current support module ownership evidence from IN-2026-014 is authoritative for this planning initiative.
- Safe assumption: Source-of-truth index update is allowed because it only adds an ADR link.
- Blocking assumption: Any actual namespace migration requires a separate Human Gate and runtime workpack.

## Selected delivery mode
L2 architecture/docs planning initiative. Runtime APPLY, imports, moves, deletes, package/build/config changes are forbidden.

## Epic breakdown
- Epic ID: E1
- Title: Current namespace snapshot
- Scope: Summarize current React app root, top-level support modules, and legacy retirement separation.
- Risk profile: docs-only.
- Success criteria: snapshot appears in ADR-004 and workpack/report artifacts.

- Epic ID: E2
- Title: Options analysis
- Scope: Evaluate Options A-D for benefits, risks, migration cost, import churn, Vite/TS impact, verification, workpacks, and strong gates.
- Risk profile: docs-only with future runtime implications.
- Success criteria: ADR-004 contains complete option analysis.

- Epic ID: E3
- Title: Recommendation and follow-up queue
- Scope: Recommend Option A now, defer C/D, and define follow-up workpacks IN-2026-018 through IN-2026-023.
- Risk profile: docs-only.
- Success criteria: recommendation avoids immediate migration and preserves legacy retirement guardrails.

## Sprint mapping
- Sprint / slice: Renderer consolidation / pre n8n and pre legacy archive.
- Workpack candidates: `WP-IN-2026-017-renderer-support-namespace-strategy`.
- Dependencies: ADR-003, renderer retirement plan, non-React renderer support ownership audit.
- Exit criteria: ADR created, validators pass, forbidden-path scope check confirms no initiative-caused runtime changes.

## Workpack queue
- Workpack ID: `WP-IN-2026-017-renderer-support-namespace-strategy`
- Type: docs-only architecture decision
- Purpose: create ADR-004 and planning artifacts.
- Dependency: IN-2026-014 ownership audit.
- Expected status: Done after validation.

## Executor routing
- Workpack ID: `WP-IN-2026-017-renderer-support-namespace-strategy`
- Selected executor: `ai-dock-initiative-runner`
- Primary skill: `ai-dock-initiative-runner`
- Secondary executors: none
- Rationale: docs-only architecture planning does not need runtime executors.

## Gate plan
- Soft gates:
  - Use ADR-004 as next free ADR number.
  - Add source-of-truth link for ADR-004.
  - Mark migration follow-ups as optional/deferred.
- Strong human gates:
  - Runtime/source changes.
  - Import/path moves.
  - Vite/TS/package/script/lockfile changes.
  - Immediate migration recommendation.
- Gate owner: Human for strong gates; Codex may log soft gates.
- Expected decision point: no strong gate expected for this docs-only initiative.

## Verification strategy
- Docs/workflow validation:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-017-renderer-support-namespace-strategy`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-017-renderer-support-namespace-strategy/workpack.md`
- Runtime tests: not run because runtime is unchanged.
- Smoke/manual QA: not run because runtime is unchanged.
- Commands:
  - `git status --short`
  - `git diff --stat`
  - `git diff --check`
  - `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Risk register
- Risk: Option A leaves current namespace ambiguity in place.
- Impact: Future work may still misclassify active support.
- Mitigation: ADR rules and source-of-truth link.
- Owner: Human + future workpack owner.
- Status: accepted.

- Risk: Future migration becomes larger if deferred too long.
- Impact: More import churn later.
- Mitigation: Add IN-2026-023 preflight before larger renderer feature work.
- Owner: future workpack owner.
- Status: open follow-up.

- Risk: Package lock remains dirty from unrelated worktree state.
- Impact: Forbidden-path status output shows `package-lock.json`.
- Mitigation: Do not touch or stage it in this initiative; report as pre-existing.
- Owner: Human.
- Status: residual.
