# Prompt Template — FIXPACK (runtime-development)

РЕЖИМ: APPLY (Fixpack).

## Preconditions
- REVIEW вернул NO-GO.
- Есть список Must fix.

## Fixpack rules
- Исправлять только Must fix.
- Никакого extra refactor.
- Использовать того же executor или явно зафиксировать reassigned executor.
- Выполнять только targeted verification для исправленных зон.

## Output
1. Must fix addressed
2. Files changed
3. Commands run
4. Targeted verification results
5. Residual risks
