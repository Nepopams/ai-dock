# Initiative: IN-2026-032 Evaluation Studio UI Shell

## Initiative ID
`IN-2026-032-evaluation-studio-ui-shell`

## Title
Evaluation Studio UI Shell

## Status
Done

## Owner
Human + Codex

## Goal
Create the first scoped renderer shell for Judge Mode / Evaluation Studio that presents Judge as a standalone Dock capability while reusing the existing Compare/Judge workflow.

## User value
Users can open Judge from the sidebar, understand that they are in Evaluation Studio, manually start a two-answer comparison, and see which evaluation modes are available now versus planned later.

## Problem
Judge Mode already has foundation layers for answer comparison, presets, custom rubric/instructions, JSON contract validation, exports, and local backend labeling, but the sidebar entry still drops users directly into the older technical `CompareView`. Before adding source pickers, history/export, research modes, or n8n integration, Judge needs a small product shell that does not change the current runtime pipeline.

## Success criteria
- [x] Initiative artifacts exist and validate.
- [x] `WP-JUDGE-006-evaluation-studio-ui-shell` workpack and prompt-pack exist and validate.
- [x] `EvaluationStudioView` is created as a renderer-only shell.
- [x] `App.tsx` routes `activeLocalView === "compare"` to `EvaluationStudioView`.
- [x] Existing `CompareView` is reused for the working answer-comparison surface.
- [x] Empty/manual start state appears when `compareDraft` is missing.
- [x] Existing prepared comparisons from Chat/History still open the comparison surface.
- [x] No main, preload, shared, IPC, package, dependency, provider, or settings schema changes are made.
- [x] Tests/build and scope checks are recorded.

## In scope
- Create IN-2026-032 initiative artifacts.
- Create `WP-JUDGE-006-evaluation-studio-ui-shell` workpack and prompt-pack.
- Create `EvaluationStudioView` as a renderer shell.
- Render status/mode cards for available and planned Evaluation Studio modes.
- Add a manual start form for question/task, two answers, and optional answer labels.
- Reuse existing `actions.prepareJudgeComparison` and `CompareView`.
- Update minimal renderer CSS.
- Update `EP-JUDGE-001` roadmap/workpack map for `WP-JUDGE-006`.
- Record validation, build/test results, and manual smoke status in delivery artifacts.

## Out of scope
- New IPC channels.
- Main/preload/shared changes.
- Judge pipeline changes.
- Provider/settings model changes.
- Package/dependency changes.
- Full Evaluation Studio implementation.
- EvaluationRun history/storage.
- Preset picker runtime integration.
- Research source picker.
- BrowserView content extraction.
- File import.
- n8n integration.
- Dedicated local LLM provider.

## Constraints
- L3 scoped renderer UI APPLY only.
- Human approval exists for `WP-JUDGE-006 Evaluation Studio UI Shell`.
- Stop if `EP-JUDGE-001` epic artifacts are missing.
- Do not change `src/main/**`, `src/preload/**`, or `src/shared/**`.
- Do not change Judge IPC, Judge runtime pipeline, provider/settings schema, package files, dependency metadata, build config, or scripts.
- Do not perform a large `CompareView` rewrite.
- Do not implement history/storage.
- Use `CompareView` composition instead of duplicating Judge run logic.

## Strong human gate triggers
- `EP-JUDGE-001` epic artifacts are missing.
- A required change touches main, preload, shared, IPC, package/dependency, provider/settings schema, build config, or scripts.
- UI shell requires a large `CompareView` rewrite.
- Manual start requires a new store/runtime contract instead of existing `prepareJudgeComparison`.
- Implementation pressure expands into EvaluationRun history/storage, source extraction, file import, research mode, or n8n integration.
- REVIEW Must Fix changes scope, risk profile, or executor routing.

## Candidate epics
- `EP-JUDGE-001 Judge Mode / Evaluation Studio MVP`: this initiative delivers the Slice 3 Studio Shell workpack.

## Risks
- The shell can feel duplicated because `CompareView` keeps its current internal header; mitigation: keep this workpack compositional and defer deeper layout cleanup.
- Manual smoke still needs an Electron session; mitigation: record the checklist and mark smoke pending if not run.
- Planned mode cards could be mistaken for working features; mitigation: render them as non-actionable status cards.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-JUDGE-006-evaluation-studio-ui-shell/workpack.md`
- `../../epics/EP-JUDGE-001-evaluation-studio-mvp/epic.md`
