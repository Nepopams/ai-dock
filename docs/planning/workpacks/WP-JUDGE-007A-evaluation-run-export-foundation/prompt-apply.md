# Prompt Apply: WP-JUDGE-007A EvaluationRun Export Foundation

## Objective
Implement the scoped export foundation in the allowed paths only.

## Apply scope
- Create `src/shared/types/evaluationRun.ts`.
- Create `src/shared/types/evaluationRun.js`.
- Update `src/main/ipc/export.ipc.js` to:
  - discover criteria from score buckets;
  - render validator findings;
  - render safe metadata;
  - omit raw response from Markdown by default;
  - write JSON with legacy top-level fields plus `evaluationRun`.
- Update `src/preload/utils/judge.js` only if needed for metadata/validator preservation.
- Add/update targeted tests:
  - `tests/evaluationRun.test.js`
  - `tests/judge-export.test.js`
  - `tests/judge-preload.test.js`
- Update EP-JUDGE-001 roadmap/map and architecture implementation note.
- Finalize initiative/workpack run-state, gates, and delivery report.

## Guardrails
- Do not add IPC channels.
- Do not change `src/shared/ipc/**`.
- Do not change `src/preload/modules/**`.
- Do not change `src/main/storage/**`.
- Do not change `src/main/services/judgePipeline.js`.
- Do not change providers, settings, package files, dependencies, build config, scripts, or Electron builder config.
- Do not implement EvaluationRun history store, list/open/delete APIs, persistence, database, or migration.
- Do not redesign Evaluation Studio UI.
- Do not duplicate `rawResponse` into normalized `evaluationRun` by default.
