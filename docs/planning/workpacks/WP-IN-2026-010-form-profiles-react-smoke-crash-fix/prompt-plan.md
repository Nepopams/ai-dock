# WP-IN-2026-010 Prompt - PLAN

MODE: PLAN ONLY / READ ONLY.

## Task
Analyze the Form Profiles React smoke crash and produce a file-level plan to fix:
- `ReferenceError: variable is not defined` in `PreviewPanel`.
- Zustand/React getSnapshot warning in `FormProfilesManager`.

## Must read
- `AGENTS.md`
- `CODEX.md`
- `docs/planning/workpacks/WP-IN-2026-010-form-profiles-react-smoke-crash-fix/workpack.md`
- `src/renderer/react/views/forms/FormProfilesManager.tsx`
- `src/renderer/react/views/forms/FormEditor.tsx`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/store/formProfilesSlice.ts`
- `src/shared/types/form.ts`
- `package.json`

## Required PLAN answers
1. Where exactly `PreviewPanel` uses undefined `variable`.
2. Why current tests/build did not catch it.
3. Minimal correcting diff.
4. Why `FormProfilesManager` triggers getSnapshot warning.
5. Whether to use individual selectors or `useShallow`.
6. Whether an ErrorBoundary is needed.
7. Files to change.
8. Verification commands.

## Output
Write the PLAN result to `plan.md` and update initiative run-state/queue/gates.
