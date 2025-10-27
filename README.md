# VR AI Dock

VR AI Dock — десктопное приложение на Electron, которое объединяет несколько AI‑сервисов (ChatGPT, Claude, DeepSeek, UX Pilot и др.) в одном интерфейсе и дополняет их локальным чатом с собственными настройками провайдеров. Проект построен на связке **Electron (main + preload)**, **React/Vite** и **Zustand**, с строгой CSP и отключённым `nodeIntegration`.

## Возможности

- **Менеджер вкладок**  
  - Sidebar с преднастроенными сервисами.  
  - Таб‑полоса на базе `BrowserView` с восстановлением порядка/состояния (`userData/tabs.json`).  
  - Обработка системных шорткатов (Ctrl/Cmd + Numbers).  
  - Контекстное меню копирования/инспекта внутри web‑view.

- **Chat (локальная вкладка)**  
  - Реализован собственный экран чата на React + Zustand.  
  - История хранится в `userData/ai-dock/chat/*.json`, каждый диалог — отдельный файл.  
  - Потоковое получение ответов через OpenAI‑совместимый драйвер, поддержка `Abort`.  
  - Ретраи с экспоненциальным бэкоффом, отдельные статусы (`connecting`, `streaming`, `retrying`, `done`).  
  - UI показывает текущий статус, количество попыток, usage/finishReason, коды ошибок.  
  - Возможность повторить последний запрос (`Retry`).  
  - Список диалогов с созданием/удалением, автозагрузка истории при переключении.

- **Настройки соединений**  
  - Экран “Connections → Completions” для CRUD профилей провайдеров.  
  - Профили (`userData/completions.json`) с безопасным хранением токенов через `safeStorage`.  
  - “Test connection” выполняет пробный запрос `/chat/completions`.

- **Prompt Router & Drawer**  
  - Быстрая рассылка промтов на подключённые сервисы, сбор истории (до 50 записей).  
  - Drawer со своими шаблонами промтов (`prompts.json`) и синхронизацией ширины с main.

- **Экспорт чатов**  
  - Сервисная команда `save-chat-md` сохраняет текущий чат из BrowserView в Markdown.

- **Безопасность**  
  - `contextIsolation`, `sandbox`, `nodeIntegration: false`.  
  - CSP: `default-src 'self'`.  
  - Все IPC сконцентрированы в `preload`, доступ в renderer только через типизированные API.

## Архитектура

```
src/
├─ main/            # Electron main process, IPC, хранение историй и настроек
│  ├─ ipc/          # Регистрация IPC-каналов (chat, completions, tabs и т.д.)
│  ├─ providers/    # Драйверы (openai-compatible)
│  ├─ services/     # chatBridge, settings и прочие сервисы
│  └─ storage/      # historyFs (файловое хранилище разговоров)
├─ preload/         # contextBridge API для renderer
├─ renderer/        # React/Vite UI
│  ├─ react/        # Компоненты, views, Zustand store
│  └─ assets/       # Иконки/ресурсы
└─ types/           # Глобальные декларации renderer.d.ts
```

### Поток чата (ChatView → main)
1. **Renderer** вызывает `window.chat.send(conversationId, messages, options)`.  
2. **Preload** нормализует payload и шлёт в IPC `chat:send`.  
3. **chatBridge**:
   - достаёт активный профиль + токен; при отсутствии создаёт новый разговор через `historyFs.createConversation`.  
   - сохраняет сообщение пользователя, добавляет черновик ассистента.  
   - запускает провайдер с таймаутом (по профилю или 60 с).  
   - стримит чанки (`chat:chunk`) + usage/done (`chat:done`), по ошибкам — `chat:error`.  
   - сетевые/5xx ошибки -> ретраи c экспоненциальным ожиданием (лог `requestId retry n/3`, событие `chat:retry`).  
4. **renderer/Zustand** обновляет состояние, персистит usage/finishReason, управляет статусами и ретраями.  
5. История лежит в `userData/ai-dock/chat/<conversationId>.json`.

### История разговоров (`historyFs`)
- `createConversation(title?, model?, profile?, id?)` — создаёт файл с метаданными.  
- `appendMessage(convId, message)` — добавляет сообщение, обновляет `updatedAt`.  
- `finalizeAssistantMessage(convId, msgId, content, meta?)` — дописывает контент/мету.  
- `getMessages(convId, cursor?, limit?)` — возвращает пагинированную выборку.  
- `listConversations()` — сортированные по `updatedAt` summary.  
- `deleteConversation(convId)` — удаление JSON.  
- `safeWrite()` — гарантирует atomic rename.

## Требования

- Node.js 18+ (встроенный npm).  
- Windows / macOS / Linux (разработка тестировалась под Windows).  
- Для доступа к внешним API — действительный OpenAI‑совместимый эндпоинт и токен.

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Режим разработки: запускает Vite + Electron
npm run dev

# Сборка production-бандла
npm run build

# Запуск собранного приложения
npm run start
```

> Если запускаете под Windows PowerShell и получаете ошибку “npm не является...”, убедитесь, что Node.js установлен и `npm` есть в PATH.

## Проверка функциональности

1. Запустите `npm run dev`, откроется окно AI Dock.  
2. Перейдите в Sidebar → “Chat” и отправьте сообщение.  
3. Дождитесь стрима; при отмене и повторной отправке увидите новые статусы.  
4. Закройте приложение, перезапустите — история диалога восстановится.  
5. На вкладке “Connections” создайте профиль с коротким `timeoutMs`, чтобы увидеть `timeout` и кнопку Retry.  
6. Для теста ретраев укажите невалидный `baseUrl` (будет 3 попытки и лог в консоли main).

## Тестирование

- `npm run typecheck` — проверка типов (если сконфигурирована).  
- `npm run lint` — линтеры (по необходимости добавить).  
- Автотестов пока нет; рекомендуются smoke‑тесты вручную (см. раздел “Проверка функциональности”).

## Дальнейшие идеи

- Поддержка нескольких локальных вкладок (например, “Tools”, “History”).  
- Шифрование истории чатов или возможность экспорта/импорта.  
- UI для просмотра usage/метрик по диалогу.  
- Расширенные уведомления о состоянии ретраев и таймаутов.

## Контакты

Проект развивается командой VR AI Dock. Вопросы и предложения — создавайте issue или PR в репозитории.
