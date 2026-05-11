# Orchestration Plan - IN-2026-010

## Initiative summary
Single scoped renderer bugfix initiative to unblock Form Profiles smoke after the React renderer default switch.

## Assumptions
- The user-provided L3 autonomy is sufficient to pass the plan gate autonomously if no strong gate triggers appear.
- The `FormEditor.tsx:1704` browser console line maps to source `PreviewPanel` text rendering around the `{{variable}}` placeholder.
- No new tests are added unless existing test structure provides an obvious renderer smoke path inside the allowed scope.

## Selected delivery mode
Runtime single-layer, renderer-only, one workpack.

## Epic breakdown
- E1: Fix Form Profiles React smoke crash and warning.

## Sprint mapping
- React default smoke fix.
- One sequential workpack: `WP-IN-2026-010-form-profiles-react-smoke-crash-fix`.

## Workpack queue
- `WP-IN-2026-010-form-profiles-react-smoke-crash-fix` - scoped renderer APPLY.

## Executor routing
- Primary: `ai-dock-renderer-react-executor`.
- Secondary QA: `ai-dock-test-qa-executor`.
- Rationale: affected runtime files are React renderer view files only; store contracts and shared types remain read-only.

## Gate plan
- Gate A Scope: user-provided scope and allow/forbid lists are explicit.
- Gate B Plan: autonomous pass allowed by L3 if PLAN finds no schema/IPC/package/main/preload need.
- Gate C Apply: diff must only touch allowed files.
- Gate D Review: validators, tests, build, diff, and scope checks recorded.

## Verification strategy
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-010-form-profiles-react-smoke-crash-fix`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-010-form-profiles-react-smoke-crash-fix/workpack.md`
- `npm test`
- `npm run build`
- `npx tsc --noEmit --pretty false` if available without config/package changes.
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts`

## Risk register
- Existing `package-lock.json` is modified before this initiative; verify it is pre-existing and not touched.
- Manual smoke may remain pending if the Electron dev app is not launched.
- Build may pass despite runtime JSX issues because Vite/esbuild transpilation does not run the component.
