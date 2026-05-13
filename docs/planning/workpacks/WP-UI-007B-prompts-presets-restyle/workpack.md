# WP-UI-007B Prompt Templates and Media Presets Restyle

## Workpack ID
`WP-UI-007B-prompts-presets-restyle`

## Title
AI Dock UI v2 Prompt Templates and Media Presets Restyle

## Status
Done; manual Electron smoke pending

## Owner
Human + Codex

## Mode
L3 scoped renderer Prompt Templates / Media Presets UI APPLY

## Sources of truth
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/exports/7.png`
- `docs/design/ui-v2/exports/8.png`

## Goal
Apply UI v2 visual treatment to Prompt Templates and Media Presets without changing template or preset behavior.

## User value
Users get a consistent creation/preset-management UX for searchable templates, tag chips, editor modal, variable hints, preset gallery, preset editor, import conflict handling, adapter warnings, and apply dialog.

## In scope
- Restyle `TemplatesManager.tsx`.
- Restyle `InsertPromptDialog.tsx` only for visual consistency.
- Restyle `PresetsGallery.tsx` only as needed.
- Restyle `ApplyPresetDialog.tsx` only as needed.
- Add scoped CSS in `global.css`.
- Update UI v2 roadmap and initiative artifacts.

## Out of scope
- Template storage, variable parser, import/export semantics.
- Media preset schema, import/export semantics, adapter resolution, apply behavior.
- Prompt Router changes.
- History Hub restyle.
- Store/shared/IPC/package/dependency changes.

## Current architecture context
Prompt Templates is a local React view backed by `templatesSlice` through `useDockStore`. Media Presets is a local React view backed by `mediaPresetsSlice`, registry client state, adapter resolution, and `ApplyPresetDialog`. Current behavior lives in handlers and store actions; this workpack only changes renderer markup classes and CSS.

## Allowed files
- `src/renderer/react/views/prompts/TemplatesManager.tsx`
- `src/renderer/react/views/prompts/InsertPromptDialog.tsx`
- `src/renderer/react/views/presets/PresetsGallery.tsx`
- `src/renderer/react/components/ApplyPresetDialog.tsx`
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-007B-prompts-presets-restyle/**`
- `docs/planning/workpacks/WP-UI-007B-prompts-presets-restyle/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
- `src/renderer/react/views/forms/**`
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/components/chat/**`
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/renderer/react/views/history/**`
- `src/renderer/adapters/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `electron-builder.yml`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Confirm design references and gates.
2. Migrate Prompt Templates utility-like class clusters to scoped semantic classes.
3. Restyle Insert Prompt dialog with scoped semantic classes.
4. Tokenize Media Presets and Apply dialog CSS with minimal JSX class additions.
5. Update roadmap and delivery artifacts.
6. Run validators, tests, build, diff, and forbidden-path checks.

## Acceptance criteria
- Prompt Templates and Media Presets visibly align to UI v2 tokens.
- Template behavior is unchanged.
- Preset behavior is unchanged.
- Apply behavior is unchanged.
- No schema, store, IPC, package, or unrelated view changes.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-007B-prompts-presets-restyle`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-007B-prompts-presets-restyle/workpack.md`
- `npm test`
- `npm run build`
- `git diff --check`
- Forbidden-path status check.

## Security impact
No new secrets, IPC, file access, external navigation, or token display. Apply feedback and import/export errors remain renderer-visible status only.

## IPC impact
None. Existing template and media preset APIs are consumed unchanged.

## Docs impact
Roadmap and initiative/workpack artifacts are updated.

## Rollback
Revert this workpack's changes in allowed files. No storage migrations or dependency changes are introduced.

## Done criteria
- Artifacts exist and validate.
- UI changes are limited to allowed renderer files and CSS.
- Tests/build pass.
- Forbidden-path status check is clean.
- Delivery report records manual smoke checklist and next workpack.

## Risks
- Utility-heavy Prompt Templates JSX diff can be noisy.
- Modal CSS must stay scoped enough to avoid affecting unrelated modals.
- Manual Electron smoke is still required for import/export/apply flows.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`

## PLAN answers
1. Prompt Templates and Media Presets canonical exports are absent, but numeric exports `7.png` and `8.png` are present and used with the markdown design handoff.
2. `TemplatesManager` restyles header, actions, search, tag filters, loading/empty/error states, list/table rows, tag chips, editor modal, and variable hints.
3. `InsertPromptDialog` gets visual restyle for modal chrome, template selector, target tabs, variables, preview, metadata, and footer actions.
4. `PresetsGallery` restyles toolbar, filters, grid/cards, tags, params preview, editor modal, import conflict dialog, and actions.
5. `ApplyPresetDialog` restyles modal chrome, target client list, preview, feedback messages, and insert/send buttons.
6. Template CRUD/duplicate/delete/import/export/variable extraction/insert and preset CRUD/duplicate/delete/import/export/apply/adapter warnings remain unchanged.
7. ClassName changes are visual-only and do not alter event handlers, data flow, or action calls.
8. Utility-like class clusters will be replaced in Prompt Templates and Insert Prompt with scoped semantic classes; Presets/Apply mostly keep existing semantic classes.
9. CSS touched: new Prompt Templates and Insert Prompt sections plus scoped Presets/Apply dialog tokenization.
10. No split is required because Presets/Apply already use semantic classes and the combined diff can remain bounded.
11. Exact files changed are limited to the allowed list in this workpack.
12. No strong gate is active.
