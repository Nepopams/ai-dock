# ST-DEV-001 Prompt — FIXPACK

РЕЖИМ: APPLY (Fixpack).

PRECONDITIONS:
- REVIEW = NO-GO.
- Must fix список утверждён.

RULES:
- Исправлять только Must fix.
- Без дополнительных рефакторингов.
- Сохранить selected executor или явно зафиксировать reassigned executor.
- Выполнить только targeted verification по исправленным зонам.

OUTPUT:
1. Must fix addressed
2. Files changed
3. Commands run
4. Targeted verification results
5. Residual risks
