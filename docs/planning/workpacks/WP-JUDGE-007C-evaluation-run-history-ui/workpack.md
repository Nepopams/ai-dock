# Workpack: WP-JUDGE-007C EvaluationRun History UI Integration

## Workpack ID
`WP-JUDGE-007C-evaluation-run-history-ui`

## Title
EvaluationRun History UI Integration

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped renderer UI APPLY

## Type
Runtime renderer UI/store/docs

## Selected executor
`ai-dock-renderer-react-executor`

## Primary skill
`ai-dock-renderer-react-executor`

## Secondary executors
- `ai-dock-zustand-state-executor`
- `ai-dock-test-qa-executor`
- `ai-dock-ipc-security-reviewer`, read-only API usage review

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
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/styles/global.css`
- `src/shared/types/evaluationRun.ts`
- `src/shared/types/evaluationRun.js`
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/preload/modules/evaluationRun.js`
- `src/preload/index.ts`
- `src/types/renderer.d.ts`, read-only reference only
- `tests/**/*`
- `package.json`

## Goal
Add UI integration for existing EvaluationRun History Store: save, list, open, and delete saved EvaluationRuns in Evaluation Studio.

## User value
Users can preserve Judge results and revisit saved evaluations without manually exporting files or re-running Judge.

## Current architecture context
`EvaluationStudioView` currently renders the Studio shell, mode cards, manual two-answer start form, and embeds `CompareView` when a compare draft exists. `CompareView` owns the current Judge controls, builds the Judge export payload inline for Markdown/JSON export, and renders score/validator results. `judgeSlice` stores one session-scoped result and has run/clear/error/progress actions, but no hydration action. `IN-2026-034` already exposes `window.evaluationRuns.save/list/read/delete`; the UI does not consume it yet.

## Affected modules
- Renderer UI: `EvaluationStudioView`, `CompareView`, and CSS.
- Zustand state: minimal `judgeSlice` hydration action and `DockActions` type composition.
- Docs/planning: initiative/workpack artifacts, EP-JUDGE roadmap/workpack-map, short architecture note.
- Tests: optional pure helper test if helper extraction remains useful.

## In scope
- Create initiative artifacts and prompt-pack.
- Add `Save Evaluation` button in `CompareView`.
- Reuse the same Judge export payload shape as existing Export MD/JSON.
- Convert payload with existing `mapJudgeExportPayloadToEvaluationRun`.
- Call `window.evaluationRuns.save(evaluationRun)`.
- Add optional `onEvaluationSaved?: () => void | Promise<void>` prop to `CompareView`.
- Add saved EvaluationRuns panel to `EvaluationStudioView`.
- Load list with `window.evaluationRuns.list({ limit: 20, offset: 0 })`.
- Add Refresh, Open, and Delete controls.
- Build compare draft from opened run subjects.
- Hydrate Judge result from opened run result, metadata, validator results, and optional raw response.
- Refresh list after save/delete.
- Add minimal styles to `global.css`.
- Update EP-JUDGE roadmap/workpack-map and short architecture note.

## Out of scope
- Auto-save after every Judge run.
- Search/filter/sort advanced UI.
- New IPC/storage/preload/shared channels or contracts.
- Main process changes.
- Storage changes.
- n8n integration.
- Import/export beyond existing APIs.
- Full CompareView redesign.
- Dedicated EvaluationRun detail page.
- Package/dependency/build config changes.

