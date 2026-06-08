---
name: Ledgerly
description: Compliance calendar for Australian sole traders — calm, structured, and always under control.
colors:
  primary: "#ff6200"
  primary-muted: "#ff9a5e"
  void: "#0d0d0d"
  surface: "#1a1a1a"
  surface-inset: "#111111"
  surface-raised: "#202020"
  border-default: "#2a2a2a"
  border-subtle: "#2e2e2e"
  border-accent: "#3a3a3a"
  text-primary: "#f5f5f5"
  text-secondary: "#c0c0c0"
  text-tertiary: "#b0b0b0"
  text-muted: "#888888"
  text-disabled: "#606060"
  status-complete-bg: "#142a1c"
  status-complete-border: "#2a6040"
  status-complete-label: "#4caf82"
  status-due-soon-bg: "#2c1f09"
  status-due-soon-border: "#7a5a18"
  status-due-soon-label: "#e0aa55"
  status-overdue-bg: "#2a0f0f"
  status-overdue-border: "#7a2020"
  status-overdue-label: "#e07070"
  badge-overdue-bg: "#5f1f1f"
  badge-overdue-text: "#ffcccc"
  badge-due-soon-bg: "#6d4d15"
  badge-due-soon-text: "#ffe0a0"
  badge-upcoming-bg: "#2a2a2a"
  badge-upcoming-text: "#c8c8c8"
  danger-bg: "#5b1e1e"
  danger-text: "#ffdede"
  error: "#ff6b6b"
typography:
  display:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
  caption:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  input: "10px"
  card: "12px"
  panel: "16px"
  pill: "999px"
spacing:
  xs: "0.4rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "1.5rem"
  section: "1.1rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.card}"
    padding: "0.75rem 1.1rem"
  button-primary-active:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.card}"
    padding: "0.75rem 1.1rem"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "0.75rem 1.1rem"
  button-danger:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger-text}"
    rounded: "{rounded.card}"
    padding: "0.75rem 1.1rem"
  task-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "0.9rem 1rem"
  stat-card-complete:
    backgroundColor: "{colors.status-complete-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "1rem"
  stat-card-overdue:
    backgroundColor: "{colors.status-overdue-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "1rem"
  input:
    backgroundColor: "{colors.surface-inset}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.input}"
    padding: "0.72rem 0.85rem"
---

# Design System: Ledgerly

## 1. Overview

**Creative North Star: "The Ledger of Calm"**

Ledgerly exists to dissolve a specific anxiety: the feeling that important deadlines are slipping through the cracks. The design system is built to embody the resolution, not the problem. Every surface should feel like a well-maintained ledger — ordered, readable, and entirely under control. The visual density is deliberately low. Breathing room is load-bearing.

The system is dark throughout. Not dark for mood or aesthetics, but because a sole trader checking their compliance status in a short morning window needs their eye to land on what matters instantly, without ambient glare or visual noise competing for attention. The orange accent appears rarely — on actions and brand moments only — so that when it appears, it reads as "this matters."

Status is the primary data type. Overdue, due soon, and upcoming are color-coded at the tonal level (surface, border, and label all shift together) rather than relying on color alone, so the system remains usable at a glance and accessible to color-blind users. This system explicitly rejects: the red-alert compliance aesthetic that amplifies anxiety; the navy-and-gold "finance" aesthetic that signals corporate formality; the SaaS hero-metric template with gradient stat blocks; and generic to-do app chrome that carries no compliance-specific meaning.

**Key Characteristics:**
- Dark, airy, low-density surfaces with deliberate breathing room
- Orange as a rare signal — not decoration
- Three-tier status system (overdue/due-soon/upcoming) baked into every status-bearing surface
- DM Sans at consistent weights — warm, geometric, readable on dark
- No shadows; depth through layered surface tones and border contrast

## 2. Colors

A restrained dark palette anchored by a single harvest orange. Color carries meaning before it carries aesthetic weight.

### Primary
- **Harvest Orange** (`#ff6200`): The sole accent. Used on primary CTAs, the brand mark, active states, and focused inputs. Never decorative. Its rarity is its power.
- **Muted Amber** (`#ff9a5e`): Softer secondary link color for the monthly summary shortcut. Warms without commanding.

### Neutral
- **Void** (`#0d0d0d`): App background. Not pure black — has a faint warm undertone.
- **Charcoal Surface** (`#1a1a1a`): Card and panel surfaces. Primary container.
- **Ink** (`#111111`): Inset surfaces — form fields, list panels. Darker than surface to create depth without shadows.
- **Iron** (`#2a2a2a`): Default borders and dividers.
- **Bone** (`#f5f5f5`): Primary text. Slightly off-white; easier on the eyes in dark mode.
- **Ash** (`#c0c0c0`): Secondary text — subtitles, descriptions.
- **Smoke** (`#888888`): Tertiary text — metadata, step counts, captions.
- **Coal** (`#606060`): Disabled or empty-state text.

