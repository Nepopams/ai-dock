# Workpack: WP-JUDGE-007A EvaluationRun Export Foundation

## Workpack ID
`WP-JUDGE-007A-evaluation-run-export-foundation`

## Title
EvaluationRun Export Foundation

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped shared/export/renderer/test APPLY

## Type
Runtime shared/export/test/docs

## Selected executor
`ai-dock-history-exporter-executor`

## Primary skill
`ai-dock-history-exporter-executor`

## Secondary executors
- `ai-dock-ipc-security-reviewer`
- `ai-dock-test-qa-executor`
- `ai-dock-renderer-react-executor`, only if `CompareView` export payload assembly needs a tiny compatibility update.

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
- `docs/planning/initiatives/IN-2026-032-evaluation-studio-ui-shell/delivery-report.md`
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/shared/ipc/export.ipc.ts`
- `src/shared/ipc/export.ipc.js`
- `src/preload/utils/judge.js`
- `src/preload/modules/exporter.js`
- `src/main/ipc/export.ipc.js`
- `src/main/services/exporter.js`
- `src/main/storage/historyFs.js`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `tests/**/*`
- `package.json`

## Goal
Create the first normalized EvaluationRun export foundation for Judge Mode and improve Judge Markdown/JSON exports without adding history storage, new IPC channels, database/storage migration, n8n integration, or Judge runtime pipeline changes.

## User value
Users receive more complete Judge export reports with dynamic criteria, validator findings, safe metadata, and a normalized JSON envelope that future History or workflow layers can consume.

## Current architecture context
Judge Mode currently exports Markdown and JSON through existing `window.exporter` methods backed by `src/preload/modules/exporter.js` and `src/main/ipc/export.ipc.js`. The current export payload is `JudgeExportPayload` with `question`, `answers`, `result`, and `generatedAt`. `JudgeResult` can already carry `validatorResults` and `metadata`. Markdown export hard-codes three criteria and includes `rawResponse` when present. Chat history storage exists in `src/main/storage/historyFs.js`, but it is not EvaluationRun storage and must not be changed here.

## Affected modules
- Shared export types: new EvaluationRun export shape and guards.
- Main export IPC: Markdown/JSON formatting on existing channels.
- Preload sanitizer: preserve current export metadata/validator behavior; change only if needed.
- Tests: targeted export, mapper, guard, and sanitizer assertions.
- Docs/planning: initiative/workpack/epic/architecture notes.

## In scope
- Create `src/shared/types/evaluationRun.ts` and `.js`.
- Add dependency-free runtime guards and mapper from current `JudgeExportPayload` to EvaluationRun export shape.
- Use dynamic criteria discovered from actual score buckets in Markdown.
- Render explicit `Validator Findings` section when validator results exist.
- Render safe `Metadata` section.
- Omit `rawResponse` from Markdown by default.
- Add `evaluationRun` to JSON export while preserving legacy top-level fields.
- Add targeted tests.
- Update EP-JUDGE-001 roadmap/workpack map.
- Add a short implementation note to the Judge architecture report.

## Out of scope
- EvaluationRun storage/history.
- New list/open/delete history APIs.
- New IPC channels.
- n8n integration.
- File import/source picker.
- Full preset picker.
- Provider settings.
- Runtime Judge pipeline.
- Dependency/package/build config changes.
- Evaluation Studio UI redesign.
- Preload bridge channel changes.

## Allowed files
- `src/shared/types/evaluationRun.ts`
- `src/shared/types/evaluationRun.js`
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`, only if adding optional export compatibility fields is necessary
- `src/preload/utils/judge.js`
- `src/main/ipc/export.ipc.js`
- `src/renderer/react/views/CompareView.tsx`, only if export payload construction needs minimal change
- `tests/evaluationRun.test.js`
- `tests/judge-preload.test.js`
- `tests/judge-export.test.js`
- `docs/planning/initiatives/IN-2026-033-evaluation-run-export-foundation/**`
- `docs/planning/workpacks/WP-JUDGE-007A-evaluation-run-export-foundation/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`, only for a short implementation note

## Forbidden files
- `src/main/storage/**`
- `src/main/services/judgePipeline.js`
- `src/main/services/settings.js`
- `src/main/providers/**`
- `src/preload/modules/**`
- `src/shared/ipc/**`
- `src/shared/prompts/judge/**`
- `src/shared/presets/evaluation/**`
- `src/renderer/react/views/EvaluationStudioView.tsx`
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
- `src/main/ipc/export.ipc.js`
- `tests/evaluationRun.test.js`
- `tests/judge-preload.test.js`
- `tests/judge-export.test.js`
- `docs/planning/initiatives/IN-2026-033-evaluation-run-export-foundation/**`
- `docs/planning/workpacks/WP-JUDGE-007A-evaluation-run-export-foundation/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`

## IPC impact
None. This workpack must use the existing `export:judge:md` and `export:judge:json` channels only.

## Preload impact
No new preload API or channel. Existing `window.exporter.judgeMarkdown(payload)` and `window.exporter.judgeJson(payload)` must keep working. `src/preload/utils/judge.js` may be touched only to preserve/sanitize existing export metadata or validator fields if needed.

## Renderer impact
Expected none. `CompareView` already provides the current export payload. If a tiny compatibility update becomes necessary, it is limited to export payload assembly and no UI redesign.

## Store impact
None.

## Data/storage impact
None. EvaluationRun is introduced as export shape only. No storage ID lifecycle, persistence fields, migration, database, list/open/delete APIs, or `src/main/storage/**` changes.