## Allowed files
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/evaluation/**`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/styles/global.css`
- `tests/evaluationRunUiPayload.test.js`, only if pure helper tests are added
- `docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui/**`
- `docs/planning/workpacks/WP-JUDGE-007C-evaluation-run-history-ui/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`, only for a short implementation note

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
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
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/styles/global.css`
- `docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui/**`
- `docs/planning/workpacks/WP-JUDGE-007C-evaluation-run-history-ui/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`

## IPC impact
None. The UI uses the existing `window.evaluationRuns` preload API and does not add or change IPC channels.

## Preload impact
None. Existing `window.evaluationRuns.save/list/read/delete` is used as-is.

## Renderer impact
Adds explicit save/list/open/delete UI for saved EvaluationRuns in Evaluation Studio and an additive Save Evaluation button in CompareView.

## Store impact
Adds one minimal action: `hydrateJudgeResult(result: JudgeResult): void`. It sets the current `judgeResult`, clears judge errors/progress/running state, and does not invoke Judge.

## Data/storage impact
None to storage format. Full saved records are read through the existing store only after explicit Open; the list panel renders summaries only.

## Security impact
- Sandbox and contextIsolation remain unchanged.
- Renderer still has no Node access.
- UI calls only bounded preload APIs.
- No secrets/tokens are rendered; list uses safe summaries.
- Save uses `mapJudgeExportPayloadToEvaluationRun`, whose mapper whitelists safe metadata and omits raw response by default.
- Opening a saved run displays user-saved subject content by explicit action.

## PLAN conclusion
1. `EvaluationStudioView` currently shows a shell with mode cards, manual two-answer start, and a `CompareView` workspace once `compareDraft` exists.
2. `CompareView` currently builds export payload inline as `{ question, answers: evaluatedAnswers, result: judgeResult, generatedAt }` and sends it to `window.exporter.judgeMarkdown` or `window.exporter.judgeJson`.
3. The current Judge result can be saved without main/preload/shared changes by building the same payload, mapping it with `mapJudgeExportPayloadToEvaluationRun`, and calling existing `window.evaluationRuns.save`.
4. A Zustand action is needed for hydration because saved runs must restore `judgeResult` without invoking `runJudge`. Minimal action: `hydrateJudgeResult(result: JudgeResult): void`.
5. Open saved run by `window.evaluationRuns.read(id)`, then create compare draft from `run.question` and `run.subjects` where `kind === "answer"`; use `subject.agentId || subject.label`, `subject.content`, and `requestId = run.runId`. Hydrate Judge result from `run.result`, plus `metadata = run.metadata`, `validatorResults = run.validatorResults`, and `rawResponse` only when present.
6. Delete saved run by `window.confirm`, `window.evaluationRuns.delete(id)`, and list refresh. If deleting the currently open run, no crash is expected because compare draft and hydrated result are independent of the deleted file.
7. Refresh saved runs list on mount, Refresh button, after save callback, and after delete.
8. Exact files to change are listed in Expected file changes; no shared/preload/main/storage/package files will be changed.
9. Verification commands: initiative validator, workpack validator, `npm test`, `npm run build`, `git status --short`, `git diff --stat`, `git diff --check`, and forbidden-path status check.
10. Strong gate: none active. Stop if a dependency, auto-save, IPC/preload/shared/main/storage/package change, or large CompareView rewrite becomes necessary.

## Step-by-step plan
1. Create initiative artifacts and prompt-pack.
2. Add local EvaluationRun bridge/response types in `EvaluationStudioView` and `CompareView`.
3. Add `hydrateJudgeResult` to `judgeSlice` and expose it through existing store action typing.
4. In `CompareView`, factor the existing export payload construction into a local helper and add Save Evaluation using existing mapper/API.
5. Add optional `onEvaluationSaved` callback prop and call it after a successful save.
6. In `EvaluationStudioView`, load saved summaries on mount and render a compact saved evaluations panel.
7. Add Refresh, Open, and Delete handlers using existing preload API.
8. Open saved records by adapting `EvaluationRunExport` into compare draft plus hydrated Judge result.
9. Add minimal global CSS for saved list/panel/chips/actions.
10. Update EP-JUDGE roadmap/workpack map and architecture note.
11. Run verification and scope checks.
12. Perform REVIEW and finalize delivery report/run-state.

## Acceptance criteria
- [x] Initiative artifacts and workpack validate.
- [x] Save Evaluation appears after Judge result area/action area and is disabled without result/evaluated answers.
- [x] Save uses existing EvaluationRun mapper and `window.evaluationRuns.save`.
- [x] Save success shows toast and refreshes parent list.
- [x] Save failure shows safe toast.
- [x] Export MD/JSON behavior is unchanged.
- [x] Saved list loads first 20 summaries and has empty/loading/error states.
- [x] Saved list shows title, created/updated dates, evaluationType, subjectCount, averageScore, validator fail/warn counts, and model/profile when present.
- [x] Open saved run does not invoke Judge and hydrates visible result.
- [x] Delete confirms, calls existing API, and refreshes list.
- [x] No main/preload/shared/storage/package/dependency changes.
- [x] EP-JUDGE planning docs and architecture note are updated.

## Test plan
- Existing full suite: `npm test`.
- Renderer build: `npm run build`.
- No brittle UI test unless a pure helper is extracted into an allowed test file.
- Manual smoke checklist recorded in delivery report.

## Verification commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-007C-evaluation-run-history-ui/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Manual smoke checklist
- [ ] `npm run dev:app`
- [ ] Open Judge / Evaluation Studio.
- [ ] Run Judge.
- [ ] Save Evaluation.
- [ ] Saved evaluations list refreshes and shows new item.
- [ ] Open saved evaluation.
- [ ] Saved result appears without re-running Judge.
- [ ] Export MD/JSON still works after opening saved run.
- [ ] Delete saved evaluation.
- [ ] List updates.
- [ ] Chat/Form Profiles/History/Connections still open.
- [ ] BrowserView tabs still work.

## Docs/index updates required
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`

## Docs impact
Creates `IN-2026-035` artifacts and `WP-JUDGE-007C` prompt-pack. Updates EP-JUDGE roadmap/workpack map to mark UI integration complete or in progress and points next work to `WP-JUDGE-008`.

## Rollback
Revert the allowed renderer/store/style changes and docs updates for `IN-2026-035`/`WP-JUDGE-007C`. No persisted EvaluationRun data format changes are involved. Existing saved data can remain in userData because this workpack only adds UI consumption.

## Done criteria
- [x] Acceptance criteria met.
- [x] Required verification commands executed or explicitly marked blocked with reason.
- [x] Runtime scope check confirms forbidden paths unchanged.
- [x] Delivery report finalized.
- [x] REVIEW verdict recorded as GO, Conditional GO, or NO-GO.

## Risks
- Manual Electron smoke may remain pending.
- Existing saved records can contain full answer content; the UI must show full content only after explicit Open.
- Opened saved runs use the current CompareView score table, which still displays the current fixed criteria rows.
- `src/types/renderer.d.ts` cannot be updated under the current allow-list, so local casts must remain narrow and isolated.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
