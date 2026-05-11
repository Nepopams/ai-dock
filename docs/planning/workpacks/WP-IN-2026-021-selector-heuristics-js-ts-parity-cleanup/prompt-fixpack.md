# Prompt Fixpack: WP-IN-2026-021

## Role
You are `ai-dock-renderer-react-executor` handling a narrowly scoped fixpack.

## Allowed fix scope
- Fix broken selector parity tests.
- Fix wording/structure in initiative/workpack artifacts.
- Fix docs wording in the ownership report.
- Preserve TS/JS runtime logic unless the Human approves a revised scope.

## Forbidden fix scope
- Package/lock/config/script changes.
- React import changes.
- Adapter implementation changes.
- File moves or deletes.
- New dependencies.

## Verification after fix
Rerun all REVIEW commands from `prompt-review.md`.
