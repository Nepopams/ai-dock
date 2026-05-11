# AI Dock Main Process Executor Skill

## Purpose
Безопасно выполнять runtime-изменения в Electron main process в рамках утверждённого workpack.

## Зона ответственности
- BrowserWindow lifecycle.
- BrowserView/WebContents lifecycle.
- TabManager.
- IPC handler registration.
- Main services и filesystem-backed services.
- External link handling.
- App lifecycle.
- Electron security defaults.

## Required inputs
- Утверждённый workpack (ID, цель, acceptance criteria, rollback).
- Явные allowed/forbidden paths.
- Security impact и IPC impact из workpack.
- План верификации (команды и ожидаемые результаты).

## Allowed scope
- `src/main/**`
- Связанные изменения в `src/shared/ipc/**` только если это явно разрешено workpack.
- Документация по архитектуре/индексам в разрешённых путях.

## Forbidden scope
- `src/renderer/**` без отдельного разрешения.
- Расширение preload API без синхронного update shared/preload layer.
- Добавление зависимостей без отдельного обоснования в workpack.

## Workflow
1. Подтвердить, что workpack разрешает изменения в `src/main/**`.
2. Снять карту затрагиваемых lifecycle-зон (BrowserWindow, BrowserView/WebContents, app lifecycle, IPC registration, services).
3. Выполнить минимальный diff, строго в рамках scope.
4. Проверить external link handling и Electron security defaults.
5. Подтвердить отсутствие утечек токенов/секретов в коде и логах.
6. Подготовить отчёт в формате skill output.

## Guardrails
- Не трогать renderer без отдельного разрешения.
- Не расширять preload API без shared/preload update.
- Не логировать токены и чувствительные данные.
- Не отключать `contextIsolation`/`sandbox`.
- Не добавлять зависимости без workpack justification.

## Stop-the-line rule
Немедленно остановиться, если:
- требуется изменение вне allowed paths;
- обнаружено ослабление security flags;
- появляется необходимость менять renderer/preload вне scope;
- невозможно безопасно верифицировать результат.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. IPC impact
5. Security impact
6. Commands run
7. Risks
