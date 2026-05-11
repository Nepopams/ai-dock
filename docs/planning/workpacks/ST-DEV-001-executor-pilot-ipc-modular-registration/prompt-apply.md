# ST-DEV-001 Prompt — APPLY

РЕЖИМ: APPLY.

PRECONDITIONS:
- PLAN approved.
- Human Gate пройден.

EXECUTION:
- Selected executor: `ai-dock-main-process-executor`.
- Secondary handoff: `ai-dock-preload-ipc-executor` при необходимости.
- Вносить минимальный diff.
- Работать только в allowed paths.
- Stop-the-line при любом scope drift.
- Если меняется contract wiring — обновить IPC/service docs indexes.

VERIFICATION:
- Выполнить verification commands из workpack.
- Зафиксировать результаты и риски.

OUTPUT:
1. What changed
2. Files consulted
3. Files changed
4. Commands run
5. Verification results
6. IPC/preload impact
7. Risks
