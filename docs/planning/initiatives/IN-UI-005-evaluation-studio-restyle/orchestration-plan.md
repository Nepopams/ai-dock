# Orchestration Plan: IN-UI-005 Evaluation Studio Restyle

## Initiative summary
Apply UI v2 visuals to Evaluation Studio and CompareView while preserving Judge runtime, EvaluationRun storage, export behavior, and state contracts.

## Assumptions
- `docs/design/ui-v2/exports/03-judge-evaluation-studio.png` is absent.
- `docs/design/ui-v2/exports/3.png` visually matches the Judge Evaluation Studio frame and can be used with markdown handoff docs.
- Existing UI v2 token, shell, and Chat workpacks are available on this branch.
- Current Judge/EvaluationRun behavior is correct and must be preserved.

## Selected delivery mode
L3 scoped renderer Evaluation Studio UI APPLY.

## Epic breakdown
- Design source verification.
- Initiative and workpack artifact creation.
- Evaluation/Compare CSS visual restyle.
- Automated verification and delivery reporting.

## Sprint mapping
Single initiative-runner pass for `WP-UI-005-evaluation-studio-restyle`.

## Workpack queue
1. `WP-UI-005-evaluation-studio-restyle` - apply Evaluation Studio UI v2 restyle.
2. `WP-UI-006-connections-form-profiles-restyle` - next recommended runtime workpack.

## Executor routing
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary QA: `ai-dock-test-qa-executor` through validators, tests, build, and diff checks.
- Security/accessibility review: scoped to focus, disabled, danger, and readability states.
- Zustand executor: read-only confirmation only; no store changes allowed.

## Gate plan
- Human approval is already provided for `WP-UI-005`.
- Strong gate if runtime behavior, storage/export contracts, package/dependency metadata, or forbidden paths are needed.
- Soft gate for missing canonical export filename; proceed because numeric export and markdown handoff are sufficient for conservative visual mapping.

## Verification strategy
- Validate initiative and workpack artifacts.
- Run `npm test`.
- Run `npm run build`.
- Run `git diff --check`.
- Run forbidden-path status check for main, preload, shared, stores, Chat, unrelated local views, adapters, package, config, scripts, and build metadata.
- Record manual smoke checklist as pending unless run.

## Risk register
- Missing canonical PNG filename reduces handoff traceability.
- Dense result tables and validator findings can regress readability if over-compressed.
- Saved-run list must keep summaries privacy-safe and avoid exposing full answer content.
