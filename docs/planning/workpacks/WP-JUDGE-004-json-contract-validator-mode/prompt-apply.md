# Prompt Apply: WP-JUDGE-004 JSON Contract Validator Mode

## Mode
APPLY after PLAN and gate evaluation.

## Scope
Implement first bounded JSON contract validator layer in the current Judge compatibility flow.

## Apply steps
1. Extend shared Judge TS/JS types and guards.
2. Extend preload sanitizer for validation config and export result validator findings.
3. Add pure deterministic validator helpers to `judgePipeline.js`.
4. Add validator findings to LLM prompt context and result metadata.
5. Add minimal CompareDraft/CompareView validation controls and findings display.
6. Update/add targeted tests.
7. Run verification.

## Forbidden during APPLY
- No dependencies/package/lockfile changes.
- No new IPC channel.
- No full JSON Schema engine.
- No provider settings changes.
- No prompt/rubric source edits.
- No preset catalog runtime import.
- No EvaluationRun/history/storage.
- No large CompareView redesign.
