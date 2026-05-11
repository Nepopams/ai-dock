# Prompt Plan: WP-JUDGE-001 Current Contract Hardening

## Mode
PLAN read-only, except allowed Initiative Runner run-state/workpack docs.

## Required answers
- Which current Judge contracts exist?
- What exactly should be hardened now?
- What stays in later Evaluation Studio phases?
- Can changes be backward-compatible?
- Are new IPC channels needed? If yes, STOP.
- Are package/dependency changes needed? If yes, STOP.
- Which exact files should change?
- Which tests should be added?
- How will stack/token/secret details be kept out of renderer-visible errors?
- How will current CompareView behavior be preserved?

## PLAN conclusion
No strong gate found for optional metadata/code/progress hardening, safe error details, sanitizer fixes, and targeted tests. APPLY may proceed inside allowed files only.
