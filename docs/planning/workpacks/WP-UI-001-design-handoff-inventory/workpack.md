# Workpack: WP-UI-001 Design Handoff Inventory

## Workpack ID
`WP-UI-001-design-handoff-inventory`

## Title
AI Dock UI v2 Design Handoff Inventory

## Status
Done

## Owner
Human + Codex

## Mode
L2 docs/design/planning APPLY

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
- `docs/_indexes/feature-index.md`
- UI context files listed in this workpack.

## Goal
Create a managed design handoff pack for AI Dock UI v2 and define a bounded workpack queue for future runtime implementation.

## User value
The user can safely apply Pencil UI v2 to AI Dock through small, reviewable UI workpacks instead of a broad refactor that risks breaking core runtime flows.

## In scope
- Create `docs/design/ui-v2/source/README.md`.
- Create `docs/design/ui-v2/exports/README.md`.
- Create `docs/design/ui-v2/design-tokens.md`.
- Create `docs/design/ui-v2/implementation-notes.md`.
- Create `docs/design/ui-v2/screen-map.md`.
- Create `docs/design/ui-v2/ui-v2-workpack-roadmap.md`.
- Create initiative artifacts for `IN-UI-001`.
- Create this workpack and prompt-pack.
- Update source-of-truth and feature-index links for UI v2 handoff.

## Out of scope
- Runtime CSS changes.
- React component changes.
- UI primitive implementation.
- Shell restyle.
- View restyle.
- Dependency or UI library changes.
- `src/**` edits.
- Package/config/script/build edits.

## Current architecture context
AI Dock is an Electron + React/Vite + Zustand desktop shell. The current React app mounts `Sidebar`, `PromptRouter`, `TabStrip`, local views, `PromptDrawer`, and `Toast` in `App.tsx`. Local views include Chat, Connections, Form Profiles, Form Runner, Prompt Templates, History, Media Presets, and Evaluation Studio. Styling is concentrated in `global.css`, while some form screens include Tailwind-like utility class strings directly in JSX. UI v2 must therefore start with a token/primitive workpack before shell and view restyles.

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

## Step-by-step plan
1. Read governance, workflow, indexes, workpack templates, and UI context files.
2. Create `docs/design/ui-v2/source` and `exports` folders with README handoff rules.
3. Create `design-tokens.md` from UI v2 reference tokens and implementation constraints.
4. Create `implementation-notes.md` mapping Pencil frames to current files, target visual changes, out-of-scope items, and smoke checks.
5. Create `screen-map.md` mapping frame names, PNG filenames, routes/views, files, and target workpacks.
6. Create `ui-v2-workpack-roadmap.md` with `WP-UI-001` through `WP-UI-007`.
7. Create initiative run-state artifacts.
8. Create `WP-UI-001` prompt-pack.
9. Update source-of-truth and feature index links.
10. Run validators and diff/scope checks.
11. Record review result and delivery report.

## Acceptance criteria
- [x] Design handoff folder exists.
- [x] Source README explains `.pen` source/reference handling.
- [x] Exports README lists all required PNG files.
- [x] Design tokens document includes color, typography, spacing, layout, radius/border/shadow, status, button/input/card/table/chip state tokens.
- [x] Implementation notes map all requested frames to current files.
- [x] Screen map table exists.
- [x] UI v2 roadmap defines `WP-UI-001` through `WP-UI-007`.
- [x] Initiative artifacts exist and validate.
- [x] Workpack validates.
- [x] No runtime source changes.
- [x] No package/config changes.
- [x] Delivery report says runtime APPLY was not performed.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-001-ai-dock-ui-v2-design-handoff-inventory`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-001-design-handoff-inventory/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Security impact
None for runtime. This is docs/design/planning only. No sandbox, contextIsolation, preload, IPC, renderer Node access, tokens, secrets, or storage behavior is changed.

## IPC impact
None. No IPC contracts, preload bridge APIs, main handlers, or renderer IPC consumers are changed.

## Docs impact
Creates `docs/design/ui-v2/**`, initiative artifacts, and `WP-UI-001` prompt-pack. Updates source-of-truth and feature index links.

## Rollback
Remove the files created under `docs/design/ui-v2/**`, `docs/planning/initiatives/IN-UI-001-ai-dock-ui-v2-design-handoff-inventory/**`, and `docs/planning/workpacks/WP-UI-001-design-handoff-inventory/**`; revert the UI v2 link additions in `docs/_indexes/source-of-truth.md` and `docs/_indexes/feature-index.md`.

## Done criteria
- [x] All expected files created.
- [x] Initiative validator PASS.
- [x] Workpack validator PASS.
- [x] `git diff --check` PASS.
- [x] Runtime/package/config forbidden-path check PASS.
- [x] Delivery report complete.

## Risks
- Real PNG exports are still required before runtime implementation.
- Future token mapping may reveal discrepancies between the starter token inventory and the final PNG exports.
- `WP-UI-007` may need splitting if PLAN finds high complexity.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`

## Selected executor
`ai-dock-initiative-runner`

## PLAN conclusion
1. The full design cannot be applied in one APPLY because it spans shell, global CSS, Chat, Judge, Connections, forms, History, Presets, Prompt Templates, and shared states. That is a giant multi-screen runtime change.
2. The design handoff inventory is needed to convert Pencil into deterministic implementation inputs: PNG exports, tokens, screen map, file mapping, smoke checks, and bounded workpacks.
3. `.pen` should be placed in `docs/design/ui-v2/source/` or kept externally if too large. PNG exports should be placed in `docs/design/ui-v2/exports/`.
4. This workpack creates the six design docs, initiative artifacts, and prompt-pack.
5. Next UI workpacks are `WP-UI-002` through `WP-UI-007`, starting with global design tokens and primitives.
6. Allowed and forbidden files are explicit in this workpack.
7. No strong gate is active for docs-only APPLY; runtime work requires a future Human Gate.
8. Runtime unchanged status is verified with forbidden-path `git status`.
