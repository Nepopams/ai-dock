# Workpack: WP-IN-2026-010 - Form Profiles React Smoke Crash Fix

## Workpack ID
`WP-IN-2026-010-form-profiles-react-smoke-crash-fix`

## Title
Form Profiles React Smoke Crash Fix

## Status
Done / Manual Smoke Pending

## Owner
- Owner: Human + Codex
- Selected executor: `ai-dock-renderer-react-executor`
- Secondary executor: `ai-dock-test-qa-executor`

## Mode
`runtime-development`

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/delivery-report.md`
- `src/renderer/react/views/forms/FormProfilesManager.tsx`
- `src/renderer/react/views/forms/FormEditor.tsx`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/store/formProfilesSlice.ts`
- `src/shared/types/form.ts`
- `package.json`

## Goal
Fix the Form Profiles React view crash and remove the unstable Zustand selector warning while preserving current Form Profiles behavior.

## User value
Users can open Form Profiles in the React renderer, edit profiles, adjust preview sample values, and continue smoke testing without a black screen.

## In scope
- Fix the `ReferenceError: variable is not defined` in `PreviewPanel`.
- Replace the FormProfilesManager object selector with stable individual selectors.
- Add only minimal guards if needed for empty sample values or test results.
- Update initiative/workpack artifacts and delivery report.
- Run automated verification and record manual smoke checklist status.

## Out of scope
- Redesigning Form Profiles.
- Rewriting `FormEditor`.
- Adding an ErrorBoundary in this workpack.
- Changing IPC/preload/main/shared contracts.
- Changing FormProfile schema or persisted data.
- Changing package files, build scripts, or dependencies.
- Changing Form Runner runtime.

## Current architecture context
`FormProfilesManager` reads Form Profiles state and actions from `useDockStore`, then renders `FormEditor`. `FormEditor` renders `PreviewPanel` with `sampleValues`, `testResult`, `dirty`, and test callbacks. The crash is renderer-only: the `PreviewPanel` JSX text contains an unescaped `{{variable}}` placeholder that React evaluates as a JS object expression. The warning is from a Zustand selector that returns a new object snapshot each call.

Affected modules:
- `renderer`
- `renderer Zustand consumer`
- `docs`

## Allowed files
- `src/renderer/react/views/forms/FormProfilesManager.tsx`
- `src/renderer/react/views/forms/FormEditor.tsx`
- `docs/planning/initiatives/IN-2026-010-form-profiles-react-smoke-crash-fix/**`
- `docs/planning/workpacks/WP-IN-2026-010-form-profiles-react-smoke-crash-fix/**`

Optional allowed only if PLAN proves direct need:
- `src/renderer/react/components/**`
- `src/renderer/react/store/useDockStore.ts`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Confirm the `PreviewPanel` undefined identifier source.
2. Confirm why current verification missed it.
3. Replace the JSX placeholder with string text so React does not evaluate `variable`.
4. Replace the FormProfilesManager object selector with individual selectors.
5. Avoid shared schema, IPC, preload, main, package, or Form Runner changes.
6. Run validators, tests, build, optional TypeScript check, and git diff/scope checks.
7. REVIEW the diff against this workpack and update delivery report.

PLAN answers:
- Undefined `variable`: `src/renderer/react/views/forms/FormEditor.tsx` source line 1152 renders `{{variable}}` in JSX text inside `PreviewPanel`; browser sourcemap reports it near line 1704. JSX parses this as an object expression using shorthand property `variable`, causing `ReferenceError`.
- Why tests/build missed it: `npm test` runs Node tests only, not a React render smoke. `npm run build` uses Vite/esbuild transpilation and does not execute the component. It also does not perform `tsc --noEmit` type checking.
- Minimal diff: render the placeholder as string text, e.g. `{"{{variable}}"}`, and leave preview behavior unchanged.
- Zustand warning cause: `useDockStore((state) => ({ ... }))` returns a fresh object snapshot on every call, which React 19/Zustand v5 warns can cause an infinite render loop.
- Warning fix: prefer individual selectors for each field and keep `actions` as its existing selector; no new dependency and no `useShallow` needed.
- ErrorBoundary: not needed for the minimal fix; consider as a separate small follow-up if desired.
- Files to change: `FormEditor.tsx`, `FormProfilesManager.tsx`, initiative/workpack docs.
- Checks: initiative/workpack validators, `npm test`, `npm run build`, optional `npx tsc --noEmit --pretty false`, git diff/scope checks.

## Acceptance criteria
- [ ] Form Profiles opens without fatal render error.
- [ ] `PreviewPanel` does not reference undefined identifiers.
- [ ] The sample values help text still displays the literal `{{variable}}` placeholder.
- [ ] FormProfilesManager selector no longer creates an unstable object snapshot.
- [ ] No FormProfile persisted schema or shared contract changes.
- [ ] No forbidden runtime/package/build paths changed.
- [ ] Validators, tests, build, diff checks, and scope checks are recorded.
- [ ] Manual smoke checklist is recorded in delivery report.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-010-form-profiles-react-smoke-crash-fix`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-010-form-profiles-react-smoke-crash-fix/workpack.md`
- `npm test`
- `npm run build`
- `npx tsc --noEmit --pretty false` if possible without package/tsconfig changes.
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts`

Manual smoke checklist:
- [ ] `cmd /c npm run dev:app`
- [ ] Open Form Profiles.
- [ ] Screen is not black.
- [ ] No `ReferenceError: variable is not defined`.
- [ ] No getSnapshot warning loop.
- [ ] Create a new Form Profile.
- [ ] Switch Profile / Request Template / Schema tabs.
- [ ] Change sample values in PreviewPanel.
- [ ] Click Cancel/Save without crash.
- [ ] Go to Form Run from saved profile, if the button is available.

## Security impact
- No sandbox/contextIsolation changes.
- No Node access added to renderer.
- No secrets or tokens exposed.
- No new IPC channels or preload bridge changes.

## IPC impact
none

## Docs impact
- Initiative artifacts and workpack prompt-pack are created/updated.
- No architecture/index updates required because no contracts or ownership boundaries change.

## Rollback
- Revert the two renderer file edits in `FormEditor.tsx` and `FormProfilesManager.tsx`.
- Revert this initiative/workpack artifact folder if abandoning the initiative.
- Re-run validators/tests/build after rollback.

## Done criteria
- [x] APPLY diff is minimal and only in allowed files.
- [x] Verification commands executed and recorded.
- [x] REVIEW Gate = GO or explicit NO-GO with Must Fix.
- [x] Delivery report is updated with manual smoke status.

## Risks
- Manual Electron smoke may remain pending in this run.
- Existing dirty `package-lock.json` must be treated as pre-existing and not modified.
- Optional `tsc --noEmit` may expose unrelated pre-existing type errors.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
- `plan.md`
- `review.md`
