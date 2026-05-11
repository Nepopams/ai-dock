# WP-IN-2026-010 Prompt - REVIEW

MODE: REVIEW ONLY / READ ONLY.

## Checks
- Diff matches workpack and PLAN.
- Changed files stay inside allowed files.
- Forbidden files are not modified by this initiative.
- `PreviewPanel` no longer uses undefined identifiers.
- FormProfilesManager no longer returns an unstable object snapshot selector.
- No shared/schema/IPC/preload/main/package/build changes.
- Validators/tests/build/diff checks are recorded.
- Manual smoke status is recorded.

## Verification
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-010-form-profiles-react-smoke-crash-fix`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-010-form-profiles-react-smoke-crash-fix/workpack.md`
- `npm test`
- `npm run build`

## Output
Write REVIEW result to `review.md`, update initiative run-state/queue/gates/delivery report, and give GO/NO-GO.
