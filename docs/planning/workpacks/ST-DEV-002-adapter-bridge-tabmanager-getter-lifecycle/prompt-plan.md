# ST-DEV-002 Prompt - PLAN

РЕЖИМ: PLAN ONLY / READ ONLY.

## Задача
Провести read-only аудит AdapterBridge lifecycle после ST-DEV-001 и подготовить exact file-level PLAN для перевода `registerAdapterBridgeIpc(tabManager)` на late-bound `registerAdapterBridgeIpc({ getTabManager })`.

## Обязательно прочитать
- `AGENTS.md`
- `CODEX.md`
- `docs/planning/workpacks/ST-DEV-002-adapter-bridge-tabmanager-getter-lifecycle/workpack.md`
- `docs/planning/workpacks/ST-DEV-001-executor-pilot-ipc-modular-registration/workpack.md`
- `src/main/main.js`
- `src/main/ipc/bootstrap.js`
- `src/main/browserViews/adapterBridge.js`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`

## Жёсткие правила
- Не изменять файлы.
- Не создавать файлы.
- Не устанавливать зависимости.
- Не запускать команды, меняющие рабочее дерево.
- Использовать только read-only проверки: `git status`, `git diff --stat`, `rg`, `Get-Content`/`cat`, чтение исходников и docs.

## Что проверить
- Подтвердить current lifecycle `main.js -> bootstrap.js -> adapterBridge.js`.
- Подтвердить или опровергнуть stale `tabManager` risk.
- Проверить, какие файлы должны измениться в APPLY.
- Проверить, меняется ли IPC contract или только lifecycle/wiring.
- Проверить, нужны ли docs/index updates.
- Подтвердить selected executor: `ai-dock-main-process-executor`.
- Подтвердить secondary executor: `ai-dock-ipc-security-reviewer`.

## Выход
1. PLAN summary
2. Executor decision
3. Current AdapterBridge lifecycle snapshot
4. Proposed file-level changes for APPLY
5. Allowed files for APPLY
6. Forbidden files for APPLY
7. Verification commands
8. Manual smoke checklist
9. Risks
10. Questions, only if blocking
11. Ready for Human Gate: yes/no
