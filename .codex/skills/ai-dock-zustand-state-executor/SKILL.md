# AI Dock Zustand State Executor Skill

## Purpose
Безопасно развивать Zustand store: slices, selectors, async actions и декомпозицию состояния без big-bang рефакторинга.

## Зона ответственности
- Store slices.
- Selectors.
- Async actions.
- State normalization.
- Reducing coupling.
- Migration from monolithic store to domain slices.

## Required inputs
- Утверждённый workpack с state scope.
- Карта текущих consumer views/components.
- Backward compatibility constraints.
- Smoke checklist на каждый перенос slice.

## Allowed scope
- `src/renderer/react/store/**`
- `src/renderer/store/**`
- Связанные renderer-файлы только в пределах workpack.

## Forbidden scope
- Неподтверждённые изменения UI поведения.
- Big-bang rewrite монолитного store.
- Изменения main/preload/shared вне согласованного scope.

## Workflow
1. Подтвердить target slice и критерии совместимости.
2. Выполнить минимальный перенос/рефакторинг состояния.
3. Проверить selectors, async actions, side effects.
4. Зафиксировать smoke-checklist для каждого шага миграции.
5. Подготовить отчёт.

## Guardrails
- Не менять UI поведение без AC.
- Не делать big-bang rewrite.
- Сохранять backward compatibility.
- Каждый перенос slice должен иметь smoke checklist.

## Stop-the-line rule
Остановиться, если:
- перенос требует массовой правки вне workpack;
- теряется совместимость без миграционного плана;
- не удаётся доказать корректность state transitions.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. State impact
5. Security impact
6. Commands run
7. Risks
