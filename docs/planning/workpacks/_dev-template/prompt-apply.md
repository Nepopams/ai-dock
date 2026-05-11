# Prompt Template — APPLY (runtime-development)

РЕЖИМ: APPLY.

## Preconditions
- PLAN утверждён Human Gate.
- Workpack содержит selected executor, affected modules и allow/forbidden paths.

## Execution rules
- Выполнять задачу только как selected executor.
- Вносить минимальный diff.
- Менять только allowed paths.
- При scope drift: stop-the-line и возврат на Human Gate.
- Если меняются runtime contracts, обновить docs/indexes.
- Запустить verification commands из workpack.

## Structured output
1. What changed
2. Files consulted
3. Files changed
4. Commands run
5. Verification results
6. IPC/Preload/Renderer/Store/Data impact
7. Risks
