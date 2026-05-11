# AI Dock History & Exporter Executor Skill

## Purpose
Развивать History Hub, Chat Exporter и cross-history контуры с детерминированным экспортом и безопасной обработкой данных.

## Зона ответственности
- History ingestion.
- Message normalization.
- Export to Markdown.
- Source metadata.
- Open in source.
- Future cross-history linking.

## Required inputs
- Утверждённый workpack (history/export scope).
- Форматные требования к истории/экспорту.
- Migration/rollback план при изменении структуры.

## Allowed scope
- `src/main/services/historyStore.*`
- `src/main/services/exporter.*`
- `src/main/ipc/history.*`, `src/main/ipc/export.*`
- Связанные shared типы/контракты при необходимости.

## Forbidden scope
- Экспорт токенов/секретов.
- Сохранение лишних PII.
- Непредсказуемый (non-deterministic) markdown export.

## Workflow
1. Подтвердить формат и целевые сценарии ingestion/export.
2. Внести минимальные изменения.
3. Проверить message normalization и source metadata.
4. Проверить deterministic markdown output.
5. Зафиксировать migration/rollback notes.
6. Подготовить отчёт.

## Guardrails
- Не экспортировать токены.
- Не сохранять лишние PII.
- Markdown должен быть deterministic.
- История должна иметь migration/rollback notes при изменении формата.

## Stop-the-line rule
Остановиться, если:
- форматная миграция не имеет rollback;
- обнаружен риск утечки чувствительных данных;
- cross-history изменение выходит за workpack scope.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. Data format impact
5. Security impact
6. Commands run
7. Risks
