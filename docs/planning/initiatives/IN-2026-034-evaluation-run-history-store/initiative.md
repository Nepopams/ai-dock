# Initiative: IN-2026-034 EvaluationRun History Store

## Initiative ID
`IN-2026-034-evaluation-run-history-store`

## Title
EvaluationRun History Store

## Status
Done

## Owner
Human + Codex

## Goal
Add a separate file-backed store for Judge Mode `EvaluationRun` records with bounded save, list, read, and delete APIs, without mixing EvaluationRun data into chat history and without implementing a history UI.

## User value
Users and future workpacks gain a stable way to persist Judge/Evaluation Studio results as first-class EvaluationRun records. Later UI and workflow work can list, open, export, or consume these records without depending on transient export payloads.

## Problem
`IN-2026-033` added a normalized `EvaluationRunExport` shape and export foundation, but the app still cannot persist evaluation runs. Chat history storage uses a thread/message domain and should not become the storage model for Judge evaluation records.

## Human approval context
The human explicitly approved the next Judge Mode workpack:
- `WP-JUDGE-007B EvaluationRun History Store`.
- Scope is L3 data/storage-sensitive runtime APPLY.
- The workpack must not implement EvaluationRun history UI, chat history migration, n8n integration, provider/settings changes, or dependency changes.

## Success criteria
- [x] Initiative artifacts exist and validate.
- [x] `WP-JUDGE-007B-evaluation-run-history-store` exists with prompt-pack.
- [x] PLAN answers all required storage, IPC, preload, rollback, privacy, file, test, and gate questions.
- [x] A separate EvaluationRun storage service exists under `src/main/storage/evaluationRunStore.js`.
- [x] Storage layout is file-per-run with an index under `userData/ai-dock/evaluations`.
- [x] Shared EvaluationRun storage-level guards/types exist.
- [x] Shared EvaluationRun IPC constants exist.
- [x] Main IPC handlers expose only save/list/read/delete and return stable ok/fail shapes.
- [x] Preload exposes only a minimal `window.evaluationRuns` API.
- [x] List summaries exclude full subject content, `rawResponse`, and custom prompts.
- [x] Existing chat history storage and Judge runtime pipeline are untouched.
- [x] Targeted store, IPC, preload, and guard tests pass.
- [x] EP-JUDGE-001 roadmap/workpack map and architecture note are updated.

## In scope
- Create initiative artifacts.
- Create the `WP-JUDGE-007B` workpack and prompt-pack.
- Execute PLAN, Gate Evaluation, APPLY, QA, REVIEW, and delivery reporting.
- Create a separate file-backed EvaluationRun store.
- Add storage-level EvaluationRun record/summary guards.
- Add shared IPC constants and response types for EvaluationRun history.
- Add main IPC handlers and register them in main bootstrap.
- Add a minimal preload API module and required preload registration.
- Add targeted tests for store, IPC, preload, and shared guards.
- Update EP-JUDGE-001 planning docs and a short architecture implementation note.

## Out of scope
- EvaluationRun history UI.
- Automatic save after every Judge run.
- New sidebar entry.
- Search/filter UI.
- n8n integration.
- Storage migration.
- Full-text indexing.
- Cloud sync.
- Encryption changes.
- Provider/settings changes.
- Judge runtime pipeline changes.
- Package/dependency changes.

## Constraints
- Do not mix EvaluationRun records with chat history.
- Do not change existing chat history storage or IPC.
- Do not change Judge runtime pipeline.
- Do not change provider/settings model.
- Do not add dependencies.
- Do not change `package.json` or `package-lock.json`.
- Do not implement UI in this workpack.
- Do not implement database or migration.
- Use bounded channels only: `evaluationRun:save`, `evaluationRun:list`, `evaluationRun:read`, `evaluationRun:delete`.
- Do not expose arbitrary IPC invocation through preload.
- Store summaries must not include full subject content, `rawResponse`, or custom prompt text.

## Strong human gate triggers
- Need to change chat history storage or chat history IPC.
- Need a database, migration, dependency, package, or lockfile change.
- Need to change Judge runtime pipeline or provider/settings model.
- Need to implement renderer history UI.
- Storage path or lifecycle cannot be decided from current context.
- Rollback plan is unclear or impossible.
- New channels beyond save/list/read/delete are required.
- Required runtime changes fall outside the workpack allowed paths.

## Candidate epics
- `EP-JUDGE-001 Judge Mode / Evaluation Studio MVP`

## Workpack queue
- `WP-JUDGE-007B-evaluation-run-history-store`: current scoped APPLY.
- Future `WP-JUDGE-007C` or equivalent: EvaluationRun History View/UI integration.
- Future n8n EvaluationRun consumption: out of this initiative.

## Risks
- File-backed storage touches userData and needs careful rollback and path discipline.
- EvaluationRun records can contain full subjects; list summaries must stay privacy-safe.
- Preload registration uses the actual repo entrypoint `src/preload/index.ts`, while the prompt named an `.js` equivalent.
- Manual Electron smoke remains required after automated checks.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-JUDGE-007B-evaluation-run-history-store/workpack.md`
