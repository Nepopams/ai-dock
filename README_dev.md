## VR AI Dock — заметки для разработки

### Быстрый запуск и отладка
- `npm run dev:new-ui` — запускает Vite + Electron в dev-режиме. Переменная `AI_DOCK_SKIP_AUTOTABS=1` предотвращает автозагрузку тяжёлых вкладок.
- `npm run electron:dev` — прямой запуск main-процесса с увеличенным лимитом памяти (`NODE_OPTIONS=--max-old-space-size=4096`).
- `npm run electron:inspect` — стартует Electron с `--inspect=9229`. После запуска откройте Chrome/Edge → `chrome://inspect` → Configure… (убедитесь, что указан `localhost:9229`). В списке Remote Target выберите «inspect» для VR AI Dock.

### Снятие heap snapshot main-процесса
1. Запустите `npm run electron:inspect`.
2. В Chrome откройте `chrome://inspect` и подключитесь к таргету «Electron Main Process».
3. В DevTools перейдите во вкладку **Memory**, выберите **Heap snapshot** и нажмите **Take snapshot**. Можно сравнивать два снимка (до/после) через вкладку **Comparison**.

### Рекомендации при правках
- Используйте хелпер `createDisposableBag` (`src/renderer/utils/disposables.ts`) для управления подписками, таймерами, `requestAnimationFrame`.
- После добавления performance-марок очищайте их (`performance.clearMarks`, `performance.clearMeasures`).
- При закрытии вкладок/BrowserView всегда вызывать `destroy()` и очищать ссылки, чтобы main-процесс освобождал память.
- В dev-режиме sourcemap отключены, HMR-оверлей выключен — если нужна диагностика, включайте точечно через `vite.config.js`.
