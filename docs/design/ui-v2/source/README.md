# AI Dock UI v2 Design Source

This folder is the expected repository home for the Pencil source artifact for AI Dock UI v2.

## Source artifact
- Expected file: `ai-dock.pen`
- Pencil source frame: `AI Dock / 00 Design System - Source of Truth`
- Pencil v2 frames:
  - `Main Dock Shell`
  - `Local Chat`
  - `Judge Evaluation Studio`
  - `Connections`
  - `Form Profiles`
  - `Form Runner`
  - `Prompt Templates`
  - `Media Presets`
  - `History Hub`
  - `Component States Board`

## Handoff rule
`.pen` is a source/reference artifact, not the implementation source for Codex runtime work.

Codex should not depend on parsing `.pen` files during runtime workpacks. The runtime workpacks must use the PNG exports plus the Markdown specs in `docs/design/ui-v2/`:

- `../exports/README.md`
- `../design-tokens.md`
- `../implementation-notes.md`
- `../screen-map.md`
- `../ui-v2-workpack-roadmap.md`

## Storage options
Human may place `ai-dock.pen` in this folder when repository size and binary storage policy allow it.

If the Pencil file is too large or belongs in external design storage, keep it externally and record the stable location in the future UI workpack PLAN before runtime APPLY.

## Runtime guardrail
No runtime workpack may apply UI v2 from `.pen` alone. It must reference approved PNG exports and the Markdown handoff notes so the implementation remains reviewable without a binary-design parser.
