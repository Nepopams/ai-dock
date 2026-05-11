# Change Management — VR AI Dock

## 1) Добавление IPC
Обязательная цепочка:
1. Контракт и типы в `src/shared/ipc/**`.
2. Экспонирование/валидация в `src/preload/**`.
3. Handler/registration в `src/main/**`.
4. Подключение renderer consumer.
5. Обновление `docs/_indexes/ipc-index.md` и `docs/architecture/service-catalog.md`.

## 2) Добавление Agent Adapter
- Добавить/обновить adapter implementation и selector rules.
- Уточнить требования к bridge-командам и safety checks.
- Обновить feature-index и service-catalog.
- Проверить совместимость с Registry & Adapters.

## 3) Изменения Zustand store
- Любая правка slice должна иметь явный state contract.
- Не смешивать UI-only и integration state без причины.
- Обновлять документацию по consumer views и side effects.

## 4) Изменения Chat/Completions
- Любые изменения потоков запросов/ответов должны покрывать:
  - timeout/abort/retry;
  - graceful error path;
  - защиту от утечек секретов.
- Обновить smoke/test-план в workpack.

## 5) Добавление Registry client
- Зафиксировать schema и валидационные правила.
- Обновить индексы (feature + service + IPC при необходимости).
- Описать fallback при невалидных/частичных данных.

## 6) Workflow / n8n интеграции
- Сначала docs-only дизайн и threat-model.
- Затем отдельный runtime workpack с boundary правилами.
- Не допускать прямого renderer-доступа к чувствительным токенам.

## 7) Обновление README / service-catalog / indexes
Любое функциональное изменение должно синхронно обновлять:
- `README.md` (если меняется поведение пользователя/разработчика),
- `docs/architecture/service-catalog.md`,
- `docs/_indexes/*` (feature/ipc/source-of-truth).
