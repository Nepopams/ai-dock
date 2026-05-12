# Initiative: IN-UI-001 AI Dock UI v2 Design Handoff Inventory

## Initiative ID
`IN-UI-001-ai-dock-ui-v2-design-handoff-inventory`

## Title
AI Dock UI v2 Design Handoff Inventory

## Status
Done

## Owner
Human + Codex

## Goal
Create a managed design handoff pack and bounded UI workpack queue for applying the Pencil UI v2 design to the current VR AI Dock without a giant runtime refactor.

## User value
The user gets a safe, step-by-step path from Pencil design to implementation through Initiative -> Workpack -> PLAN/APPLY/REVIEW, with clear handoff artifacts and runtime guardrails.

## Problem
AI Dock has a complete Pencil design, but without a handoff inventory Codex could treat it as a single broad restyle and accidentally break runtime flows across Electron shell, BrowserView tabs, local Chat, Prompt Router, Prompt Drawer, History, Evaluation Studio, Form Profiles, Media Presets, and Connections.

## Success criteria
- [x] Initiative artifacts are file-backed under this folder.
- [x] `WP-UI-001-design-handoff-inventory` workpack and prompt-pack exist.
- [x] `docs/design/ui-v2/source/README.md` explains `.pen` source/reference handling.
- [x] `docs/design/ui-v2/exports/README.md` lists required PNG exports.
- [x] `docs/design/ui-v2/design-tokens.md` documents starter UI v2 tokens.
- [x] `docs/design/ui-v2/implementation-notes.md` maps Pencil frames to current React files and smoke checks.
- [x] `docs/design/ui-v2/screen-map.md` maps frames, PNGs, routes/files, and target workpacks.
- [x] `docs/design/ui-v2/ui-v2-workpack-roadmap.md` defines bounded UI workpacks.
- [x] Source-of-truth and feature index links are updated.
- [x] Runtime APPLY is not performed.
- [x] Forbidden runtime/package/config files are not changed.

## In scope
- Create initiative artifacts.
- Create `WP-UI-001` workpack and prompt-pack.
- Create `docs/design/ui-v2/**` structure.
- Record expected PNG exports.
- Create `design-tokens.md`.
- Create `implementation-notes.md`.
- Create `screen-map.md`.
- Create UI v2 workpack roadmap.
- Update `docs/_indexes/source-of-truth.md` and `docs/_indexes/feature-index.md` with UI v2 links.

## Out of scope
- Runtime CSS changes.
- React component changes.
- UI primitive implementation.
- Shell restyle.
- View restyle.
- Package/dependency changes.
- `src/**` edits.
- `package.json` or `package-lock.json` edits.
- `tsconfig`, Vite, scripts, or Electron Builder config edits.

## Constraints
- Initiative autonomy: L2 docs/design/planning APPLY only.
- Runtime APPLY is forbidden.
- `.pen` is source/reference, not the only implementation source.
- Codex must use PNG exports plus Markdown specs for runtime handoff.
- No placeholder PNG binary files are created.
- No dependencies or UI libraries are added.
- Allowed files:
  - `docs/design/ui-v2/**`
  - `docs/planning/initiatives/IN-UI-001-ai-dock-ui-v2-design-handoff-inventory/**`
  - `docs/planning/workpacks/WP-UI-001-design-handoff-inventory/**`
  - `docs/_indexes/source-of-truth.md` only for UI v2 handoff links
  - `docs/_indexes/feature-index.md` only for UI v2 handoff links
- Forbidden files:
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

## Strong human gate triggers
- Any runtime APPLY.
- Any change to `src/**`.
- Any change to package, lockfile, dependency metadata, Vite, TypeScript, Electron Builder, scripts, build, dist, release, or node_modules paths.
- Any attempt to apply the full UI v2 design in one runtime APPLY.
- Any future workpack with unclear affected modules, selected executor, allowed paths, forbidden paths, verification, or rollback.
- Any design change that requires new IPC, preload bridge changes, main-process handlers, storage/data format changes, or security invariant changes.
- Any runtime implementation that depends on parsing `.pen` as the only source.

## Candidate epics
- Epic 1: UI v2 design handoff source/export inventory.
- Epic 2: Global design tokens and UI primitives.
- Epic 3: Shell restyle.
- Epic 4: Local Chat restyle.
- Epic 5: Evaluation Studio restyle.
- Epic 6: Connections and Form Profiles restyle.
- Epic 7: Remaining local view restyles.

## Risks
- PNG exports may be missing when runtime work begins. Mitigation: required export list is documented and the next runtime workpack must verify availability.
- Global CSS changes can regress multiple screens. Mitigation: `WP-UI-002` must token-map first and verify shared states before view work.
- Mixed styling approaches exist today, including `global.css` and Tailwind-like JSX utility classes. Mitigation: each view workpack must plan scoped styling and smoke checks.
- Judge, History, Chat, and Form Runner have data/runtime-sensitive flows. Mitigation: visual workpacks must forbid IPC, storage, provider, and contract changes unless separately gated.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-UI-001-design-handoff-inventory/workpack.md`
- `../../../design/ui-v2/source/README.md`
- `../../../design/ui-v2/exports/README.md`
- `../../../design/ui-v2/design-tokens.md`
- `../../../design/ui-v2/implementation-notes.md`
- `../../../design/ui-v2/screen-map.md`
- `../../../design/ui-v2/ui-v2-workpack-roadmap.md`
