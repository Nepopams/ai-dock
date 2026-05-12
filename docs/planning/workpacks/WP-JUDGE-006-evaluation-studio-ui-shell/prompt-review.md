# Prompt Review: WP-JUDGE-006 Evaluation Studio UI Shell

## Objective
Review the implementation for scope, behavior, and verification.

## Review checks
- `EvaluationStudioView` exists.
- `App.tsx` routes compare to `EvaluationStudioView`.
- Existing `CompareView` is reused, not rewritten.
- Empty/manual start appears when `compareDraft` is absent.
- Manual start uses existing store action and no new IPC.
- Planned modes are visible but not active runtime features.
- No main/preload/shared/runtime/pipeline/package/dependency changes.
- Epic roadmap/workpack map updated.
- Validators, tests, build, diff, and forbidden-path checks are recorded.
- Manual smoke checklist is recorded.

## Verdict format
Return `GO`, `GO WITH FOLLOW-UPS`, or `STOP-THE-LINE`, with findings ordered by severity.