### Status (used as full surface trios — bg + border + label)
- **Complete**: Background `#142a1c`, border `#2a6040`, label `#4caf82`
- **Due Soon**: Background `#2c1f09`, border `#7a5a18`, label `#e0aa55`
- **Overdue**: Background `#2a0f0f`, border `#7a2020`, label `#e07070`

**The Tonal Trio Rule.** Status is never communicated by color alone. Overdue, due soon, and upcoming each have a matching background tint, border, and label color that shift together. The status badge text label is always present alongside the color.

**The One Voice Rule.** Harvest Orange (`#ff6200`) appears on ≤10% of any given screen. It is reserved for the brand mark, primary buttons, active input borders, and the progress fill. Using it for decoration, hover glows, or decorative accents is prohibited.

## 3. Typography

**Body Font:** DM Sans (400, 500, 600, 700, 800), with `system-ui` fallback

DM Sans is slightly warmer and more geometric than Inter with more distinctive apertures at small sizes. On dark surfaces at 0.95rem, it reads with quiet authority — not corporate, not casual.

### Hierarchy
- **Display** (700, 2rem, line-height 1.15): App name on login screen, page-level headings. Maximum two instances per screen.
- **Headline** (700, 1.4rem, line-height 1.2): Current month header on dashboard. One per screen.
- **Title** (600, 1rem, line-height 1.3): Task names, card headings, section subheadings.
- **Body** (400, 0.95rem, line-height 1.5): Descriptions, task step text, profile fields. Max line length 65ch in reading contexts.
- **Label** (700, 0.78rem, letter-spacing 0.08em, uppercase): Section labels (OVERDUE / DUE SOON / UPCOMING), brand wordmark (LEDGE). Always uppercase, always tracking.
- **Caption** (400, 0.85rem, line-height 1.4): Due dates, step counts, secondary metadata. Uses Smoke (`#888`) color.

**The Weight Contrast Rule.** Hierarchy is achieved through weight contrast of at least two steps between adjacent levels — 400 body to 700 heading, never 400 to 500. A flat weight scale creates visual monotony.

## 4. Elevation

Ledgerly is **flat by default**. No `box-shadow` values exist in the system. Depth is communicated exclusively through surface tiers and border contrast.

The three-tier surface stack:
1. **Floor** (`#0d0d0d`): App background — no content lives at this level
2. **Ground** (`#1a1a1a`): Primary cards, panels, task cards — most content
3. **Pit** (`#111111`): Inset elements inside cards — form fields, list panels, summary scrollers

Borders (`#2a2a2a` default, `#3a3a3a` emphasized) define containment at each level. The task detail panel uses a darker scrim overlay (`rgba(0,0,0,0.68)`) without blur or glass effects.

**The No-Shadow Rule.** Box shadows are prohibited. If an element needs to feel contained or elevated, increase its surface color one tier (e.g. from `#0d0d0d` to `#1a1a1a`) and add a border. Shadows import an ambient-light metaphor that conflicts with the flat, controlled ledger aesthetic.

## 5. Components

### Buttons
Buttons use immediate press feedback — `transform: scale(0.97)` on `:active` — so they feel physically responsive. Transitions use a strong ease-out curve (`cubic-bezier(0.23, 1, 0.32, 1)`) at 160ms for snap without jank.

- **Shape:** Softly rounded (12px). Generous enough to feel approachable, not pill-shaped.
- **Primary:** Harvest Orange (`#ff6200`) background, white text (`#ffffff`), padding `0.75rem 1.1rem`. No border.
- **Secondary:** Dark raised surface (`#252525`) background, Bone text (`#f5f5f5`), 1px Iron border (`#3a3a3a`).
- **Danger:** Dark red (`#5b1e1e`) background, light red text (`#ffdede`). Full-width. Used only for Log Out.
- **Hover:** All buttons respond at `opacity: 0.88` under `@media (hover: hover) and (pointer: fine)` only — touch devices do not receive hover states.
- **Disabled:** Primary at `opacity: 0.45`, cursor `not-allowed`, no scale on `:active`.

### Status Badges
Compact pill labels that confirm the status shown by the card's section heading.

- **Shape:** Full pill (999px radius)
- **Overdue:** `#5f1f1f` background, `#ffcccc` text
- **Due Soon:** `#6d4d15` background, `#ffe0a0` text
- **Upcoming:** `#2a2a2a` background, `#c8c8c8` text
- **Typography:** 0.75rem, 700 weight
- **Usage:** Always paired with a color-coded section label. Never used alone as the sole status indicator.

### Task Cards
The primary interactive unit. Each represents one compliance obligation.

