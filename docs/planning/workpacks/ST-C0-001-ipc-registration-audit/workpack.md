# Workpack: ST-C0-001 — IPC Registration Audit

## Workpack ID
`ST-C0-001`

## Title
Аудит регистрации IPC и план безопасного перехода к модульной registration layer

## Status
Draft (готов к PLAN)

## Owner
Codex (исполнитель) + Human Gate Owner

## Mode
PLAN-first (без runtime-изменений на текущем шаге)

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/architecture/service-catalog.md`
- `docs/_indexes/ipc-index.md`
- `src/main/main.js`
- `src/main/ipc/**`
- `src/preload/index.ts`
- `src/preload/modules/**`
- `src/shared/ipc/**`

## Goal
Провести read-only аудит текущей регистрации IPC и подготовить безопасный, поэтапный план модульной регистрации IPC через bootstrap/registry layer в будущих workpack’ах.

## User value
- Снижение риска regression при будущих IPC-изменениях.
- Прозрачная карта текущих каналов и registration points.
- Чёткая декомпозиция будущего refactor без big-bang.

## In scope
- Анализ `main.js` и модулей `src/main/ipc/**`.
- Анализ preload-экспонирования IPC API.
- Анализ shared IPC contracts.
- Подготовка предложенного target design и phased refactor plan.

## Out of scope
- Любые изменения runtime-кода.
- Добавление/удаление IPC каналов.
- Перенос логики в новые runtime-модули в этом workpack.

## Current architecture context
Сейчас IPC-регистрация в main централизована вокруг `src/main/main.js` и ряда доменных `register*Ipc` модулей; preload агрегирует API через `src/preload/index.ts`; shared контракты частично вынесены в `src/shared/ipc/**`.

## Allowed files
### Для текущего PLAN (read-only)
- `docs/planning/workpacks/ST-C0-001-ipc-registration-audit/**`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- чтение: `src/main/**`, `src/preload/**`, `src/shared/**`

### Для будущего APPLY (proposal only, НЕ выполнять сейчас)
- `src/main/main.js`
- `src/main/ipc/**`
- `src/main/browserViews/adapterBridge.*`
- `src/preload/index.ts`
- `src/preload/modules/**`
- `src/shared/ipc/**`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`

## Forbidden files
- `src/renderer/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`
- `package-lock.json`

## Step-by-step plan
1. Снять полную карту IPC registration points и каналов.
2. Сверить каналы main ↔ preload ↔ shared contracts.
3. Найти дублирование/непоследовательность и зоны риска.
4. Предложить target-state модульной registration layer.
5. Разбить migration на 2–4 безопасных future workpack’а.
6. Подготовить verification и rollback-подход для каждого future workpack.

## Acceptance criteria
- [ ] Есть список source-of-truth.
- [ ] Есть чёткая цель и user value.
- [ ] Есть in-scope и out-of-scope.
- [ ] Есть allowed/forbidden paths.
- [ ] Есть test plan.
- [ ] Есть risk list.
- [ ] Есть rollback.

## Test plan
- PLAN-фаза: только read-only проверки структуры и связей каналов.
- APPLY-фаза (будущая): targeted smoke IPC registration + preload exposure consistency.

## Security impact
Ожидаемый эффект: усиление дисциплины IPC boundaries, прозрачность surface area, снижение риска непроверенных каналов.

## IPC impact
На этом шаге — только аудит и дизайн. Runtime IPC поведение не меняется.

## Docs impact
- Может потребоваться обновление `docs/_indexes/ipc-index.md` по итогам future APPLY.
- Может потребоваться обновление `docs/architecture/service-catalog.md`.

## Rollback
Для текущего workpack rollback тривиален: откат документных изменений. Runtime rollback не требуется, так как runtime не меняется.

## Done criteria
- Workpack готов к запуску отдельного PLAN prompt.
- Human Gate подтверждает scope и будущие APPLY-пути.

## Risks
- Неполный аудит каналов из-за смешанных `.ts/.js` артефактов.
- Недооценка side-effects при декомпозиции registration.
- Риск scope creep в future APPLY без жёсткого gate.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
