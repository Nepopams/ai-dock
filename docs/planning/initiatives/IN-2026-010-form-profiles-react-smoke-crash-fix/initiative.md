# Initiative - IN-2026-010 Form Profiles React Smoke Crash Fix

## Initiative ID
`IN-2026-010-form-profiles-react-smoke-crash-fix`

## Title
Form Profiles React Smoke Crash Fix

## Status
Delivered / Manual Smoke Pending

## Owner
Human + Codex

## Goal
Fix the blocking Form Profiles crash and Zustand snapshot warning found after the React renderer default switch.

## User value
Users can open and use Form Profiles in the React UI without a black screen during smoke testing.

## Problem
After IN-2026-009, manual smoke found that opening Form Profiles crashes the renderer. Browser console reported:
- `FormProfilesManager.tsx:63 The result of getSnapshot should be cached to avoid an infinite loop`
- `FormEditor.tsx:1704 Uncaught ReferenceError: variable is not defined`
- The fatal render error happens in `PreviewPanel`.

## Success criteria
- Form Profiles opens without fatal render errors.
- `PreviewPanel` does not reference an undefined `variable` identifier.
- `FormProfilesManager` does not use an unstable object literal Zustand selector.
- No shared contracts, preload, main process, package metadata, or persisted profile schema changes.
- Required validators, tests, build, diff checks, and scope checks are executed and recorded.

## In scope
- Create initiative artifacts.
- Create one scoped renderer bugfix workpack and prompt pack.
- PLAN, autonomous gate evaluation, APPLY, QA, REVIEW, and delivery report.
- Fix the `PreviewPanel` `ReferenceError`.
- Remove the Form Profiles Zustand getSnapshot warning without behavior changes.
- Add only minimal defensive rendering if current state may be null/empty.

## Out of scope
- Redesigning Form Profiles.
- Rewriting `FormEditor`.
- Changing IPC contracts.
- Changing the FormProfile schema or persisted data.
- Changing main/preload/shared files.
- Changing package files or build scripts.
- Adding dependencies.
- Changing Form Runner runtime.

## Constraints
- L3 scoped renderer bugfix APPLY.
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary executor: `ai-dock-test-qa-executor`.
- Runtime changes must stay in the explicit renderer allow-list.
- Stop if the fix needs shared schema/contracts, main/preload/package changes, or a large `FormEditor` rewrite.

## Strong human gate triggers
- Need to change `src/main/**`, `src/preload/**`, `src/shared/**`, package files, dependency metadata, or build scripts.
- Need to change FormProfile schema or persisted data.
- Need a broad `FormEditor` rewrite or ErrorBoundary implementation in this workpack.
- Need runtime changes outside the allowed files.
- Verification cannot be run safely.

## Candidate epics
- E1: Form Profiles React smoke unblocker.

## Risks
- Automated tests may not include a React render smoke for Form Profiles, so manual Electron smoke remains important.
- Worktree already had a modified `package-lock.json`; this initiative must not modify it.
- `npx tsc --noEmit` may reveal pre-existing unrelated type errors.

## Links
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/delivery-report.md`
- `docs/planning/workpacks/WP-IN-2026-010-form-profiles-react-smoke-crash-fix/workpack.md`
