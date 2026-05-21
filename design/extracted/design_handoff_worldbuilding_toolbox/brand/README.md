# Worldbuilding Toolbox — Design System

> A quiet place to chart your worlds. A workspace for fiction writers and novelists to build, organize, and explore imagined worlds — timelines, eras, characters, factions, ideas — at their own pace.

This is a **design system**, not a product. It contains brand foundations, design tokens, components, and high-fidelity UI kits that any designer or AI agent can use to mock up the Worldbuilding Toolbox accurately.

---

## What this system covers

**Primary audience for the product:** hobbyist fiction writers / novelists building long-form fictional worlds.

**Three vibe words for the brand:** *simplistic, functional, blank slate.*

The product ships with **one visual theme: Constellation.**

Deep space, thin HUD lines, mono accents, faint scan lines. Medium sci-fi intensity — restrained, not neon. Sharp corners. Cyan as the single HUD accent. The mood is *chart at 2&nbsp;am*: focused, technical, calm. The interface gets out of the way of long writing sessions while quietly signaling that this is a tool for thinking about big things — galactic timelines, alien societies, deep time.

---

## Sources & context

This design system was built greenfield. There is **no existing codebase, Figma, or production app yet** — the brand was developed from the user's brief and answers to a clarifying questionnaire. Recorded constraints:

- Audience: hobbyist fiction writers / novelists
- Theme: Constellation only (sci-fi HUD, medium intensity)
- Logo handling: typographic logotype (no mark)
- Iconography: Tabler Icons
- Imagery motif: star maps / constellations
- Novelty: mostly conventional with a few signature moments
- Surfaces mocked: marketing site, timeline editor, article/idea editor, dashboard, help/wiki, login

If a real codebase or Figma file becomes available later, this system should be reconciled against it — token names will likely survive, raw values may shift.

---

## Index

| Path | What's in it |
|---|---|
| `README.md` | You are here. Brand, content + visual foundations, iconography, manifest. |
| `colors_and_type.css` | All design tokens. Semantic + raw scales + type roles. |
| `SKILL.md` | Cross-compatible skill manifest for Claude Code. |
| `fonts/` | Webfont notes. (Currently CDN — see *Type* section.) |
| `assets/` | Logos, icon set, constellation backgrounds, empty-state illustrations. |
| `preview/` | Small HTML cards that populate the Design System review tab. |
| `ui_kits/marketing/` | Marketing landing page mock. |
| `ui_kits/app/` | Full app prototype — dashboard, timeline, article editor, idea inbox, help. |
| `ui_kits/auth/` | Login + signup. |

---

## Content Fundamentals

The product is for writers. Copy must read like a quiet collaborator, never a cheerleader.

**Tone.** Calm, plainspoken, faintly literary, with a thin layer of "logbook" formality on chrome elements. The Toolbox is a place to think, not to be hyped at. No exclamation points in product UI (one is allowed per landing page, max). No "Awesome!" "Let's go!" "🎉". The voice respects that the user is building something serious to *them*.

**Person.** Second person ("your world", "your timeline", "you've drafted 3 ideas") for direct addresses. First-person plural ("we") only in marketing copy or system-of-record voice — never in UI buttons.

**Casing.**
- Sentence case for body copy, button labels in marketing, and any string longer than ~3 words: *"New entry"*, *"Drop a file, or browse."*
- **HUD labels** in chrome — section headers in the sidebar, status badges, breadcrumb caps, axis ticks, table headers — are `UPPERCASE` with `0.14em` tracking in JetBrains Mono. Reserved for short labels (≤14 chars): `SECTOR 04`, `SYSTEM LOG`, `ENTRIES · 47`. Never long sentences.

**Density.** Default to fewer words. A button says `New entry`, not `Create a new entry`. Empty states get two sentences max, then one quiet action. Tooltips are ≤8 words. Help articles can be long-form prose — the editor allows it.

**Numerals.** Numerals always for counts (`3 eras`, not `three eras`). Tabular figures in JetBrains Mono make numbers line up in columns automatically. Dates respect user preference (BCE/AD, custom calendar labels, standard-year, etc.). The product never assumes a Gregorian-only world.

**Emoji.** None in product UI. None in marketing. Iconography handles all glyph needs (see *Iconography*).

**HUD vocabulary.** A few terms recur in chrome to lock the sci-fi feel without crossing into camp:
- `SECTOR`, `ARCHIVE`, `ENTRY`, `WAYPOINT`, `LOG`, `SURVEY`, `SY` (standard year)
- Use sparingly. The world's *content* is the user's writing; the chrome's vocabulary should not compete with it.

