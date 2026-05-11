# PLAN - WP-IN-2026-010

## PLAN summary
The crash and warning are both renderer-local. The workpack can proceed under L3 autonomy with no strong human gate because the fix does not require shared contracts, main/preload, package metadata, dependencies, data migration, or a broad rewrite.

## Required answers
1. Undefined `variable` location: `src/renderer/react/views/forms/FormEditor.tsx` line 1152 in `PreviewPanel` renders `{{variable}}` directly in JSX text. JSX treats this as an object expression containing shorthand property `variable`, so rendering throws `ReferenceError: variable is not defined`. The browser console line 1704 appears to be the transformed/sourcemapped location.
2. Tests/build missed it because `npm test` runs Node tests only, not a React render smoke for Form Profiles. `npm run build` uses Vite/esbuild and does not execute `PreviewPanel`; it also does not typecheck with `tsc --noEmit`.
3. Minimal correcting diff: replace direct `{{variable}}` JSX text with a string expression such as `{"{{variable}}"}`.
4. `FormProfilesManager` warning cause: `useDockStore((state) => ({ ... }))` returns a fresh object each snapshot read. React 19/Zustand v5 warns that `getSnapshot` results should be cached to avoid an infinite loop.
5. Warning fix: use individual `useDockStore((state) => state.x)` selectors. This avoids adding imports/dependencies and preserves behavior. `useShallow` is not necessary.
6. ErrorBoundary: not needed for this minimal fix. A small ErrorBoundary can be a follow-up workpack if desired.
7. Files to change: `src/renderer/react/views/forms/FormEditor.tsx`, `src/renderer/react/views/forms/FormProfilesManager.tsx`, and initiative/workpack docs.
8. Checks: initiative/workpack validators, `npm test`, `npm run build`, optional `npx tsc --noEmit --pretty false`, git status/diff/stat/check/scope checks.

## File-level plan
- `FormEditor.tsx`: escape/render the `{{variable}}` placeholder as literal string text.
- `FormProfilesManager.tsx`: split the object selector into individual selectors for `formProfiles`, `formProfilesLoading`, `formProfilesError`, `formProfilesFilter`, `formProfilesSelectedId`, and `formProfilesLastTest`.
- Docs: update run-state, gates, queue, delivery report, and REVIEW artifacts.

## Gate evaluation
Gate B passes autonomously under L3. No strong human gate is triggered.
