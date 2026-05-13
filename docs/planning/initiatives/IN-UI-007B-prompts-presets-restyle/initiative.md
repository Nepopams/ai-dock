# IN-UI-007B Prompt Templates and Media Presets Restyle

## Initiative ID
`IN-UI-007B-prompts-presets-restyle`

## Title
AI Dock UI v2 Prompt Templates and Media Presets Restyle

## Status
Delivered; manual Electron smoke pending

## Owner
Human + Codex

## Goal
Apply UI v2 visual treatment to Prompt Templates and Media Presets without changing template storage, preset schema, import/export, adapter resolution, or preset apply behavior.

## User value
Users get a consistent creation and preset-management experience for Prompt Templates, Media Presets, editor modals, variable hints, adapter warnings, feedback states, and apply flows.

## Problem
Most primary local views already use the UI v2 shell and view language, but Prompt Templates and Media Presets still rely on older mixed styling and utility-heavy markup.

## Success criteria
- Prompt Templates is visually aligned with UI v2.
- Media Presets and Apply Preset dialog are visually aligned with UI v2.
- Template CRUD, duplicate, delete, import/export, variable extraction, and insert semantics remain unchanged.
- Media preset CRUD, duplicate, delete, import/export, adapter warnings, and apply semantics remain unchanged.
- No store, shared contract, IPC, dependency, package, or unrelated view changes.
- Validators, tests, build, `git diff --check`, and forbidden-path checks pass.

## In scope
- Create initiative artifacts and workpack prompt-pack.
- Restyle `TemplatesManager`, `InsertPromptDialog`, `PresetsGallery`, and `ApplyPresetDialog` only as needed.
- Add scoped Prompt Templates, Insert Prompt, Media Presets, and Apply dialog CSS in `global.css`.
- Update UI v2 roadmap status.
- Record manual smoke checklist in the delivery report.

## Out of scope
- Template storage/schema changes.
- Template variable parser changes.
- Media preset schema changes.
- Media preset import/export behavior changes.
- Media preset apply behavior changes.
- Adapter resolution changes.
- Prompt Router changes.
- History Hub restyle.
- New dependencies or UI libraries.

## Constraints
- Do not change `src/main/**`, `src/preload/**`, `src/shared/**`, stores, package/config/scripts/build outputs, or unrelated views.
- Do not change IPC contracts or Zustand state shape.
- Do not do a broad CSS rewrite.
- Keep this as a visual-only renderer APPLY.

## Strong human gate triggers
- Required changes exceed allowed files.
- APPLY would require store/shared/schema/IPC/package changes.
- Template or preset runtime behavior would change.
- Diff must be split into `WP-UI-007B1` and `WP-UI-007B2`.
- Build failures require unrelated source changes.

## Candidate epics
- UI v2 design application sequence.
- Prompt creation and preset management UX.

## Risks
- Prompt Templates has utility-heavy JSX, so visual class migration could accidentally alter layout or labels.
- Media Presets has storage-heavy flows, so editor/apply UI must remain visual-only.
- Canonical PNG filenames are absent; numeric exports are used as the local design reference.

## Links
- Workpack: `docs/planning/workpacks/WP-UI-007B-prompts-presets-restyle/workpack.md`
- UI v2 roadmap: `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- Screen map: `docs/design/ui-v2/screen-map.md`
