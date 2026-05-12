# Prompt Apply: WP-IN-2026-028 Judge Sidebar Entry

## Mode
APPLY.

## Instructions
Add one Sidebar local view entry:
- `id: "compare"`
- `label: "Judge"`
- `icon: infoIcon`
- `isActive: activeLocalView === "compare"`
- `onClick: () => { void focusLocalView("compare"); }`

Do not change Judge runtime, IPC, preload, shared contracts, package files, or CompareView.
