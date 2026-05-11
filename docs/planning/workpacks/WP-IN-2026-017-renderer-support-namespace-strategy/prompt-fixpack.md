# Prompt - FIXPACK - WP-IN-2026-017

MODE: APPLY (Fixpack).

Use only if REVIEW returns NO-GO.

Fixpack rules:
- Address only REVIEW Must Fix items.
- Do not expand scope.
- Do not edit runtime/source/package/build files.
- Do not move/delete files.
- Do not update imports or config.
- Keep changes inside allowed docs paths from `workpack.md`.
- Re-run targeted validators and scope checks.

Output:
1. Must fix addressed.
2. Files changed.
3. Commands run.
4. Verification results.
5. Residual risks.
