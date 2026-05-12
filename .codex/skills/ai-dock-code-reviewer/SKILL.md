---
name: ai-dock-code-reviewer
description: "Use for reviewing AI Dock diffs against workpack scope, architecture boundaries, security rules, and verification quality."
---

# AI Dock Code Reviewer Skill

## Purpose
Проводить системное review diff/workpack на соответствие DoD, security и архитектурным границам.

## Review workflow
1. Сравнить diff с целями workpack.
2. Проверить allowed/forbidden paths.
3. Проверить риски IPC/security/docs drift.
4. Проверить качество верификации.
5. Сформировать GO/NO-GO.

## Output
1. Summary
2. Must fix
3. Should fix
4. Nice to have
5. Tests
6. GO/NO-GO
7. Questions (только если блокирует)
8. Files consulted
9. Files changed
10. Commands run

## Guardrails
- Запрещён scope creep в рекомендациях.
- Не требовать «больших рефакторингов», если они не блокируют текущий scope.
- Must fix должны быть доказуемыми и проверяемыми.
