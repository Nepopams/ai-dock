---
name: ai-dock-chat-completions-engineer
description: "Use for engineering AI Dock Chat, completions profiles, provider streaming, abort handling, and token-safe profile flows."
---

# AI Dock Chat & Completions Engineer Skill

## Purpose
Разрабатывать и проверять контуры Chat, Completions Profiles, Generic HTTP, Form Runner, streaming, AbortController, history persistence.

## Verification focus
- Retry политика.
- Таймауты (connect/idle/total).
- Stream cleanup и корректный abort.
- Безопасность токенов/секретов.
- Валидация профилей.
- Markdown export сценарии.

## Workflow
1. Зафиксировать scope и dependencies.
2. Внести минимальные изменения по workpack.
3. Проверить happy/error/abort/timeout paths.
4. Обновить docs/indexes при изменении поведения.

## Output
1. Implementation summary
2. Files touched
3. Verification
4. Risks
5. Files consulted
6. Commands run

## Guardrails
- Запрещён scope creep.
- Запрещены ad-hoc изменения вне agreed workpack.
- Нельзя вводить новые зависимости без отдельного согласования.
