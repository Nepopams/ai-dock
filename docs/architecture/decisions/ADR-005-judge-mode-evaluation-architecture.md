# ADR-005: Judge Mode Evaluation Architecture

## Status
Proposed

## Context
VR AI Dock already has a basic Judge prototype:
- `src/main/services/judgePipeline.js`
- `src/main/ipc/judge.ipc.js`
- `src/shared/types/judge.*`
- `src/shared/ipc/judge.ipc.*`
- `src/shared/prompts/judge/system.md`
- `src/shared/prompts/judge/rubric.md`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/views/CompareView.tsx`

The prototype evaluates answer comparisons through one completions profile with fixed criteria: `coherence`, `factuality`, and `helpfulness`. It is useful as a first vertical slice, but it does not represent the target product capability.

Judge Mode needs to become an Evaluation Studio that can evaluate:
- answer comparisons;
- single answer quality;
- research outputs;
- structured JSON outputs;
- prompt adherence;
- custom rubrics and judge prompts;
- code/technical answers;
- UX/product/design outputs;
- multi-agent results.

It must support API models, local LLMs through existing profiles, deterministic validators, hybrid evaluation, export, and eventual history/workflow integration.

## Decision
Treat Judge Mode as a first-class Evaluation Studio capability, not as a narrow CompareView extension.

Target architecture:
- Introduce an `EvaluationRun` model as the long-term artifact shape.
- Treat answer comparison as one evaluation mode, not the root model.
- Use existing completions profiles for MVP API and local LLM backends.
- Use local OpenAI-compatible profiles and generic HTTP profiles before adding any dedicated local provider profile.
- Add deterministic validators as explicit result sources, not hidden prompt instructions.
- Keep LLM judge findings separate from deterministic validator findings.
- Stage implementation through bounded workpacks. No giant APPLY is allowed.

This ADR does not authorize runtime changes. It defines the direction for future workpacks.

## Options considered
### Option A: Harden current CompareView/Judge prototype only
Benefits:
- Smallest near-term implementation.
- Reuses current pipeline and UI.

Risks:
- Preserves hard-coded criteria and answer-only model.
- Makes JSON validation, custom presets, and history/export harder later.
- Encourages product scope to accrete inside CompareView.

Decision:
- Rejected as target architecture.
- Still useful as compatibility input for `WP-JUDGE-001`.

### Option B: Build Evaluation Studio around `EvaluationRun`
Benefits:
- Supports multiple evaluation types.
- Gives future n8n/RAG/workflow layers a stable artifact.
- Allows deterministic validators and LLM judging to coexist.
- Lets existing CompareView become one mode inside a larger capability.

Risks:
- Requires staged shared/preload/main/renderer/history work.
- Needs careful compatibility with the current Judge prototype.
- Requires privacy/export decisions before persistence expands.

Decision:
- Accepted as target direction.

### Option C: Create a dedicated local LLM provider system first
Benefits:
- Clearer local model UX.
- Could support model discovery and local-only guarantees.

Risks:
- Requires provider settings model changes and likely migration.
- Blocks user value that existing OpenAI-compatible/generic HTTP profiles can already unlock.
- Increases scope before Judge contract is stable.

Decision:
- Deferred.
- Reuse existing profiles first.

### Option D: Deterministic validators only
Benefits:
- Reproducible and low cost.
- Strong fit for JSON validation.

Risks:
- Cannot judge nuance, research quality, or UX/product critique alone.
- Does not compare natural-language answer quality well.

Decision:
- Adopt as part of hybrid architecture, not the whole product.

## Consequences
- Future Judge workpacks should be framed as Evaluation Studio work unless intentionally limited to prototype maintenance.
- `JudgeInput/JudgeResult` should be treated as prototype/compatibility shape, not final contract.
- The first implementation workpack should harden contract and result handling before adding UI breadth.
- Presets and validators should be explicit data/model concepts.
- Existing completions profiles are the MVP backend abstraction.
- Dedicated local provider profile work requires a separate Human Gate.
- History/export work requires a separate data/storage/privacy gate.

## Follow-up workpacks
- `WP-JUDGE-001 Current Contract Hardening`
- `WP-JUDGE-002 Evaluation Preset Catalog`
- `WP-JUDGE-003 Custom Rubric / Custom Judge Prompt`
- `WP-JUDGE-004 JSON / Schema Validator Mode`
- `WP-JUDGE-005 Local LLM Backend Labeling and UX`
- `WP-JUDGE-006 Evaluation Studio UI Shell`
- `WP-JUDGE-007 EvaluationRun History and Export`
- `WP-JUDGE-008 Tests and Smoke Suite`
- `WP-JUDGE-009 Research Comparison Mode`
- `WP-JUDGE-010 n8n EvaluationRun integration preflight`

## Strong gates
Stop and request Human decision before:
- changing `src/shared/**` Judge/evaluation contracts;
- adding or changing IPC channels;
- changing preload bridge exposure;
- changing `src/main/**` Judge pipeline/provider behavior;
- changing `src/renderer/**` Judge/Studio UI or store;
- changing completions provider settings format;
- adding dependencies or modifying package/lock files;
- adding history/storage format for EvaluationRun;
- exporting raw/sensitive evaluation inputs by default;
- implementing multiple runtime layers in one APPLY.

## Validation strategy
For docs-only planning:
- validate initiative artifacts;
- validate workpack structure;
- run `git diff --check`;
- confirm forbidden runtime/source/package/build paths are not changed.

For future runtime workpacks:
- run targeted unit tests for contracts, sanitizers, validators, and parser behavior;
- run preload build when bridge changes;
- run `npm test`;
- manually smoke answer comparison, custom rubric, JSON validation, API profile, local OpenAI-compatible profile, generic HTTP profile, provider failure, export, and no-profile state;
- verify no token/secret values appear in renderer, logs, exports, or debug details.
