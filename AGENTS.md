# AGENTS Playbook — VR AI Dock

## Миссия проекта
VR AI Dock — desktop-shell на Electron для безопасной и расширяемой работы с AI-агентами и AI-клиентами (web clients через BrowserView/WebContents tabs, локальный Chat, Completions Profiles, Form Runner, History Hub, Registry & Adapters, Prompt Drawer / Prompt Router).

Первичный executor: **Codex**. Политики применимы также к Claude и другим Dock Agents.

## Архитектурные границы
- `src/main/**` — Electron main process, window lifecycle, IPC handlers, сервисы.
- `src/preload/**` — безопасный bridge между renderer и main (contextBridge + ipcRenderer).
- `src/renderer/**` — UI-слой (React/Vite + Zustand и вспомогательные renderer-модули).
- `src/shared/**` — общие IPC contracts, типы и утилиты.

## Security invariants (обязательно)
- `contextIsolation` должен оставаться включённым.
- `sandbox` должен оставаться включённым.
- Прямой Node-доступ в renderer запрещён.
- Секреты/токены нельзя выводить в renderer-UI, логи, debug dumps.
- Любые новые интеграции должны проходить через preload + typed/shared contracts.

## IPC rules
Любой новый IPC канал добавляется только так:
1. Контракт/константы в `src/shared/ipc/**`.
2. Экспонирование в `src/preload/**` bridge.
3. Handler/registration в `src/main/**`.
4. Только после этого — renderer consumer.

Нельзя создавать «скрытые» или ad-hoc IPC каналы напрямую из renderer.

## BrowserView/WebContents rules
- Управление web clients — через `TabManager`/BrowserView-слой main.
- Внешняя навигация и popup-поведение должны оставаться ограниченными и контролируемыми.
- Любые изменения жизненного цикла вкладок должны включать cleanup/dispose и проверку утечек.

## Функциональные зоны (правила изменений)
- **Prompt Drawer / Prompt Router**: правки только через scoped workpack с явным UX impact.
- **History Hub**: изменения структуры истории/индексов — только с миграционным и rollback планом.
- **Chat**: изменения потоков отправки/стриминга — с проверкой abort/retry/error-path.
- **Completions Profiles**: любое изменение профилей/настроек — с backward compatibility и валидацией.

## Workpack-first policy
- Runtime-изменения разрешены **только** через workpack в `docs/planning/workpacks/**`.
- Для каждой задачи: **PLAN → Human Gate → APPLY → REVIEW**.
- Если scope выходит за workpack — остановка и возврат на PLAN/Gate.

## Initiative-first policy
- Если пользователь даёт инициативу вместо готового workpack, Codex должен использовать Initiative Runner layer.
- Initiative Runner создаёт file-backed initiative artifacts в `docs/planning/initiatives/**`.
- Initiative Runner может создавать epics, sprint mapping, workpack'и и prompt-pack'и автономно.
- Существующий workpack flow не удаляется: он становится inner loop для каждого workpack инициативы.

## Strong Human Gate policy
Codex обязан остановиться и запросить решение человека, если:
- требуется runtime APPLY без валидного workpack и PLAN;
- allowed/forbidden paths, selected executor или verification commands неясны;
- требуется изменение security invariants, IPC/preload boundary, data format или dependency metadata;
- executor должен выйти за свой слой или за allowed paths;
- REVIEW Must Fix меняет scope, risk profile или routing.

## No giant APPLY rule
- Multi-layer runtime initiative нельзя выполнять единым большим APPLY.
- Scope должен быть разложен на последовательные workpack'и с отдельными allowed paths, verification и REVIEW.
- Если decomposition невозможна без решения человека — stop-the-line и возврат на Human Gate.

## File-backed run-state rule
- Состояние инициативы нельзя держать только в чате.
- Для каждой инициативы должны существовать `run-state.md`, `task-queue.md`, `gates.md` и `delivery-report.md`.
- После каждого PLAN/APPLY/REVIEW/fixpack шага Codex обновляет run-state и queue.

## Initiative Runner output requirements
Итоговый output Initiative Runner обязан включать:
- что создано и обновлено;
- files consulted;
- files changed;
- commands run;
- runtime scope check;
- verification;
- risks;
- follow-ups;
- current run-state path и recommended next action.

## Executor Layer
- Executor roles могут менять runtime-код **только** при наличии утверждённого workpack.
- Каждая runtime-задача обязана содержать список affected modules.
- Allowed paths должны быть зафиксированы явно.
- Forbidden paths должны быть зафиксированы явно.
- Ни один executor не может менять чужой слой без stop-the-line и возврата на Human Gate.
- Тесты и обновление docs/indexes — часть implementation, а не опциональный шаг.
- Итоговый output executor обязан включать: files consulted, files changed, commands run, verification, risks.

## Обязательный формат ответа Codex
В каждом итоговом ответе обязательно указывать:
1. `Files consulted`
2. `Files changed`
3. `Commands run`
4. `Risks`
5. `Follow-ups`
