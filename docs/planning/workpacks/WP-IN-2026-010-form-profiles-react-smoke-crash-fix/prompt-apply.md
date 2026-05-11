# WP-IN-2026-010 Prompt - APPLY

MODE: APPLY.

## Preconditions
- Workpack is valid.
- PLAN is complete.
- L3 autonomous gate evaluation found no strong human gate.
- Allowed files and forbidden files are explicit.

## Execution
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary executor: `ai-dock-test-qa-executor`.
- Make a minimal diff only in allowed files.
- Stop if shared schema/contracts, main/preload/package files, or large rewrite is needed.

## Required implementation
1. Fix undefined `variable` in `PreviewPanel` by rendering the placeholder as literal text.
2. Replace `FormProfilesManager` object selector with individual selectors.
3. Preserve current preview/test behavior.
4. Do not change persisted `FormProfile` shape.
5. Do not change IPC, preload, main process, dependencies, package files, or build scripts.

## Verification
Run the commands listed in the workpack test plan and record results in run-state and delivery report.

## Output
Update initiative artifacts and prepare REVIEW.
