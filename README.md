# AI Dock

AI Dock — настольное Electron‑приложение, которое собирает любимые AI‑ассистенты (ChatGPT, Claude, Alisa, DeepSeek) в одном окне с вкладками BrowserView. Каждая служба изолирована собственным `session`‑partition, поэтому логины и куки не смешиваются.

## Возможности

- **Tab Manager**: вкладки в BrowserView с отдельными сессиями, Sidebar для быстрого переключения, сохранение состояния между запусками (`tabs.json`).
- **Prompt Router Bar**: единая панель ввода промтов, мультивыбор агентов, история последних 50 запросов и мгновенная подстановка в поля каждого сервиса.
- **Prompts Drawer**: локальная библиотека промтов с добавлением, удалением и копированием в буфер.
- **Save Chat as Markdown**: экспорт любой активной вкладки в `.md` с автоматическим определением сервиса и форматированием диалога.
- **Безопасность**: `contextIsolation`, `sandbox`, preload‑мост без прямого доступа к Node, фильтр внешних ссылок.

## Стек

- Node.js 22 / Electron 31
- Простая сборка без фреймворков: HTML + CSS + ES‑modules
- `electron-builder` для Windows (NSIS)

## Структура

```
ai-dock/
├─ assets/                # иконки приложения
├─ src/
│  ├─ main/               # main process, TabManager, history store
│  ├─ preload/            # contextBridge API
│  └─ renderer/           # index.html/css/js + UI модули и SVG
├─ package.json
├─ electron-builder.yml
└─ README.md
```

## Быстрый старт

```bash
npm install
npm run dev    # запускает Electron в dev-режиме
```

## Сборка релиза

```bash
npm run build  # собирает Windows NSIS через electron-builder
```

Готовый инсталлятор появится в `dist/`.

## Prompt Router Bar

1. Введите текст в поле «Введите промт…».
2. Отметьте нужных агентов (по умолчанию все выделены).
3. Нажмите `Send` или `Ctrl/Cmd + Enter`.
4. Промт отправится во все отмеченные вкладки (в поле ввода каждого сервиса).
5. В выпадающем списке 📜 можно выбрать ранее отправленный промт — история хранится в `userData/prompts_history.json` (до 50 записей).

## Prompts Drawer

- Открывается кнопкой «Prompts» в шапке.
- Сохраняйте часто используемые шаблоны, копируйте их в буфер одним кликом.
- Файловое хранилище — `userData/prompts.json`.

## Экспорт диалогов

1. Сделайте активной нужную вкладку.
2. Нажмите `Save Chat` в правой части таб-бара.
3. AI Dock выполнит скрипт извлечения DOM → Markdown и предложит сохранить файл.

## Настройка/расширение

- Новые сервисы добавляются в `src/main/services.js`.
- Логика вкладок и их восстановления — `src/main/tabManager.js`.
- Мост для IPC и методов Prompt Router — `src/preload/preload.js`.
- Рендерер с UI‑логикой — `src/renderer/index.js`.

## Лицензия

MIT (по умолчанию). Обновите, если требуется иная.***
