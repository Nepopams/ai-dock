# Prompt Apply: WP-JUDGE-003 Custom Rubric / Custom Prompt

## Mode
APPLY after PLAN and gates.

## Scope
Implement the backward-compatible `customPrompt` field in the existing Judge compatibility flow only.

## Apply steps
1. Add optional `customPrompt` and metadata flags to shared Judge TS/JS contracts and guards.
2. Update preload sanitizer to trim `customPrompt`, omit empty strings, and reject non-string values.
3. Update `judgePipeline.js` prompt assembly with a bounded custom-instructions block and preserve strict JSON output.
4. Add metadata flags for `rubricSource` and `customPromptApplied`; never include the full custom prompt in metadata.
5. Update CompareDraft and CompareView minimally to capture and send custom judge instructions.
6. Add/update targeted tests.
7. Add a short architecture implementation note only if the architecture report exists on the current branch; otherwise record why it was skipped.
8. Run verification commands.

## Forbidden during APPLY
- No new IPC channels.
- No prompt/rubric source edits.
- No preset catalog runtime integration.
- No package/dependency/config/script changes.
- No provider settings changes.
- No EvaluationRun/history/storage.
