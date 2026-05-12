# Orchestration Plan: IN-2026-034 EvaluationRun History Store

## Initiative summary
Deliver `WP-JUDGE-007B EvaluationRun History Store`: a separate, file-backed persistence layer and bounded IPC/preload API for normalized EvaluationRun records. This work does not implement a history UI, does not alter chat history, and does not change Judge execution.

## Assumptions
- `EvaluationRunExport` from `IN-2026-033` is the stable run envelope for persistence.
- The existing Electron `app.getPath("userData")` path is the correct base for local app data.
- A file-per-run layout with an index is safer for read/delete/rollback than a JSONL blob for this domain.
- The repo preload source of truth is `src/preload/index.ts`; the prompt's `index.js` allowance maps to this actual source file for module registration.
- The IPC index should be updated because new IPC channels are added, even though this is a docs-only index update.

## Selected delivery mode
L3 data/storage-sensitive runtime APPLY.

This is a bounded storage, shared contract, main IPC, preload, test, and docs workpack. It deliberately excludes renderer UI, Judge pipeline, provider/settings, package, dependency, database, migration, and chat history changes.

## Epic breakdown
- Epic ID: `EP-JUDGE-001`
- Title: Judge Mode / Evaluation Studio MVP
- Current slice: `WP-JUDGE-007B EvaluationRun History Store`
- Dependency: `WP-JUDGE-007A` normalized export foundation.
- Follow-up: history UI/integration workpack after this storage API exists.

## Sprint mapping
No separate sprint folder is required. EP-JUDGE roadmap slice 4B tracks this workpack.

## Workpack queue
| Workpack ID | Type | Purpose | Dependency | Expected status |
| --- | --- | --- | --- | --- |
| `WP-JUDGE-007B-evaluation-run-history-store` | Runtime storage/shared/IPC/preload/test/docs | Persist EvaluationRun records separately from chat history with save/list/read/delete. | `WP-JUDGE-007A` export foundation. | Done after APPLY/REVIEW |
| `WP-JUDGE-007C EvaluationRun History View` | Future renderer/UI | Build UI to save/open/list EvaluationRun records. | `WP-JUDGE-007B`. | Follow-up only |

## Executor routing
- Selected executor: `ai-dock-history-exporter-executor`.
- Primary responsibility: EvaluationRun persistence model and export/history boundary.
- Secondary executors:
  - `ai-dock-main-process-executor`: storage service and main IPC registration.
  - `ai-dock-preload-ipc-executor`: shared IPC constants and preload bridge.
  - `ai-dock-ipc-security-reviewer`: channel bounds, sanitizer, no stack/secrets.
  - `ai-dock-test-qa-executor`: targeted tests and build verification.

## Gate plan
- Gate A Scope: satisfied by the human prompt and recorded in `gates.md`.
- Gate B Plan: proceed to APPLY if PLAN finds no strong gate.
- Gate C Apply: verify diff stays inside the workpack paths and forbidden paths stay untouched.
- Gate D Review: verify tests/build, privacy properties, and delivery report.

## PLAN answers
1. EvaluationRun store must be separate from chat history because chat history is a thread/message conversation model, while EvaluationRun is an immutable evaluation artifact with scores, validator findings, subjects, metadata, and export semantics.
2. Storage layout: `userData/ai-dock/evaluations/runs/<runId>.json` plus `userData/ai-dock/evaluations/index.json`.
3. File-per-run is chosen because read/delete/rollback are simple, records may be larger than chat messages, and list UI can read compact summaries from the index without loading full run content.
4. Required IPC channels are bounded to `evaluationRun:save`, `evaluationRun:list`, `evaluationRun:read`, and `evaluationRun:delete`. These are the minimum CRUD operations requested and do not expose search, migration, import, or arbitrary filesystem access.
5. Preload API: expose `window.evaluationRuns.save(run)`, `list({ limit, offset })`, `read(id)`, and `delete(id)` using existing module conventions and sanitized inputs.
6. Backward compatibility with the export foundation is preserved by storing `EvaluationRunExport` directly as `record.run`; the export mapper and current JSON export remain unchanged.
7. Rollback plan: remove the new store, IPC contract, IPC registration, preload module/registration, tests, and docs. Runtime data is isolated under `userData/ai-dock/evaluations`, so rollback does not touch chat history or provider settings.
8. List summaries do not expose full subject content, `rawResponse`, or custom prompt text. They keep only title, question preview, subject count, score summary, validator summary, and a safe metadata summary.
9. Exact files planned for change are listed in the workpack, including the actual preload entrypoint `src/preload/index.ts` and governance-required `docs/_indexes/ipc-index.md`.
10. Tests: `tests/evaluationRunStore.test.js`, `tests/evaluationRunIpc.test.js`, `tests/evaluationRunPreload.test.js`, plus storage-level guard assertions in the new tests.
11. Strong gate: none active after PLAN. The path normalization for `src/preload/index.ts` and IPC index update are recorded as soft gates because they are required by current repo architecture and governance, and they do not expand runtime scope beyond the approved preload/API work.

## Verification strategy
- Initiative/workpack validators.
- `node --check` on changed JS runtime/shared/preload files.
- Targeted node tests for store, IPC, and preload.
- Full `npm test`.
- `npm run preload:build`.
- `npm run build`.
- Git diff/status/scope checks, including forbidden paths.

## Risk register
| Risk | Impact | Mitigation | Status |
| --- | --- | --- | --- |
| Full subject content leaks in list | Sensitive evaluation inputs visible in summaries | Summary builder excludes subjects, raw response, and custom prompt; tests assert absence | Open until review |
| Store corrupts index | List becomes inaccurate | Rebuild index from run files when index is missing or invalid | Open until tests |
| IPC exposes stack traces | Renderer sees internal paths/secrets | IPC fail helper returns stable code and safe message only | Open until tests |
| Preload path mismatch | Registration may require source file not named in prompt | Use actual `src/preload/index.ts` and record soft gate | Accepted |
| Chat history coupling | Evaluation runs accidentally share chat history model | Do not import or change chat history files; scope check forbidden paths | Open until review |
