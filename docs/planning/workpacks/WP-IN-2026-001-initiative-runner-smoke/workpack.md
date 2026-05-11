# Initiative Runner Smoke Workpack

## Workpack ID
`WP-IN-2026-001-initiative-runner-smoke`

## Title
Initiative Runner docs-only smoke pilot.

## Status
Done

## Owner
Human + Codex

## Mode
PLAN / APPLY / REVIEW, docs-only.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/human-gates.md`
- `.codex/workflows/executor-routing.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/source-of-truth.md`
- `scripts/workflow/validate-initiative.mjs`
- `scripts/workflow/validate-workpack.mjs`

## Goal
Проверить Initiative Runner outer loop через создание initiative artifacts, workpack queue, prompt-pack, docs-only APPLY, REVIEW verdict и delivery report.

## User value
Пользователь получает проверенный пример, где Codex автономно ведёт инициативу верхнего уровня без ручного копирования workpack prompts.

## In scope
- Создать initiative artifacts для `IN-2026-001-validate-initiative-runner`.
- Создать этот docs-only workpack.
- Создать prompt-pack: `prompt-plan.md`, `prompt-apply.md`, `prompt-review.md`, `prompt-fixpack.md`.
- Обновить run-state, task-queue, gates и delivery-report.
- Выполнить structural validation commands.

## Out of scope
- Runtime-код.
- `src/main/**`, `src/preload/**`, `src/renderer/**`, `src/shared/**`.
- `package.json`, `package-lock.json`.
- Dependencies.
- n8n/Judge/History функциональность.

## Current architecture context
Новый Initiative Runner layer уже описан в `.codex/skills/ai-dock-initiative-runner/SKILL.md`, `.codex/workflows/initiative-to-delivery.md` и `.codex/prompts/initiative-runner-template.md`. Этот workpack является первым L2 smoke pilot, который проверяет file-backed outer loop без runtime APPLY.

Selected executor: `ai-dock-initiative-runner`.

## Allowed files
- `docs/planning/initiatives/IN-2026-001-validate-initiative-runner/**`
- `docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/renderer/**`
- `src/shared/**`
- `package.json`
- `package-lock.json`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Создать initiative artifacts.
2. Создать docs-only workpack.
3. Создать prompt-pack.
4. Зафиксировать PLAN результат.
5. Пройти soft gate evaluation без strong gate.
6. Выполнить docs-only APPLY в allowed paths.
7. Запустить validation commands.
8. Провести REVIEW по DoD и path discipline.
9. Обновить delivery report и merge recommendation.

## Acceptance criteria
- [x] Initiative artifacts существуют и содержат обязательные секции.
- [x] Workpack существует и содержит обязательные секции.
- [x] Prompt-pack создан.
- [x] `task-queue.md` отражает один completed workpack.
- [x] `gates.md` фиксирует soft gates и отсутствие strong gates.
- [x] Validation commands PASS.
- [x] Runtime scope check подтверждает отсутствие изменений в runtime/package paths.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-001-validate-initiative-runner`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`

Runtime tests не применимы: workpack docs-only.

## Security impact
- sandbox/contextIsolation impact: none.
- IPC boundary impact: none.
- token/secrets impact: none.
- Renderer Node access impact: none.

## IPC impact
`none`.

## Docs impact
- Добавлены initiative artifacts.
- Добавлен workpack и prompt-pack smoke pilot.
- Runtime/index contracts не менялись.

## Rollback
Удалить папки:
- `docs/planning/initiatives/IN-2026-001-validate-initiative-runner/`
- `docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/`

Runtime rollback не требуется.

## Done criteria
- [x] Соответствие DoD для docs-only scope.
- [x] No giant APPLY.
- [x] Forbidden paths не изменены.
- [x] Validation commands PASS.
- [x] REVIEW Gate = GO после финальной проверки.

## Risks
- Риск: smoke pilot не покрывает runtime L3 autonomy.
  Mitigation: зафиксировать как follow-up.
- Риск: structural validators не проверяют семантику.
  Mitigation: REVIEW фиксирует scope/path/security discipline.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
