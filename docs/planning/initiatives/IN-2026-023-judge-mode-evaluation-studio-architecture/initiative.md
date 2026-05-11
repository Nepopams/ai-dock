# Initiative: IN-2026-023 Judge Mode / Evaluation Studio Architecture

## Initiative ID
`IN-2026-023-judge-mode-evaluation-studio-architecture`

## Title
Judge Mode / Evaluation Studio Architecture

## Status
Done

## Owner
Human + Codex

## Goal
Design Judge Mode as a first-class Evaluation Studio capability for VR AI Dock. The target capability must evaluate AI results through API models, local LLM profiles, evaluation presets, custom judge prompts/rubrics, deterministic validators, history, and export.

## User value
Users can compare answers from different Dock Agents, check research quality, validate structured outputs, inspect prompt adherence, and save/share evaluation results without leaving Dock.

## Problem
The current Judge prototype is useful but narrow. It compares an answer list with one `judgeProfileId`, one optional rubric, fixed criteria (`coherence`, `factuality`, `helpfulness`), manual JSON parsing/fallback, and no preset catalog, deterministic validators, evaluation history, or explicit local LLM mode. Planning is needed before runtime work so Judge does not become a hard-coded extension of `CompareView`.

## Success criteria
- [x] Initiative artifacts exist and are file-backed.
- [x] Planning workpack and prompt-pack exist.
- [x] Read-only audit covers the current Judge pipeline, IPC, contracts, prompts, store, UI, provider, export, and history dependencies.
- [x] Architecture/product report exists at `docs/architecture/judge-mode-evaluation-studio.md`.
- [x] ADR draft exists at `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`.
- [x] MVP, phased roadmap, preset catalog, backend strategy, and bounded implementation workpacks are defined.
- [x] Recommended first implementation workpack is identified.
- [x] No runtime/source/package/build files are changed by this initiative.

## In scope
- Create initiative artifacts under `docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture/**`.
- Create planning workpack and prompt-pack under `docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/**`.
- Perform read-only audit of existing Judge implementation.
- Design target Judge Mode / Evaluation Studio architecture.
- Define product decomposition: MVP, Phase 1, Phase 2, and later phases.
- Define bounded implementation workpacks.
- Create architecture/product report.
- Create ADR draft.
- Update source-of-truth and feature indexes for new report/ADR links.

## Out of scope
- Runtime code changes.
- `src/main/**` changes.
- `src/renderer/**` changes.
- `src/shared/**` changes.
- `src/preload/**` changes.
- `package.json` or `package-lock.json` changes.
- Dependency changes.
- Prompt/rubric runtime changes.
- Tests additions or edits.
- Local LLM provider implementation.
- History schema or provider settings migration.

## Constraints
- Runtime APPLY is forbidden in this initiative.
- Allowed files are limited to the initiative folder, the planning workpack folder, the architecture report, ADR files, and index links explicitly allowed by the prompt.
- Strong gate required before changing runtime/source/shared contracts/provider settings/package metadata.
- Judge implementation must remain behind preload + typed/shared contracts in future work.
- Main-process JS is current runtime source of truth per ADR-002.
- React renderer is the active UI surface per ADR-003.
- Active top-level renderer support modules are not legacy per ADR-004.

## Strong human gate triggers
- Any runtime APPLY.
- Any change to `src/main/**`, `src/renderer/**`, `src/shared/**`, or `src/preload/**`.
- Any change to `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`, or `scripts/**`.
- Any new dependency.
- Any immediate change to Judge IPC/shared contract/provider settings/history format.
- Any recommendation that bundles multi-layer runtime implementation into one giant APPLY.
- Any workpack with unclear allowed paths, forbidden paths, selected executor, verification, or rollback.

## Candidate epics
- Epic 1: Current Judge contract preflight and hardening plan.
- Epic 2: Evaluation preset catalog and rubric model.
- Epic 3: Custom judge prompt and rubric UX.
- Epic 4: Deterministic validators for JSON/schema/prompt-adherence support.
- Epic 5: Backend strategy for API profiles, local OpenAI-compatible endpoints, generic HTTP, and future local provider profile.
- Epic 6: Evaluation Studio UI model and CompareView evolution.
- Epic 7: EvaluationRun history/export lifecycle.
- Epic 8: Multi-agent, research comparison, and future n8n handoff.

## Risks
- Planning can overfit future runtime before contract hardening. Mitigation: start with `WP-JUDGE-001 Current Contract Hardening`.
- Local LLM quality varies widely. Mitigation: label backends clearly and keep deterministic validators separate from LLM verdicts.
- Evaluation history may require data format decisions. Mitigation: gate history/storage work separately.
- Exporting evaluation inputs can expose sensitive data. Mitigation: make export/privacy controls explicit in later workpacks.
- Existing dirty `package-lock.json` is outside this initiative. Mitigation: record it as pre-existing and do not modify it.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/workpack.md`
- `../../../architecture/judge-mode-evaluation-studio.md`
- `../../../architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
