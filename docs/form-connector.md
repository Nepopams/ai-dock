## Form Profiles UI

- Раздел доступен через боковое меню `Form Profiles`. Отображаются все профили, загруженные из `userData/form-profiles.json`.
- Верхняя панель позволяет искать по `label` или `id`, создавать новый профиль, дублировать, удалять и принудительно обновлять список.
- Новый профиль создаётся на основе дефолтного «Echo JSON» и получает новый `id` (`crypto.randomUUID()`), `label` устанавливается как `New Form Profile`. Сохранение выполняет полную валидацию (обязательные поля, уникальные имена в схеме).
- Редактор содержит три вкладки:
  - **Profile** — общие свойства: `label`, `baseUrl`, `stream`, `auth.apiKeyRef`, описание.
  - **Request Template** — метод, путь, заголовки, query, тело (поддержка `json`, `form`, `none`, `multipart` с подсказкой).
  - **Schema** — список полей (управление порядком, удаление, настройка атрибутов; для `select` — редактор options).
- Панель справа отображает dry-run: значения для подстановки (`Sample values`), результат `Run Test` (`url`, `method`, headers, bodyPreview, notes). Запуск возможен только при отсутствии несохранённых изменений.
- Удаление и переключение с несохранённым черновиком требуют подтверждения.

## Dry-run

- Renderer вызывает `window.formProfiles.test({ profile, sampleValues })`.
- Main-процесс проверяет `apiKeyRef` и выполняет рендеринг без сетевых запросов; результат содержит `url`, `method`, `headers` (маскирование чувствительных ключей), `bodyPreview` и необязательные `notes`.
- При ошибке (включая отсутствие секрета) возвращается `{ ok:false, error, details? }`, которое отображается в панели предпросмотра.

## Streaming
- Run view dostupen iz Form Profiles (knopka "Open Run...") tolko dlya profilej so stream-mode (`sse` ili `ndjson`).
- Start: `window.formRunner.stream.start({ profileId, values, connectTimeoutMs, idleTimeoutMs, totalTimeoutMs })`; main podpisyvaet inflight i shlet delta/done/error/status.
- Delta-sobytiya (SSE `data:`/`[DONE]`, NDJSON stroki s `delta|token|content` ili syroj tekst) konkatenirujutsja v `text` na renderer-e.
- Status sobytija (`open`, `heartbeat`, `closed`) obnavljaet UI; `idleTimeoutMs` po umolchaniu 30 000 ms, narushenie -> `TIMEOUT` i zakrytie streama.
- Abort (renderer -> main) vyzyvaet `AbortController` s prichinoj `user-abort`, v UI status `aborted` i soobshchenie ob ostanovke.
- V Stream Output dostupny knopki scroll/copy, aggregator simvolov i vremja poslednego chanka; finalny tekst dostupen v `StreamDone.aggregatedText`.
