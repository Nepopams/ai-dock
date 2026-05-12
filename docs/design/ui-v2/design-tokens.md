# AI Dock UI v2 Design Tokens

This is the initial handoff inventory for UI v2 tokens visible in the Pencil references and user-provided design input. Runtime workpacks must verify these against PNG exports before modifying `src/**`.

## Runtime mapping rule
The first runtime workpack must map these tokens to the existing `src/renderer/react/styles/global.css` variable/class structure before applying view-level restyles. No UI library or dependency may be added for UI v2.

## Color tokens
| Token | Value | Usage |
| --- | --- | --- |
| `bg.app` | `#070A0F` | Full app background and deepest canvas. |
| `bg.shell` | `#0B0F14` | Sidebar, tab strip, dock chrome. |
| `bg.surface` | `#101722` | Panels, cards, local view surfaces. |
| `bg.surface.raised` | `#141C2A` | Raised controls, modal surfaces, focused cards. |
| `bg.surface.subtle` | `#0D131D` | Table rows, recessed wells, code/pre blocks. |
| `border.subtle` | `rgba(255, 255, 255, 0.08)` | Default borders and dividers. |
| `border.strong` | `rgba(255, 255, 255, 0.14)` | Active panel and table borders. |
| `text.primary` | `#F6F9FF` | Primary headings and dense data. |
| `text.secondary` | `#C8D0E0` | Body text and labels. |
| `text.muted` | `#8D96A9` | Metadata, hints, timestamps. |
| `accent.primary` | `#4F8CFF` | Primary actions, selected tabs, focus rings. |
| `accent.primary.hover` | `#6AA0FF` | Primary hover state. |
| `accent.primary.subtle` | `rgba(79, 140, 255, 0.14)` | Selection fills and active chips. |
| `accent.secondary` | `#7C3AED` | Optional secondary accent for special states, used sparingly. |

## Status tokens
| Token | Value | Usage |
| --- | --- | --- |
| `status.ready` | `#34D399` | Ready, successful, connected, saved. |
| `status.info` | `#60A5FA` | Informational, loading, active progress. |
| `status.warning` | `#FBBF24` | Retry, partial, caution. |
| `status.error` | `#FB7185` | Error, failed validation, destructive warnings. |
| `status.idle` | `#64748B` | Idle and unavailable state. |
| `status.ready.bg` | `rgba(52, 211, 153, 0.14)` | Ready chip background. |
| `status.error.bg` | `rgba(251, 113, 133, 0.14)` | Error chip/background. |

## Typography tokens
| Token | Value | Usage |
| --- | --- | --- |
| `font.family.ui` | `"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` | Current UI font stack. |
| `font.size.xs` | `11px` | Dense metadata, tiny chips. |
| `font.size.sm` | `12px` | Labels, table metadata. |
| `font.size.base` | `13px` | Dense control text. |
| `font.size.body` | `14px` | Body text and form input text. |
| `font.size.section` | `18px` | View section headings. |
| `font.size.page` | `24px` | Page headings. |
| `font.weight.regular` | `400` | Body text. |
| `font.weight.medium` | `600` | Labels, cards, controls. |
| `font.weight.bold` | `700` | Page headings and important metrics. |
| `line.height.compact` | `1.25` | Chips and dense rows. |
| `line.height.body` | `1.5` | Paragraphs and multiline content. |

## Spacing tokens
| Token | Value | Usage |
| --- | --- | --- |
| `space.1` | `4px` | Tight internal gaps. |
| `space.2` | `8px` | Compact grid base. |
| `space.3` | `12px` | Control padding and small panel gaps. |
| `space.4` | `16px` | Default panel gap. |
| `space.5` | `20px` | Large panel gap. |
| `space.6` | `24px` | Page padding. |
| `space.8` | `32px` | Wide desktop page gutter. |

## Layout tokens
| Token | Value | Usage |
| --- | --- | --- |
| `layout.grid.base` | `8px` | Compact layout grid. |
| `layout.dock.rail.width` | `72px` | Left dock rail/sidebar width. |
| `layout.tabstrip.height` | `44px` | Top tab strip height. |
| `layout.page.padding` | `24px` | Default local view padding. |
| `layout.panel.gap` | `16px` | Standard view panel gap. |
| `layout.panel.gap.large` | `20px` | Larger dashboard/workspace gap. |
| `layout.content.maxWidth` | `none` | Desktop shell views use full available workspace unless a specific panel demands a constraint. |

## Radius, border, and shadow tokens
| Token | Value | Usage |
| --- | --- | --- |
| `radius.control` | `8px` | Inputs, tabs, compact buttons. |
| `radius.card` | `16px` | Cards and repeated items. |
| `radius.panel` | `16px` | Panels and major sections. |
| `radius.pill` | `999px` | Chips and legacy pill controls only where the design requires pills. |
| `border.width.default` | `1px` | Default control and panel borders. |
| `shadow.panel` | `0 16px 40px rgba(0, 0, 0, 0.35)` | Raised panels. |
| `shadow.modal` | `0 24px 70px rgba(0, 0, 0, 0.5)` | Modal dialogs. |
| `focus.ring` | `0 0 0 3px rgba(79, 140, 255, 0.24)` | Keyboard focus ring. |

## Component state tokens
### Buttons
| State | Tokens |
| --- | --- |
| Default | `bg.surface.raised`, `border.subtle`, `text.secondary` |
| Hover | `accent.primary.subtle`, `border.strong`, `text.primary` |
| Active/primary | `accent.primary`, `text.primary` |
| Disabled | `opacity: 0.55`, no transform |
| Danger | `status.error`, `status.error.bg` |

### Inputs
| State | Tokens |
| --- | --- |
| Default | `bg.surface.subtle`, `border.subtle`, `text.primary` |
| Focus | `border: accent.primary`, `focus.ring` |
| Error | `border: status.error`, `status.error.bg` |
| Disabled | `opacity: 0.55`, muted text |

### Cards and panels
| State | Tokens |
| --- | --- |
| Default | `bg.surface`, `border.subtle`, `radius.card` |
| Hover | `border.strong`, optional `shadow.panel` |
| Selected | `accent.primary.subtle`, `accent.primary` border |
| Empty | dashed `border.subtle`, muted text |

### Tables
| State | Tokens |
| --- | --- |
| Header | `text.muted`, uppercase metadata, `font.size.xs` |
| Row | `bg.surface`, `border.subtle` |
| Row hover | `bg.surface.raised`, `border.strong` |
| Numeric metric | `font.weight.bold`, `text.primary` |

### Chips
| State | Tokens |
| --- | --- |
| Neutral | `bg.surface.raised`, `text.secondary` |
| Selected | `accent.primary.subtle`, `accent.primary` |
| Ready | `status.ready.bg`, `status.ready` |
| Error | `status.error.bg`, `status.error` |
| Warning | `rgba(251, 191, 36, 0.14)`, `status.warning` |

## Known current-code mapping notes
- `global.css` already has shell dimensions matching `layout.dock.rail.width` and `layout.tabstrip.height`.
- Current colors are close but not tokenized consistently.
- Some form screens use Tailwind-like class strings in React components. UI v2 should not introduce a new dependency; it should either map existing utility output safely or migrate styling in scoped view workpacks.
- Card radii in existing CSS vary from `8px` to `22px`. UI v2 should normalize repeated cards/panels to `radius.card` or `radius.panel` by workpack, not globally in one APPLY.
