# Sprint S0 — Codex Workflow Bootstrap

## Цель спринта
Собрать минимально работоспособный Workpack Layer, чтобы последующие изменения шли через стандартный pipeline и Human Gates.

## Epics
- EP-C0 — Codex Workflow Layer

## Workpacks
- ST-C0-001 — IPC Registration Audit (подготовка к будущему PLAN/APPLY)

## Acceptance criteria
- [ ] Созданы шаблоны workpack и prompt-pack.
- [ ] Созданы структуры epics/sprints/workpacks.
- [ ] Есть pilot-workpack с явными in/out scope и рисками.
- [ ] Скрипты проверки workpack-слоя запускаются локально.

## Manual verification checklist
- [ ] Проверить, что шаблоны читаемы и пригодны к копированию в Codex.
- [ ] Проверить, что pilot-workpack содержит все обязательные секции.
- [ ] Проверить `vibe-status` и `validate-workpack` на pilot-workpack.
- [ ] Проверить, что runtime-файлы не изменялись.
