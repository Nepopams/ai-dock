# REVIEW Prompt: WP-UI-001 Design Handoff Inventory

You are Codex reviewer for VR AI Dock.

Mode: REVIEW, read-only except updating review state artifacts if needed.

## Review checks
- Design handoff folder exists.
- Source README explains `.pen` as source/reference.
- Exports README lists all required PNG filenames.
- Design tokens are documented.
- Implementation notes map frames to current files, target visual changes, out of scope, and smoke checks.
- Screen map exists.
- UI workpack roadmap exists and starts runtime work with `WP-UI-002`.
- No runtime source files changed.
- No package/config/script files changed.
- No dependencies added.
- Initiative validator passes.
- Workpack validator passes.
- `git diff --check` passes.
- Delivery report says runtime APPLY was not performed.

## Verdict
Return `GO` only if all checks pass. Return `NO-GO` with Must Fix items if any check fails.
