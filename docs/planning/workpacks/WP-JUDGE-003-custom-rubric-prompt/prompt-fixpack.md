# Prompt Fixpack: WP-JUDGE-003 Custom Rubric / Custom Prompt

## Mode
FIXPACK only if REVIEW finds a Must Fix inside this workpack scope.

## Allowed fixes
- Correct shared guard parity.
- Correct preload sanitizer behavior.
- Correct bounded prompt assembly wording.
- Correct metadata flags without leaking custom prompt text.
- Correct CompareView payload/draft behavior.
- Correct tests or docs that describe this workpack.

## Stop conditions
Stop and request Human decision if a fix requires a new IPC channel, prompt source file edit, preset runtime integration, provider setting change, package/dependency change, large UI rewrite, or EvaluationRun/history/storage.
