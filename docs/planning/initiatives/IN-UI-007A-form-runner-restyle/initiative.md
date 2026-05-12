## Initiative ID
IN-UI-007A-form-runner-restyle

## Title
AI Dock UI v2 Form Runner Restyle

## Status
Done

## Owner
Human + Codex

## Goal
Apply UI v2 visual treatment to Form Runner without changing form execution behavior.

## User value
Users get a consistent Form Profiles to Form Runner flow with a clearer parameter panel, timeout controls, request preview, stream state, response panels, validation, redaction, and copy actions.

## Problem
Form Profiles is aligned to UI v2, but Form Runner still used older utility-heavy layout and did not visually match the new settings/form surfaces.

## Success criteria
- Form Runner layout, header, profile selector, generated fields, request preview, stream panel, response panel, errors, validation, and actions are visually aligned with UI v2.
- Existing profile selection, field validation, request preview, redaction, sync run, stream run, abort, copy, clear, and back behavior remains unchanged.
- No form profile schema, shared form render utility, IPC, preload, main, store, package, or dependency changes.
- Automated initiative/workpack validators, tests, build, diff checks, and forbidden-path scope checks pass.
- Manual smoke checklist is recorded in the delivery report.

## In scope
- Create initiative artifacts.
- Create `WP-UI-007A-form-runner-restyle` and prompt-pack.
- Plan Form Runner visual restyle against UI v2 handoff.
- Apply visual changes to `FormRunView.tsx`.
- Add scoped Form Runner CSS in `global.css`.
- Use existing `--aid-*` tokens and primitive styling patterns.
- Preserve all event handlers and runtime behavior.
- Update UI v2 roadmap status.
- Add delivery report.

## Out of scope
- Form profile schema changes.
- Form runner IPC/preload/main changes.
- `renderTemplate` or `sanitizePreview` changes.
- Sync/stream/abort execution behavior changes.
- Form Profiles restyle changes.
- Prompt Templates, Media Presets, or History restyles.
- New component library or new dependencies.

## Constraints
- Do not change `src/main/**`, `src/preload/**`, or `src/shared/**`.
- Do not change `src/renderer/store/**` or `src/renderer/react/store/**`.
- Do not change `package.json` or `package-lock.json`.
- Do not change IPC contracts.
- Do not change form profile schema or shared form render utilities.
- Do not add dependencies or UI libraries.
- Do not do a broad CSS rewrite.
- Do not alter sync, stream, abort, copy, clear, or back behavior.

## Strong human gate triggers
- Stop if Form Runner visual sources cannot support a safe bounded restyle.
- Stop if implementation requires main/preload/shared/store/package/dependency changes.
- Stop if implementation requires form runner or form profiles state-shape changes.
- Stop if implementation alters `runFormSync`, `startFormStream`, or `abortFormStream` behavior.
- Stop if implementation requires shared form contracts/utilities changes.
- Stop if `FormRunView` rewrite becomes large enough to split further.
- Stop if build errors require unrelated view/store changes.

## Candidate epics
- UI v2 Design Handoff and Runtime Adoption.

## Risks
- Canonical `06-form-runner.png` is absent; numeric `6.png` is used with markdown handoff.
- Manual Electron smoke remains required for visual confirmation and runtime behavior paths.
- Form Runner had a pre-existing declaration-order risk where `profile` was read before initialization; this was corrected inside the allowed file without changing state or handlers.

## Links
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/exports/6.png`
- `docs/planning/workpacks/WP-UI-007A-form-runner-restyle/workpack.md`
