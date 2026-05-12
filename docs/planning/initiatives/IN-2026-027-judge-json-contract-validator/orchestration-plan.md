# Orchestration Plan: IN-2026-027 Judge JSON Contract Validator Mode

## Initiative summary
This initiative delivers `WP-JUDGE-004 JSON / Schema Validator Mode` as a first bounded deterministic validator layer for the current Judge prototype. It validates JSON answers before the LLM judge and shows validator findings without building Evaluation Studio.

## Assumptions
- The current branch is stacked on IN-2026-024/025/026 and includes contract hardening, preset catalog, and `customPrompt`.
- Existing `judge:run` can carry optional validation config; no new IPC channel is needed.
- The static preset catalog remains read-only context and is not imported by runtime.
- Architecture report and ADR-005 are absent on this branch and are consulted from git history.
- Markdown export template cannot be changed because `src/main/ipc/**` is forbidden; JSON export can carry sanitized `validatorResults`.

## Selected delivery mode
L3 scoped runtime/shared/preload/main/renderer/test APPLY.

## Epic breakdown
| Epic | Scope |
| --- | --- |
| E1 | Initiative/workpack orchestration |
| E2 | Shared validation contract |
| E3 | Preload sanitizer/export sanitizer |
| E4 | Main deterministic validators and prompt context |
| E5 | Minimal CompareView UI and state |
| E6 | Tests and REVIEW |

## Sprint mapping
Single scoped workpack: `WP-JUDGE-004-json-contract-validator-mode`.

## Workpack queue
| Workpack | Status |
| --- | --- |
| `WP-JUDGE-004-json-contract-validator-mode` | Done |

## Executor routing
- Selected executor: `ai-dock-main-process-executor`
- Secondary executor: `ai-dock-ipc-security-reviewer`
- Secondary executor: `ai-dock-renderer-react-executor`
- Secondary executor: `ai-dock-test-qa-executor`

## Gate plan
- Stop if a new IPC channel is needed.
- Stop if dependency/package/lockfile changes are needed.
- Stop if full JSON Schema validation is required.
- Stop if provider settings, prompt source files, or preset catalog runtime imports are needed.
- Stop if CompareView requires a large redesign.

## Verification strategy
- Validate initiative/workpack artifacts.
- Syntax-check edited JS.
- Run targeted and full tests.
- Run preload build and app build.
- Run diff and forbidden-path scope checks.

## Risk register
| Risk | Mitigation |
| --- | --- |
| Validator/LLM disagreement | Show validator results separately and pass them as evidence only |
| Scope expands into schema engine | Keep top-level parse, required keys, and simple enum checks only |
| Sensitive answer text leak in findings | Do not include raw answer text in validator results |
| Export gap | Preserve validatorResults in sanitized JSON export payload; defer Markdown formatting to a future exporter workpack |