- **Corner Style:** 12px radius
- **Background:** Charcoal Surface (`#1a1a1a`)
- **Border:** Iron (`#2e2e2e`), shifts to `#444` on hover
- **Hover:** Background lightens to `#202020` under pointer media query
- **Active:** `transform: scale(0.985)` — subtle press confirmation
- **Internal Padding:** `0.9rem 1rem`
- **Layout:** Flexbox, space-between. Task meta (name, date, step count) left; status badge right.
- **Animation:** Staggers in on dashboard load with 45ms delay per card, 280ms ease-out, starting at `opacity: 0; translateY(10px)`.

### Stat Cards
Summary counts at the top of the dashboard. Three variants: complete (green-tinted), pending (amber-tinted), overdue (red-tinted).

- **Shape:** 12px radius
- **Background + Border:** Full status trio (see Colors — Status section)
- **Typography:** Large number in 700 weight, 1.5rem; small label below in 0.82rem, 85% opacity
- **Usage:** Grid of three on dashboard. Never use the hero-metric template (big number + gradient accent + supporting stats). These are status summaries, not vanity metrics.

### Inputs and Selects
- **Style:** Ink background (`#111`), 1px border Iron (`#333`), 10px radius
- **Focus:** Border shifts to Harvest Orange (`#ff6200`); no glow, no shadow
- **Typography:** 0.95rem body weight
- **Placeholder style:** Ash (`#c0c0c0`) color
- **Error state:** Red inline text (`#ff6b6b`) below the field; border does not change color on error (avoids double-anxiety signal)

### Task Detail Panel (Bottom Sheet)
A layered overlay panel that slides up from the bottom of the viewport.

- **Shape:** 16px radius on the panel (more generous than card-level)
- **Background:** Charcoal Surface (`#1a1a1a`)
- **Border:** `#343434`, 1px
- **Overlay scrim:** `rgba(0,0,0,0.68)` — no blur
- **Animation:** `slideUp` — 300ms ease-out, `translateY(24px)` to `translateY(0)`, plus `opacity: 0` to `1`. Click outside to dismiss.
- **Max height:** 90vh with internal scroll.
- **Primary action (Mark as Done):** Full-width primary button pinned to bottom of panel content.

### Business Type Selector Cards
Selection affordance for the onboarding step. Six cards in a 2-column grid.

- **Style:** `#131313` background, 1.5px `#2e2e2e` border, 12px radius
- **Selected state:** Border shifts to Harvest Orange (`#ff6200`); background tints to `#1a0d00`
- **Hover (pointer devices only):** Border lightens to `#555`
- **Internal layout:** Emoji icon (1.5rem), bold label (0.95rem), muted description (0.83rem, `#a0a0a0`)

## 6. Do's and Don'ts

### Do:
- **Do** use the three-tier surface stack (void -> surface -> inset) to create depth without shadows.
- **Do** pair every status color with its matching border and label color — all three tiers of the status trio together.
- **Do** keep Harvest Orange (`#ff6200`) on ≤10% of any given screen, exclusively for actionable or brand moments.
- **Do** use DM Sans at 700 weight for all section labels, with `letter-spacing: 0.08em` and uppercase transform.
- **Do** guard all `:hover` states with `@media (hover: hover) and (pointer: fine)` — touch devices must never receive sticky hover states.
- **Do** include a text label alongside every status color — never rely on color alone for status communication.
- **Do** use `transform: scaleX()` with `transform-origin: left` instead of `transition: width` for progress bars.
- **Do** apply `transform: scale(0.97)` on `:active` for all clickable elements to give press feedback.
- **Do** stagger lists of cards with 40-50ms delay between items; simultaneous appearance feels mechanical.

### Don't:
- **Don't** use box-shadows. Depth comes from surface tiers and borders only.
- **Don't** animate layout properties (`width`, `height`, `padding`, `margin`). Use `transform` and `opacity` only.
- **Don't** use Inter, Roboto, or any font used on millions of sites without distinction. DM Sans is the system font.
- **Don't** use border-left or border-right greater than 1px as a colored stripe accent. Rewrite with background tints or full borders.
- **Don't** apply `background-clip: text` with a gradient. Use a single solid color; emphasis through weight or size only.
- **Don't** use glassmorphism (backdrop-filter blur + semi-transparent backgrounds) on cards or panels. The aesthetic is flat and tonal.
- **Don't** lead with overdue warnings as the dominant tone. Ledgerly reduces anxiety, it does not amplify it.
- **Don't** use navy-and-gold, teal-and-white, or any finance-category color reflex. The palette is deliberately outside those lanes.
- **Don't** build a hero-metric template (big number + gradient accent + supporting stats row). The stat cards are functional status tiles, not vanity dashboards.
- **Don't** use ease-in on any UI transition. It starts slow — the opposite of responsive. Use ease-out or the custom strong curve (`cubic-bezier(0.23, 1, 0.32, 1)`).
- **Don't** animate screen transitions on keyboard-initiated actions. The fade-in animation is for mouse/touch navigation only.
- **Don't** build identical card grids (same size, same icon + heading + text, endlessly repeated). If showing a list of similar items, vary density or grouping before defaulting to a uniform grid.
