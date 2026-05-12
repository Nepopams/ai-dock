# Orchestration Plan: IN-2026-029 Codex Skill Frontmatter Compatibility

## Initiative summary
This initiative fixes Codex CLI skill loading for AI Dock by adding minimal YAML frontmatter to every existing `.codex/skills/*/SKILL.md` file and adding a validator script.

## Assumptions
- The CLI error is caused by missing frontmatter at the beginning of each `SKILL.md`.
- Frontmatter with `name` and `description` is sufficient for compatibility.
- Descriptions can be short English summaries derived from existing skill titles and purpose sections.
- No runtime or package changes are required.

## Selected delivery mode
L2 workflow/governance APPLY. Runtime APPLY is forbidden.

## Epic breakdown
| Epic | Scope |
| --- | --- |
| E1 | Inventory `.codex/skills/*/SKILL.md` files |
| E2 | Add minimal frontmatter |
| E3 | Add dependency-free validator |
| E4 | Verify artifacts and scope |

## Sprint mapping
Single scoped workflow workpack: `WP-IN-2026-029-codex-skill-frontmatter-compatibility`.

## Workpack queue
| Workpack | Status |
| --- | --- |
| `WP-IN-2026-029-codex-skill-frontmatter-compatibility` | Done |

## Executor routing
- Selected executor: workflow/governance executor.
- Secondary review: test/QA via validator script and path checks.

## PLAN answers
1. Skill files found: 20.
2. Missing YAML frontmatter: 20.
3. Minimal format:
   ```yaml
   ---
   name: <skill-directory-name>
   description: "<short plain-English description>"
   ---
   ```
4. Fields added: `name`, `description`.
5. Semantic risk: low; only file-start metadata is added and existing Markdown content remains unchanged.
6. Validator script: yes, added because it is dependency-free and gives repeatable CLI compatibility checks.
7. Exact files changed: 20 `SKILL.md` files, validator script, and initiative/workpack artifacts.
8. Strong gate: none.

## Gate plan
- Stop if runtime or package changes are needed.
- Stop if skill directories must be renamed.
- Stop if content rewrites beyond frontmatter become necessary.

## Verification strategy
- Run initiative/workpack validators.
- Run new skill frontmatter validator.
- Run git status/diff checks, including forbidden runtime/package paths.

## Risk register
| Risk | Mitigation |
| --- | --- |
| Description mismatch | Keep descriptions short and aligned to existing skill title/purpose |
| Future loader requires more fields | Validator is easy to extend later |
| Accidental runtime drift | Forbidden-path status check |
