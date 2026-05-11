# PLAN Prompt - WP-IN-2026-007

Plan the registry TypeScript counterpart sync.

Required answers:
- Compare `registry.js` and `registry.ts` export surfaces.
- Decide whether `registry.ts` can be converted to a typed wrapper over `registry.js`.
- If wrapper conversion is impossible, define the minimal sync required.
- Decide whether shared types, package metadata, tsconfig, build, scripts, runtime imports, IPC, preload, or renderer need changes.
- Identify strong gates.
- List exact files allowed for APPLY.
- List verification commands.

PLAN conclusion:
- JS exports nine symbols; old TS exported six.
- Missing TS exports are `serviceCategories`, `isServiceCategory`, and `isServiceClient`.
- Wrapper conversion is safe and preferred.
- No shared, package, tsconfig, build, scripts, runtime JS, IPC, preload, or renderer changes are needed.
- No strong gate is triggered.
