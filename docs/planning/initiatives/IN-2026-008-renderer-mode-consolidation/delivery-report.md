# Delivery Report - IN-2026-008

## Summary
Docs-only architecture initiative for renderer mode consolidation. The current dual mode was audited and an ADR draft was created proposing React as the intended primary Dock UI, with the legacy renderer retained temporarily as an explicit fallback pending separate implementation workpacks.

## Workpacks completed
- `WP-IN-2026-008-renderer-mode-consolidation`

## Files changed
- `docs/planning/initiatives/IN-2026-008-renderer-mode-consolidation/**`
- `docs/planning/workpacks/WP-IN-2026-008-renderer-mode-consolidation/**`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/_indexes/source-of-truth.md`

## Commands run
- `git status --short`
- `Get-Content -Raw AGENTS.md`
- `Get-Content -Raw CODEX.md`
- `Get-Content -Raw .codex/skills/ai-dock-initiative-runner/SKILL.md`
- `Get-Content -Raw .codex/workflows/initiative-to-delivery.md`
- `Get-Content -Raw .codex/prompts/initiative-runner-template.md`
- `Get-Content -Raw docs/_governance/dor.md`
- `Get-Content -Raw docs/_governance/dod.md`
- `Get-Content -Raw docs/_indexes/source-of-truth.md`
- `Get-Content -Raw docs/architecture/service-catalog.md`
- `Get-Content -Raw package.json`
- `Get-Content -Raw src/main/main.js`
- `Get-Content -Raw src/renderer/index.html`
- `Get-Content -Raw src/renderer/index.js`
- `Get-Content -Raw src/renderer/index.css`
- `Get-Content -Raw src/renderer/react/App.tsx`
- `rg --files src/renderer/react`
- `rg --files src/renderer -g '!src/renderer/react/**'`
- `Get-Content -Raw src/renderer/react/index.html`
- `Get-Content -Raw src/renderer/react/main.tsx`
- `Get-ChildItem -Recurse -File src\\renderer\\react`
- `rg -n "window\\.|window\\.api|window\\.aiDock|activeLocalView|createRoot|AI_DOCK|ipc|preload" src/renderer/react`
- `Get-Content -Raw vite.config.js`
- `Get-Content -Raw scripts/build-preload.js`
- `Get-Content -Raw electron-builder.yml`
- `Get-Content -Raw scripts/workflow/validate-initiative.mjs`
- `Get-Content -Raw scripts/workflow/validate-workpack.mjs`
- `New-Item -ItemType Directory -Force ...`
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-008-renderer-mode-consolidation`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-008-renderer-mode-consolidation/workpack.md`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json vite.config.js scripts`

## Test results
- Initiative validator: PASS.
- Workpack validator: PASS.
- `git diff --check`: PASS, with an existing line-ending warning for `docs/_indexes/source-of-truth.md`.
- Forbidden path scoped status: clean.

## Review results
GO. Docs-only artifacts are complete, ADR-003 is linked from source-of-truth, and runtime/config/package paths were not changed.

## Risks
- `npm start` still launches without `AI_DOCK_REACT_UI=true`, so current behavior remains ambiguous until a later runtime/build workpack.
- `npm run electron:build` currently builds preload and invokes electron-builder, but does not run `vite build` or set `AI_DOCK_REACT_UI`.
- Legacy renderer still exists and remains a possible accidental validation path.

## Follow-ups
- IN-2026-009: React renderer default runtime/build switch.
- IN-2026-010: Legacy renderer fallback/archive/retirement plan.
- Workpack: rename or replace `dev:new-ui` with a clearer React/default app script.
- Workpack: React start/build smoke checklist.
- Workpack: non-React renderer support module ownership audit.

## Merge recommendation
Merge docs-only artifacts. Do not change runtime defaults until a separate Human-Gated runtime/build workpack is opened.
