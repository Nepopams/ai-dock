# IN-UI-008 Gates

## Soft gates
- Canonical PNG files can be created from numeric exports because every numeric source exists.
- Numeric PNG files remain as source evidence and are not deleted.
- Current screenshots are documented but not captured by Codex.
- Index updates are allowed because existing index style already links UI v2 handoff docs.

## Strong human gates
- STOP if runtime source changes are needed.
- STOP if package, dependency, config, script, build, or release files need changes.
- STOP if screenshot automation tooling is required.
- STOP if visual acceptance must be claimed without current screenshots.
- STOP if a fixpack requires runtime changes before screenshots and visual gap matrix are complete.

## Stop-the-line events
None.

## Approval log
- Human explicitly requested the visual acceptance layer and stopped further UI restyle workpacks.

## Decisions log
- Copy numeric PNG exports to canonical filenames only when canonical targets are missing.
- Do not overwrite existing canonical files.
- Do not delete numeric files.
- Do not run `npm test` or `npm run build`; this initiative changes docs/assets only.
