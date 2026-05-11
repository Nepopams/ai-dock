# APPLY Prompt - WP-IN-2026-007

Apply only the scoped parity sync.

Allowed:
- Replace `src/main/services/registry.ts` with a typed wrapper over `registry.js`.
- Update `docs/architecture/main-ts-parity-audit.md` for the new wrapper status.
- Create/update IN-2026-007 initiative/workpack artifacts.

Forbidden:
- Editing `src/main/services/registry.js`.
- Editing registry IPC files.
- Editing shared, preload, renderer, package, lockfile, tsconfig, Vite config, scripts, dependencies, build artifacts, or runtime imports.

Required wrapper exports:
- `getRegistryPath`
- `loadRegistry`
- `saveRegistry`
- `clearRegistryCache`
- `watchRegistry`
- `stopRegistryWatcher`
- `serviceCategories`
- `isServiceCategory`
- `isServiceClient`
