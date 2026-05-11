# Workpack Template

## Workpack ID
`WP-XXXX-YYY`

## Title
Краткое название workpack.

## Status
Draft / Planned / In Progress / Review / Done / Blocked

## Owner
Ответственный исполнитель (например, Codex + Human owner).

## Mode
PLAN / APPLY / REVIEW

## Sources of truth
- AGENTS.md
- CODEX.md
- docs/_governance/dor.md
- docs/_governance/dod.md
- docs/_indexes/source-of-truth.md
- релевантные архитектурные/индексные документы

## Goal
Что именно нужно получить в результате.

## User value
Какую ценность это даёт пользователю/команде.

## In scope
- ...

## Out of scope
- ...

## Current architecture context
Краткий снимок текущего состояния, которое затрагивает workpack.

## Allowed files
- `path/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/renderer/**`
- `src/shared/**`
- `node_modules/**`

## Step-by-step plan
1. ...
2. ...
3. ...

## Acceptance criteria
- [ ] Критерий 1
- [ ] Критерий 2

## Test plan
- Команда 1
- Команда 2
- Обоснование, если тесты не запускаются

## Security impact
- sandbox/contextIsolation impact
- token/secrets impact

## IPC impact
- Какие IPC контракты/каналы затронуты (или `none`).

## Docs impact
- Какие документы и индексы нужно обновить.

## Rollback
Как откатить изменения безопасно.

## Done criteria
Условия завершения (должны соответствовать DoD).

## Risks
- Риск 1 + mitigation
- Риск 2 + mitigation

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
