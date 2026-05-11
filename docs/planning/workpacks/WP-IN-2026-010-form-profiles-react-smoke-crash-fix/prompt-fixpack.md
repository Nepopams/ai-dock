# WP-IN-2026-010 Prompt - FIXPACK

MODE: APPLY FIXPACK.

## Preconditions
- REVIEW returned NO-GO.
- Must Fix items are explicit.
- Fixpack remains inside the existing allowed files and executor routing.

## Rules
- Fix only REVIEW Must Fix items.
- Do not expand scope.
- Do not change shared contracts, main, preload, package files, dependencies, or build scripts.
- Stop if Must Fix requires new paths or risk profile changes.

## Verification
Repeat the relevant workpack verification commands after the fix.

## Output
Update run-state, task queue, review, and delivery report.
