# Orchestration Plan: IN-2026-036 Judge Dynamic Criteria Display

## Initiative summary
Deliver one scoped renderer UI compatibility workpack so `CompareView` renders all score criteria present in `judgeResult.scores`, including criteria restored from saved EvaluationRuns.

## Assumptions
- Safe assumption: dynamic criteria can be discovered from existing `judgeResult.scores` without shared type changes.
- Safe assumption: `CompareView` can render trimmed criterion ids directly in the score table.
- Safe assumption: a pure helper under `src/renderer/react/views/evaluation/**` is within the renderer allow-list and can be tested by a targeted Node test.
- Blocking assumption: if TypeScript/shared contracts must change to represent dynamic criteria, the initiative must stop. PLAN found no such need.

## Selected delivery mode
Runtime single-layer: scoped renderer UI APPLY with targeted helper test and planning docs.

## Epic breakdown
- Epic ID: `EP-JUDGE-001`
- Title: Judge Mode / Evaluation Studio MVP
- Scope: dynamic criteria display compatibility after EvaluationRun export/history UI work.
- Risk profile: Low-Medium. Renderer-only UI display change, no IPC/storage/export/Judge runtime changes.
- Success criteria: CompareView dynamic criteria rows render, default order is preserved, empty state exists, verification passes.

## Sprint mapping
- Sprint / slice: EP-JUDGE Slice 4D Dynamic Criteria Display.
- Workpack candidates: `WP-IN-2026-036-judge-dynamic-criteria-display`.
- Dependencies: `WP-JUDGE-007A`, `WP-JUDGE-007B`, `WP-JUDGE-007C`.
- Exit criteria: workpack REVIEW = GO or Conditional GO with only manual smoke pending.

## Workpack queue
- Workpack ID: `WP-IN-2026-036-judge-dynamic-criteria-display`
- Type: Runtime renderer UI/test/docs
- Purpose: Replace hardcoded CompareView score criteria rows with dynamic criteria discovery.
- Dependency: prior EvaluationRun export/history UI work is complete.
- Expected status: Done after APPLY/REVIEW.

## Executor routing
- Workpack ID: `WP-IN-2026-036-judge-dynamic-criteria-display`
- Selected executor: `ai-dock-renderer-react-executor`
- Primary skill: `ai-dock-renderer-react-executor`
- Secondary executors: `ai-dock-test-qa-executor`
- Rationale: dominant runtime scope is React renderer UI plus a pure renderer helper test. No store, main, preload, shared, IPC, export, or storage changes are needed.

## Gate plan
- Soft gates: artifact naming, helper file location, targeted test command selection, EP-JUDGE slice naming.
- Strong human gates: forbidden path change, shared type change, Judge pipeline/export/storage change, dependency change, large redesign, or verification blocker.
- Gate owner: Human for strong gates; Codex can record soft gates.
- Expected decision point: PLAN Gate passed based on explicit user approval and PLAN conclusion; no active strong gate.

## Verification strategy
- Docs/workflow validation:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-036-judge-dynamic-criteria-display`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-036-judge-dynamic-criteria-display/workpack.md`
- Runtime tests:
  - `node --test tests/judgeDynamicCriteria.test.js`
  - `npm test`
- Build:
  - `npm run build`
- Scope checks:
  - `git status --short`
  - `git diff --stat`
  - `git diff --check`
  - `git status --short -- src/main src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`
- Smoke/manual QA:
  - Electron checklist recorded in delivery report.

## Risk register
- Risk: shared `JudgeCriterion` remains fixed.
  Impact: TypeScript cannot model future criteria globally.
  Mitigation: keep this workpack as renderer display compatibility only; stop if shared changes become required.
  Owner: Codex.
  Status: Open residual risk.
- Risk: manual Electron smoke may remain pending.
  Impact: lower product-smoked confidence.
  Mitigation: record checklist and keep merge recommendation conditional if manual smoke is not performed.
  Owner: Human + Codex.
  Status: Pending.
