# Workpack: WP-IN-2026-028 Judge Sidebar Entry

## Workpack ID
`WP-IN-2026-028-judge-sidebar-entry`

## Title
Judge Sidebar Entry

## Status
Completed

## Owner
Human + Codex

## Mode
L3 scoped renderer UX APPLY.

## Type
`renderer-ux`

## Selected executor
- Renderer React executor

## Primary skill
- Renderer React implementation

## Secondary executors
- Workflow validation
- Test/QA

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `src/renderer/react/components/Sidebar.tsx`
- `src/renderer/react/App.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/store/useDockStore.ts`
- `package.json`

## Goal
Add a visible `Judge` entry to the React sidebar that opens the existing Compare/Judge local view.

## User value
Users can discover and open Judge Comparison directly from the UI.

## In scope
- Add one Sidebar entry with `id: "compare"` and label `Judge`.
- Use existing `focusLocalView("compare")`.
- Use existing icon assets.
- Create initiative and prompt-pack artifacts.

## Out of scope
- Judge runtime changes.
- IPC/preload/shared contract changes.
- CompareView changes.
- Evaluation Studio, presets, JSON validator, backend labels.
- Package/dependency changes.

## Current architecture context
`App.tsx` already renders `<CompareView />` when `activeLocalView === "compare"`. `useDockStore` already supports `focusLocalView("compare")`. The missing piece is a visible sidebar control.

## Allowed files
- `src/renderer/react/components/Sidebar.tsx`
- `src/renderer/react/assets/icons/**` only if a new icon is strictly needed
- `docs/planning/initiatives/IN-2026-028-judge-sidebar-entry/**`
- `docs/planning/workpacks/WP-IN-2026-028-judge-sidebar-entry/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/store/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`

## Expected file changes
- `src/renderer/react/components/Sidebar.tsx`
- Initiative/workpack docs only.

## PLAN conclusion
No strong gate. The existing local view routing already supports `compare`, so the implementation is a one-entry Sidebar change. No icon asset is required; `infoIcon` can be reused.

## Step-by-step plan
1. Add a `Judge` object to `localViews`.
2. Set `isActive` to `activeLocalView === "compare"`.
3. Call `focusLocalView("compare")` from `onClick`.
4. Preserve existing entries and layout.
5. Run validators, tests, build, diff check, and forbidden-path check.

## Acceptance criteria
- [x] Sidebar includes a Judge button.
- [x] Judge button opens `compare` local view.
- [x] Existing local and bottom sidebar entries are preserved.
- [x] No new icon asset is added.
- [x] No forbidden files are changed.
- [x] Verification passes.

## Test plan
- Run initiative validator.
- Run workpack validator.
- Run `npm test`.
- Run `npm run build`.
- Run `git diff --check`.
- Run forbidden-path scope check.
- Manual smoke in `npm run dev:app`.

## Security impact
None. Renderer navigation only; no IPC, preload, secrets, storage, or provider behavior changes.

## IPC impact
None.

## Docs impact
Adds IN-2026-028 initiative artifacts and `WP-IN-2026-028` workpack/prompt-pack.

## Rollback
Remove the `Judge` entry from `localViews` and delete this initiative/workpack artifact set if needed.

## Done criteria
- [x] Workpack validator PASS.
- [x] Initiative validator PASS.
- [x] `npm test` PASS.
- [x] `npm run build` PASS.
- [x] Forbidden-path scope check PASS.
- [x] Delivery report complete.

## Risks
- Manual UI smoke is pending.
- Reused icon may be less semantically precise than a future dedicated Judge icon.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
