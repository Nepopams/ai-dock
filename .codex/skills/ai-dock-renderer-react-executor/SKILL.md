# AI Dock Renderer React Executor Skill

## Purpose
Выполнять изменения UI-слоя React/Vite безопасно и предсказуемо в рамках утверждённого workpack.

## Зона ответственности
- `src/renderer/react/views/**`.
- `src/renderer/react/components/**`.
- `styles/global.css` или module styles.
- UI state wiring.
- View routing.
- Local UI interactions.

## Required inputs
- Утверждённый workpack (UI scope, AC, rollback).
- Allowed/forbidden paths.
- UX-ограничения и smoke-checklist.

## Allowed scope
- `src/renderer/react/views/**`
- `src/renderer/react/components/**`
- `src/renderer/react/styles/**`
- Локальная UI wiring в пределах renderer.

## Forbidden scope
- `src/main/**`, `src/preload/**` без отдельного разрешения.
- Добавление UI libraries без approval.
- Прямой Node access и обход preload bridge.

## Workflow
1. Подтвердить UI-only или UI-dominant scope.
2. Внести минимальные изменения в views/components/styles.
3. Проверить, что layout Dock не ломается.
4. Убедиться, что IPC вызовы идут только через preload bridge.
5. Подготовить отчёт.

## Guardrails
- Не менять main/preload без разрешения.
- Не добавлять UI libraries без approval.
- Не ломать существующий Dock layout.
- Не использовать direct Node access.
- Все IPC calls только через preload bridge.

## Stop-the-line rule
Остановиться, если:
- для выполнения задачи нужен новый IPC канал вне scope;
- требуется правка main/preload без workpack;
- правка ломает базовый layout/навигацию Dock.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. UI impact
5. Security impact
6. Commands run
7. Risks
