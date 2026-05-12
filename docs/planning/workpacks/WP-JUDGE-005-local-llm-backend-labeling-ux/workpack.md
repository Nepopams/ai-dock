# Workpack: WP-JUDGE-005 Local LLM Backend Labeling UX

## Workpack ID
`WP-JUDGE-005-local-llm-backend-labeling-ux`

## Title
Judge Local LLM Backend Labeling UX

## Status
Completed

## Owner
Human + Codex

## Mode
L3 scoped renderer/shared utility/test APPLY. Human approval is provided in the IN-2026-030 prompt. APPLY is allowed only because PLAN found no strong gate.

## Type
`runtime-development`

## Selected executor
- `ai-dock-renderer-react-executor`

## Primary skill
- `ai-dock-renderer-react-executor`

## Secondary executors
- `ai-dock-test-qa-executor`
- `ai-dock-security-hardening-executor` for privacy wording review only

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
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/initiatives/IN-2026-024-judge-current-contract-hardening/delivery-report.md`
- `docs/planning/initiatives/IN-2026-025-judge-evaluation-preset-catalog/delivery-report.md`
- `docs/planning/initiatives/IN-2026-026-judge-custom-rubric-prompt/delivery-report.md`
- `docs/planning/initiatives/IN-2026-027-judge-json-contract-validator/delivery-report.md`
- `src/main/services/settings.js`
- `src/main/services/judgePipeline.js`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/store/useDockStore.ts`
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `tests/**`
- `package.json`

## Goal
Add derived backend labels for existing completions profiles and show those labels in Connections and Judge profile selection.

## User value
Users can see whether a Judge profile appears to target a cloud/API endpoint, a local endpoint, a private-network endpoint, or an unknown endpoint, while also seeing driver and model context.

## In scope
- Create a pure shared helper `inferCompletionsProfileLabels(profile)`.
- Show driver/backend/model labels in the Connections profile list and selected profile details.
- Show profile/backend/model labels in the CompareView Judge profile dropdown.
- Add conservative privacy helper copy.
- Add targeted helper tests.
- Add initiative/workpack artifacts and a short architecture note.

## Out of scope
- Persisted profile fields.
- Settings storage migration.
- Main/preload/IPC changes.
- Judge pipeline changes.
- Provider code changes.
- Dedicated local provider.
- Model discovery or endpoint health checks.
- Evaluation Studio UI.
- New dependencies.

## Current architecture context
Completions profiles are stored by `src/main/services/settings.js` and exposed to renderer through existing completions APIs. Profiles include `driver`, `baseUrl`, `defaultModel`, optional request settings, auth metadata, and generic HTTP config. Judge currently selects a profile by `judgeProfileId`; this workpack changes only renderer display and a shared pure helper.

## Allowed files
- `src/shared/utils/completionsProfileLabels.ts`
- `src/shared/utils/completionsProfileLabels.js`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `tests/completionsProfileLabels.test.js`
- `docs/planning/initiatives/IN-2026-030-judge-local-llm-backend-labeling-ux/**`
- `docs/planning/workpacks/WP-JUDGE-005-local-llm-backend-labeling-ux/**`
- `docs/architecture/judge-mode-evaluation-studio.md`

## Forbidden files
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `src/main/**`
- `src/preload/**`
- `src/shared/ipc/**`
- `src/shared/prompts/judge/**`
- `src/shared/presets/evaluation/**`
- `src/main/providers/**`
- `src/main/services/settings.js`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## PLAN conclusion
1. Place helper in `src/shared/utils` because it is pure profile data derivation used by renderer and tests.
2. Compute labels from existing `profile.driver`, `profile.baseUrl`, and `profile.defaultModel`; do not persist labels.
3. Labels: `OpenAI-compatible`, `Generic HTTP`, `Local endpoint`, `Private network endpoint`, `Cloud/API endpoint`, `Unknown endpoint`, and model summary.
4. Privacy wording must use "inferred" and "not a privacy guarantee."
5. Main/preload/IPC changes are not needed. If needed later, STOP.
6. `settings.js` changes are not needed. If needed later, STOP.
7. Exact files: shared helper TS/JS, two renderer views, one test file, docs, and short architecture note.
8. Tests cover endpoint classification, generic driver labels, invalid/missing URLs, and absence of auth/token values in labels.
9. No strong gate triggered.

## Step-by-step plan
1. Add `inferCompletionsProfileLabels` TS/JS helper.
2. Add targeted helper tests.
3. Import helper into `CompletionsSettings.tsx` and render concise labels in list/details.
4. Import helper into `CompareView.tsx`, build richer option labels, and add conservative helper text under the selector.
5. Add short implementation note to Judge architecture report.
6. Run required validators, tests, build, diff checks, and forbidden-path status check.
7. Update run-state, task queue, workpack status, and delivery report.

## Acceptance criteria
- [x] Helper classifies localhost, 127.0.0.1, and ::1 as local.
- [x] Helper classifies 10.x.x.x, 172.16-31.x.x, 192.168.x.x, and `.local` as private network.
- [x] Helper classifies hosted URLs as cloud/API.
- [x] Helper classifies missing/invalid URL as unknown.
- [x] Generic HTTP profiles show `Generic HTTP` driver label while retaining endpoint classification.
- [x] Labels do not include token/auth data.
- [x] Connections UI displays driver/backend/model labels without changing save payload.
- [x] Judge profile dropdown displays profile/backend/model labels without changing Judge input contract.
- [x] Privacy helper copy avoids local-only guarantees.
- [x] No forbidden files are changed.

## Test plan
- Add `tests/completionsProfileLabels.test.js`.
- Run `node --check src/shared/utils/completionsProfileLabels.js`.
- Run `node --test tests/completionsProfileLabels.test.js`.
- Run full `npm test`.
- Run `npm run build`.
- Run required diff and forbidden-path checks.

## Security impact
The helper must ignore auth/token/request secret values and never include them in returned labels. UI copy must warn that local/private endpoint labels are inferred from URL and are not privacy guarantees.

## IPC impact
No IPC impact. Existing completions profile APIs already supply the profile data needed by the renderer, and Judge keeps using the existing input contract.

## Docs impact
Adds IN-2026-030 initiative docs, `WP-JUDGE-005` prompt-pack, and a short implementation note in `docs/architecture/judge-mode-evaluation-studio.md`.

## Rollback
Revert the helper, tests, renderer label display edits, architecture note, and planning artifacts. No storage migration or runtime rollback is needed.

## Done criteria
- [x] Workpack validator PASS.
- [x] Initiative validator PASS.
- [x] Helper syntax check PASS.
- [x] Targeted helper tests PASS.
- [x] Full tests PASS.
- [x] Build PASS.
- [x] Diff check PASS.
- [x] Forbidden-path scope check PASS.
- [x] Delivery report complete.

## Risks
- URL-based inference can be misleading for proxies, tunnels, or DNS rewrites.
- UI labels can get long when model/profile names are long.
- Future explicit backend metadata may supersede these derived labels.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
