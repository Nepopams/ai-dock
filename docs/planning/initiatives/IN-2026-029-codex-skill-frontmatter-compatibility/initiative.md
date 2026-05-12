# Initiative: IN-2026-029 Codex Skill Frontmatter Compatibility

## Initiative ID
`IN-2026-029-codex-skill-frontmatter-compatibility`

## Title
Codex Skill Frontmatter Compatibility

## Status
Completed

## Owner
Human + Codex

## Goal
Make all `.codex/skills/*/SKILL.md` files valid for the Codex CLI skill loader by adding required YAML frontmatter.

## User value
Codex CLI can load AI Dock skills automatically instead of skipping them because of missing frontmatter.

## Problem
The Codex CLI reports `missing YAML frontmatter delimited by ---` for AI Dock skill files. The skill layer is therefore unavailable in CLI sessions.

## Success criteria
- [x] Initiative artifacts exist.
- [x] Workpack and prompt-pack exist.
- [x] All `.codex/skills/*/SKILL.md` files start with YAML frontmatter.
- [x] Frontmatter uses only `name` and `description`.
- [x] `name` matches the skill directory name.
- [x] `description` is short, quoted, and single-line.
- [x] Existing Markdown skill content is not rewritten.
- [x] Dependency-free validator script exists.
- [x] Required verification commands pass.

## In scope
- Add YAML frontmatter to existing AI Dock skill files.
- Add `scripts/workflow/validate-skills-frontmatter.mjs`.
- Create initiative/workpack artifacts.

## Out of scope
- Runtime application changes.
- `src/**` changes.
- Package or lockfile changes.
- Package script changes.
- New dependencies.
- New skills or directory renames.
- Large skill content rewrites.

## Constraints
- Do not change runtime code.
- Do not change package metadata.
- Do not change skill semantics.
- Keep frontmatter minimal and compatible with CLI expectations.

## Strong human gate triggers
- Need to edit runtime files.
- Need to change package or lock files.
- Need to add dependencies.
- Need to rename skill directories.
- Need to rewrite skill behavior beyond frontmatter compatibility.

## Candidate epics
- Epic 1: Inventory skill frontmatter state.
- Epic 2: Add minimal frontmatter to all skill files.
- Epic 3: Add dependency-free validation script.
- Epic 4: Verification and delivery report.

## Risks
- A description could drift from a skill's intended trigger; mitigated by deriving descriptions from existing headings/purpose.
- Codex CLI may enforce additional metadata later; this initiative only implements the currently reported `name`/`description` frontmatter compatibility.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-IN-2026-029-codex-skill-frontmatter-compatibility/workpack.md`
