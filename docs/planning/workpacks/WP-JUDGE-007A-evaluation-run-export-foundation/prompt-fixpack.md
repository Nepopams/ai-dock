# Prompt Fixpack: WP-JUDGE-007A EvaluationRun Export Foundation

## Objective
Apply only narrow fixes found during REVIEW without expanding scope.

## Allowed fix types
- Guard/mapper correctness fixes in `src/shared/types/evaluationRun.*`.
- Export formatter fixes in `src/main/ipc/export.ipc.js`.
- Sanitizer preservation fixes in `src/preload/utils/judge.js`.
- Targeted test expectation fixes in allowed test files.
- Documentation status or report corrections.

## Forbidden fix types
- New IPC channels.
- Shared IPC changes.
- Preload module/bridge API changes.
- EvaluationRun history/storage/persistence.
- Judge runtime pipeline changes.
- Provider/settings model changes.
- Package/dependency/build script changes.
- UI redesign or broader renderer changes.

## Escalation
If a fix requires forbidden files, storage, new IPC, package/dependency changes, provider/settings changes, or scope expansion into `WP-JUDGE-007B`, stop and request a new human gate decision.
