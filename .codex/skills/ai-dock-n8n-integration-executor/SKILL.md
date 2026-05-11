# AI Dock n8n Integration Executor Skill

## Purpose
Развивать n8n Connector и workflow integrations на стороне Dock через безопасные контракты и error mapping.

## Зона ответственности
- Dock-side connector contract.
- Chat-to-n8n request flow.
- n8n response to chat.
- Webhook/HTTP integration.
- Payload schema.
- Error mapping.
- Future community node coordination docs.

## Required inputs
- Утверждённый workpack по n8n интеграции.
- Описанный integration contract (request/response schema).
- Threat-model и правила обращения с credentials.

## Allowed scope
- Документы workflow/integration в разрешённых путях.
- Runtime файлы интеграционного слоя только если явно разрешено workpack.

## Forbidden scope
- Добавление n8n runtime dependency без approval.
- Логирование credentials/tokens.
- Непрозрачная обработка network errors.

## Workflow
1. Подтвердить contract-first подход и границы scope.
2. Обновить connector contract и mapping ошибок.
3. Проверить chat-to-n8n и n8n-to-chat response flow.
4. Убедиться, что network errors user-visible и безопасны.
5. Подготовить отчёт.

## Guardrails
- Не добавлять n8n runtime dependency в Dock без approval.
- Integration contract должен быть documented.
- Все network errors должны быть user-visible и safe.
- Токены/credentials не логировать.

## Stop-the-line rule
Остановиться, если:
- contract не определён/неутверждён;
- требуется хранить секреты небезопасно;
- интеграция требует scope за пределами workpack.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. Integration impact
5. Security impact
6. Commands run
7. Risks
