# Orchestration Plan: IN-UI-004 Chat View Restyle

## Initiative summary
Apply UI v2 visuals to Local Chat only, using the existing token/primitives foundation and preserving all Chat runtime behavior.

## Assumptions
- `docs/design/ui-v2/exports/02-local-chat.png` is absent.
- `docs/design/ui-v2/exports/2.png` visually matches the Local Chat frame and can be used alongside markdown handoff docs.
- Existing shell and token work from `IN-UI-002` and `IN-UI-003` is already merged into this branch.
- Current Chat behavior is correct and must be preserved.

## Selected delivery mode
L3 scoped renderer Chat UI APPLY.

## Epic breakdown
- Design source verification.
- Workpack and prompt-pack creation.
- Chat component/CSS visual restyle.
- Automated verification and delivery reporting.

## Sprint mapping
Single initiative-runner pass for `WP-UI-004-chat-view-restyle`.

## Workpack queue
1. `WP-UI-004-chat-view-restyle` - apply Local Chat UI v2 restyle.
2. `WP-UI-005-evaluation-studio-restyle` - next recommended runtime workpack after merge.

## Executor routing
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary QA: `ai-dock-test-qa-executor` through required validators, test, build, and diff checks.
- Security/accessibility review: scoped to focus, disabled, and readability checks only.
- Zustand executor: read-only confirmation; no store changes allowed.

## Gate plan
- Human approval is already provided for `WP-UI-004`.
- Strong gate if runtime behavior or forbidden paths are needed.
- Soft gate for missing canonical export filename; proceed only because numeric export and markdown handoff are sufficient for conservative visual mapping.

## Verification strategy
- Validate initiative and workpack artifacts.
- Run `npm test`.
- Run `npm run build`.
- Run `git diff --check`.
- Run forbidden-path status check for main, preload, shared, stores, unrelated views, package, config, scripts, and build metadata.
- Record manual smoke checklist as pending unless run.

## Risk register
- Missing canonical PNG filename can reduce handoff traceability.
- CSS layout changes can affect scroll/pinned composer behavior.
- Compare button visual alignment must not alter Judge handoff payload.
