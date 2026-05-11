# Workpack: ST-DEV-002 - AdapterBridge TabManager Getter Lifecycle

## Workpack ID
`ST-DEV-002`

## Title
AdapterBridge TabManager Getter Lifecycle

## Status
Applied / Ready for Review

## Owner
- Owner: Codex + Human Gate
- Selected executor: `ai-dock-main-process-executor`
- Secondary executor: `ai-dock-ipc-security-reviewer`

## Mode
`runtime-development`

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `docs/planning/workpacks/ST-DEV-001-executor-pilot-ipc-modular-registration/workpack.md`
- `src/main/main.js`
- `src/main/ipc/bootstrap.js`
- `src/main/browserViews/adapterBridge.js`
- `src/main/browserViews/adapterBridge.ts`
- `src/shared/ipc/adapterBridge.ipc.*`

## Goal
Подготовить и выполнить scoped runtime-задачу по переводу AdapterBridge IPC registration с direct `tabManager` reference на late-bound `getTabManager` context, чтобы IPC handlers не замыкали stale `TabManager` и соответствовали bootstrap/context handoff стилю после ST-DEV-001.

## User value
- Снижение риска обращения AdapterBridge IPC к устаревшему `TabManager` после пересоздания окна.
- Единый lifecycle-подход для main IPC registration после ST-DEV-001.
- Более безопасная и reviewable модель BrowserView/TabManager access.

## In scope
- Перевести `registerAdapterBridgeIpc(tabManager)` на `registerAdapterBridgeIpc({ getTabManager })`.
- Обновить `src/main/ipc/bootstrap.js`, чтобы он передавал getter, а не direct `tabManager`.
- Обновить `src/main/browserViews/adapterBridge.js`, чтобы IPC handler получал актуальный `tabManager` на каждый вызов.
- Добавить безопасную обработку случая, когда `tabManager` отсутствует.
- Сохранить текущие IPC channels и return shape.
- Обновить docs/indexes при необходимости.

## Out of scope
- Не менять IPC channel names.
- Не менять preload API.
- Не менять renderer UI.
- Не менять shared IPC contracts, если channel contract не меняется.
- Не менять `TabManager` behavior.
- Не добавлять новые adapters.
- Не добавлять dependencies.
- Не менять `package.json` или `package-lock.json`.
- Не менять бизнес-логику adapter execution вне lifecycle/getter boundary.

## Current architecture context
После ST-DEV-001 `src/main/main.js` вызывает `registerMainIpc({ tabManager, getMainWindow, getTabManager })`, `src/main/ipc/bootstrap.js` централизует регистрацию IPC, а `src/main/ipc/shell.js` уже использует getter/context approach. При этом `src/main/browserViews/adapterBridge.js` всё ещё регистрируется как `registerAdapterBridgeIpc(tabManager)` и замыкает конкретный `tabManager` внутри IPC handler. Это создаёт lifecycle-риск stale reference при пересоздании окна или смене active `TabManager`.

Affected modules:
- `main`
- `browserViews/adapterBridge`
- `IPC bootstrap`
- `docs`

## Allowed files
Для будущего APPLY:
- `src/main/browserViews/adapterBridge.js`
- `src/main/ipc/bootstrap.js`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `docs/planning/workpacks/ST-DEV-002-adapter-bridge-tabmanager-getter-lifecycle/**`

