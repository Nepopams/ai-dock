# Prompt Fixpack: WP-JUDGE-001 Current Contract Hardening

## Mode
FIXPACK, scoped.

## Rules
- Fix only REVIEW Must Fix items.
- Do not expand scope.
- Do not add IPC channels.
- Do not touch forbidden paths.
- Re-run targeted verification.
- Update run-state and delivery report.

## Stop condition
If the fix requires package/dependency/provider settings/prompt/history/EvaluationRun/new channel work, stop and return to Human Gate.
