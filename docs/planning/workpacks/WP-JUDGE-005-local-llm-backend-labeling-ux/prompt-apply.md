# Prompt Apply: WP-JUDGE-005 Local LLM Backend Labeling UX

## Mode
APPLY after PLAN and gate evaluation.

## Scope
Implement derived completions profile backend labels in shared utility and renderer UI only.

## Apply steps
1. Add `src/shared/utils/completionsProfileLabels.ts`.
2. Add CommonJS parity helper in `src/shared/utils/completionsProfileLabels.js`.
3. Add helper tests.
4. Update `CompletionsSettings.tsx` labels and helper note.
5. Update `CompareView.tsx` Judge profile option labels and helper text.
6. Add short architecture note.
7. Run verification and update reports.

## Forbidden during APPLY
- No package/dependency changes.
- No settings storage schema changes.
- No main/preload/IPC changes.
- No provider changes.
- No Judge pipeline changes.
- No dedicated local provider.
- No Evaluation Studio UI.
- No broad UI redesign.
