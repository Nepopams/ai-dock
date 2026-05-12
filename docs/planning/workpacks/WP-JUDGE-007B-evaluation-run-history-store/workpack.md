# Workpack: WP-JUDGE-007B EvaluationRun History Store

## Workpack ID
`WP-JUDGE-007B-evaluation-run-history-store`

## Title
EvaluationRun History Store

## Status
Done

## Owner
Human + Codex

## Mode
L3 data/storage-sensitive runtime APPLY

## Type
Runtime storage/shared/IPC/preload/test/docs

## Selected executor
`ai-dock-history-exporter-executor`

## Primary skill
`ai-dock-history-exporter-executor`

## Secondary executors
- `ai-dock-main-process-executor`
- `ai-dock-preload-ipc-executor`
- `ai-dock-ipc-security-reviewer`
- `ai-dock-test-qa-executor`

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
- `docs/_indexes/ipc-index.md`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/epic.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/planning/initiatives/IN-2026-033-evaluation-run-export-foundation/delivery-report.md`
- `src/shared/types/evaluationRun.ts`
- `src/shared/types/evaluationRun.js`
- `src/shared/ipc/history.ipc.ts`
- `src/shared/ipc/history.ipc.js`
- `src/main/services/historyStore.js`
- `src/main/ipc/history.ipc.js`
- `src/main/ipc/bootstrap.js`
- `src/preload/index.ts`
- `src/preload/modules/historyHub.js`
- `src/preload/modules/exporter.js`
- `src/preload/modules/judge.js`
- `src/preload/utils/base.js`
- `tests/**/*`
- `package.json`

## Goal
Add a separate file-backed EvaluationRun record store and bounded API for save/list/read/delete, without mixing EvaluationRun data into chat history and without building a history UI.

## User value
Users will be able to persist Judge/Evaluation Studio run artifacts as their own domain records, and future History UI/n8n work can consume a stable local storage API instead of transient export payloads.

## Current architecture context
`WP-JUDGE-007A` introduced `EvaluationRunExport` in `src/shared/types/evaluationRun.*` and added normalized JSON export without persistence. Existing chat history lives separately in `src/main/services/historyStore.js` and `src/main/ipc/history.ipc.js` using a thread/message model. Main IPC registration is centralized in `src/main/ipc/bootstrap.js`. Preload modules are registered from `src/preload/index.ts`, which is bundled to `src/preload/preload.dist.js` by `npm run preload:build`.

## Affected modules
- Shared EvaluationRun types: storage-level record and summary guards.
- Shared IPC: bounded EvaluationRun channel constants and response/request types.
- Main storage: new EvaluationRun file-backed store.
- Main IPC: new save/list/read/delete handlers.
- Main bootstrap: register the new handlers once.
- Preload: new `window.evaluationRuns` module and entrypoint registration.
- Tests: store, IPC, preload, and guard coverage.
- Docs/planning/indexes: initiative/workpack, EP-JUDGE updates, architecture note, IPC index update.

## In scope
- Create `src/main/storage/evaluationRunStore.js`.
- Extend `src/shared/types/evaluationRun.ts` and `.js` with `EvaluationRunRecord`, `EvaluationRunSummary`, guards, and helper summary builders.
- Create `src/shared/ipc/evaluationRun.ipc.ts` and `.js`.
- Create `src/main/ipc/evaluationRun.ipc.js` and register it in `src/main/ipc/bootstrap.js`.
- Create `src/preload/modules/evaluationRun.js` and register it in `src/preload/index.ts`.
- Add tests in `tests/evaluationRunStore.test.js`, `tests/evaluationRunIpc.test.js`, and `tests/evaluationRunPreload.test.js`.
- Update EP-JUDGE-001 roadmap/workpack-map, architecture note, and IPC index.
- Keep the store under `userData/ai-dock/evaluations`.

## Out of scope
- EvaluationRun history UI.
- Automatic save after each Judge run.
- New sidebar entry.
- Search/filter UI.
- n8n integration.
- Storage migration.
- Full-text indexing.
- Cloud sync.
- Encryption changes.
- Provider/settings changes.
- Judge runtime pipeline changes.
- Existing chat history storage or IPC changes.
- Renderer changes.
- Package/dependency/build config changes.

## Allowed files
- `src/shared/types/evaluationRun.ts`
- `src/shared/types/evaluationRun.js`
- `src/shared/ipc/evaluationRun.ipc.ts`
- `src/shared/ipc/evaluationRun.ipc.js`
- `src/main/storage/evaluationRunStore.js`
- `src/main/ipc/evaluationRun.ipc.js`
- `src/main/ipc/bootstrap.js`
- `src/preload/modules/evaluationRun.js`
- `src/preload/index.ts`, only for registering the new preload module because this repo has a TypeScript preload entrypoint.
- `tests/evaluationRunStore.test.js`
- `tests/evaluationRunIpc.test.js`
- `tests/evaluationRunPreload.test.js`
- `docs/planning/initiatives/IN-2026-034-evaluation-run-history-store/**`
- `docs/planning/workpacks/WP-JUDGE-007B-evaluation-run-history-store/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`, only for a short implementation note.
- `docs/_indexes/ipc-index.md`, only for the required IPC index update.

## Forbidden files
- `src/main/services/historyStore.js`
- `src/main/ipc/history.ipc.js`
- `src/main/storage/historyFs.js`
- `src/main/services/judgePipeline.js`
- `src/main/ipc/judge.ipc.js`
- `src/main/ipc/export.ipc.js`
- `src/renderer/**`
- `src/shared/prompts/judge/**`
- `src/shared/presets/evaluation/**`
- `src/main/providers/**`
- `src/main/services/settings.js`
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

## IPC impact
Adds exactly four shared IPC channels:
- `evaluationRun:save`
- `evaluationRun:list`
- `evaluationRun:read`
- `evaluationRun:delete`

Handlers must return `{ ok: true, ... }` or `{ ok: false, code, error }` with stable codes: `invalid_payload`, `not_found`, `storage_failed`, `unknown`. No stack traces should be returned to renderer by default.

## Preload impact
Expose a minimal `window.evaluationRuns` namespace:
- `save(runOrRecord)`
- `list({ limit, offset })`
- `read(id)`
- `delete(id)`

Inputs are sanitized before `ipcRenderer.invoke`. The API must not expose arbitrary channel invocation.

## Renderer impact
None. No UI, no Zustand, no renderer consumer in this workpack.

## Store impact
New standalone EvaluationRun store only. Existing chat history files and services remain untouched.

## Data/storage impact
Storage layout:
- `userData/ai-dock/evaluations/index.json`
- `userData/ai-dock/evaluations/runs/<runId>.json`

Record shape:
- `id`
- `createdAt`
- `updatedAt`
- `title`
- `evaluationType`
- `questionPreview`
- `subjectCount`
- `validatorSummary`
- `metadataSummary`
- `run`

Summary shape:
- `id`
- `createdAt`
- `updatedAt`
- `title`
- `evaluationType`
- `questionPreview`
- `subjectCount`
- `scoreSummary`
- `validatorSummary`
- `metadataSummary`

## Security impact
- Sandbox and contextIsolation remain unchanged.
- Renderer still has no Node access.
- New preload API is bounded and sanitized.
- List summaries omit full subject content, `rawResponse`, and custom prompt.
- IPC error responses use stable codes and safe messages without stacks.
- No token/auth/provider secret fields are added.

## PLAN conclusion
1. EvaluationRun store must be separate from chat history because it persists evaluation artifacts, not conversation threads/messages.
2. Storage layout is file-per-run plus index under `userData/ai-dock/evaluations`.
3. File-per-run is chosen for easier read/delete/rollback and future list performance.
4. IPC channels are bounded to save/list/read/delete and are enough for current storage API.
5. Preload API is `window.evaluationRuns` with four matching methods.
6. Backward compatibility is preserved by storing existing `EvaluationRunExport` envelopes without changing export IPC or Judge runtime.
7. Rollback removes the new store/IPC/preload/tests/docs; runtime data remains isolated and can be manually deleted if desired.
8. Summary privacy is enforced by deriving compact summaries with no full subjects, `rawResponse`, or custom prompt.
9. Exact files are listed above, including actual `src/preload/index.ts` and IPC index update.
10. Tests are store, IPC, preload, and guard-focused.
11. Strong gate: none active. Stop if implementation requires chat history changes, DB/migration/dependency/package changes, Judge pipeline changes, renderer UI, or channels beyond the approved four.

## Step-by-step plan
1. Create initiative artifacts, workpack, and prompt-pack.
2. Extend shared EvaluationRun types with record/summary guards and summary helpers.
3. Add shared EvaluationRun IPC constants and typed request/response definitions.
4. Implement `evaluationRunStore` with file-per-run persistence, atomic writes, index maintenance, missing-index recovery, and privacy-safe summaries.
5. Implement main IPC handlers with stable ok/fail responses and no stack traces.
6. Register the IPC module in main bootstrap.
7. Implement and register preload `window.evaluationRuns`.
8. Add targeted tests for guard/store/IPC/preload behavior.
9. Update EP-JUDGE roadmap/workpack-map, architecture note, and IPC index.
10. Run required verification commands and scope checks.
11. Finalize run-state, task queue, gates, delivery report, and REVIEW verdict.

## Acceptance criteria
- [x] Initiative artifacts and workpack validate.
- [x] Separate EvaluationRun store exists and persists valid runs.
- [x] Store list returns summaries without full subject content, `rawResponse`, or custom prompt.
- [x] Store read returns full record.
- [x] Store delete removes run file and index entry.
- [x] Missing read returns not found/null behavior.
- [x] Invalid run is rejected.
- [x] Shared record and summary guards accept valid data and reject invalid data.
- [x] Main IPC handlers return stable ok/fail shapes.
- [x] Main IPC invalid payload returns `invalid_payload`.
- [x] Main IPC missing read/delete returns `not_found`.
- [x] Main IPC errors do not include stack traces.
- [x] Preload sanitizes id and paging.
- [x] Preload rejects invalid save payload.
- [x] Preload exposes no arbitrary invoke.
- [x] Chat history, Judge pipeline, export IPC, renderer, provider/settings, package files remain untouched.
- [x] EP-JUDGE planning docs and architecture note updated.

## Test plan
- Targeted:
  - `node --test tests/evaluationRunStore.test.js tests/evaluationRunIpc.test.js tests/evaluationRunPreload.test.js`
- Full:
  - `npm test`
- Syntax/build:
  - `node --check src/main/storage/evaluationRunStore.js`
  - `node --check src/main/ipc/evaluationRun.ipc.js`
  - `node --check src/shared/types/evaluationRun.js`
  - `node --check src/shared/ipc/evaluationRun.ipc.js`
  - `npm run preload:build`
  - `npm run build`

## Verification commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-034-evaluation-run-history-store`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-007B-evaluation-run-history-store/workpack.md`
- `node --check src/main/storage/evaluationRunStore.js`
- `node --check src/main/ipc/evaluationRun.ipc.js`
- `node --check src/shared/types/evaluationRun.js`
- `node --check src/shared/ipc/evaluationRun.ipc.js`
- `node --test tests/evaluationRunStore.test.js tests/evaluationRunIpc.test.js tests/evaluationRunPreload.test.js`
- `npm test`
- `npm run preload:build`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main/services/historyStore.js src/main/ipc/history.ipc.js src/main/storage/historyFs.js src/main/services/judgePipeline.js src/main/ipc/judge.ipc.js src/main/ipc/export.ipc.js src/renderer package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Manual smoke checklist
- [ ] `npm run dev:app`
- [ ] App starts without duplicate IPC handler errors.
- [ ] Existing Judge screen opens.
- [ ] Existing export still works.
- [ ] No visible UI for EvaluationRun history yet; expected.
- [ ] Chat/Form Profiles/History/Connections still open.
- [ ] BrowserView tabs still work.

## Docs/index updates required
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/_indexes/ipc-index.md`

## Docs impact
Creates `IN-2026-034` artifacts and `WP-JUDGE-007B` prompt-pack. Updates EP-JUDGE-001 to mark the History Store slice separately from later UI integration, adds a short architecture note, and records the new IPC surface in the IPC index.

## Rollback
Revert the new shared IPC contract, storage service, main IPC module/registration, preload module/registration, shared storage-level guards, targeted tests, and docs/index updates. No chat history files or migrations are involved. Runtime data is isolated at `userData/ai-dock/evaluations` and can be left in place or manually removed outside code rollback.

## Done criteria
- [x] Acceptance criteria met.
- [x] Required verification commands executed or explicitly marked blocked with reason.
- [x] Runtime scope check confirms forbidden paths unchanged.
- [x] Delivery report finalized.
- [x] REVIEW verdict recorded as GO or Conditional GO.

## Risks
- Manual Electron smoke may remain pending.
- Full records contain evaluation subject content by design; summary privacy must remain enforced.
- Missing or corrupt index rebuild adds complexity; tests must cover missing-index behavior.
- Future UI still needs a separate workpack to make this usable from the renderer.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
