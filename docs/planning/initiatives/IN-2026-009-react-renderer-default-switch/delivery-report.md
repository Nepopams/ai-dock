# Delivery Report - IN-2026-009

## Summary
React renderer is now the default renderer path. Legacy renderer remains available through the explicit `AI_DOCK_LEGACY_UI=true` fallback. Package scripts now provide `dev:app`, keep `dev:new-ui` as a compatibility alias, make `start` use a fresh React dist, and make `electron:build` run the React build before packaging.

## Workpacks completed
- `WP-IN-2026-009-react-renderer-default-switch`

## Files changed
- `src/main/main.js`
- `package.json`
- `README.md`
- `docs/architecture/service-catalog.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/**`
- `docs/planning/workpacks/WP-IN-2026-009-react-renderer-default-switch/**`

## Commands run
- `git status --short`
- `Get-Content -Raw AGENTS.md`
- `Get-Content -Raw CODEX.md`
- `Get-Content -Raw .codex/skills/ai-dock-initiative-runner/SKILL.md`
- `Get-Content -Raw .codex/workflows/initiative-to-delivery.md`
- `Get-Content -Raw .codex/prompts/initiative-runner-template.md`
- `Get-Content -Raw .codex/workflows/codex-plan-apply-review.md`
- `Get-Content -Raw .codex/workflows/executor-routing.md`
- `Get-Content -Raw .codex/workflows/human-gates.md`
- `Get-Content -Raw docs/_governance/dor.md`
- `Get-Content -Raw docs/_governance/dod.md`
- `Get-Content -Raw docs/_indexes/executor-index.md`
- `Get-Content -Raw docs/_indexes/source-of-truth.md`
- `Get-Content -Raw docs/architecture/service-catalog.md`
- `Get-Content -Raw docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `Get-Content -Raw package.json`
- `Get-Content -Raw src/main/main.js`
- `Get-Content -Raw src/renderer/index.html`
- `Get-Content -Raw src/renderer/index.js`
- `Get-Content -Raw src/renderer/index.css`
- `Get-Content -Raw src/renderer/react/App.tsx`
- `rg --files src/renderer/react`
- `Get-Content -Raw vite.config.js`
- `Get-Content -Raw scripts/build-preload.js`
- `Get-Content -Raw electron-builder.yml`
- `git ls-files src/preload/preload.dist.js src/renderer/react/dist package-lock.json`
- `Get-Content -Raw .gitignore`
- `Get-Content -Raw README.md`
- `Get-Content -Raw scripts/workflow/validate-initiative.mjs`
- `Get-Content -Raw scripts/workflow/validate-workpack.mjs`
- `New-Item -ItemType Directory -Force ...`
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package json ok')"`
- `node --check src/main/main.js`
- `git diff -- src/main/main.js package.json docs/architecture/service-catalog.md`
- `git diff -- README.md`
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-009-react-renderer-default-switch`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-009-react-renderer-default-switch/workpack.md`
- `npm test`
- `npm run build`
- `npm run preload:build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- package-lock.json src/preload src/shared`
- `git status --short -- src/renderer src/main package.json README.md docs/architecture/service-catalog.md`
- `rg -n "AI_DOCK_REACT_UI|AI_DOCK_LEGACY_UI|AI_DOCK_REACT_DIST|dev:new-ui|dev:app|start:legacy|electron:build" src/main/main.js package.json README.md docs/architecture/service-catalog.md`

## Test results
- Initiative validator: PASS.
- Workpack validator: PASS.
- `npm test`: PASS, 21 tests passed. Existing Node module type warnings were emitted.
- `npm run build`: PASS. Vite built React renderer to `src/renderer/react/dist`; existing CSS minify warnings were emitted.
- `npm run preload:build`: PASS.
- `git diff --check`: PASS after a bounded README trailing whitespace fix.
- `git status --short -- package-lock.json src/preload src/shared`: clean.

## Review results
GO with manual smoke pending. React is default, legacy fallback is explicit, package-lock/dependencies/preload/shared/IPC were not changed, and automated verification passed.

Manual smoke checklist:
- `npm run dev:app` starts Vite + Electron React UI.
- `npm start` launches packaged-style Electron using React dist.
- Legacy fallback works only with explicit `AI_DOCK_LEGACY_UI=true` or `npm run start:legacy`.
- Chat/History/Completions/Form Runner local views open.
- BrowserView tabs still create/switch/close.
- No missing preload bundle errors.

## Risks
- Manual Electron smoke was not run because the request explicitly says not to auto-launch interactive dev app windows.
- `dev:app` still has the existing concurrent startup timing risk because no wait dependency was added.
- `npm run build` emits existing CSS minify warnings; build exits successfully.
- `npm test` emits existing Node module type warnings; tests pass.
- Worktree also contains uncommitted IN-2026-008 docs from the prior initiative.

## Follow-ups
- Run manual Electron smoke checklist.
- Decide separately whether ADR-003 should move from Proposed to Accepted after this implementation.
- IN-2026-010: legacy renderer fallback/archive/retirement plan.
- Audit non-React renderer support module ownership before any legacy deletion.

## Merge recommendation
CONDITIONAL GO. Automated verification passed and runtime scope is clean; complete manual Electron smoke before final release/merge confidence.
