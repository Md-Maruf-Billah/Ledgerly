---
name: Ledgerly
register: product
direction: Crafted Workspace
theme: warm-light
---

# Ledgerly Design System

## Creative North Star

Ledgerly should feel like opening a beautifully maintained compliance ledger: ordered, tactile, calm, and immediately useful. The interface serves Australian sole traders who often arrive with deadline anxiety, so hierarchy must restore control before decoration asks for attention.

The working product uses the **Atelier + Planner** direction:

- Atelier provides the compact navigation shell, clear task rows, typography, and crafted stationery character.
- Planner makes time spatial through the dashboard timeline and calendar canvas.
- Expressive motion is reserved for onboarding, contextual panels, progress, and completion.

## Foundations

### Color

The product uses warm oat paper (`#f4f1ea`), warm-white surfaces (`#fffdf9`), and warm charcoal ink (`#211e1a`). Clay (`#c75f34`) is the only brand accent and remains uncommon on working screens.

Status always uses three signals together:

| Status | Surface | Border | Ink |
| --- | --- | --- | --- |
| Overdue | `#f8e7e0` | `#e6b8a7` | `#8a3621` |
| Due soon | `#fbefd8` | `#ecd29a` | `#7a5410` |
| Upcoming | `#ede8df` | `#ddd5c7` | `#6c655a` |
| Completed | `#e8f0e6` | `#bcd4b6` | `#3c5734` |

Color is never the sole status signal. Every status-bearing control includes text and a dot, icon, placement, or tonal surface.

### Typography

- **Hanken Grotesk:** interface copy, headings, controls, and labels.
- **Geist Mono:** dates, counts, prices, completion ratios, and reference-like data.
- Headings rely on weight and tighter tracking, not decorative effects.
- Body copy stays concise and generally below 70 characters per line.

### Shape And Elevation

- Inputs: 9px radius.
- Buttons: 12px radius.
- Cards: 16px radius.
- Panels and primary focus surfaces: 22px radius.
- Shadows are warm, diffuse, and used only where elevation explains layering.
- Avoid card nesting. Rules, spacing, and typography should do most grouping work.

## Product Structure

Desktop uses a persistent navigation rail for Overview, Calendar, Reports, Alerts, Plan, and Settings. Tablet collapses the rail. Mobile uses a bottom navigation with a prominent Add action.

The dashboard hierarchy is:

1. Current month and calm context.
2. The next obligation requiring action.
3. Compact monthly status summary.
4. Spatial timeline.
5. Grouped obligation rows.

The calendar is a planner canvas with a contextual focus panel on desktop and a stacked focus area on smaller screens. Task details open as a right-side panel on desktop and a bottom sheet on mobile.

## Interaction And Motion

- Routine transitions: 140-220ms.
- Contextual panels: approximately 260ms.
- Animate transform and opacity for movement.
- Buttons and pressable rows use subtle scale feedback.
- Hover styles are wrapped in `(hover: hover) and (pointer: fine)`.
- Onboarding and completion may use richer motion because they are rare.
- `prefers-reduced-motion` reduces all motion to near-instant state changes.

## Accessibility

- WCAG AA contrast minimum.
- Visible keyboard focus is required.
- Interactive targets are at least 44px where practical.
- Dialogs trap focus, close with Escape, and restore focus.
- Status labels remain available to assistive technology.
- Mobile layouts must not rely on hover.

## Anti-Patterns

- No dark finance theme, navy-and-gold palette, neon, or alarmist red.
- No gradient text, glass cards, glow shadows, or colored side stripes.
- No giant vanity metric hero.
- No repetitive equal card grids when a list or timeline is clearer.
- No layout-property animation.
- No remote decorative imagery on authentication screens.
