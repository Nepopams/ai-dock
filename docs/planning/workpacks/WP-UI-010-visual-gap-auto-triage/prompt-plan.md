# WP-UI-010 PLAN Prompt

You are Codex Initiative Runner for VR AI Dock.

Mode: L2 visual QA / design triage / docs APPLY. Runtime APPLY is forbidden.

Plan requirements:
1. Confirm current screenshot coverage.
2. Confirm Codex can visually inspect PNGs.
3. STOP if image inspection is unavailable.
4. Identify screens that are NO-GO, GO with polish, GO, or Pending screenshot.
5. Identify screens that require React layout changes rather than CSS-only changes.
6. Identify previous workpacks that missed visible owner files.
7. List exact docs to change.
8. Confirm no strong gate is active.

Forbidden files:
- `src/**`
- package/config/scripts/build/release/dependency files.

Verification:
- Initiative validator.
- Workpack validator.
- `git diff --check`.
- Forbidden-path status check.
