# Initiative: IN-UI-005 Evaluation Studio Restyle

## Initiative ID
IN-UI-005-evaluation-studio-restyle

## Title
AI Dock UI v2 Evaluation Studio Restyle

## Status
Done

## Owner
Human + Codex

## Goal
Apply UI v2 visual treatment to Evaluation Studio / Judge while preserving all Judge and EvaluationRun behavior.

## User value
Judge becomes a first-class Evaluation Studio surface with clearer mode cards, saved run list, manual start, Judge controls, validation findings, score table, export, and save actions.

## Problem
Shell and Chat are aligned with UI v2, but Evaluation Studio still uses older dense mixed styling. This creates visual drift in one of the highest-value local views.

## Success criteria
- Evaluation Studio and CompareView use UI v2 tokens and visual language.
- Judge runtime, EvaluationRun storage, export behavior, and Zustand state shape remain unchanged.
- No main, preload, shared, package, dependency, or unrelated local view changes.
- Automated validators, tests, build, diff check, and forbidden-path checks pass.
- Delivery report records manual Electron smoke status and the next workpack.

## In scope
- Create initiative artifacts.
- Create `WP-UI-005-evaluation-studio-restyle` workpack and prompt pack.
- Plan Evaluation Studio visual restyle from UI v2 handoff.
- Apply visual-only changes to `EvaluationStudioView`, `CompareView`, evaluation helper files, and `global.css` only if needed.
- Update UI v2 roadmap status.
- Add delivery report.

## Out of scope
- Judge runtime, prompt, parser, provider, or pipeline changes.
- EvaluationRun storage/read/write/schema changes.
- Export MD/JSON behavior changes.
- New Judge modes, research comparison mode, n8n integration, or preset picker runtime.
- Store shape changes.
- New dependencies or UI libraries.
- Chat, Connections, Forms, History, Presets, or Prompt Templates restyles.

## Constraints
- Do not change `src/main/**`, `src/preload/**`, `src/shared/**`, `src/renderer/store/**`, or `src/renderer/react/store/**`.
- Do not change package/config/build/script files.
- Do not change Judge IPC contracts, EvaluationRun storage, Judge pipeline, or export behavior.
- Do not do a broad CSS rewrite.
- Keep shell and Chat CSS from prior workpacks intact.

## Strong human gate triggers
- STOP if Judge visual mapping cannot proceed from available exports and markdown handoff.
- STOP if implementation requires forbidden paths, new dependencies, store shape changes, IPC/preload/main/shared changes, or package/config changes.
- STOP if runJudge, save/open/delete EvaluationRun, export MD/JSON, or updateCompareDraft behavior must change.
- STOP if CSS changes become broad enough to affect unrelated views.
- STOP if build errors require unrelated view/store edits.

## Candidate epics
- UI v2 adoption for AI Dock local views.
- Judge Mode / Evaluation Studio MVP visual hardening.

## Risks
- Canonical export filename `03-judge-evaluation-studio.png` is absent; numeric export `3.png` is used as visual reference with markdown handoff.
- CSS-only visual changes can affect dense data tables, saved-run cards, or result readability.
- Manual Electron smoke is required for interaction-level confidence.

## Links
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/workpacks/WP-UI-005-evaluation-studio-restyle/workpack.md`
