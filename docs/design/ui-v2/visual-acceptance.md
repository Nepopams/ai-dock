# UI v2 Visual Acceptance

## Purpose
This document defines the control layer for accepting the UI v2 rollout visually. It is not a runtime APPLY and does not authorize CSS or React changes.

## Acceptance model
Automated verification proves that the workpacks built and stayed inside allowed paths. Visual acceptance proves that the running app actually matches the Pencil design closely enough to ship.

Codex should not perform visual acceptance without current app screenshots because the repository diff cannot prove layout, clipping, BrowserView bounds, modal stacking, focus visibility, or whether the app is accidentally running in legacy mode.

## Required evidence per screen
- Canonical design PNG from `docs/design/ui-v2/exports/`.
- Current app screenshot from `docs/design/ui-v2/current-screenshots/`.
- Manual smoke notes for the screen's primary flows.
- One row in `docs/design/ui-v2/visual-gap-matrix.md`.

## Acceptance levels
| Level | Meaning | Action |
| --- | --- | --- |
| GO | Screen visually matches the design closely enough and smoke passes. | No fixpack required. |
| GO with polish | Screen is usable and recognizably UI v2, but has non-blocking visual gaps. | Add polish item to fixpack backlog. |
| NO-GO | Screen has a blocker that makes the UI misleading, unreadable, clipped, or operationally risky. | Create scoped WP-UI-009 fixpack before acceptance. |

## Hard visual blockers
- Wrong app mode or legacy UI is visible.
- Unreadable text or insufficient contrast on critical content.
- Critical controls are clipped or unreachable.
- Layout is broken or content is shifted under shell chrome.
- Primary action is hidden, disabled incorrectly, or visually indistinct.
- Modal/dialog is unusable, behind the shell, or impossible to dismiss.
- BrowserView bounds are visibly broken.

## Non-blocking polish
- Spacing mismatch that does not hide content.
- Icon mismatch when the action label remains clear.
- Imperfect color/radius match that still follows the UI v2 palette.
- Minor typography mismatch.
- Slight card density mismatch with all controls still usable.

## Decision rule
No further runtime UI fixpack should start until screenshots exist and the visual gap matrix identifies the actual gaps. Fixpacks must be scoped by screen bucket and must not become a new giant restyle.

## Component States Evidence
The Component States Board pass is tracked separately by `IN-UI-009-component-states-shared-dialogs`. Visual acceptance should include at least one exercised confirm dialog, one key-value editor state with add/edit/remove and empty-key warning, one modal/dialog stack, one toast, and representative empty/error/warning/success states where those surfaces are reachable.

This evidence does not replace screen screenshots. It only confirms that shared overlays and state fragments do not undermine otherwise accepted screens.
