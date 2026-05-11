# Prompt Template — REVIEW (runtime-development)

РЕЖИМ: REVIEW ONLY (read-only).

## Review goals
- Сравнить diff с workpack.
- Проверить, что executor остался в allowed scope.
- Проверить, что forbidden paths не тронуты.
- Проверить тесты и verification evidence.
- Проверить docs/index drift.
- Вынести GO/NO-GO.

## Output
1. Summary
2. Must fix
3. Should fix
4. Tests/verification assessment
5. GO/NO-GO
6. Files consulted
7. Commands run
