# Prompt Review: WP-JUDGE-003 Custom Rubric / Custom Prompt

## Mode
REVIEW.

## Review checks
- Backward compatibility preserved.
- Existing `window.judge.run(input)` flow still works.
- Existing answer comparison still requires 2+ answers.
- No new IPC channels.
- No package/lock/dependency changes.
- No provider settings changes.
- No prompt/rubric source file changes.
- Preset catalog not connected to runtime.
- CompareView only minimally changed.
- `customPrompt` text is not stored in metadata or exported metadata by default.
- Tests pass.
- Build and preload build pass.
- Workpack/initiative validators pass.
- Delivery report contains follow-ups.

## Required verification
Run every command listed in `workpack.md`.
