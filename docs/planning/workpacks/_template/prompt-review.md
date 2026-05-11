# Prompt Template — REVIEW (Read-Only)

РЕЖИМ: REVIEW ONLY.

Инструкция для Codex:
1. Сравни diff с целями workpack.
2. Проверь соблюдение allowed/forbidden paths.
3. Проверь соответствие DoD.
4. Проверь IPC/security/docs drift.
5. Проверь полноту verification.
6. Выдай:
   - Summary,
   - Must fix,
   - Should fix,
   - Nice to have,
   - Tests,
   - GO/NO-GO,
   - вопросы (только если блокирует).

Запрещено вносить изменения в режиме REVIEW.
