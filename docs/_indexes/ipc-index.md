# IPC Index — VR AI Dock

> Статус: частично заполнено по текущему репозиторию; отдельные детали помечены `needs verification`.

## 1) Main IPC modules
Основные модули регистрации IPC в `src/main/ipc/**`:
- bootstrap/registry layer: `bootstrap.js`
- shell-level handlers: `shell.js` (`tabs:*`, `prompts:*`, `clipboard:*`, `layout:*`, `promptRouter:*`, `save-chat-md`)
- `chat.js`
- `completions.js`
- `registry.ipc.ts/js`
- `judge.ipc.ts/js`
- `export.ipc.ts/js`
- `evaluationRun.ipc.ts/js` (`evaluationRun:save`, `evaluationRun:list`, `evaluationRun:read`, `evaluationRun:delete`)
- `history.ipc.ts/js`
- `templates.ipc.ts/js`
- `mediaPresets.ipc.ts/js`
- `formProfiles.ipc.ts/js`
- `formRunner.ipc.ts/js`
- BrowserView bridge: `src/main/browserViews/adapterBridge.ts/js` (`adapter:exec`, `adapter:ping`; main registration uses late-bound `getTabManager` context)

`src/main/main.js` создаёт окно/`TabManager` и вызывает bootstrap-регистрацию, но не содержит inline IPC handler registrations.

## 2) Preload exposed APIs
Основные preload-модули в `src/preload/modules/**`:
- `coreApi`, `aiDock`, `chat`, `historyHub`, `mediaPresets`, `templates`
- `completions`, `judge`, `exporter`, `adapterBridge`, `registry`
- `formProfiles`, `formRunner`, `evaluationRuns`

`needs verification`: точный public surface каждого namespace (рекомендуется зафиксировать в отдельном appendix).

## 3) Renderer consumers
Renderer-потребители расположены в:
- `src/renderer/react/store/**` и `src/renderer/store/**` (Zustand slices)
- `src/renderer/react/views/**`
- `src/renderer/react/components/**`

`needs verification`: полный mapping «view/component → preload API method».

## 4) Shared contracts
Источники контрактов и IPC-констант:
- `src/shared/ipc/contracts.ts/js`
- `src/shared/ipc/*.ipc.ts/js`
- `src/shared/ipc/*.contracts.ts/js`

## 5) Security notes
- Не обходить preload bridge прямыми вызовами из renderer.
- Каналы должны иметь контракты в shared-слое.
- Для новых каналов обязательны проверка входных данных и безопасная обработка ошибок.

## 6) Update rules
При любом IPC-изменении обновлять одновременно:
1. shared contracts;
2. preload exposure;
3. main handler;
4. этот IPC index;
5. service catalog (если изменилась зона ответственности).
