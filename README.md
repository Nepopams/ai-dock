# VR AI Dock (React UI)

VR AI Dock — десктопный клиент на базе Electron для работы с несколькими AI‑сервисами в едином окне. Интерфейс реализован на React/Vite c управлением состоянием через Zustand, а безопасное взаимодействие между renderer и main организовано через собственные preload‑мосты (nodeIntegration выключен, contextIsolation включён).

## Основные возможности

- **Мульти‑вкладки**: отдельные BrowserView для ChatGPT, Claude, DeepSeek, UX Pilot и локального чат‑экрана. Список вкладок и их состояние сохраняются в `userData/tabs.json` и восстанавливаются при следующем запуске.
- **Экран “Chat”**:
  - стриминговый чат с отображением статусов (`connecting`, `streaming`, `retrying`, `done`, `error`, `aborted`);
  - история сообщений и метаданные сохраняются в `userData/ai-dock/chat/<conversationId>.json`;
  - автоскролл при ответах ассистента и индикатор `↓ New messages`, если пользователь отскроллил историю вверх;
  - возможность остановить генерацию (`Stop`) или отправить повторный запрос (`Retry`), экспорт диалога в Markdown.
- **Подключения (Connections → Completions)**:
  - управление профилями моделей (OpenAI‑совместимых и кастомных Generic HTTP endpoint’ов), хранение токенов в `safeStorage` с прозрачным `tokenRef` в `userData/completions.json`;
  - тест соединения, переключение активного профиля, настройка headers и схемы ответа для generic‑драйвера.
- **Prompt Router**: боковой Drawer с библиотекой подсказок, рассылка prompt’ов на выбранные сервисы, импорт/экспорт сохранённых шаблонов.
- **Безопасность**: строгий CSP, `contextIsolation`, `sandbox`, работа с файловой системой ограничена `userData`. Все IPC‑каналы проходят через preload‑слой.

## Структура проекта

```
src/
├─ main/            # Electron main-процесс: окна, IPC, сервисы, драйверы, storage
├─ preload/         # мосты exposeInMainWorld (chat, completions, API оболочки)
├─ renderer/
│  ├─ react/        # Vite + React UI, Zustand store, компоненты и стили
│  └─ index.html    # точка входа legacy webview (оставлена для совместимости)
└─ types/           # декларации типов для renderer (global window.*)
```

## Требования

- Node.js **18.x** или новее (рекомендуется LTS)
- npm **9.x** или новее
- Windows 10/11, macOS или Linux (Electron 31 поддерживает все три ОС)

## Установка и запуск

```bash
git clone <repo-url>
cd ai-desktop
npm install
```

### Режим разработки

```bash
# Запуск Vite (renderer) + Electron (main)
npm run dev:new-ui
```

Команда `dev:new-ui` параллельно поднимает Vite (`npm run dev`) и Electron (`npm run electron:dev`) с установленной переменной `AI_DOCK_REACT_UI=true`, чтобы main-процесс загружал React‑интерфейс.

> Примечание: если запускается только `npm run dev`, то стартует лишь Vite‑сервер без Electron‑окна.

### Продакшн‑сборка

```bash
npm run build        # сборка Vite
npm run electron:build   # сборка Electron дистрибутива (Windows NSIS по умолчанию)
```

Готовые артефакты Vite лежат в `src/renderer/react/dist`, установщик Electron — в `dist/`.

## Рабочие каталоги и данные

- **История чатов**: `%APPDATA%/VR AI Dock/ai-dock/chat/` (по одному JSON на диалог).
- **Профили completions**: `%APPDATA%/VR AI Dock/completions.json` + шифрованные токены в `safeStorage`.
- **Tabs/сервисы**: `%APPDATA%/VR AI Dock/tabs.json`.
- **Экспорт Markdown**: диалог “Save As…” предлагает выбрать произвольный путь, формат `*.md`.

При необходимости сброса состояния достаточно удалить соответствующие файлы в `userData` (приложение должно быть закрыто).

## Работа с чатами

- Каждая отправка формирует payload вида `{id, role, content, ts, meta}` и передаёт полный стек сообщений в драйвер (short memory = вся последовательность до ограничения модели).
- Поддерживаются статусы использования (`usage`) и `finishReason` из OpenAI‑совместимых ответов; они отображаются в UI под сообщением ассистента.
- Механизм Retry повторяет последний запрос с сохранённым snapshot’ом (user/assistant messageId + requestOptions).
- Кнопка `Export` в верхнем правом углу сохраняет текущий диалог в Markdown.

## Профили Completions

- **OpenAI-compatible**: базовый URL (`baseUrl`), модель по умолчанию, токен (`Bearer`/`Basic`), дополнительные headers и таймаут.
- **Generic HTTP**: конфигурируемый endpoint, метод (`POST`/`GET`), шаблон JSON‑тела с плейсхолдерами `{{model}}`, `{{messages[]}}`, `{{stream}}` и др., описание схемы ответа (SSE / NDJSON / lines или buffer). Поддерживается извлечение usage через JSONPath‑подобные строки.
- Тест соединения (`Test Connection`) отправляет ping‑запрос с текущими настройками и отображает usage/preview или ошибку.

## Разработка и стили

- Глобальные стили находятся в `src/renderer/react/styles/global.css`. Tailwind не используется — классы кастомные.
- Компоненты React организованы в `src/renderer/react/components`, экраны — в `views`, состояние — `store/useDockStore.ts` + слайсы в `store/chatSlice.ts` и др.
- При добавлении новых IPC, расширяйте preload (`src/preload/preload.js`) и типы `src/types/renderer.d.ts`.

## Полезные команды

| Команда | Описание |
| --- | --- |
| `npm run dev` | Только Vite (renderer) — удобно для изолированной верстки |
| `npm run electron:dev` | Только Electron (main), ожидает, что React уже собран |
| `npm run dev:new-ui` | Полный дев-режим (Vite + Electron) |
| `npm run build` | Сборка React UI |
| `npm run start` | Запуск собранного Electron (использует production build) |
| `npm run electron:build` | сборка установщика/пакета |

## Вклад и тестирование

Отдельного тестового контура пока нет. Перед Pull Request:

1. Убедитесь, что `npm run dev:new-ui` работает без ошибок и предупреждений в консоли.
2. Проверьте, что новые IPC и preload‑экспорты описаны в `src/types/renderer.d.ts`.
3. Если меняются форматы хранения (historyFs/completions), добавьте миграции или обновите README.

Будущие задачи: unit‑тесты для сервисов (settings, historyFs, genericHttp), визуальные тесты чат‑экрана, автоматическая сборка CI.

---

Если возникли вопросы по архитектуре или интеграции новых AI‑провайдеров, см. разделы `src/main/services/` и `src/main/providers/` — там описана логика повторных попыток, таймаутов и потоковой обработки. При добавлении нового драйвера придерживайтесь текущего паттерна `async generator` и стандартных IPC‑каналов (`chat:*`, `completions:*`). Удачной работы! 💡
