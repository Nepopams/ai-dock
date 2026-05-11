# Prompt Template — PLAN (runtime-development)

РЕЖИМ: PLAN ONLY.

## Задача
Провести read-only анализ runtime-development workpack и подготовить file-level план.

## Требования
- Только read-only анализ.
- Inspect только релевантные файлы из sources-of-truth и affected modules.
- Подтвердить selected executor или предложить более подходящий executor с обоснованием.
- Составить точный список файлов для будущего APPLY.
- Сформировать risk list и test/verification plan.
- Никаких изменений файлов в этом шаге.

## Ожидаемый формат
1. PLAN summary
2. Executor decision
3. Proposed file changes
4. Verification plan
5. Risks
6. Files consulted
7. Commands run
