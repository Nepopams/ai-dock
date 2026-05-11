# PLAN Template (Read-Only)

## Режим
PLAN ONLY (read-only).

## Жёсткие ограничения
- Ничего не редактировать.
- Ничего не устанавливать.
- Не запускать команды, меняющие рабочее дерево.
- Работать только через чтение файлов и безопасные команды инспекции.

## Обязательное чтение
- `AGENTS.md`
- `CODEX.md`
- `.codex/prompts/ai-dock-anchor.md`
- релевантный workpack

## Что нужно выдать
1. Понимание задачи (understanding)
2. Inspected files
3. File-level implementation plan
4. Verification plan
5. Risks
6. Questions (только блокирующие)

## Дополнительно
- Явно перечислить allowed/forbidden paths.
- Указать, что runtime-изменения без workpack запрещены.
