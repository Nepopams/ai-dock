# VR AI Dock

Electron-приложение для работы с множеством AI-клиентов в формате док-панели. Интерфейс написан на React/Vite с Zustand, основная логика живёт в процессе Electron main, обмен с renderer идёт через жёстко типизированные IPC-мосты и sandboxed preload.

## Основные возможности
- **Вкладка Chat** — стриминговые диалоги с профилями провайдеров, поддержка retry/abort, история диалогов на диске.
- **Completions Profiles** — безопасное хранение токенов, драйверы OpenAI-compatible и Generic HTTP, тест подключения.
- **Media Presets** — библиотека пресетов для генерации изображений/видео с быстрым применением к зарегистрированным клиентам.
- **History Hub** — агрегирование сообщений из разных источников с поиском и открытием в исходном клиенте.
- **Registry & Adapters** — реестр веб-клиентов, IPC-мост для выполнения скриптов в их вкладках.

## Архитектура
- src/main — процесс Electron: создание окон, IPC, службы (chatBridge, settings, historyStore, mediaPresets и др.).
- src/preload — sandbox-мост между renderer и main. Сборка выполняется в единый бандл preload.dist.js.
- src/renderer/react — React/Vite UI (Views, Components, Zustand store, Tailwind стили).
- src/shared — общие типы, контракты IPC, утилиты.
- scripts — вспомогательные сценарии (build-preload, smoke-гайды).

## Требования
- Node.js 20+
- npm 10+
- Windows (поддерживаются и другие платформы, но сборка тестировалась в Windows окружении).

## Установка и запуск
`ash
npm install
npm run preload:build      # сборка sandbox-прелоада
npm run dev:new-ui         # старт Vite + Electron с вотчером прелоада
`

### Основные npm-скрипты
| Скрипт | Назначение |
| --- | --- |
| 
pm run dev | только Vite (renderer) |
| 
pm run preload:watch | вотчер esbuild для прелоада |
| 
pm run dev:new-ui | параллельно preload watch + Vite + Electron |
| 
pm run build | production-сборка React UI |
| 
pm run preload:build | production-бандл прелоада |
| 
pm run start | запуск Electron cо свежим прелоадом и prod UI |
| 
pm run electron:build | сборка дистрибутива через electron-builder |
| 
pm test | Node test runner (см. 	ests/) |

## Структура каталогов
`	ext
src/
  main/            # Электрон main процесс и сервисы
  preload/         # index.ts + modules/* + utils/* (esbuild бандл)
  renderer/react/  # React/Bvite UI, Zustand store, Tailwind стили
  shared/          # типы, IPC контракты, общие утилиты
scripts/           # build-preload, smoke/ сценарии и документация
`

## Тестирование
- Node тесты (
pm test) покрывают утилиты и основные сервисы.
- Smoke-сценарии в scripts/smoke/*.md помогают вручную проверить ключевые фичи (history, media presets, prompt utilities и т.д.).

## Внесение изменений
1. Запускайте 
pm run dev:new-ui, чтобы автоматом пересобирать preload и UI.
2. При добавлении IPC обновляйте типы в src/shared/ipc и соответствующие интерфейсы в src/types/renderer.d.ts.
3. Перед PR/commit проверяйте 
pm test, smoke-гайды и не забывайте про 
pm run preload:build.
4. Новые документы кладите в docs/ или scripts/smoke в зависимости от формата.

## Лицензия
По умолчанию используется лицензия из корневого package.json (при необходимости обновите раздел).
