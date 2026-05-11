# Orchestration Plan - IN-2026-009

## Initiative summary
This L3 scoped runtime/build initiative implements the renderer mode strategy from ADR-003 by making React the default renderer path and preserving legacy as an explicit fallback.

## Assumptions
- Human approval for this runtime/build workpack is present in the initiative prompt.
- `src/renderer/react/dist/index.html` is the production React renderer entry because Vite builds to `src/renderer/react/dist`.
- `src/preload/preload.dist.js` and `src/renderer/react/dist/**` are generated and git-ignored; verification may regenerate them without tracked source changes.
- `README.md` documents run commands, so it is eligible for a scoped docs update.

## Selected delivery mode
One scoped runtime/build workpack: PLAN -> Gate Evaluation -> APPLY -> Verification -> REVIEW.

## Epic breakdown
- E1: Runtime renderer default switch.
- E2: Package script consolidation.
- E3: Docs/run-command clarification.
- E4: Verification and review.

## Sprint mapping
Renderer consolidation / pre-feature cleanup.

## Workpack queue
1. `WP-IN-2026-009-react-renderer-default-switch` - runtime/build APPLY.

## Executor routing
- Selected executor: `ai-dock-release-build-executor`.
- Secondary executors: `ai-dock-main-process-executor`, `ai-dock-renderer-react-executor`, `ai-dock-test-qa-executor`.

## Gate plan
- Gate A: Scope authorized by initiative prompt.
- Gate B: PLAN confirms no dependency, lockfile, preload/shared/IPC, or renderer component changes are needed.
- Gate C: Diff must stay within allowed files.
- Gate D: Validators and verification must pass or be reported with residual risks.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack.
- Run `npm test`.
- Run `npm run build`.
- Run `npm run preload:build`.
- Run git status, diff stat, diff check, and scoped forbidden-path status.

## Risk register
- Risk: no automated interactive Electron smoke. Mitigation: delivery report manual smoke checklist.
- Risk: concurrent dev startup may race Electron before Vite is ready. Mitigation: document residual risk and avoid adding a wait dependency.
- Risk: package script changes can confuse current users. Mitigation: preserve `dev:new-ui` alias.
