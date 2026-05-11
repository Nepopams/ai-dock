# FIXPACK Prompt - Initiative Runner Smoke Workpack

## Назначение
Использовать только если REVIEW выдаст NO-GO.

## Правила
- Исправлять только Must Fix.
- Не расширять scope.
- Не менять runtime, package files или dependencies.
- Не менять allowed/forbidden paths без strong human gate.
- Сохранять selected executor `ai-dock-initiative-runner`.

## Allowed paths
- `docs/planning/initiatives/IN-2026-001-validate-initiative-runner/**`
- `docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/**`

## Verification
- Повторить targeted validator, который упал.
- Повторить `git diff --check`, если Must Fix связан с formatting/diff hygiene.

## Output
1. Fixed items.
2. Files consulted.
3. Files changed.
4. Commands run.
5. Remaining risks.
