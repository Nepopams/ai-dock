# IN-UI-007C Orchestration Plan

## Initiative summary
Apply UI v2 styling to History Hub as the last remaining UI v2 local view workpack after Form Runner and Prompt Templates / Media Presets.

## Assumptions
- Canonical export `09-history-hub.png` is missing, but numeric export `9.png` is present and matches the History Hub frame.
- Existing `--aid-*` token foundation and previous view restyles are available.
- No history behavior, storage, IPC, or store changes are required.

## Selected delivery mode
L3 scoped renderer History UI APPLY.

## Epic breakdown
- History Hub view restyle.
- History CSS tokenization.
- Roadmap and delivery artifact update.

## Sprint mapping
Single workpack: `WP-UI-007C-history-hub-restyle`.

## Workpack queue
1. `WP-UI-007C-history-hub-restyle` - in progress.

## Executor routing
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary QA: `ai-dock-test-qa-executor` through verification commands and manual smoke checklist.
- Security/readability: `ai-dock-security-hardening-executor` considerations for source actions, readable message text, and no data exposure changes.

## Gate plan
- Human approval is present in the request for `WP-UI-007C`.
- Strong gate is not triggered because numeric History export is present and scope stays inside allowed files.
- Stop if implementation needs stores, shared contracts, IPC, main/preload, package, dependencies, or behavior changes.

## Verification strategy
- Initiative validator.
- Workpack validator.
- `npm test`.
- `npm run build`.
- `git diff --check`.
- Forbidden-path status check.
- Manual Electron smoke checklist recorded in delivery report.

## Risk register
- Open-in-source and continue-in-chat are Electron-only flows; manual smoke remains required.
- Existing History CSS block is adjacent to previous UI sections; edits must stay scoped to `.history-*`.
- Search result text can be long; CSS must preserve wrapping and scrollability.
