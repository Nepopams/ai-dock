# APPLY Prompt: WP-UI-001 Design Handoff Inventory

You are Codex Initiative Runner for VR AI Dock.

Mode: APPLY for L2 docs/design/planning. Runtime APPLY is forbidden.

## Allowed files
- `docs/design/ui-v2/**`
- `docs/planning/initiatives/IN-UI-001-ai-dock-ui-v2-design-handoff-inventory/**`
- `docs/planning/workpacks/WP-UI-001-design-handoff-inventory/**`
- `docs/_indexes/source-of-truth.md`, only for UI v2 handoff links
- `docs/_indexes/feature-index.md`, only for UI v2 handoff links

## Forbidden files
- `src/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `electron-builder.yml`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Required output files
- `docs/design/ui-v2/source/README.md`
- `docs/design/ui-v2/exports/README.md`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- initiative artifacts under `docs/planning/initiatives/IN-UI-001-ai-dock-ui-v2-design-handoff-inventory/**`
- prompt-pack and `workpack.md` under `docs/planning/workpacks/WP-UI-001-design-handoff-inventory/**`

## Guardrails
- Do not create placeholder PNG files.
- Do not copy real images unless already provided in repo.
- Do not modify runtime code.
- Do not modify package/config files.
- Record `WP-UI-002 Global Design Tokens and UI Primitives` as the next runtime workpack.

## Verification
Run the commands listed in `workpack.md`, then update `run-state.md`, `task-queue.md`, and `delivery-report.md`.
