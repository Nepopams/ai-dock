# Workpack: WP-IN-2026-036 Judge Dynamic Criteria Display

## Workpack ID
`WP-IN-2026-036-judge-dynamic-criteria-display`

## Title
Judge Dynamic Criteria Display

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped renderer UI APPLY

## Type
Runtime renderer UI/test/docs

## Selected executor
`ai-dock-renderer-react-executor`

## Primary skill
`ai-dock-renderer-react-executor`

## Secondary executors
- `ai-dock-test-qa-executor`
- `ai-dock-zustand-state-executor`, only if PLAN proves store hydration needs adjustment.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`
- `docs/_indexes/executor-index.md`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/epic.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/planning/initiatives/IN-2026-033-evaluation-run-export-foundation/delivery-report.md`
- `docs/planning/initiatives/IN-2026-034-evaluation-run-history-store/delivery-report.md`
- `docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui/delivery-report.md`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/EvaluationStudioView.tsx`, read-only context
- `src/renderer/store/judgeSlice.ts`, read-only unless PLAN proves required
- `src/shared/types/judge.ts`, read-only context
- `src/shared/types/evaluationRun.ts`, read-only context
- `tests/**/*`
- `package.json`

## Goal
Make the `CompareView` score table render all criteria actually present in `judgeResult.scores`, while preserving legacy default ordering and staying inside renderer-only compatibility scope.

## User value
Users can see non-default criteria from future presets, custom rubrics, and saved EvaluationRuns instead of only the three legacy rows.

## Current architecture context
`WP-JUDGE-007A` added dynamic score criteria support to EvaluationRun export. `WP-JUDGE-007B` added EvaluationRun history storage. `WP-JUDGE-007C` added saved EvaluationRun UI and hydrates Judge results back into `CompareView`. The remaining gap is visual: `CompareView` still maps over a hardcoded `["coherence", "factuality", "helpfulness"]` list and `findScore` is typed to those fixed criteria.

## Affected modules
- Renderer UI: `CompareView`.
- Renderer helper: `src/renderer/react/views/evaluation/**`.
- Tests: targeted pure helper test.
- Docs/planning: initiative/workpack artifacts, EP-JUDGE roadmap/workpack map, architecture note.

## In scope
- Create initiative artifacts and prompt-pack.
- Add `discoverScoreCriteria(result: JudgeResult | null): string[]` as a pure renderer helper.
- Discover all criteria from all score buckets in `result.scores`.
- Preserve preferred default ordering first: `coherence`, `factuality`, `helpfulness`.
- Append additional criteria in first-seen order.
- Trim, de-duplicate, and ignore invalid/empty criteria.
- Update `findScore` to accept any criterion string.
- Replace fixed score table row rendering with dynamic `scoreCriteria.map(...)`.
- Add empty state row: `No score criteria returned.`
- Add targeted helper tests.
- Update EP-JUDGE roadmap/workpack map and short architecture note.

## Out of scope
- Judge runtime/prompt changes.
- Preset picker changes.
- New criteria generation.
- Dynamic criteria editing.
- New IPC/preload/shared contracts.
- Export changes.
- Storage changes.
- EvaluationRun format changes.
- Full CompareView redesign.
- Dependency/package changes.

## Allowed files
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/evaluation/**`
- `src/renderer/react/styles/global.css`, only if tiny score-table empty-state styling is needed
- `tests/judgeDynamicCriteria.test.js`
- `docs/planning/initiatives/IN-2026-036-judge-dynamic-criteria-display/**`
- `docs/planning/workpacks/WP-IN-2026-036-judge-dynamic-criteria-display/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`, only for a short implementation note

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/judgeSlice.ts`, unless PLAN proves absolutely required
- `src/renderer/react/views/EvaluationStudioView.tsx`, unless PLAN proves tiny compatibility note is required
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `electron-builder.yml`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Expected file changes
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/evaluation/scoreCriteria.ts`
- `tests/judgeDynamicCriteria.test.js`
- `docs/planning/initiatives/IN-2026-036-judge-dynamic-criteria-display/**`
- `docs/planning/workpacks/WP-IN-2026-036-judge-dynamic-criteria-display/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`

## IPC impact
None. No IPC channels, constants, handlers, or consumers are added or changed.

## Preload impact
None. No bridge/API changes.

## Renderer impact
`CompareView` score rows become dynamic over `judgeResult.scores`. The rest of the Judge form, run, save, and export actions remain unchanged.

## Store impact
None. PLAN found no `judgeSlice` change is required.

## Data/storage impact
None. Existing saved EvaluationRuns are only displayed through existing hydrated Judge result data.

## Security impact
- `contextIsolation` and `sandbox` are untouched.
- Renderer still has no direct Node access.
- No tokens/secrets are added to UI/logs/docs.
- No new IPC/preload/storage/export surface is introduced.
- Criteria ids are rendered from result data already present in renderer state.

## PLAN conclusion
1. Hardcoded criteria are rendered in `src/renderer/react/views/CompareView.tsx` inside the score table `<tbody>` with `["coherence", "factuality", "helpfulness"].map(...)`.
2. Criteria will be discovered from `judgeResult.scores` by iterating every score bucket (`answer_1`, `answer_2`, etc.) and reading string `criterion` fields.
3. Preferred ordering is preserved by returning discovered default criteria first in this order: `coherence`, `factuality`, `helpfulness`; all other criteria follow in first-seen order.
4. Unknown/custom criteria labels will render as their trimmed criterion ids for now. No mapping catalog is introduced.
5. If no score criteria are discovered, the table body renders one row with `No score criteria returned.` spanning all columns.
6. No shared/type changes are required. If they become required, STOP.
7. No `judgeSlice` change is required because the hydrated `judgeResult` already carries scores. If store changes become required, STOP unless the workpack is revised.
8. Exact files to change: `CompareView.tsx`, `views/evaluation/scoreCriteria.ts`, `tests/judgeDynamicCriteria.test.js`, initiative/workpack docs, EP-JUDGE roadmap/workpack map, and one short architecture note.
9. Verification commands: initiative validator, workpack validator, targeted helper test, `npm test`, `npm run build`, status/diff checks, whitespace check, and forbidden-path status check.
10. Strong gate: none active. Stop if main/preload/shared/Judge pipeline/export/storage/package/dependency/large redesign work becomes necessary.

## Step-by-step plan
1. Create initiative artifacts and prompt-pack.
2. Add pure helper `discoverScoreCriteria` in `src/renderer/react/views/evaluation/scoreCriteria.ts`.
3. Update `CompareView` to import the helper and compute `scoreCriteria` with `useMemo`.
4. Update `findScore` to accept `criterion: string` and compare trimmed criteria.
5. Replace the fixed criteria array in table rendering with `scoreCriteria`.
6. Add an empty-state row when `scoreCriteria.length === 0`.
7. Add `tests/judgeDynamicCriteria.test.js` for helper discovery behavior.
8. Update EP-JUDGE roadmap/workpack map and architecture implementation notes.
9. Run validation, tests, build, diff, and forbidden-path checks.
10. Perform REVIEW and finalize run-state/task-queue/gates/delivery-report.

## Acceptance criteria
- [x] Initiative artifacts and workpack validate.
- [x] `CompareView` uses dynamic score criteria from `judgeResult.scores`.
- [x] Default criteria preserve order: `coherence`, `factuality`, `helpfulness`.
- [x] Extra criteria render after defaults in first-seen order.
- [x] Duplicate/empty/invalid criteria are ignored.
- [x] `findScore` supports arbitrary criterion strings.
- [x] Empty score criteria display `No score criteria returned.`
- [x] Existing export/save/Judge run behavior is unchanged.
- [x] No main/preload/shared/store/package/dependency changes.
- [x] Targeted helper tests, `npm test`, and `npm run build` pass.
- [x] EP-JUDGE docs and architecture note are updated.

## Test plan
- Targeted helper test: `node --test tests/judgeDynamicCriteria.test.js`.
- Full suite: `npm test`.
- Renderer build: `npm run build`.
- Scope and whitespace checks listed below.
- Manual Electron smoke checklist recorded in delivery report.

## Verification commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-036-judge-dynamic-criteria-display`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-036-judge-dynamic-criteria-display/workpack.md`
- `node --test tests/judgeDynamicCriteria.test.js`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Manual smoke checklist
- [ ] `npm run dev:app`
- [ ] Open Judge / Evaluation Studio.
- [ ] Run current Judge result with default criteria.
- [ ] Confirm `coherence`, `factuality`, and `helpfulness` still display.
- [ ] Open or create saved EvaluationRun with non-default criteria if possible.
- [ ] Confirm extra criteria rows display.
- [ ] Save Evaluation still works.
- [ ] Open saved evaluation still works.
- [ ] Export MD/JSON still works.
- [ ] Chat/Form Profiles/History/Connections still open.

## Docs/index updates required
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`

## Docs impact
Creates `IN-2026-036` artifacts and `WP-IN-2026-036` prompt-pack. Updates EP-JUDGE planning docs with a completed compatibility slice and records a short architecture implementation note.

## Rollback
Revert the allowed `CompareView`, renderer helper, targeted test, initiative/workpack docs, EP-JUDGE docs, and architecture note changes. No persisted data, IPC, preload, main, shared, export, storage, or package changes are involved.

## Done criteria
- [x] Acceptance criteria met.
- [x] Required verification commands executed or explicitly marked blocked with reason.
- [x] Runtime scope check confirms forbidden paths unchanged.
- [x] Delivery report finalized.
- [x] REVIEW verdict recorded as GO with manual smoke follow-up.

## Risks
- Manual Electron smoke may remain pending.
- Shared Judge type guards still model fixed legacy criteria; this workpack intentionally limits itself to renderer display compatibility.
- Saved runs with future criteria rely on already-hydrated `judgeResult.scores` data.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
