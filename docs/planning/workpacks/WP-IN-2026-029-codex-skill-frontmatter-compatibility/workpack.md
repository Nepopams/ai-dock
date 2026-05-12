# Workpack: WP-IN-2026-029 Codex Skill Frontmatter Compatibility

## Workpack ID
`WP-IN-2026-029-codex-skill-frontmatter-compatibility`

## Title
Codex Skill Frontmatter Compatibility

## Status
Completed

## Owner
Human + Codex

## Mode
L2 workflow/governance APPLY. Runtime APPLY is forbidden.

## Type
`workflow-governance`

## Selected executor
- Workflow/governance executor

## Primary skill
- `ai-dock-initiative-runner`

## Secondary executors
- Test/QA for validator verification

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/**/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/executor-routing.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`

## Goal
Add Codex CLI-compatible YAML frontmatter to every AI Dock skill file without changing skill semantics.

## User value
Codex CLI loads AI Dock skills automatically instead of skipping them during startup.

## In scope
- Add frontmatter to existing `.codex/skills/*/SKILL.md`.
- Add dependency-free validator script.
- Add initiative/workpack artifacts.

## Out of scope
- Runtime application code.
- Package or lockfile changes.
- Package scripts.
- New dependencies.
- Skill directory renames.
- New skills.
- Rewriting skill instructions.

## Current architecture context
AI Dock keeps project-specific Codex skills under `.codex/skills/<skill-name>/SKILL.md`. The CLI expects each file to start with YAML frontmatter delimited by `---`.

## Allowed files
- `.codex/skills/**/SKILL.md`
- `scripts/workflow/validate-skills-frontmatter.mjs`
- `docs/planning/initiatives/IN-2026-029-codex-skill-frontmatter-compatibility/**`
- `docs/planning/workpacks/WP-IN-2026-029-codex-skill-frontmatter-compatibility/**`
- `CODEX.md` only if adding a short note
- `docs/_indexes/executor-index.md` only if correcting skill references

## Forbidden files
- `src/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `electron-builder.yml`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Expected file changes
- 20 `.codex/skills/*/SKILL.md` files.
- `scripts/workflow/validate-skills-frontmatter.mjs`.
- Initiative/workpack artifacts.

## PLAN conclusion
1. Found 20 `.codex/skills/*/SKILL.md` files.
2. All 20 lacked YAML frontmatter.
3. Minimal frontmatter format uses `---`, `name`, `description`, `---`.
4. Added fields: `name` matching directory and quoted single-line `description`.
5. Semantic risk is low because existing Markdown content remains unchanged.
6. Validator script is useful and can be implemented without dependencies or package changes.
7. Exact files are limited to allowed paths.
8. No strong gate triggered.

## Step-by-step plan
1. Inventory all skill files.
2. Add frontmatter to each file start.
3. Preserve existing Markdown body exactly after frontmatter.
4. Add `validate-skills-frontmatter.mjs`.
5. Create initiative/workpack artifacts.
6. Run required validators and scope checks.
7. Record delivery report.

## Acceptance criteria
- [x] All 20 skill files start with `---`.
- [x] Every skill has a closing frontmatter delimiter.
- [x] Every skill has `name` and `description`.
- [x] Every `name` matches the directory name.
- [x] Every `description` is non-empty and quoted.
- [x] Existing skill instruction body is not rewritten.
- [x] Validator script passes.
- [x] No runtime/package files changed.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-029-codex-skill-frontmatter-compatibility`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-029-codex-skill-frontmatter-compatibility/workpack.md`
- `node scripts/workflow/validate-skills-frontmatter.mjs`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js electron-builder.yml scripts/build-preload.js`

## Security impact
None. This is metadata and workflow validation only. No secrets, runtime code, package metadata, IPC, preload, or provider behavior is changed.

## IPC impact
None.

## Docs impact
Adds IN-2026-029 initiative artifacts and workpack/prompt-pack. No CODEX.md update was needed.

## Rollback
Remove frontmatter blocks from the affected skill files, remove the validator script, and delete the IN-2026-029 artifact directories.

## Done criteria
- [x] Initiative validator PASS.
- [x] Workpack validator PASS.
- [x] Skill frontmatter validator PASS.
- [x] Diff check PASS.
- [x] Forbidden runtime/package path check PASS.
- [x] Delivery report complete.

## Risks
- Future Codex CLI versions may require additional fields.
- Manual CLI startup verification is still needed.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
