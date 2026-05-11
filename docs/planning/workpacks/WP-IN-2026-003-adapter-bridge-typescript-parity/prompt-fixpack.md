# FIXPACK Prompt - WP-IN-2026-003

MODE: APPLY (Fixpack).

## Preconditions
- REVIEW returns NO-GO.
- Must Fix items are bounded to the same allowed paths and executor.

## Fixpack rules
- Fix only REVIEW Must Fix items.
- Do not expand scope.
- Do not change `adapterBridge.js`, `bootstrap.js`, shared, preload, renderer, package metadata, or lockfile.
- Repeat targeted verification and REVIEW.

## Output
Record Must Fix addressed, files changed, commands run, targeted verification results, and residual risks.