**Examples.**

| ❌ Don't | ✅ Do |
|---|---|
| "Awesome! Your world is created 🎉" | "World ready." |
| "Click here to add your first idea!" | "Capture an idea." |
| "We couldn't find anything matching your search." | "No entries match *"{query}"*." |
| "Drag-and-drop your files here or browse your computer to upload" | "Drop a file, or browse." |
| "Sign in to Worldbuilding Toolbox now!" | "Sign in." |
| Tooltip: "This will permanently delete the era and all its events" | Tooltip: "Delete era and its events." |

**Naming conventions inside the product.**
The product respects that worldbuilders rename things. Eras are not "Periods" by default — they're "Eras". But the user can rename `Era` → `Age`, `Cycle`, `Saga`, `Reign`, etc., and the label cascades. UI strings that reference these concepts should use the user's term, not the system default.

---

## Visual Foundations

### Color

A near-black base built on deep-space blue (`#0b0e14`) with bone-white text (`#e6e7eb`). The single HUD accent is cyan (`#7fdbff`). Borders are very subtle (`#1f2532`) — they exist as architectural lines, not strong divisions.

Accent use is restricted to: primary action button, focus ring, link, current-state indicators, HUD labels. Never as decorative background washes. Never as gradient fills.

Semantic colors: green for success (`#6ad6a3`), amber for warning (`#f0b860`), red for danger (`#e86464`). All sit in the same desaturated, slightly-luminous register as the cyan accent — so they read as "system" colors, not "candy" colors.

### Type

| Role | Family | Where it's used |
|---|---|---|
| Display + body | Space Grotesk | Headings, marketing copy, article body, button text |
| UI + HUD chrome | JetBrains Mono | Labels, badges, breadcrumbs, axis ticks, table headers |
| Long-form reading body (reserved) | Source Serif 4 | Optional serif for very long-form articles inside the editor — opt-in only |

All three are Google Fonts, loaded via CDN in `colors_and_type.css`. **No substitutions flagged.**

Reading body uses Space Grotesk at `1.0625rem / 1.65` line-height — comfortable for screen. Tight type scale: 12 / 14 / 16 / 17 / 20 / 24 / 30 / 36 / 48 / 64 / 88. JetBrains Mono should always use tabular figures for any numeric column (`font-variant-numeric: tabular-nums`).

### Spacing

4px base scale: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96`. Default vertical rhythm between blocks is **24px**; section spacing is **48–64px**; hero spacing **96px**.

### Backgrounds

- **Flat deep-space.** No mesh gradients. No bluish-purple AI-slop gradients.
- **One signature treatment:** a 1.5%-opacity horizontal scan-line pattern (`var(--grain)`) overlaid on hero areas and large surfaces. Subtle — must not interfere with reading.
- A constellation backdrop (sparse white dots / linework, with cyan highlights on key stars) is used for landing-page heroes, world covers, and empty states. **Never** behind editable content.
- No full-bleed photography. No human faces. No 3D renders.

### Animation

Conservative. The product is for thinking, not entertaining.

- Hover transitions: `120ms ease-out` — `cubic-bezier(0.2, 0, 0, 1)`.
- Open/close (menus, drawers, inspector): `220ms` with the same easing.
- **No bounces.** No springs. No celebratory animations.
- **Signature moment 1:** when adding a new event to the timeline, the inserted dot pulses cyan once (320ms, decays to baseline).
- **Signature moment 2:** primary buttons have a faint cyan glow on focus and a brief 1px scan-line sweep across themselves on click.
- **Signature moment 3:** the hero's tagline underline draws in left-to-right on page load (`1.4s ease-out`).

### Hover & press states

- **Hover:** background lightens by one step (`--space-900` → `--space-800`). Border may shift to `--space-600`. Foreground unchanged.
- **Press:** brief opacity drop to `0.85` (no scale transform). On primary buttons, background shifts to `--accent-hover`.
- **Focus:** uses `--focus-ring` — 2px solid cyan with a 2px space-color gap inside. Mimics a HUD reticle.

### Borders & rules

- 1px solid `--space-700` (`#1f2532`) is the default border everywhere.
- Borders are the primary architectural device — every card, every panel, every input is outlined. They define structure where shadow would in a softer system.
- Section dividers use the same color, full-bleed.
- For elevation contrast, step up to `--space-600` (`#2a3447`) or use `--shadow-glow`.

