# Delivery Report: IN-2026-034 EvaluationRun History Store

## Summary
Delivered `WP-JUDGE-007B EvaluationRun History Store`. Judge/Evaluation Studio now has a separate file-backed EvaluationRun persistence foundation with storage-level record/summary guards, bounded save/list/read/delete IPC, and a minimal preload API. No chat history storage, Judge runtime pipeline, export IPC, renderer UI, provider/settings, package, dependency, database, or migration changes were added.

## Workpacks completed
| Workpack ID | Status | REVIEW verdict | Notes |
| --- | --- | --- | --- |
| `WP-JUDGE-007B-evaluation-run-history-store` | Done | GO with manual smoke follow-up | Storage/API foundation only; EvaluationRun history UI remains follow-up |

## Files changed
- `src/shared/types/evaluationRun.ts`
- `src/shared/types/evaluationRun.js`
- `src/shared/ipc/evaluationRun.ipc.ts`
- `src/shared/ipc/evaluationRun.ipc.js`
- `src/main/storage/evaluationRunStore.js`
- `src/main/ipc/evaluationRun.ipc.js`
- `src/main/ipc/bootstrap.js`
- `src/preload/modules/evaluationRun.js`
- `src/preload/index.ts`
- `tests/evaluationRunStore.test.js`
- `tests/evaluationRunIpc.test.js`
- `tests/evaluationRunPreload.test.js`
- `docs/planning/initiatives/IN-2026-034-evaluation-run-history-store/**`
- `docs/planning/workpacks/WP-JUDGE-007B-evaluation-run-history-store/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/_indexes/ipc-index.md`

## Commands run
| Command | Purpose | Result |
| --- | --- | --- |
| `git switch -c workflow/in-2026-034-evaluation-run-history-store` | Create requested branch | PASS |
| `Get-Content ...` | Read required governance, architecture, epic, prior delivery, storage, IPC, preload, test, and package context | PASS |
| `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-034-evaluation-run-history-store` | Validate initiative artifacts | PASS |
| `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-007B-evaluation-run-history-store/workpack.md` | Validate workpack artifact | PASS |
| `node --check src/main/storage/evaluationRunStore.js` | Syntax check store | PASS |
| `node --check src/main/ipc/evaluationRun.ipc.js` | Syntax check main IPC | PASS |
| `node --check src/shared/types/evaluationRun.js` | Syntax check shared type runtime | PASS |
| `node --check src/shared/ipc/evaluationRun.ipc.js` | Syntax check shared IPC runtime | PASS |
| `node --test tests/evaluationRunStore.test.js tests/evaluationRunIpc.test.js tests/evaluationRunPreload.test.js` | Targeted tests | PASS, 8 tests |
| `npm test` | Full test suite | PASS, 77 tests; existing module-type warnings |
| `npm run preload:build` | Build preload bundle | PASS |
| `npm run build` | Build renderer bundle | PASS, existing CSS minify warnings |
| `git status --short` | Review changed files | PASS |
| `git diff --stat` | Review diff size | PASS |
| `git diff --check` | Whitespace check | PASS, line-ending warnings only |
| `git status --short -- src/main/services/historyStore.js src/main/ipc/history.ipc.js src/main/storage/historyFs.js src/main/services/judgePipeline.js src/main/ipc/judge.ipc.js src/main/ipc/export.ipc.js src/renderer package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml` | Forbidden-path scope check | PASS, empty |

## Test results
- Initiative validator: PASS.
- Workpack validator: PASS.
- JS syntax checks: PASS.
- Targeted tests: PASS, 8 tests.
- `npm test`: PASS, 77 tests. Existing module-type warnings remain.
- `npm run preload:build`: PASS.
- `npm run build`: PASS. Existing CSS minify warnings remain.
- `git diff --check`: PASS, line-ending warnings only.
- Forbidden-path scope check: PASS, empty.

## Manual smoke checklist
- [ ] `npm run dev:app`
- [ ] App starts without duplicate IPC handler errors.
- [ ] Existing Judge screen opens.
- [ ] Existing export still works.
- [ ] No visible UI for EvaluationRun history yet; expected.
- [ ] Chat/Form Profiles/History/Connections still open.
- [ ] BrowserView tabs still work.

## Review results
- Separate EvaluationRun storage created: PASS.
- Existing chat history untouched: PASS.
- New IPC channels limited to `evaluationRun:save`, `evaluationRun:list`, `evaluationRun:read`, `evaluationRun:delete`: PASS.
- Preload API exposes no arbitrary invoke: PASS.
- List summaries omit full subject content, `rawResponse`, and custom prompt text: PASS.
- No package/dependency changes: PASS.
- No renderer changes: PASS.
- Tests/build/preload pass: PASS.
- EP-JUDGE and architecture docs updated: PASS.
- IPC index updated: PASS.
- Next UI integration workpack identified: PASS.

## Runtime scope check
- Runtime changes stayed in the approved storage/shared/IPC/preload paths.
- The new store is isolated under `userData/ai-dock/evaluations`.
- Forbidden-path check was empty for chat history storage/IPC, Judge runtime, export IPC, renderer, package/lock, build config, scripts, and Electron builder config.

## Data and privacy
- Full records contain `EvaluationRunExport` because read/open flows need the complete run.
- List summaries are derived and compact: title, evaluation type, question preview, subject count, score summary, validator summary, and safe metadata summary.
- List summaries do not include subject content, `rawResponse`, or custom prompt text.
- IPC failure responses use stable codes and safe messages without stack traces.
- No token/auth/provider secret fields were introduced.

## Backward compatibility
- Existing Judge export foundation remains unchanged.
- Existing `window.exporter` methods remain unchanged.
- Existing chat history APIs and storage remain unchanged.
- No renderer consumer is required yet; `window.evaluationRuns` is additive.

## Risks
- Manual Electron smoke remains pending.
- Runtime data written under `userData/ai-dock/evaluations` is intentionally separate from code rollback; manual cleanup is possible if needed.
- The storage API exists before UI integration, so product usability depends on a follow-up workpack.

## Follow-ups
- Create a separate EvaluationRun History View/UI integration workpack.
- Decide whether CompareView/Evaluation Studio should offer explicit save actions or auto-save in a later gated workpack.
- Keep n8n consumption deferred until the storage API is product-smoked.

## Merge recommendation
GO with manual smoke follow-up. Automated verification and scope review passed.
