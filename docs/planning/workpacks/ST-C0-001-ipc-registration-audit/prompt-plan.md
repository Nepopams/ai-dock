# ST-C0-001 Prompt — PLAN (Read-Only IPC Audit)

РЕЖИМ: PLAN ONLY.

Задача:
Провести read-only аудит текущей IPC registration topology и подготовить file-level план будущего модульного refactor без изменений runtime-кода.

Инструкция:
1. Прочитай: `AGENTS.md`, `CODEX.md`, `.codex/prompts/ai-dock-anchor.md`, текущий `workpack.md`, `docs/_indexes/ipc-index.md`, `docs/architecture/service-catalog.md`.
2. Разрешено только чтение: `src/main/**`, `src/preload/**`, `src/shared/**`.
3. Запрещено: любые правки файлов, установки зависимостей, модифицирующие команды.
4. Выдай:
   - current IPC snapshot (main/preload/shared);
   - mapping channels and handlers;
   - gap/risk list;
   - proposed staged refactor plan (future APPLY);
   - verification strategy;
   - blocking questions (если есть).
5. Обязательно укажи: files consulted, commands run, risks.
