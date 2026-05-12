# Prompt Plan: WP-JUDGE-005 Local LLM Backend Labeling UX

## Mode
PLAN, read-only except initiative/workpack artifacts.

## Required answers
1. Where should the label helper live?
2. How are backend labels computed without profile schema changes?
3. Which labels are used?
4. How does wording avoid privacy guarantees?
5. Are main/preload/IPC changes needed?
6. Are settings storage changes needed?
7. Which exact files change?
8. Which tests are added?
9. Is any strong gate triggered?

## PLAN conclusion
Use a pure shared helper in `src/shared/utils`. Derive labels from existing `driver`, `baseUrl`, and `defaultModel`. Show concise labels in Connections and Judge profile selector. Use explicit "inferred" and "not a privacy guarantee" copy. No main/preload/IPC/settings/package changes are required. No strong gate is triggered.
