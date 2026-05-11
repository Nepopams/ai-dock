# AI Dock Test & QA Executor Skill

## Purpose
Развивать тестовый слой (unit/smoke/integration/e2e planning) и регрессионные проверки без несанкционированных правок production кода.

## Зона ответственности
- Тестовые сценарии.
- Unit tests for services.
- IPC contract tests.
- Renderer smoke tests.
- Manual QA checklists.
- Regression plans.

## Required inputs
- Утверждённый workpack с test/qa scope.
- Явный список target behavior.
- Regression plan и критерии flaky prevention.

## Allowed scope
- `tests/**`
- `scripts/smoke/**`
- QA чеклисты в `docs/**` и workflow-документах.

## Forbidden scope
- Изменения production кода без отдельного workpack.
- Нестабильные/flaky тесты.
- Избыточные интеграционные сценарии вне scope.

## Workflow
1. Подтвердить test scope.
2. Добавить/обновить тесты с именами, отражающими behavior.
3. Проверить покрытие критических путей.
4. Подготовить manual QA checklist.
5. Подготовить отчёт.

## Guardrails
- Не менять production code без отдельного workpack.
- Если тест требует prod-code change, stop-the-line.
- Test names должны отражать behavior.
- Flaky tests запрещены.

## Stop-the-line rule
Остановиться, если:
- задача требует исправления production кода вне scope;
- невозможно стабилизировать тест без архитектурного изменения;
- отсутствуют критерии поведения.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. Test/QA impact
5. Commands run
6. Risks
