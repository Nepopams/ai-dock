# Prompt Apply: WP-JUDGE-001 Current Contract Hardening

## Mode
APPLY, scoped runtime hardening.

## Guardrails
- Do not add IPC channels.
- Do not change package/lock/dependencies.
- Do not touch provider settings.
- Do not touch prompts/rubrics.
- Do not implement EvaluationRun, presets, validators, or history storage.
- Do not redesign CompareView.

## Apply steps
1. Add optional `JudgeResult.metadata` type/guard support.
2. Add optional `JudgeRunResponse.code` and progress stage type support.
3. Add result metadata in `judgePipeline.js`.
4. Sanitize error details and add stable error codes in `judge.ipc.js`.
5. Harden preload Judge export sanitizer.
6. Store optional error code and avoid raw stack details in `judgeSlice.ts`.
7. Add minimal progress labels in CompareView if needed.
8. Add targeted tests.
9. Run all required verification.
10. Update run-state and delivery report.
