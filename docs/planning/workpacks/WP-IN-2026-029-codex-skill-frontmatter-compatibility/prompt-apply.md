# Prompt Apply: WP-IN-2026-029 Codex Skill Frontmatter Compatibility

## Mode
APPLY.

## Instructions
Add YAML frontmatter to every `.codex/skills/*/SKILL.md`:

```yaml
---
name: <skill-directory-name>
description: "<short plain-English description of when to use this skill>"
---
```

Do not rewrite the existing Markdown body. Add `scripts/workflow/validate-skills-frontmatter.mjs` without dependencies. Do not change runtime, package, lockfile, or build config files.
