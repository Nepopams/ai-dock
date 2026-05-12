# WP-UI-002 - Global Design Tokens and UI Primitives

## Workpack ID
`WP-UI-002-global-design-tokens-primitives`

## Title
Global Design Tokens and UI Primitives

## Status
Done; automated verification passed. Manual Electron smoke remains required.

## Owner
Human + Codex

## Mode
L3 scoped renderer CSS/runtime APPLY with human approval recorded for `WP-UI-002`.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/skills/ai-dock-renderer-react-executor/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `src/renderer/react/styles/global.css`

## Goal
Add UI v2 CSS variables and shared primitive classes as a stable foundation for later screen-level restyles without restyling all screens or changing runtime behavior.

## User value
The UI v2 rollout can proceed through bounded workpacks using one token layer instead of duplicating visual constants in each view.

## In scope
- Create this workpack and prompt pack.
- Add `--aid-*` CSS custom properties to `:root`.
- Add opt-in `.aid-*` primitive classes for future workpacks.
- Map only low-risk existing global values to variables.
- Add focus-visible and disabled helpers without removing visible focus globally.
- Fix an obvious malformed orphan block in `global.css`.
- Update UI v2 docs with runtime mapping status.

## Out of scope
- Shell restyle.
- Chat restyle.
- Judge/Evaluation Studio restyle.
- Connections/Form Profiles restyle.
- Remaining views restyle.
- React component changes.
- Zustand, IPC, storage, provider, main, preload, shared, package, dependency, or config changes.
- New CSS architecture or UI library.

## Current architecture context
The renderer uses a single large `src/renderer/react/styles/global.css` file that mixes shell, chat, judge, history, form, preset, and component-state styles. `App.tsx` and shell/view components consume existing class names and IDs directly. The CSS already uses `72px` for the dock rail and `44px` for the tab strip/top inset. This workpack adds a foundation inside the existing stylesheet rather than moving styles or changing component contracts.

## PLAN answers
1. Required PNG exports present: not under the exact names listed in `docs/design/ui-v2/exports/README.md`; numeric exports `0.png` through `10.png` are present.
2. Proceed without exact PNG names: yes. This work is token bootstrap only and uses explicit token values from `docs/design/ui-v2/design-tokens.md`; screen-level frame application is deferred.
3. CSS variables added: `--aid-bg-*`, `--aid-border-*`, `--aid-text-*`, `--aid-accent-*`, `--aid-status-*`, `--aid-space-1` through `--aid-space-8`, `--aid-layout-*`, `--aid-radius-*`, `--aid-shadow-*`, and `--aid-focus-ring`.
4. Existing values mapped now: body background/text, sidebar width/background, tabstrip left/height, prompt router left/top, content left, `--top-inset`, legacy `.pill-btn` color/radius/hover, focus-visible helpers.
5. Values left untouched: most screen-specific chat, judge, history, forms, presets, prompt router, tab, sidebar button, table, modal, and utility colors remain hardcoded until their screen workpacks.
6. Primitive classes added: `.aid-panel`, `.aid-card`, `.aid-surface`, `.aid-button`, `.aid-button--primary`, `.aid-button--secondary`, `.aid-button--ghost`, `.aid-button--danger`, `.aid-input`, `.aid-chip`, `.aid-chip--ready`, `.aid-chip--warning`, `.aid-chip--error`, `.aid-chip--info`, `.aid-empty-state`, `.aid-table`, `.aid-focusable`.
7. Existing malformed CSS: `global.css` contained an orphan declaration block after `.adapter-status--idle`. The minimal fix is in scope as CSS hygiene under this workpack.
8. Broad restyle avoidance: no React components are edited, primitives are not wired into runtime views, and only a small set of base/layout values are mapped.
9. Exact changed files: `global.css`, two UI v2 docs, initiative artifacts, and this workpack prompt pack.
10. Verification commands: initiative validator, workpack validator, `npm test`, `npm run build`, `git status --short`, `git diff --stat`, `git diff --check`, and forbidden-path status check.
11. Strong gate: none active after PLAN. The PNG filename mismatch is recorded as a soft gate because this is not a screen-restyle APPLY.

## Allowed files
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-002-global-design-tokens-primitives/**`
- `docs/planning/workpacks/WP-UI-002-global-design-tokens-primitives/**`
- `docs/_indexes/source-of-truth.md` only if a token mapping link is needed

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/react/App.tsx`
- `src/renderer/react/components/**`
- `src/renderer/react/views/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
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
1. Read governance, Initiative Runner workflow, UI v2 handoff, runtime context, and current CSS.
2. Confirm PNG export state and decide whether token bootstrap may proceed.
3. Create initiative artifacts and workpack prompt pack.
4. Add UI v2 CSS variables and opt-in primitives to `global.css`.
5. Map only low-risk existing values and fix the malformed CSS orphan block.
6. Update design token docs and roadmap status.
7. Run validators, tests, build, diff checks, and forbidden-path status check.
8. Record results in run state and delivery report.

## Acceptance criteria
- `global.css` contains the required `--aid-*` variables.
- Required primitive classes exist and are opt-in.
- No React components or view files are changed.
- No main/preload/shared/package/config/scripts files are changed.
- Screen restyles are explicitly deferred.
- Validators pass.
- `npm test` and `npm run build` pass or failures are clearly documented.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-002-global-design-tokens-primitives`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-002-global-design-tokens-primitives/workpack.md`
- `npm test`
- `npm run build`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/react/App.tsx src/renderer/react/components src/renderer/react/views src/renderer/store src/renderer/react/store package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Manual smoke checklist
- `npm run dev:app`
- App starts.
- Sidebar visible.
- Tab strip visible.
- Prompt router visible and can collapse/expand if existing behavior supports it.
- Chat opens.
- Judge opens.
- Connections opens.
- Form Profiles opens.
- History opens.
- No obvious global color/readability regression.
- Keyboard focus remains visible on buttons/inputs.

## Security impact
No IPC, preload, main process, provider, storage, token, or secret handling changes. Focus/disabled helpers should improve keyboard visibility without changing data flow.

## IPC impact
None.

## Docs impact
Adds initiative/workpack artifacts, prompt pack, a runtime mapping note in `design-tokens.md`, and a roadmap status update for `WP-UI-002`.

## Rollback
Revert the edits to `global.css`, the two UI v2 docs, and the `IN-UI-002`/`WP-UI-002` planning directories. No data migration or package cleanup is required.

## Done criteria
- Workpack artifacts exist.
- CSS variables and primitive classes exist.
- Scoped docs are updated.
- Verification commands are run and recorded.
- Manual smoke status is recorded.
- Delivery report states that screen restyles are deferred.

## Risks
- Global CSS focus and base-color changes may have subtle visual effects across views.
- Exact named PNG exports remain missing and should be aligned before screen workpacks.
- Manual Electron smoke is still needed after automated checks.

## Prompt pack links
- [PLAN prompt](prompt-plan.md)
- [APPLY prompt](prompt-apply.md)
- [REVIEW prompt](prompt-review.md)
- [FIXPACK prompt](prompt-fixpack.md)
