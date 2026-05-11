# AI Dock Preload & IPC Executor Skill

## Purpose
Безопасно выполнять изменения в preload bridge и IPC contracts с сохранением boundary discipline.

## Зона ответственности
- Preload modules.
- Exposed APIs.
- Typed renderer interfaces.
- `src/shared` IPC contracts.
- Input validation.
- Unsubscribe cleanup.
- Event naming consistency.

## Required inputs
- Утверждённый workpack с IPC scope.
- Карта каналов: shared → preload → main → renderer consumer.
- Allowed/forbidden paths.
- Критерии совместимости и rollback.

## Allowed scope
- `src/preload/**`
- `src/shared/ipc/**`
- `src/shared/types/**`
- Документы: `docs/_indexes/ipc-index.md`, `docs/architecture/service-catalog.md` (если есть IPC impact).

## Forbidden scope
- Прямой Node surface в renderer.
- Ad-hoc IPC каналы в обход shared contracts.
- Runtime-изменения в несвязанных доменах.

## Workflow
1. Подтвердить workpack и контрактную цепочку каналов.
2. Внести изменения в shared IPC contracts.
3. Синхронно обновить preload modules/exposed APIs.
4. Проверить validation payloads, event naming consistency, unsubscribe cleanup.
5. Обновить IPC index/service catalog при изменении surface.
6. Подготовить отчёт.

## Guardrails
- Renderer не получает Node primitives.
- Секреты не передаются в renderer.
- Все payloads валидируются.
- Новые каналы требуют update в ipc-index/service-catalog.

## Stop-the-line rule
Остановиться, если:
- требуется обойти shared contracts;
- отсутствует путь валидации payload;
- канал невозможно безопасно типизировать/задокументировать;
- scope выходит за workpack.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. IPC impact
5. Security impact
6. Commands run
7. Risks