## Forbidden files
- `src/preload/**`
- `src/renderer/**`
- `src/shared/**`, если не доказано изменение контракта
- `tests/**`, если workpack не расширен через Human Gate
- `package.json`
- `package-lock.json`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. PLAN: read-only проверить текущий lifecycle `main.js -> bootstrap.js -> adapterBridge.js`.
2. PLAN: подтвердить или опровергнуть stale `tabManager` risk и зафиксировать file-level APPLY plan.
3. Human Gate: утвердить minimal diff и allowed files.
4. APPLY: обновить `registerAdapterBridgeIpc` на объектный context `{ getTabManager }`.
5. APPLY: обновить `bootstrap.js`, чтобы AdapterBridge получал `getTabManager`.
6. APPLY: в AdapterBridge handler получать `tabManager` на каждый IPC вызов и возвращать безопасный error response, если manager отсутствует.
7. APPLY: сохранить IPC channels `adapter:exec` и `adapter:ping` и существующий response shape.
8. APPLY: обновить docs/indexes при необходимости.
9. REVIEW: проверить path discipline, lifecycle behavior, security invariants и verification evidence.
10. FIXPACK: исправлять только Must Fix без дополнительных refactor.

## Acceptance criteria
- [ ] `registerAdapterBridgeIpc` принимает context с `getTabManager`, а не direct `tabManager`.
- [ ] `src/main/ipc/bootstrap.js` передаёт `getTabManager` в AdapterBridge registration.
- [ ] AdapterBridge IPC handler получает актуальный `tabManager` во время каждого `adapter:exec` вызова.
- [ ] При отсутствии `tabManager` handler возвращает безопасный `{ ok: false, error, code }` response без throw наружу.
- [ ] IPC channel names не изменены.
- [ ] Current AdapterBridge return shape сохранён.
- [ ] Preload API, renderer и shared contracts не изменены.
- [ ] Forbidden files не изменены.
- [ ] Docs/indexes синхронизированы, если они затронуты.

## Test plan
- `npm run workflow:validate-workpack -- docs/planning/workpacks/ST-DEV-002-adapter-bridge-tabmanager-getter-lifecycle/workpack.md`
- `node --check src/main/ipc/bootstrap.js`
- `node --check src/main/browserViews/adapterBridge.js`
- `npm test`
- `git diff --name-status`
- Manual smoke: app start, create/switch/close tab, AdapterBridge `adapter:ping`, AdapterBridge `adapter:exec` happy path, missing/closed tab error path.

## Security impact
- `contextIsolation`, `sandbox` и preload bridge discipline не должны измениться.
- Новые IPC channels не добавляются.
- AdapterBridge остаётся main-process controlled и не раскрывает Node primitives в renderer.
- Error handling должен оставаться безопасным и не раскрывать секреты/токены.
- Late-bound `getTabManager` снижает lifecycle-риск stale BrowserView access.

## IPC impact
Behavior-neutral lifecycle update для существующих AdapterBridge channels:
- `adapter:exec`
- `adapter:ping`

Channel names и preload-facing API не меняются. Expected response shape сохраняется.

## Docs impact
- `docs/_indexes/ipc-index.md` обновить, если нужно явно зафиксировать getter/context registration для AdapterBridge.
- `docs/architecture/service-catalog.md` обновить, если нужно уточнить BrowserView/TabManager lifecycle responsibility.
- Этот workpack и prompt-pack являются source of truth для ST-DEV-002.

## Rollback
- Откатить `src/main/browserViews/adapterBridge.js` к direct `tabManager` registration.
- Откатить `src/main/ipc/bootstrap.js` к прежней передаче direct `tabManager`.
- Откатить связанные docs updates.
- Повторить targeted verification и manual smoke.

## Done criteria
- [ ] PLAN выполнен и approved Human Gate получен.
- [ ] APPLY diff минимален и находится только в allowed files.
- [ ] Verification commands выполнены и зафиксированы.
- [ ] Manual smoke checklist выполнен или residual risk явно указан.
- [ ] REVIEW Gate = GO.

## Risks
- Неправильная обработка отсутствующего `tabManager` может изменить error semantics `adapter:exec`.
- Случайное изменение shared/preload contract приведёт к scope creep.
- Недостаточный smoke может пропустить BrowserView lifecycle regression.
- Если TypeScript wrapper `adapterBridge.ts` фактически используется downstream, может потребоваться отдельный Human Gate для включения его в allowed files.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
