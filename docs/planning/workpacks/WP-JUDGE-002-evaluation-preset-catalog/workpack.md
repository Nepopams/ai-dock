# Workpack: WP-JUDGE-002 Evaluation Preset Catalog

## Workpack ID
`WP-JUDGE-002-evaluation-preset-catalog`

## Title
Judge Evaluation Preset Catalog

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped shared-data/test APPLY. Human approval is provided in the IN-2026-025 prompt. APPLY is allowed only if PLAN finds no strong gate.

## Type
`runtime-development`

## Selected executor
- `ai-dock-main-process-executor`

## Primary skill
- `ai-dock-main-process-executor`

## Secondary executors
- `ai-dock-test-qa-executor`
- `ai-dock-renderer-react-executor` for future UI readiness assessment only; no UI changes.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`
- Remote/planning-branch `docs/architecture/judge-mode-evaluation-studio.md`
- Remote/planning-branch `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/initiatives/IN-2026-024-judge-current-contract-hardening/delivery-report.md`
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/shared/ipc/judge.ipc.ts`
- `src/shared/ipc/judge.ipc.js`
- `src/main/services/judgePipeline.js`
- `src/renderer/react/views/CompareView.tsx`
- `tests/**`
- `package.json`
- `tsconfig.json`

## Goal
Add the first static Evaluation Preset Catalog v1 as shared data/model foundation for future Evaluation Studio work without changing current Judge runtime behavior.

## User value
The product gets a reusable preset foundation for common evaluation scenarios, enabling future UI/runtime work to offer ready-made modes instead of relying on hand-written rubrics.

## Current architecture context
Current Judge is still an answer-comparison prototype. `WP-JUDGE-001` hardened optional result/error/progress metadata but did not add presets, validators, EvaluationRun, or UI. This workpack adds static catalog data only; the current pipeline still uses fixed prototype rubric/criteria.

## Affected modules
- `shared data`
- `shared types`
- `tests`
- `docs/planning`

## In scope
- Static catalog JSON in `src/shared/presets/evaluation/**`.
- README next to catalog describing static/non-runtime status.
- New shared `EvaluationPreset` types/guards in `src/shared/types/evaluationPreset.*`.
- Targeted catalog validation tests.
- Initiative/workpack/run-state/delivery docs.

## Out of scope
- Judge pipeline prompt assembly.
- IPC/preload/renderer integration.
- CompareView or Evaluation Studio UI.
- Runtime deterministic validators.
- EvaluationRun storage/history.
- Provider settings.
- Package/dependency/config changes.
- Current `JudgeInput`/`JudgeResult` changes.

