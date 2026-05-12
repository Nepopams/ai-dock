# Prompt Plan: WP-IN-2026-029 Codex Skill Frontmatter Compatibility

## Mode
PLAN.

## Required answers
- Skill files found: 20.
- Missing frontmatter: 20.
- Format: `---`, `name`, `description`, `---`.
- Fields: `name` and quoted single-line `description`.
- Semantic risk: low; frontmatter only.
- Validator script: yes, dependency-free.
- Exact files: `.codex/skills/**/SKILL.md`, validator script, artifacts.
- Strong gate: none.
