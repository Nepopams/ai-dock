# Prompt: FIXPACK - WP-IN-2026-036 Judge Dynamic Criteria Display

MODE: APPLY FIXPACK.

## Preconditions
- REVIEW returned NO-GO.
- Must Fix items are explicit.
- Fix remains inside the same allowed files and executor routing.

## Fixpack rules
- Fix only REVIEW Must Fix items.
- Do not expand scope.
- Do not touch forbidden files.
- Re-run targeted verification for changed areas.
- Stop if a fix requires shared/main/preload/storage/export/package changes.

## Output
1. Must Fix addressed
2. Files changed
3. Commands run
4. Targeted verification results
5. Residual risks
