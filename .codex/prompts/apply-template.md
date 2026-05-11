# APPLY Template (Implementation)

## Preconditions
- План утверждён (Plan Gate пройден).
- Allowed/forbidden paths зафиксированы.

## Executor-aware context (обязательный блок)
- Selected executor:
- Primary skill:
- Allowed paths:
- Forbidden paths:
- Approved PLAN summary:
- Stop-the-line triggers:
- Verification commands:
- Required docs/index updates:
- Review Gate checklist:

## Execution rules
- Вносить только минимальный diff.
- При отклонении от плана — stop-the-line и возврат на Human Gate.
- Строго соблюдать allowed/forbidden paths.
- Не менять соседние слои без явного разрешения в workpack.

## Verification
- Выполнить точные команды верификации из workpack.
- Если команда недоступна — явно указать причину.
- Для docs-only задач не запускать runtime tests без необходимости.
- Зафиксировать verification results в отчёте.

## Отчёт
1. Что создано/обновлено
2. Files consulted
3. Files changed
4. Commands run
5. Verification results
6. Risks

## Запреты
- Нельзя добавлять зависимости без обоснования и gate.
- Нельзя делать extra refactor вне scope.
