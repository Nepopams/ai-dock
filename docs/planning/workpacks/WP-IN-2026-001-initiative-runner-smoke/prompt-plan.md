# PLAN Prompt - Initiative Runner Smoke Workpack

## Режим
PLAN ONLY для docs-only workpack.

## Sources to read
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/workpack.md`

## Understanding
Нужно проверить outer loop Initiative Runner через создание и ведение file-backed docs/workflow artifacts без runtime изменений.

## Inspected files
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/source-of-truth.md`
- `scripts/workflow/validate-initiative.mjs`
- `scripts/workflow/validate-workpack.mjs`

## File-level implementation plan
1. Создать initiative artifacts в `docs/planning/initiatives/IN-2026-001-validate-initiative-runner/**`.
2. Создать workpack и prompt-pack в `docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/**`.
3. Зафиксировать soft gates и отсутствие strong gates.
4. Обновить queue/run-state/delivery-report.
5. Выполнить validation commands.
6. Провести REVIEW и записать verdict.

## Verification plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-001-validate-initiative-runner`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`

## Risks
- Structural validators не заменяют ручную семантическую проверку.
- L2 smoke не покрывает runtime L3 autonomy.

## Questions
None. Strong human gate не требуется при docs-only scope.
