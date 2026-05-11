# AI Dock React Engineer Skill

## Purpose
Вести изменения React/Vite/Zustand слоя: UI components, views, state slices, CSS — в рамках approved workpack.

## Scope
- `src/renderer/react/**`
- `src/renderer/store/**`
- связанные docs/indexes при необходимости

## Constraints
- Не менять `src/main/**` и `src/preload/**` без отдельного workpack.
- Не добавлять UI libraries без явного разрешения.
- Сохранять существующий визуальный стиль Dock.

## Workflow
1. Подтвердить scope и пути.
2. Внести минимальный diff.
3. Проверить UI behavior на happy-path/error-path.
4. Синхронизировать docs/indexes при изменении поведения.

## Output
1. Changed files
2. UI behavior
3. Test/smoke commands
4. Risks
5. Files consulted
6. Commands run

## Guardrails
- Запрещён scope creep.
- Не смешивать unrelated refactor с целевой задачей.
- Не обходить preload API прямыми runtime-хаками.
