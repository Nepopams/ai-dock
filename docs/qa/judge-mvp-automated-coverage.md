# Judge MVP Automated Coverage

Status: QA source of truth created by `IN-2026-037` / `WP-JUDGE-008`.

## Purpose
This document consolidates automated Judge MVP coverage that was previously spread across workpack delivery reports. It distinguishes automated proof from manual product smoke.

## Existing Tests
| Area | File | Covers | Does not cover | Related workpack | Verification command |
| --- | --- | --- | --- | --- | --- |
| judge-types | `tests/judge-types.test.js` | Judge input/result/export guards, validation config/validator guards, legacy criterion guard, metadata compatibility. | React UI rendering, real IPC, provider calls, OS dialogs. | `WP-JUDGE-001`, `WP-JUDGE-003`, `WP-JUDGE-004`, `WP-JUDGE-007A` | `node --test tests/judge-types.test.js` |
| judge-preload | `tests/judge-preload.test.js` | Preload sanitizers for Judge input/export payloads, custom prompt, JSON validation normalization, dynamic score criteria in sanitized results, metadata redaction. | Real Electron contextBridge, visible UI behavior, real provider call. | `WP-JUDGE-001`, `WP-JUDGE-003`, `WP-JUDGE-004`, `WP-JUDGE-007A` | `node --test tests/judge-preload.test.js` |
| judge-pipeline | `tests/judge-pipeline.test.js` | Prompt assembly, custom rubric/instructions metadata, JSON validator valid/invalid/missing/fenced/enum cases, fallback metadata. | Real completions provider availability, network failure behavior, live model quality. | `WP-JUDGE-001`, `WP-JUDGE-003`, `WP-JUDGE-004` | `node --test tests/judge-pipeline.test.js` |
| judge-ipc | `tests/judge-ipc.test.js` | Judge IPC helper stable error codes and redacted details. | Real ipcMain registration inside Electron app runtime, renderer-visible error UI. | `WP-JUDGE-001` | `node --test tests/judge-ipc.test.js` |
| judge-export | `tests/judge-export.test.js` | Markdown dynamic criteria, validator findings in Markdown, raw response omission in Markdown, JSON export with legacy fields and `evaluationRun`. | Real save dialog, file picker/export path UX, user-selected filesystem permissions. | `WP-JUDGE-007A` | `node --test tests/judge-export.test.js` |
| evaluationRun | `tests/evaluationRun.test.js` | EvaluationRun mapper and guards, safe metadata, validator result mapping, raw response omission by default. | UI save/open/delete flow, storage persistence, Electron IPC. | `WP-JUDGE-007A` | `node --test tests/evaluationRun.test.js` |
| evaluationRunStore | `tests/evaluationRunStore.test.js` | File-backed save/list/read/delete, privacy-safe summaries, missing reads/deletes, invalid payload rejection, index rebuild. | Renderer UI list refresh, OS-level disk failures, migration from future schemas. | `WP-JUDGE-007B` | `node --test tests/evaluationRunStore.test.js` |
| evaluationRunIpc | `tests/evaluationRunIpc.test.js` | Bounded EvaluationRun IPC handlers, ok response shapes, stable errors without stacks. | Real Electron process lifecycle, duplicate handler warnings during app startup. | `WP-JUDGE-007B` | `node --test tests/evaluationRunIpc.test.js` |
| evaluationRunPreload | `tests/evaluationRunPreload.test.js` | Bounded preload API surface, save/list/read/delete channel usage, list clamping, id normalization, invalid payload/id rejection. | Real contextBridge exposure inside the packaged app, visible renderer usage. | `WP-JUDGE-007B` | `node --test tests/evaluationRunPreload.test.js` |
| evaluationPresets | `tests/evaluationPresets.test.js` | Preset catalog parses, required MVP preset ids exist, unique criteria, validator types, custom/validator semantics, no main/preload/renderer imports. | Preset picker UI, runtime prompt selection for every preset, model quality. | `WP-JUDGE-002` | `node --test tests/evaluationPresets.test.js` |
| completionsProfileLabels | `tests/completionsProfileLabels.test.js` | Cloud/API, localhost, loopback, private network, generic HTTP, invalid URL, token omission, privacy hint wording. | Real Connections/Judge dropdown rendering, endpoint reachability, privacy guarantee. | `WP-JUDGE-005` | `node --test tests/completionsProfileLabels.test.js` |
| judgeDynamicCriteria | `tests/judgeDynamicCriteria.test.js` | Criteria discovery from `judgeResult.scores`, default ordering, extra criteria first-seen ordering, trim/dedupe, invalid/empty filtering, empty result handling. | Full React table rendering, saved-run UI open flow, label catalog. | `IN-2026-036` | `node --test tests/judgeDynamicCriteria.test.js` |
| judgeQaDocs | `tests/judgeQaDocs.test.js` | Required QA docs exist, smoke suite headings A-J exist, automated coverage doc references expected test files, release confidence sections exist. | Product behavior, Electron UI, provider calls, OS dialogs. | `WP-JUDGE-008` | `node --test tests/judgeQaDocs.test.js` |

## Automated Gaps
- Electron UI navigation.
- Real provider call.
- Real save dialog.
- File dialog export.
- BrowserView tabs.
- Local LLM endpoint smoke.
- Duplicate IPC handler errors during full app startup.
- Visual progress states during Judge runs.
- Real saved EvaluationRun open/delete interaction from the Studio list.
- Real Markdown/JSON exported file inspection after user-chosen save paths.

## Interpretation
- `npm test` is the automated regression baseline for Judge MVP internals.
- `npm run build` is the renderer/build confidence baseline.
- Manual smoke remains required before product-smoked release confidence.
