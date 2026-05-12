# Orchestration Plan: IN-UI-006 Connections and Form Profiles Restyle

## Initiative summary
Apply UI v2 styling to Connections and Form Profiles settings surfaces through one scoped renderer workpack while preserving provider/profile/registry/form behavior.

## Assumptions
- Human approval exists for `WP-UI-006 Connections / Form Profiles Restyle`.
- Numeric PNG exports `4.png` and `5.png` are acceptable visual references when canonical names are missing.
- The work can stay inside renderer presentation files and `global.css`.
- Existing stores and shared types are context only and must not be edited.

## Selected delivery mode
L3 scoped renderer UI APPLY through `ai-dock-renderer-react-executor`.

## Epic breakdown
- UI v2 foundations and shell are already complete through `IN-UI-002` and `IN-UI-003`.
- Chat and Evaluation Studio are already complete through `IN-UI-004` and `IN-UI-005`.
- This initiative completes the settings/form-heavy UI v2 slice.

## Sprint mapping
- Single bounded workpack: `WP-UI-006-connections-form-profiles-restyle`.
- Follow-up workpack: `WP-UI-007 Remaining Views Restyle`.

## Workpack queue
1. `WP-UI-006-connections-form-profiles-restyle` - in progress.

## Executor routing
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary review lenses: `ai-dock-test-qa-executor` for verification checklist, `ai-dock-security-hardening-executor` for token/privacy/readability review.
- Zustand executor is context-only because no store changes are planned.

## Gate plan
- Human approval is recorded in the user request.
- Strong gate check is performed during PLAN.
- Stop if runtime behavior, schema, IPC, dependency, or broad rewrite pressure appears.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack artifact.
- Run `npm test`.
- Run `npm run build`.
- Run `git diff --check`.
- Run forbidden-path status check.
- Record manual smoke as pending unless explicitly performed.

## Risk register
- Missing canonical PNG names: mitigated by using numeric PNG exports and handoff docs.
- FormEditor utility class density: mitigated by scoped semantic classes and CSS-only visual treatment.
- Token exposure risk: mitigated by preserving password/token handling and not adding secret display.
- Manual visual risk: mitigated by recording required Electron smoke checklist.
