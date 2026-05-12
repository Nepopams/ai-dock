# Prompt Fixpack: WP-JUDGE-004 JSON Contract Validator Mode

## Mode
FIXPACK only if REVIEW finds a Must Fix inside this workpack scope.

## Allowed fixes
- Correct shared validation guards.
- Correct preload sanitizer behavior.
- Correct deterministic parse/required-key/simple-enum helpers.
- Correct validator prompt context.
- Correct minimal CompareView behavior.
- Correct tests/docs inside allowed paths.

## Stop conditions
Stop if a fix requires a dependency, new IPC channel, full schema engine, provider settings change, prompt source edit, preset runtime import, large UI redesign, or EvaluationRun/history/storage.