### Shadows

- Almost no soft drop shadows. Elevation is shown via border weight + faint cyan glow (`--shadow-glow`) on focused / active elements only.
- Modals get a heavy `--bg-overlay` backdrop (`rgba(6, 8, 16, 0.75)`) instead of shadow.
- The few cases that use a faint drop shadow (`--shadow-md`) layer it under a 1px border — never alone.

### Radii (corners)

`0 / 2 / 4 / 6` plus pill (999). Buttons 2, cards 4, modals 6. Sharp by default — anything rounder feels off-brand.

### Transparency & blur

Used **rarely**. Reserved for:
- Modal overlays (`--bg-overlay`).
- Header bar when scrolled past hero — `backdrop-filter: blur(10px)` + 85% bg.
- Media-tile hover scrim — `backdrop-filter: blur(2px)` + faint cyan tint.

Never as decorative glassmorphism.

### Layout rules

- Reading column: `--measure` = 68ch. Editors, help articles, ideas always cap to this width.
- App shells use a fixed left sidebar (244px) + fluid main + optional right inspector (340px collapsible).
- Marketing pages center on `--container` (1080px) for body sections, `--container-wide` (1320px) for heroes.
- Sticky elements: app top bar (56px), section heads in long articles. Always solid background, never transparent over content unless backdrop-blur is engaged.

### Imagery

- **Star maps & constellations** are the brand's one visual motif. Used as sparse linework backgrounds for hero areas, world covers, and empty states.
- Drawn — not photographed — as simple SVG: dots (1–2px) + connecting lines (0.5–0.8px stroke at 18–35% opacity). White dots by default; a few key "anchor" stars are tinted cyan.
- World covers use the same pattern over a tinted background (each world picks a hue).
- Document thumbnails (uploaded Word, PowerPoint, Krita files) render as **filetype tiles**, not previews — colored corner + filename + extension badge.

### Cards

- Background `--bg-elevated` (`#11151d`).
- Border 1px `--border` (`#1f2532`).
- Radius `--radius-md` (2px) or `--radius-lg` (4px).
- No shadow by default. Selected/focused state gets `--shadow-glow`.
- Padding 16–24px.
- Often has a thin HUD label (`ID-003`, `SECTOR 04`) top-right or top-left in mono uppercase.

### Protection treatments

Text over imagery (rare, mostly hero) gets a 30%-opacity vertical gradient from the bg color at the bottom — *not* a frosted capsule behind the text. Capsules break the "blank slate" feel.

---

## Iconography

**System: [Tabler Icons](https://tabler.io/icons)** — 2px stroke, geometric, technical. Pulled from the curated set in `assets/icons/Icon.jsx` as inline SVGs.

**Why Tabler.** It matches the "simplistic, functional" vibe word and the Constellation HUD aesthetic — 2px geometric strokes that read like draftsman's line work. Renders well on the deep-space background because strokes inherit `currentColor`.

**Usage rules.**
- Icons are 16px in body UI, 20px in section headers, 24px in toolbars, 32px in empty states.
- Stroke weight stays at 2px (Tabler default) regardless of size.
- Icons always inherit `currentColor` — never colored independently of their context. The only exception is the cyan accent color, applied via parent `color`.
- Always paired with a label or an `aria-label`. No icon-only buttons without a tooltip.
- Emoji is **never** used in product UI or marketing.
- Unicode characters are used for typographic glyphs only: `—` (em-dash), `·` (bullet separator), `→` (next link), `‹ ›` (HUD chevrons). Never as picture-icons (no ⭐, no 🌍).

**Loading icons.** In the UI kits, icons load via `Icon.jsx` — a React component with a curated set of inlined Tabler SVG paths. See `assets/icons/README.md`. If shipping production, install the `@tabler/icons-react` npm package.

---

## Quick start for designers / agents

1. **Import the CSS:** `<link rel="stylesheet" href="colors_and_type.css">`.
2. **Use semantic tokens** in your component CSS — `var(--bg)`, `var(--fg)`, `var(--accent)`, `var(--border)`, `var(--shadow-md)`, `var(--font-display)`, etc.
3. **Use the type classes** (`.h1`, `.h2`, `.body`, `.ui-label`, `.mono`) or matching element tags.
4. **Reference the UI kits** in `ui_kits/` for canonical component composition.
5. **Stay restrained.** When in doubt, do less. Simplistic, functional, blank slate.
