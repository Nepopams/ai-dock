# Orchestration Plan: IN-UI-007A Form Runner Restyle

## Initiative summary
Apply UI v2 styling to the Form Runner local view through one scoped renderer workpack while preserving form execution, preview, redaction, sync, stream, abort, copy, and navigation behavior.

## Assumptions
- Human approval exists for `WP-UI-007A Form Runner Restyle`.
- Numeric PNG export `6.png` is an acceptable Form Runner visual reference when canonical `06-form-runner.png` is missing.
- The work can stay inside `FormRunView.tsx`, `global.css`, roadmap docs, and initiative/workpack artifacts.
- Store, shared, IPC, preload, main, package, and dependency files are context only and must not be edited.

## Selected delivery mode
L3 scoped renderer Form Runner UI APPLY through `ai-dock-renderer-react-executor`.

## Epic breakdown
- UI v2 handoff, tokens, shell, Chat, Evaluation Studio, Connections, and Form Profiles are already complete through `IN-UI-001` to `IN-UI-006`.
- This initiative closes the Form Profiles to Form Runner chain as `WP-UI-007A`.
- Remaining views are deferred to `WP-UI-007B` and `WP-UI-007C`.

## Sprint mapping
- Single bounded workpack: `WP-UI-007A-form-runner-restyle`.
- Follow-up workpack: `WP-UI-007B Prompt Templates / Media Presets Restyle`.

## Workpack queue
1. `WP-UI-007A-form-runner-restyle` - done.
2. `WP-UI-007B-prompt-templates-media-presets-restyle` - planned follow-up.
3. `WP-UI-007C-history-hub-restyle` - planned follow-up.

## Executor routing
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary review lenses: `ai-dock-test-qa-executor` for verification checklist and `ai-dock-security-hardening-executor` for redaction/readability review.
- Zustand executor is context-only because no store changes are planned.

## Gate plan
- Human approval is recorded in the user request.
- Strong gate check is performed during PLAN.
- Stop if runtime behavior, schema, IPC, dependency, store, or broad rewrite pressure appears.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack artifact.
- Run `npm test`.
- Run `npm run build`.
- Run `git diff --check`.
- Run forbidden-path status check.
- Record manual smoke as pending unless explicitly performed.

## Risk register
- Missing canonical PNG name: mitigated by using numeric `6.png` and handoff docs.
- Visual regressions in form-heavy controls: mitigated by scoped `form-runner-*` selectors.
- Secret disclosure risk: mitigated by preserving existing redaction logic and not editing shared render utilities.
- Manual visual risk: mitigated by recording required Electron smoke checklist.
