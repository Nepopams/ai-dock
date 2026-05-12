# Prompt Apply: WP-JUDGE-007B EvaluationRun History Store

Apply the approved PLAN in `workpack.md`.

## Scope
Implement a separate file-backed EvaluationRun store and bounded IPC/preload API:
- shared storage-level guards and IPC constants;
- main storage service under `src/main/storage/evaluationRunStore.js`;
- main IPC handlers and bootstrap registration;
- preload `window.evaluationRuns` module and registration;
- targeted tests and docs updates.

## Hard boundaries
- Do not touch chat history storage or chat history IPC.
- Do not touch Judge runtime pipeline.
- Do not touch export IPC unless a new human gate approves it.
- Do not change renderer UI.
- Do not change provider/settings or packages.
- Do not add dependencies.

## Verification
Run the commands listed in `workpack.md` and update initiative run-state and delivery report with exact results.
