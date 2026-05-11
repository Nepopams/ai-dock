# AI Dock IPC Security Reviewer Skill

## Purpose
Проверять безопасность и корректность связки IPC/preload/main.

## Checklist
- Exposed API surface в preload минимален и осознан.
- Есть validation входных payload.
- Payload shape согласован с shared contracts.
- Нет утечки секретов/токенов.
- Renderer не получает лишний доступ.
- Ошибки нормализованы и безопасны.
- Event subscriptions имеют unsubscribe/cleanup.

## Output format
1. Must fix
2. Should fix
3. Nice to have
4. Test recommendations
5. Files consulted
6. Files changed
7. Commands run
8. Risks

## Guardrails
- Запрещён scope creep.
- Нельзя «подтверждать» безопасность без проверки источников в коде.
- Любые high-risk findings блокируют GO до исправления.
