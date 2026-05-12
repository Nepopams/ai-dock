# Orchestration Plan: IN-2026-026 Judge Custom Rubric / Custom Prompt

## Initiative summary
`IN-2026-026` delivers `WP-JUDGE-003 Custom Rubric / Custom Prompt`: a bounded compatibility enhancement for the current Judge prototype. The initiative adds optional custom judge instructions to the existing answer-comparison flow without building Evaluation Studio.

## Assumptions
- Human approval for `WP-JUDGE-003` is present in the user request.
- Existing Judge IPC can carry the optional input field without a new channel.
- Existing completions profiles and provider settings remain unchanged.
- The preset catalog remains static and disconnected from runtime.
- Architecture report/ADR-005 may be absent on this stacked branch; they can be consulted from git history if needed.

## Selected delivery mode
L3 scoped runtime/shared/preload/main/renderer/test APPLY.

## Human approval context
Human approval is present for `WP-JUDGE-003 Custom Rubric / Custom Judge Prompt`. APPLY is allowed only inside the bounded allowed paths and only after PLAN finds no strong gate.

## Epic breakdown
| Epic | Scope |
| --- | --- |
| E1 | Initiative/workpack orchestration |
| E2 | Shared Judge contract extension |
| E3 | Preload sanitizer and prompt assembly |
| E4 | Minimal CompareView support |
| E5 | Tests, verification, and delivery report |

## Sprint mapping
Single sprint/runtime workpack: `WP-JUDGE-003-custom-rubric-prompt`.

## Workpack queue
1. `WP-JUDGE-003-custom-rubric-prompt`
   - PLAN: confirm compatibility, exact file edits, tests, and gates.
   - APPLY: implement optional `customPrompt`, sanitizer, prompt assembly, metadata, minimal CompareView, and tests.
   - REVIEW: run validation/build/test/scope checks and record delivery report.

## Executor routing
- Selected executor: `ai-dock-main-process-executor`
- Secondary executor: `ai-dock-ipc-security-reviewer`
- Secondary executor: `ai-dock-renderer-react-executor`
- Secondary executor: `ai-dock-test-qa-executor`

## Gate plan
- Stop if a new IPC channel is needed.
- Stop if package/dependency/config/script changes are needed.
- Stop if provider settings migration is needed.
- Stop if prompt/rubric source files must change.
- Stop if preset catalog runtime integration is needed.
- Stop if EvaluationRun/history/storage is needed.
- Stop if CompareView requires a large redesign.

## Non-goals
- No Evaluation Studio UI.
- No preset picker.
- No deterministic validator runtime.
- No EvaluationRun/history/storage.
- No new provider settings.
- No new IPC channels.

## Verification strategy
- Initiative validator must pass.
- Workpack validator must pass.
- JS syntax checks for edited runtime/preload files must pass.
- `npm test`, `npm run preload:build`, and `npm run build` must pass.
- Forbidden scope check must show no package/provider/settings/prompt/preset/IPC/main IPC edits.

## Risk register
| Risk | Mitigation |
| --- | --- |
| Custom instructions try to override output format | Bound instructions and restate strict JSON after them |
| Custom prompt text leaks into metadata/export metadata | Store only `customPromptApplied` boolean |
| Runtime scope expands into Evaluation Studio | Keep preset catalog/UI/history out of scope |
| Missing architecture report on stacked branch | Consult history; do not recreate large planning report in runtime workpack |

## Rollback
Revert this workpack's changes in allowed files:
- shared Judge type/guard changes;
- preload sanitizer changes;
- Judge pipeline prompt/metadata helper changes;
- CompareView/store minimal state changes;
- targeted tests;
- initiative/workpack docs.

No user-data rollback is expected.
