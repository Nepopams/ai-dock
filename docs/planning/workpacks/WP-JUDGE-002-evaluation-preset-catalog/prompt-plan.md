# Prompt Plan: WP-JUDGE-002 Evaluation Preset Catalog

## Mode
PLAN, read-only except file-backed initiative/workpack state.

## Required answers
1. Where should the static evaluation preset catalog live?
2. Are shared types/guards needed in this workpack?
3. Can JSON catalog be used without package/config changes?
4. How will current Judge runtime remain untouched?
5. What catalog v1 format should be used?
6. Which MVP presets are included?
7. Which tests are added?
8. Is any strong gate triggered?
9. Which exact files may change?

## PLAN conclusion
Use `src/shared/presets/evaluation/catalog.json` plus `README.md`, add new isolated `src/shared/types/evaluationPreset.*` guards, add `tests/evaluationPresets.test.js`, and do not touch current Judge runtime, IPC, preload, renderer, current Judge types, prompts, package, config, or scripts. No strong gate is triggered.
