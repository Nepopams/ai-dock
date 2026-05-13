# IN-UI-007B Orchestration Plan

## Initiative summary
Apply UI v2 styling to Prompt Templates and Media Presets as a bounded renderer workpack after Shell, Chat, Evaluation Studio, Connections/Form Profiles, and Form Runner restyles.

## Assumptions
- Canonical exports `07-prompt-templates.png` and `08-media-presets.png` are missing, but numeric exports `7.png` and `8.png` are present and match the requested frames.
- Existing UI v2 tokens and primitives from WP-UI-002 are available in `global.css`.
- No behavior change is required for template or media preset flows.

## Selected delivery mode
L3 scoped renderer Prompt Templates / Media Presets UI APPLY.

## Epic breakdown
- Prompt Templates view restyle.
- Insert Prompt dialog restyle.
- Media Presets gallery/editor/import restyle.
- Apply Preset dialog restyle.
- Roadmap and delivery artifacts.

## Sprint mapping
Single workpack: `WP-UI-007B-prompts-presets-restyle`.

## Workpack queue
1. `WP-UI-007B-prompts-presets-restyle` - in progress.
2. `WP-UI-007C-history-hub-restyle` - next recommended UI v2 workpack.

## Executor routing
- Selected executor: `ai-dock-renderer-react-executor`.
- QA review: `ai-dock-test-qa-executor` verification commands and manual smoke checklist.
- Security/readability review: `ai-dock-security-hardening-executor` considerations for import/export/apply feedback, no secret exposure, focus and disabled states.

## Gate plan
- Human approval is present in the user request for `WP-UI-007B`.
- Strong gate is not triggered because numeric design exports exist and scope can remain within allowed files.
- Stop if changes require store/shared/schema/IPC/package edits or a broad rewrite.

## Verification strategy
- Initiative validator.
- Workpack validator.
- `npm test`.
- `npm run build`.
- `git diff --check`.
- Forbidden-path status check.
- Manual Electron smoke checklist recorded for Prompt Templates and Media Presets.

## Risk register
- Utility-heavy Prompt Templates markup can create a noisy diff; mitigate with semantic class names only and no handler changes.
- Generic modal styles can bleed into other surfaces; mitigate with scoped selectors and prompt/preset-specific modifiers.
- Manual smoke is required for Electron-only apply/import/export flows.