## Security impact
- Sandbox/contextIsolation unchanged.
- No renderer Node access.
- No new IPC or bridge API.
- No token/auth/provider secret fields added to exports.
- Markdown omits `rawResponse` by default.
- Metadata section is restricted to safe fields: profile id, driver, model, validation mode, parse state, duration, custom prompt flag, and rubric source.

## PLAN conclusion
1. EvaluationRun export foundation in this workpack is a normalized export-only shape derived from current Judge export payloads. It is not a saved run model.
2. History storage is excluded because it requires storage format, migration/rollback, privacy, and list/open/delete decisions. That is `WP-JUDGE-007B`.
3. Existing export IPC channels are sufficient and must be reused.
4. Shared IPC and preload modules do not need changes. Any need to change them is a STOP condition.
5. Chosen shape: `runId`, `schemaVersion`, `createdAt`, `source`, `evaluationType`, `question`, `subjects`, `result`, `validatorResults`, `metadata`, `exportOptions`.
6. Backward compatibility: keep existing exporter methods and legacy JSON top-level fields, adding `evaluationRun` additively.
7. Validator results render as their own Markdown section.
8. Criteria render by discovery from actual score buckets.
9. Markdown does not include `rawResponse` by default. JSON legacy top-level result may still include it for compatibility; normalized `evaluationRun` avoids duplicating it.
10. Exact files are listed in Expected file changes.
11. Tests are `tests/evaluationRun.test.js`, `tests/judge-export.test.js`, and targeted `tests/judge-preload.test.js` assertions.
12. Strong gate: none active. Stop if new IPC, storage/history, forbidden paths, provider/settings, Judge pipeline, package, or dependency changes become necessary.

## Step-by-step plan
1. Create initiative artifacts and prompt-pack.
2. Add shared EvaluationRun export type, guard, and mapper in JS/TS.
3. Update main Judge export formatting to use the mapper.
4. Render dynamic score criteria in Markdown.
5. Render validator findings and safe metadata in Markdown.
6. Keep raw response out of Markdown by default.
7. Write JSON with legacy top-level fields plus `evaluationRun`.
8. Add targeted tests for mapper/guards, export Markdown/JSON, and sanitizer preservation.
9. Update EP-JUDGE-001 roadmap/workpack-map and architecture note.
10. Run required verification commands and scope checks.
11. Update run-state, task queue, gates, delivery report, and workpack status.

## Acceptance criteria
- [x] Initiative artifacts and workpack validate.
- [x] EvaluationRun export type and guard exist in JS/TS.
- [x] Mapper accepts valid current Judge export payload.
- [x] Mapper preserves question, subjects, result summary/verdict/scores, validator results, and safe metadata.
- [x] Mapper rejects invalid payload.
- [x] Markdown renders dynamic criteria from actual score buckets.
- [x] Markdown renders validator findings.
- [x] Markdown renders safe metadata.
- [x] Markdown does not include `rawResponse` by default.
- [x] JSON export includes `evaluationRun` and legacy top-level fields.
- [x] Existing exporter API still works.
- [x] No new IPC channels.
- [x] No storage/history implementation.
- [x] No provider/settings/package/dependency changes.
- [x] EP-JUDGE-001 roadmap/workpack map updated.

## Test plan
- Unit tests:
  - `tests/evaluationRun.test.js`
  - `tests/judge-export.test.js`
  - `tests/judge-preload.test.js`
- Full test suite:
  - `npm test`
- Build:
  - `npm run preload:build`
  - `npm run build`
- Scope checks:
  - `git diff --check`
  - forbidden-path `git status --short -- ...`

## Verification commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-033-evaluation-run-export-foundation`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-007A-evaluation-run-export-foundation/workpack.md`
- `node --check src/shared/types/evaluationRun.js`
- `node --check src/main/ipc/export.ipc.js`
- `node --check src/preload/utils/judge.js`
- `node --test tests/evaluationRun.test.js tests/judge-preload.test.js tests/judge-export.test.js`
- `npm test`
- `npm run preload:build`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main/storage src/main/services/judgePipeline.js src/main/services/settings.js src/main/providers src/preload/modules src/shared/ipc src/shared/prompts/judge src/shared/presets/evaluation package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Manual smoke checklist
- [ ] `npm run dev:app`
- [ ] Open Judge / Evaluation Studio.
- [ ] Run Judge without JSON validation.
- [ ] Export Markdown.
- [ ] Export JSON.
- [ ] Run Judge with JSON validation findings.
- [ ] Export Markdown includes validator findings.
- [ ] Export JSON includes evaluationRun envelope.
- [ ] Export does not expose tokens/auth data.
- [ ] Chat/Form Profiles/History/Connections still open.

## Docs/index updates required
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`

## Docs impact
Creates `IN-2026-033` artifacts and the `WP-JUDGE-007A` prompt-pack. Updates EP-JUDGE-001 to split `WP-JUDGE-007A` export foundation from future `WP-JUDGE-007B` history store, and adds a short architecture implementation note.

## Rollback plan
Revert `src/shared/types/evaluationRun.*`, export formatting changes in `src/main/ipc/export.ipc.js`, targeted tests, and docs updates for this initiative/workpack. Existing Judge export channels and `JudgeExportPayload` flow should return to the pre-workpack behavior.

## Done criteria
- [x] Acceptance criteria met.
- [x] Required verification commands executed or explicitly marked blocked with reason.
- [x] Runtime scope check confirms forbidden paths unchanged.
- [x] Delivery report finalized.
- [x] REVIEW verdict recorded as GO or Conditional GO.

## Risks
- Legacy JSON compatibility may keep `rawResponse` in top-level `result`; normalized `evaluationRun` avoids duplicating it.
- Manual smoke may remain pending without an Electron session.
- Full dynamic criteria beyond current `JudgeScore` compatibility remains a later contract/pipeline decision.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
