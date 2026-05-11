# PLAN Prompt - WP-IN-2026-009

Plan the React renderer default switch.

Required answers:
1. Current renderer selection in `main.js`.
2. Current script behavior for legacy/React modes.
3. Minimal diff to make React default.
4. Explicit legacy fallback model.
5. Whether `electron:build` must run `vite build`.
6. Whether package-lock changes are required.
7. Whether a strong gate exists.
8. Exact files to change.

PLAN result:
- React default is safe with `AI_DOCK_LEGACY_UI=true` as fallback.
- `npm start` needs a React dist selector because unpackaged Electron is still `isDev`.
- `electron:build` must run `npm run build` before electron-builder.
- No dependency, lockfile, preload/shared/IPC, or React component change is needed.
