# Initiative: IN-2026-030 Judge Local LLM Backend Labeling UX

## Initiative ID
`IN-2026-030-judge-local-llm-backend-labeling-ux`

## Title
Judge Local LLM Backend Labeling UX

## Status
Completed

## Owner
Human + Codex

## Goal
Make it clear in Connections and Judge UI which existing completions profile backend is being used: cloud/API, inferred local endpoint, inferred private-network endpoint, generic HTTP, or unknown.

## User value
Users can choose a Judge backend with better situational awareness, seeing driver, endpoint classification, and model without assuming that inferred local/private labels are privacy guarantees.

## Problem
Judge can already use existing completions profiles, including local OpenAI-compatible endpoints and Generic HTTP profiles, but profile selectors only show profile names or driver basics. This makes backend selection opaque and increases the risk of sending sensitive evaluation inputs to an unintended endpoint.

## Success criteria
- [x] Workpack and prompt-pack exist.
- [x] PLAN confirms labels can be derived without settings schema, IPC, preload, main, package, or provider changes.
- [x] Shared helper derives driver/backend/model labels from existing profile data.
- [x] Connections profile list/details show driver/backend/model labels.
- [x] CompareView Judge profile selector shows profile/backend/model labels.
- [x] UI copy warns that local/private labels are inferred from endpoint URL and are not a privacy guarantee.
- [x] Targeted helper tests pass.
- [x] Full tests and build pass.
- [x] Forbidden paths remain unchanged.

## In scope
- Create initiative artifacts.
- Create `WP-JUDGE-005-local-llm-backend-labeling-ux` and prompt-pack.
- Add pure shared profile labeling helper.
- Add derived labels to `CompletionsSettings`.
- Add derived labels to `CompareView` Judge profile dropdown.
- Add targeted tests.
- Add short architecture implementation note.
- Complete REVIEW and delivery report.

## Out of scope
- Provider settings migration.
- New persisted profile fields.
- Main/preload/IPC changes.
- Judge runtime pipeline changes.
- Dedicated local LLM provider.
- Model discovery or health checks.
- Evaluation Studio UI.
- New dependencies.

## Constraints
- Do not change `package.json` or `package-lock.json`.
- Do not change `src/main/**`, `src/preload/**`, or shared IPC.
- Do not change `src/main/services/settings.js`.
- Do not add dependencies.
- Do not promise local-only privacy based only on URL inference.
- Do not redesign Connections or CompareView.

## Strong human gate triggers
- Need to change package/dependency metadata.
- Need to change settings storage schema.
- Need to change main, preload, or IPC.
- Need to add a dedicated local provider.
- Need for a large UI redesign.
- Need to alter token/auth handling.

## Candidate epics
- Epic 1: Initiative/workpack orchestration.
- Epic 2: Shared completions profile label helper.
- Epic 3: ConnectionsSettings derived label display.
- Epic 4: CompareView Judge profile selector labels.
- Epic 5: Tests, verification, and delivery report.

## Risks
- Endpoint inference can be wrong if users proxy cloud APIs through local/private addresses.
- UI labels can create false privacy confidence if wording overpromises.
- Long profile labels may be dense in a native select.
- Manual UI smoke remains required.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-JUDGE-005-local-llm-backend-labeling-ux/workpack.md`
