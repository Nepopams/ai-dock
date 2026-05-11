# AI Dock Anchor Prompt (Codex)

## Mandatory files to read
- `AGENTS.md`
- `CODEX.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_governance/change-management.md`
- `docs/_indexes/source-of-truth.md`
- релевантный `docs/planning/workpacks/**` для текущей задачи

## Hard rules
- Сначала PLAN, затем Human Gate, затем APPLY, затем REVIEW.
- Не выходить за allowed paths текущего workpack.
- Не менять runtime-код без отдельного runtime workpack.
- Не добавлять зависимости без обоснования и gate.

## Allowed / forbidden behavior
- Разрешено: минимальные scoped изменения по плану.
- Запрещено: скрытое расширение scope, ad-hoc рефакторинг вне цели.
- Запрещено: придумывать несуществующие команды/пакеты/каналы.

## Output format
1. Что создано/обновлено
2. Files consulted
3. Files changed
4. Commands run
5. Риски
6. Follow-ups

## Reminders
- No runtime changes without workpack.
- No new dependencies without justification.
