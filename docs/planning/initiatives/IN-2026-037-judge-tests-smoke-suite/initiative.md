# Initiative: IN-2026-037 Judge Tests and Smoke Suite

## Initiative ID
`IN-2026-037-judge-tests-smoke-suite`

## Title
Judge Tests and Smoke Suite

## Status
Done

## Owner
Human + Codex

## Goal
Create a unified Judge MVP QA suite covering automated test inventory, manual smoke scenarios, evidence capture, and release confidence criteria for Evaluation Studio.

## User value
Before deeper Judge, Research Mode, and n8n work, the project has one clear QA source of truth: what is already automated, what must be smoked manually, and what makes the Judge MVP GO or NO-GO.

## Problem
Judge workpacks each contain their own automated tests and manual smoke notes, but those checks are spread across delivery reports. There is no consolidated product smoke suite or coverage matrix for Judge MVP.

## Success criteria
- [x] `WP-JUDGE-008-tests-smoke-suite` workpack and prompt-pack are created.
- [x] Automated Judge MVP coverage inventory is documented.
- [x] Manual smoke suite covers Evaluation Studio open, manual start, Judge run, JSON validation, save/open/delete, export MD/JSON, dynamic criteria, and backend labels.
- [x] Evidence template is ready for Human QA.
- [x] Release confidence GO/NO-GO checklist is documented.
- [x] EP-JUDGE roadmap and workpack map are updated.
- [x] No runtime source, IPC, preload, shared, renderer, provider, storage, export, package, or dependency changes are made.
- [x] Validators, docs test, full tests, build, diff, and forbidden-path checks pass.

## In scope
- Create file-backed initiative artifacts.
- Create `WP-JUDGE-008-tests-smoke-suite` and prompt-pack.
- Gather automated coverage inventory from existing Judge/EvaluationRun tests.
- Create `docs/qa/judge-mvp-smoke-suite.md`.
- Create `docs/qa/judge-mvp-smoke-evidence-template.md`.
- Create `docs/qa/judge-mvp-automated-coverage.md`.
- Create `docs/qa/judge-mvp-release-confidence.md`.
- Add a no-dependency docs QA test that checks required QA docs, scenario headings, and test inventory references.
- Update EP-JUDGE roadmap/workpack map.
- Add a short architecture implementation note and source-of-truth QA links.

## Out of scope
- Runtime feature code.
- UI redesign.
- New IPC, preload, shared contracts, storage, export, or provider changes.
- Research comparison mode.
- n8n integration.
- Storage migrations.
- Browser automation, Playwright, Cypress, Spectron, or new dependencies.
- Real provider calls or Electron manual smoke execution by Codex.

## Constraints
- Autonomy: L2 QA/docs APPLY, L3 only for `tests/**` with no runtime code changes.
- Runtime feature APPLY is forbidden.
- Selected executor: `ai-dock-test-qa-executor`.
- Secondary executor: `ai-dock-renderer-react-executor` for read-only UI flow review.
- Secondary executor: `ai-dock-ipc-security-reviewer` for QA/security checklist review only.
- No `package.json` or lockfile changes.
- No new dependencies or package scripts.
- No `src/**` changes.

## Strong human gate triggers
- Need to change `src/main/**`, `src/preload/**`, `src/shared/**`, or `src/renderer/**`.
- Need to change Judge runtime, provider calls, storage, export, IPC, or preload bridge.
- Need to add Playwright, Cypress, Spectron, browser automation, or any dependency.
- Need to change `package.json`, lockfile, TypeScript/Vite config, scripts, or build/release files.
- Verification cannot be run safely.
- Diff leaves the allowed paths.

## Candidate epics
- `EP-JUDGE-001`: Judge Mode / Evaluation Studio MVP tests and smoke readiness slice.

## Risks
- Manual Electron product smoke remains a Human QA activity after this initiative.
- Existing automated tests do not cover real provider availability, OS save/open dialogs, BrowserView tab lifecycle, or Electron navigation.
- A docs QA test can only guard documentation structure and inventory references; it does not prove product behavior.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `docs/planning/workpacks/WP-JUDGE-008-tests-smoke-suite/workpack.md`
- `docs/qa/judge-mvp-smoke-suite.md`
- `docs/qa/judge-mvp-smoke-evidence-template.md`
- `docs/qa/judge-mvp-automated-coverage.md`
- `docs/qa/judge-mvp-release-confidence.md`
