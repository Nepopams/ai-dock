# Orchestration Plan: IN-2026-033 EvaluationRun Export Foundation

## Initiative summary
Deliver a scoped EvaluationRun export foundation for Judge Mode. This adds a normalized export envelope and improves Markdown/JSON exports without implementing EvaluationRun history storage, new IPC channels, or database/persistence behavior.

## Assumptions
- Safe assumption: the existing `export:judge:md` and `export:judge:json` IPC channels can carry the enhanced export behavior.
- Safe assumption: the current `CompareView` payload is sufficient because it already sends `question`, `answers`, `result`, and `generatedAt`.
- Safe assumption: `validatorResults` and safe metadata are already present in `JudgeResult` and can be rendered/exported without changing Judge runtime.
- Blocking assumption: if normalized export requires new storage/history APIs, this initiative must stop and become `WP-JUDGE-007B`.

## Selected delivery mode
L3 scoped shared/export/test/docs APPLY.

This is a bounded runtime workpack touching shared export shape, main export formatting, existing preload sanitizer tests, targeted export tests, and docs. It does not change Judge runtime, storage, provider/settings, package metadata, or IPC channel inventory.

## Epic breakdown
- Epic ID: `EP-JUDGE-001`
- Title: Judge Mode / Evaluation Studio MVP
- Scope: EvaluationRun export foundation only.
- Risk profile: Medium, because export privacy and backward compatibility matter.
- Success criteria: normalized export envelope, improved Markdown, tests/build pass, no storage or new IPC.

## Sprint mapping
- Slice: Export/History split.
- Current workpack: `WP-JUDGE-007A EvaluationRun Export Foundation`.
- Follow-up: `WP-JUDGE-007B EvaluationRun History Store`.
- Dependency: `WP-JUDGE-007B` depends on the export shape from `WP-JUDGE-007A`, but is not implemented here.

## Workpack queue
| Workpack ID | Type | Purpose | Dependency | Expected status |
| --- | --- | --- | --- | --- |
| `WP-JUDGE-007A-evaluation-run-export-foundation` | Runtime shared/export/test/docs | Add normalized EvaluationRun export shape and improve existing Judge exports. | `WP-JUDGE-006` delivered shell and current Judge export path. | Done after APPLY/REVIEW |
| `WP-JUDGE-007B-evaluation-run-history-store` | Future runtime storage/history | Add EvaluationRun persistence/list/open/delete if separately approved. | `WP-JUDGE-007A` and a storage/privacy plan. | Follow-up only |

## Executor routing
- Selected executor: `ai-dock-history-exporter-executor`.
- Primary responsibility: export normalization, Markdown/JSON export behavior, privacy/backward compatibility.
- Secondary executors:
  - `ai-dock-ipc-security-reviewer`: review no new IPC, no secrets, safe metadata.
  - `ai-dock-test-qa-executor`: targeted tests and build verification.
  - `ai-dock-renderer-react-executor`: only if `CompareView` export payload assembly needs a tiny compatibility update.
- Routing rationale: the dominant runtime surface is main export IPC plus shared export shape and tests.

## Gate plan
- Gate A Scope: passed by human prompt and recorded in `gates.md`.
- Gate B Plan: approved for L3 scoped APPLY if no strong gate appears during PLAN.
- Gate C Apply: check diff path discipline and no forbidden path changes.
- Gate D Review: verify tests/build and delivery report.

## PLAN answers
1. EvaluationRun export foundation in this workpack means a normalized, serializable export artifact derived from the existing Judge export payload. It is an export envelope, not a stored run record.
2. History storage is out of APPLY because it requires storage format, migration/rollback, list/open/delete semantics, and privacy gates. That is `WP-JUDGE-007B`.
3. Existing export IPC channels can be used: `export:judge:md` and `export:judge:json` already move the payload through preload to main.
4. No preload modules or shared IPC changes are needed. If they become necessary, STOP.
5. The EvaluationRun export shape will use `runId`, `schemaVersion`, `createdAt`, `source`, `evaluationType`, `question`, `subjects`, `result`, `validatorResults`, `metadata`, and `exportOptions`.
6. Backward compatibility is preserved by keeping `window.exporter.judgeMarkdown(payload)` and `window.exporter.judgeJson(payload)` callable with current `JudgeExportPayload`; JSON keeps top-level legacy fields and adds `evaluationRun`.
7. Validator results render in Markdown as a `Validator Findings` section with type, status, answer key, key/path/expected/actual when present, and message.
8. Dynamic criteria render by discovering criteria from actual score buckets in order of first appearance, not from a hard-coded fixed list.
9. Markdown omits `rawResponse` by default as privacy hardening. JSON preserves legacy top-level `result` for compatibility, while normalized `evaluationRun` avoids duplicating raw response by default.
10. Exact files planned for change: `src/shared/types/evaluationRun.ts`, `src/shared/types/evaluationRun.js`, `src/main/ipc/export.ipc.js`, targeted tests, initiative/workpack docs, EP-JUDGE roadmap/map, and architecture note. `src/preload/utils/judge.js` changes only if tests prove sanitizer gaps.
11. Tests: new `tests/evaluationRun.test.js`, new `tests/judge-export.test.js`, and update `tests/judge-preload.test.js` if needed to assert metadata/validator preservation.
12. Strong gate: none active after PLAN. The line stops if implementation requires forbidden paths, new IPC, storage, package/dependency, provider/settings, or Judge pipeline changes.

## Verification strategy
- Initiative/workpack validators.
- `node --check` on changed JS runtime/shared/preload files.
- Targeted node tests.
- Full `npm test`.
- `npm run preload:build`.
- `npm run build`.
- Git diff/status/scope checks, including forbidden paths.

## Risk register
| Risk | Impact | Mitigation | Status |
| --- | --- | --- | --- |
| Raw response exposure | Sensitive model output may enter reports | Omit raw response from Markdown and normalized EvaluationRun by default; preserve legacy JSON only for compatibility | Open until review |
| Backward compatibility drift | Existing JSON consumers may break | Keep legacy top-level fields and add `evaluationRun` additively | Open until tests |
| Accidental history scope | Workpack expands into storage | Forbidden paths and scope checks include `src/main/storage/**` | Open until review |
| Criteria compatibility | Current Judge guards still accept current criteria only | Export table is dynamic over accepted scores; broader criteria contract deferred | Accepted |
