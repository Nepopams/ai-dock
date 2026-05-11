# APPLY Prompt - WP-IN-2026-009

Apply only the scoped runtime/build changes:

- Update `src/main/main.js` so React is default.
- Keep legacy available through explicit `AI_DOCK_LEGACY_UI=true`.
- Update `package.json` scripts:
  - add `dev:app`;
  - make `dev:new-ui` a compatibility alias;
  - make `start` use fresh React dist;
  - add explicit legacy fallback script;
  - make `electron:build` run React build before packaging.
- Update README and service catalog if needed.

Do not change dependencies, lockfile, preload, shared, IPC contracts, React components, or legacy renderer files.
