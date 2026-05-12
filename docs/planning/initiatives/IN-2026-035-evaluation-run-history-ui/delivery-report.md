# Delivery Report: IN-2026-035 EvaluationRun History UI Integration

## Summary
Delivered `WP-JUDGE-007C EvaluationRun History UI Integration`. Evaluation Studio now has a saved evaluations panel that lists, opens, refreshes, and deletes saved EvaluationRuns through the existing `window.evaluationRuns` preload API. CompareView now has an explicit `Save Evaluation` action that maps the current Judge export payload to `EvaluationRun` with the existing mapper and saves it through the existing storage API. No auto-save, search/filter, n8n, IPC/storage/preload/shared/main, package, dependency, or large CompareView redesign changes were added.

## Workpacks completed
| Workpack ID | Status | REVIEW verdict | Notes |
| --- | --- | --- | --- |
| `WP-JUDGE-007C-evaluation-run-history-ui` | Done | GO with manual smoke follow-up | Renderer UI/store integration only; manual Electron smoke pending |

## Files consulted
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
- `src/types/renderer.d.ts`
- `tests/**/*`
- `package.json`
- `scripts/workflow/validate-initiative.mjs`
- `scripts/workflow/validate-workpack.mjs`

## Files changed
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/styles/global.css`
- `docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui/initiative.md`
- `docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui/orchestration-plan.md`
- `docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui/task-queue.md`
- `docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui/run-state.md`
- `docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui/gates.md`
- `docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui/delivery-report.md`
- `docs/planning/workpacks/WP-JUDGE-007C-evaluation-run-history-ui/workpack.md`
- `docs/planning/workpacks/WP-JUDGE-007C-evaluation-run-history-ui/prompt-plan.md`
- `docs/planning/workpacks/WP-JUDGE-007C-evaluation-run-history-ui/prompt-apply.md`
- `docs/planning/workpacks/WP-JUDGE-007C-evaluation-run-history-ui/prompt-review.md`
- `docs/planning/workpacks/WP-JUDGE-007C-evaluation-run-history-ui/prompt-fixpack.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`

## Commands run
| Command | Purpose | Result |
| --- | --- | --- |
| `Get-ChildItem -Force` | Inspect repository root | PASS |
| `git status --short` | Starting and review worktree checks | PASS |
| `Get-Content -Raw -Encoding UTF8 ...` | Read required governance, workflow, Judge epic, prior delivery, runtime UI/store/types/preload, tests, package, and validator context | PASS |
| `rg --files tests` | Inspect test inventory | PASS |
| `rg -n "evaluation-studio|compare-|pill-btn|toast" src/renderer/react/styles/global.css` | Locate CSS insertion points | PASS |
| `New-Item -ItemType Directory -Force ...` | Create initiative/workpack directories | PASS |
| `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-035-evaluation-run-history-ui` | Validate initiative artifacts | PASS |
| `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-007C-evaluation-run-history-ui/workpack.md` | Validate workpack artifact | PASS |
| `npm run build` | Early renderer build | Initial FAIL due CommonJS `.js` mapper resolution; fixed by importing the existing TS mapper export |
| `npm test` | Full test suite | PASS, 77 tests; existing module-type warnings |
| `npm run build` | Renderer build | PASS; existing CSS minify warnings |
| `git diff --stat` | Review tracked diff size | PASS |
| `git diff --check` | Whitespace check | PASS, line-ending warnings only |
| `git status --short -- src/main src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml` | Forbidden-path scope check | PASS, empty |

## Test results
- Initiative validator: PASS.
- Workpack validator: PASS.
- `npm test`: PASS, 77 tests. Existing module-type warnings remain.
- `npm run build`: PASS. Existing CSS minify warnings remain.
- `git diff --check`: PASS, line-ending warnings only.
- Forbidden-path scope check: PASS, empty.

## Review results
- No main/preload/shared/storage/IPC changes: PASS.
- No package/dependency/build config changes: PASS.
- Save uses existing EvaluationRun mapper and existing `window.evaluationRuns.save`: PASS.
- Save is explicit only; no auto-save: PASS.
- Saved list uses existing `window.evaluationRuns.list({ limit: 20, offset: 0 })`: PASS.
- Open uses existing `window.evaluationRuns.read` and hydrates Judge result without calling `runJudge`: PASS.
- Delete uses existing `window.evaluationRuns.delete`: PASS.
- Existing Export MD/JSON methods remain unchanged: PASS.
- EP-JUDGE roadmap/workpack-map and architecture note updated: PASS.
- Manual smoke: pending.

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

## Runtime scope check
Changed runtime paths stayed within renderer/store/style allow-list. The explicit forbidden-path check for `src/main`, `src/preload`, `src/shared`, package files, TypeScript/Vite config, scripts, and Electron builder config was empty.

## Privacy and data assessment
- Saved list renders summaries only and does not render full subject content or raw response.
- Save uses the existing EvaluationRun mapper, which keeps safe metadata and omits raw response by default.
- Opening a saved run displays saved subject content only after explicit user action.
- No tokens, auth headers, or provider secrets are rendered or logged by this workpack.

## Backward compatibility
- Existing `window.exporter.judgeMarkdown` and `window.exporter.judgeJson` usage remains unchanged.
- Existing Judge run flow remains unchanged.
- Existing EvaluationRun save/list/read/delete preload API remains unchanged.
- Existing saved EvaluationRun records remain compatible.
- CompareView remains usable without the optional `onEvaluationSaved` prop.

## Risks
- Manual Electron smoke remains pending.
- Build still reports pre-existing CSS minify warnings unrelated to this workpack.
- Node test suite still reports pre-existing module type warnings.
- Opened saved runs are displayed through the current CompareView score table, which still has the current fixed visible criteria rows.

## Follow-ups
- Run the manual smoke checklist in Electron.
- Continue with `WP-JUDGE-008 Tests and Smoke Suite`.
- Consider a later scoped workpack for richer dynamic criteria display if saved/exported EvaluationRuns expand beyond current Judge criteria.

## Merge recommendation
GO with manual smoke follow-up. Automated verification and scope review passed.
