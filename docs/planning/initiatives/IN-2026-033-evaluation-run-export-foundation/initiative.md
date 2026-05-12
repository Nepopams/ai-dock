# Initiative: IN-2026-033 EvaluationRun Export Foundation

## Initiative ID
`IN-2026-033-evaluation-run-export-foundation`

## Title
EvaluationRun Export Foundation

## Status
Done

## Owner
Human + Codex

## Goal
Introduce a normalized EvaluationRun export foundation for Judge Mode while improving Judge Markdown and JSON exports without adding EvaluationRun history storage, new IPC channels, database work, or storage migration.

## User value
Users get a richer export for an evaluation result, including dynamic score criteria, validator findings, and safe run metadata. Future History and workflow layers get a stable export envelope to build on without treating this workpack as persistence.

## Problem
The current Judge export is still tied to the prototype `JudgeExportPayload` and Markdown hard-codes `coherence`, `factuality`, and `helpfulness`. Validator findings and metadata exist in `JudgeResult`, but the Markdown report does not present them as first-class sections. A normalized export shape is needed before later History or n8n work can safely consume EvaluationRun artifacts.

## Human approval context
The human approved moving toward `WP-JUDGE-007 EvaluationRun History and Export` with an explicit split:
- `WP-JUDGE-007A EvaluationRun Export Foundation`: execute now.
- `WP-JUDGE-007B EvaluationRun History Store`: prepare as a follow-up only, do not implement in this workpack.

## Success criteria
- [x] Initiative artifacts exist and validate.
- [x] `WP-JUDGE-007A-evaluation-run-export-foundation` exists with prompt-pack.
- [x] PLAN answers all required EvaluationRun export questions.
- [x] Shared EvaluationRun export type and dependency-free guards exist.
- [x] Current `JudgeExportPayload` can be mapped to normalized EvaluationRun export shape.
- [x] Markdown export uses criteria discovered from actual score buckets.
- [x] Markdown export renders validator findings and safe metadata.
- [x] Markdown export does not include raw response by default.
- [x] JSON export keeps existing `window.exporter.judgeJson(payload)` compatibility and includes `evaluationRun`.
- [x] Targeted tests cover mapper, guards, Markdown, JSON, metadata, validator findings, and raw response behavior.
- [x] EP-JUDGE-001 roadmap/workpack map identify `WP-JUDGE-007A` separately from `WP-JUDGE-007B`.
- [x] No new IPC channels, history storage, storage migration, provider/settings changes, package changes, or dependency changes.

## In scope
- Create file-backed initiative artifacts.
- Create the `WP-JUDGE-007A` workpack and prompt-pack.
- Execute PLAN, Gate Evaluation, APPLY, QA, REVIEW, and delivery reporting.
- Add shared EvaluationRun export type and runtime guard.
- Add a pure mapper from current Judge export payload to EvaluationRun export shape.
- Improve Judge Markdown export sections and criteria rendering.
- Improve Judge JSON export by adding a normalized `evaluationRun` envelope while preserving legacy top-level fields.
- Preserve and sanitize existing validator results and metadata through the existing export path.
- Add targeted tests.
- Update EP-JUDGE-001 roadmap/workpack-map and a short architecture implementation note.

## Out of scope
- EvaluationRun storage/history implementation.
- New list/open/delete history APIs.
- New IPC channels.
- n8n integration.
- File import or source picker.
- Full preset picker.
- Provider settings changes.
- Runtime Judge pipeline changes.
- `src/main/storage/**` changes.
- `src/main/services/judgePipeline.js` changes.
- `package.json` or dependency changes.

## Constraints
- Use existing `export:judge:md` and `export:judge:json` channels.
- Do not change preload bridge API shape or add channels.
- Do not implement storage, persistence, migration, or EvaluationRun database work.
- Do not touch forbidden files listed in the workpack.
- Guard functions must be dependency-free.
- JSON export must remain backward compatible for existing callers.
- Raw response must not be rendered into Markdown by default.

## Strong human gate triggers
- A new IPC channel is required.
- New storage, history format, database, or migration is required.
- `src/main/storage/**` must change.
- `src/main/services/judgePipeline.js`, provider, or settings model must change.
- `src/preload/modules/**` or `src/shared/ipc/**` must change.
- `package.json`, lockfile, build config, scripts, or dependencies must change.
- The implementation needs to expand beyond `WP-JUDGE-007A` into `WP-JUDGE-007B`.

## Candidate epics
- `EP-JUDGE-001 Judge Mode / Evaluation Studio MVP`

## Workpack queue
- `WP-JUDGE-007A-evaluation-run-export-foundation`: current scoped APPLY.
- `WP-JUDGE-007B EvaluationRun History Store`: follow-up only, not created or implemented here.

## Risks
- Existing `JudgeScore` compatibility guards still constrain runtime Judge scores to current criteria; this workpack makes export rendering dynamic over the criteria actually present in accepted payloads.
- JSON backward compatibility means the legacy top-level `result` can still carry `rawResponse`; the normalized `evaluationRun` avoids duplicating it by default.
- Manual Electron smoke remains required after automated verification.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-JUDGE-007A-evaluation-run-export-foundation/workpack.md`
