# APPLY Template (Implementation)

## Preconditions
- План утверждён (Plan Gate пройден).
- Allowed/forbidden paths зафиксированы.

## Execution rules
- Вносить только минимальный diff.
- При отклонении от плана — stop-the-line и возврат на Human Gate.
- Строго соблюдать allowed/forbidden paths.

## Verification
- Выполнить точные команды верификации из workpack.
- Если команда недоступна — явно указать причину.
- Для docs-only задач не запускать runtime tests без необходимости.

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
