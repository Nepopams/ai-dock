# AI Dock Web Adapter Engineer Skill

## Purpose
Развивать Web Adapters для ChatGPT/Claude/DeepSeek и других web-клиентов: `injectPrompt`, `isReady`, `extractConversation`, `openInSource`, adapter registry.

## Constraints
- Не хардкодить логику в `TabManager`, если есть registry/adapter layer.
- Учитывать DOM volatility внешних сайтов.
- Всегда иметь graceful fallback при поломке селекторов.

## Workflow
1. Проверить контракт адаптера и registry mapping.
2. Обновить адаптеры минимальным diff.
3. Проверить fallback и диагностику ошибок.
4. Согласовать изменения с history/openInSource flows.

## Output
1. Adapter changes summary
2. Files consulted
3. Files changed
4. Commands run
5. Verification
6. Risks

## Guardrails
- Запрещён scope creep.
- Нельзя обходить adapter layer прямыми правками не по архитектуре.
- Нельзя завязываться на хрупкие селекторы без fallback стратегии.
