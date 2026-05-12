# Prompt Fixpack: WP-JUDGE-006 Evaluation Studio UI Shell

## Objective
Apply only narrow fixes found during REVIEW without expanding scope.

## Allowed fix types
- TypeScript/build fixes in the changed renderer files.
- CSS fixes for layout/readability in the shell.
- Documentation status corrections.
- Validation output corrections in delivery artifacts.

## Forbidden fix types
- New IPC.
- Main/preload/shared changes.
- Package/dependency changes.
- Provider/settings schema changes.
- Judge runtime rewrites.
- EvaluationRun history/storage.
- Research, file import, BrowserView extraction, or n8n implementation.

## Escalation
If the fix requires forbidden files or expands the roadmap scope, stop and request a new human gate decision.