## Allowed files
- `src/shared/presets/evaluation/**`
- `src/shared/types/evaluationPreset.ts`
- `src/shared/types/evaluationPreset.js`
- `tests/evaluationPresets.test.js`
- `docs/planning/initiatives/IN-2026-025-judge-evaluation-preset-catalog/**`
- `docs/planning/workpacks/WP-JUDGE-002-evaluation-preset-catalog/**`
- `docs/architecture/judge-mode-evaluation-studio.md` only if present and only for a short implementation note
- `docs/_indexes/source-of-truth.md` only if adding a catalog/report link
- `docs/_indexes/feature-index.md` only if adding a Judge preset catalog link

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/renderer/**`
- `src/shared/ipc/**`
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/shared/prompts/judge/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Expected file changes
- `src/shared/presets/evaluation/catalog.json`
- `src/shared/presets/evaluation/README.md`
- `src/shared/types/evaluationPreset.ts`
- `src/shared/types/evaluationPreset.js`
- `tests/evaluationPresets.test.js`
- initiative/workpack docs

## PLAN conclusion
1. Static catalog location: `src/shared/presets/evaluation/catalog.json` with a local README. This matches allowed paths and keeps the data near future shared model consumers.
2. Shared types/guards are useful now because they let tests validate catalog shape without dependencies and without changing `judge.ts`.
3. JSON catalog is viable with no package/config changes. Tests can parse it through Node built-ins.
4. Current Judge runtime stays untouched by not importing the catalog from main/preload/renderer/IPC and not changing current Judge types.
5. Catalog v1 format: top-level `schemaVersion`, `presets[]`; each preset has `id`, `title`, `purpose`, `evaluationType`, `defaultCriteria`, `defaultValidators`, `inputExpectations`, `outputShape`, `promptTemplateKey`, `version`, `tags`, and `status`.
6. MVP catalog includes 10 required presets: general answer quality, research quality, JSON contract check, prompt adherence, factuality/grounding, code review, security review, UX/product review, summarization quality, custom user rubric.
7. Tests: parse JSON, validate guard, unique ids, required ids, required fields, unique criteria ids, finite weights, known validators, custom user rubric flag, JSON validator presence, security validator presence, and no runtime import dependency.
8. Strong gate: none for static catalog/data/tests. Any runtime/UI/IPC/package change would stop.
9. Exact files to change: listed in Expected file changes.

## IPC impact
None. No channels, contracts, preload bridge, or IPC consumers are changed.

## Preload impact
None.

## Renderer impact
None. Future UI picker work is a separate workpack.

## Store impact
None.

## Data/storage impact
Adds static shared catalog data only. No user data, storage, migration, or persistence change.

## Security impact
No secrets, tokens, network calls, renderer Node access, IPC change, or runtime execution. Validators are declarative catalog entries only.

## Step-by-step plan
1. Add new `EvaluationPreset` TS type and JS guard counterpart.
2. Add static `catalog.json` with the 10 required MVP presets.
3. Add `README.md` beside the catalog explaining static status and future integration gates.
4. Add `tests/evaluationPresets.test.js`.
5. Run targeted and full verification.
6. Update run-state, gates, task queue, workpack status, and delivery report.

## Test strategy
- Use Node built-in test runner and `fs`/`path`.
- Validate catalog JSON with `isEvaluationPresetCatalog`.
- Assert required semantic constraints not fully captured by the guard.
- Confirm tests only import shared type guard and static JSON, not main/preload/renderer.

## Test plan
- Add `tests/evaluationPresets.test.js`.
- Run all verification commands listed below.

## Verification commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-025-judge-evaluation-preset-catalog`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-002-evaluation-preset-catalog/workpack.md`
- `node --check src/shared/types/evaluationPreset.js`
- `node --test tests/evaluationPresets.test.js`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/renderer src/shared/ipc src/shared/types/judge.ts src/shared/types/judge.js src/shared/prompts/judge package.json package-lock.json tsconfig.json vite.config.js scripts`

## Manual smoke checklist
No manual UI smoke required because no runtime/UI behavior changes. Future UI/runtime preset workpacks must add manual smoke.

## Docs/index updates required
- Initiative/workpack docs only.
- Do not update architecture report because it is absent from the stacked branch.
- Do not update indexes unless a later review requires explicit catalog links.

## Docs impact
- Adds IN-2026-025 initiative artifacts.
- Adds `WP-JUDGE-002-evaluation-preset-catalog` workpack and prompt-pack.
- Adds README beside static catalog.

## Rollback
Revert this workpack's changes in allowed files:
- remove `src/shared/presets/evaluation/**`;
- remove `src/shared/types/evaluationPreset.*`;
- remove `tests/evaluationPresets.test.js`;
- remove IN-2026-025 initiative/workpack docs.

No storage rollback is needed because no persisted user data is changed.

## Acceptance criteria
- [x] Catalog JSON parses.
- [x] Catalog has `schemaVersion`.
- [x] All required MVP preset ids exist.
- [x] Preset ids are unique.
- [x] Each preset has required metadata fields.
- [x] Criteria ids are unique per preset.
- [x] Criterion weights are finite numbers.
- [x] Validator types are known and declarative only.
- [x] `custom-user-rubric` allows user-defined criteria.
- [x] `json-contract-check` includes `json_parse`.
- [x] `security-review` includes `forbidden_secret_pattern`.
- [x] No runtime import from main/preload/renderer is needed.
- [x] No forbidden paths are changed.

## Done criteria
- [x] Workpack validator PASS.
- [x] Initiative validator PASS.
- [x] Required checks run and recorded.
- [x] REVIEW verdict recorded.
- [x] Delivery report complete.

## Risks
- Catalog is not yet connected to runtime/UI.
- Future prompt assembly may need schema evolution.
- Branch is stacked on IN-2026-024.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
