# Evaluation Preset Catalog

This directory contains the initial static Evaluation Preset Catalog for future Judge Mode / Evaluation Studio work.

Current status:
- `catalog.json` is shared data only.
- The current Judge pipeline does not import or consume this catalog.
- There is no preset picker, runtime prompt assembly, validator execution, IPC channel, preload bridge, or renderer integration in this workpack.
- Validators in the catalog are declarative definitions only.

Future integration work must use separate scoped workpacks for:
- runtime prompt assembly;
- deterministic validator execution;
- Evaluation Studio UI and preset picker;
- EvaluationRun history/export;
- n8n or workflow consumption.

Changing preset data should be accompanied by catalog validation tests in `tests/evaluationPresets.test.js`.
