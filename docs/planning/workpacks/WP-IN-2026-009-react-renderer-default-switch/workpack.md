# WP-IN-2026-009 React Renderer Default Switch

## Workpack ID
WP-IN-2026-009-react-renderer-default-switch

## Title
React Renderer Default Switch

## Status
Complete

## Owner
Human + Codex

## Mode
L3 scoped runtime/build APPLY.

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
- `docs/architecture/service-catalog.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `package.json`
- `src/main/main.js`
- `vite.config.js`
- `scripts/build-preload.js`
- `electron-builder.yml`

## Goal
Switch the app to React renderer by default for dev/start/build while preserving legacy renderer as an explicit fallback.

## User value
The main developer commands target the active React UI, reducing accidental legacy UI testing.

## In scope
- `src/main/main.js` renderer selection.
- `package.json` scripts.
- README run command docs.
- Service catalog renderer-mode clarification.
- Initiative and workpack artifacts.

## Out of scope
- Legacy deletion.
- React component changes.
- Preload/shared/IPC contract changes.
- Dependency or lockfile changes.
- TypeScript migration.

## Current architecture context
Current `main.js` uses `AI_DOCK_REACT_UI=true` to choose React. Without that flag, it loads `src/renderer/index.html`. Vite builds React to `src/renderer/react/dist`. `dev:new-ui` starts React mode, but `start` and `electron:build` do not guarantee React default or fresh React dist.

PLAN answers:
1. Renderer selection now uses `AI_DOCK_REACT_UI === "true"`; otherwise legacy loads.
2. `dev` starts Vite only, `dev:new-ui` starts React app, `start` can hit legacy, `electron:build` does not run `vite build`.
3. Minimal diff: invert selection so React is default, add explicit `AI_DOCK_LEGACY_UI=true` fallback, and add a React dist flag for `npm start`.
4. Legacy fallback remains through `AI_DOCK_LEGACY_UI=true` and a `start:legacy` script.
5. `electron:build` should run `npm run build` before electron-builder.
6. `package-lock.json` change is not required.
7. No strong gate is present.
8. Exact files to change: `src/main/main.js`, `package.json`, `README.md`, `docs/architecture/service-catalog.md`, and initiative/workpack artifacts.

## Allowed files
- `src/main/main.js`
- `package.json`
- `README.md`
- `docs/architecture/service-catalog.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/**`
- `docs/planning/workpacks/WP-IN-2026-009-react-renderer-default-switch/**`

## Forbidden files
- `src/preload/**`
- `src/shared/**`
- `src/renderer/react/**`
- `src/renderer/index.html`
- `src/renderer/index.js`
- `src/renderer/index.css`
- `package-lock.json`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Create initiative and workpack artifacts.
2. Update `main.js` to default to React and select legacy only via `AI_DOCK_LEGACY_UI`.
3. Update scripts with `dev:app`, `dev:new-ui` compatibility alias, `start` using React dist, `start:legacy`, and `electron:build` running React build.
4. Update README command docs and service catalog.
5. Run verification commands.
6. Review diff and update delivery report.

## Acceptance criteria
- React renderer is default in `main.js`.
- Legacy renderer still exists and is explicit fallback only.
- `dev:new-ui` is not the main path and aliases `dev:app`.
- `electron:build` builds React before packaging.
- No lockfile/dependency/preload/shared/IPC changes.
- Validators and verification commands pass or are reported.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-009-react-renderer-default-switch`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-009-react-renderer-default-switch/workpack.md`
- `npm test`
- `npm run build`
- `npm run preload:build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- package-lock.json src/preload src/shared`

Manual smoke checklist:
- `npm run dev:app` starts Vite + Electron React UI.
- `npm start` launches packaged-style Electron using React dist.
- Legacy fallback works only with explicit `AI_DOCK_LEGACY_UI=true`.
- Chat/History/Completions/Form Runner local views open.
- BrowserView tabs create/switch/close.
- No missing preload bundle errors.

## Security impact
No change to `contextIsolation`, `sandbox`, `nodeIntegration`, IPC channels, preload bridge, or shared contracts.

## IPC impact
None.

## Docs impact
README command docs and service catalog are updated.

## Rollback
Revert changes to `src/main/main.js`, `package.json`, `README.md`, `docs/architecture/service-catalog.md`, and IN-2026-009 planning artifacts.

## Done criteria
- Validators pass.
- Tests/build/preload build pass.
- Scope check confirms no lockfile, preload, or shared changes.
- Delivery report includes manual smoke checklist.

## Risks
- Manual Electron smoke remains required.
- `dev:app` may still have Vite/Electron startup timing race because no dependency can be added.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
