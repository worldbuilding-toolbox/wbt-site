# Handoff: Worldbuilding Toolbox

> A workspace for fiction writers and novelists to build, organize, and explore imagined worlds — timelines, eras, characters, factions, ideas — at their own pace. Single-theme **Constellation**: deep-space dark UI, cyan HUD accent, restrained sci-fi.

---

## About the design files

The files in this bundle are **design references created in HTML/React (Babel-compiled in-browser)**. They are prototypes showing the intended look, structure, and behavior — **not production code to copy directly**.

Your task is to **recreate these designs in the target codebase's existing environment** (React + Tailwind, Next.js + CSS Modules, SwiftUI, native iOS/Android, whatever the team uses) using its established patterns and libraries. If no environment exists yet, pick the most appropriate stack for the project (the prototypes are React, so React/Next.js is the lowest-friction choice).

The HTML prototypes were built quickly and **cut corners** that you must NOT carry into production:

- All state is in-memory (no persistence, no API calls).
- React is loaded via `<script>` tags + in-browser Babel — fine for review, never ship.
- Components are inline-styled for portability. **Ship with the team's styling system** (Tailwind, CSS Modules, styled-components, etc.) — read the inline styles to lift colors / spacing / typography, but reconstruct the styling layer idiomatically.
- The Tabler icon set is hand-inlined in `assets/icons/Icon.jsx` (a curated subset of ~30 icons). For production, install `@tabler/icons-react` instead.
- "Article", "Idea", "Era", "Event" are sample shapes — they suggest the data model but are not a schema. Reconcile with the backend's actual data shapes.

---

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, radii, shadows, icon set, illustration style, and interaction patterns are all decided. Recreate the UI pixel-perfectly. Use the team's existing component library where one exists; build new primitives only where the kit's components have no analogue.

The handoff includes 18 preview cards under `reference/preview/` and three UI kits under `reference/ui_kits/` (marketing, app, auth) — open the kits' `index.html` in a browser to see the design in motion, including the constellation backdrop animations.

---

## Stack recommendations

- **Framework:** React + Next.js (the prototypes are React).
- **Styling:** Pick one — CSS variables + CSS Modules, or Tailwind with the design tokens mapped to its config. The token file at `colors_and_type.css` is the source of truth; mirror its names.
- **Icons:** `@tabler/icons-react` (2px stroke, geometric — exactly what the prototypes use).
- **Fonts:** Google Fonts via `next/font` or self-hosted WOFF2. Three families: **Space Grotesk** (display + body), **JetBrains Mono** (HUD chrome / labels / metadata), **Source Serif 4** (reserved for opt-in long-form reading body only).
- **Animation:** Plain CSS / Framer Motion. No bouncy springs — the brand uses `cubic-bezier(0.2, 0, 0, 1)` easing throughout.
- **Forms:** Whatever the team uses. Inputs cap at one focused state — cyan border + cyan inner shadow + faint cyan glow.

---

## Design tokens

Source of truth: `colors_and_type.css`. **Mirror these names** in the production token system (Tailwind config, CSS variables, theme object, etc.) — components in the kit reference semantic tokens (`var(--bg)`, `var(--accent)`, etc.) not raw values.

### Color — raw palette

| Token | Hex | Role |
|---|---|---|
| `--space-950` | `#060810` | Deepest base |
| `--space-900` | `#0b0e14` | Primary background |
| `--space-850` | `#11151d` | Elevated surface |
| `--space-800` | `#161b25` | Hover surface |
| `--space-700` | `#1f2532` | Default border |
| `--space-600` | `#2a3447` | Strong border / divider |
| `--space-500` | `#3d485e` | Muted border |
| `--steel-400` | `#5a6275` | Muted text |
| `--steel-300` | `#8a91a3` | Secondary text |
| `--bone-200`  | `#c6c9d2` | Near-foreground |
| `--bone-100`  | `#e6e7eb` | Primary foreground |
| `--bone-50`   | `#f5f5f8` | High-emphasis |
| `--cyan`      | `#7fdbff` | Primary HUD accent |
| `--cyan-dim`  | `#4aa9c9` | Accent hover |
| `--green-hud` | `#6ad6a3` | Success |
| `--amber-hud` | `#f0b860` | Warning |
| `--red-hud`   | `#e86464` | Danger |

### Color — semantic

```
--bg:           var(--space-900)
--bg-elevated:  var(--space-850)
--bg-sunken:    var(--space-950)
--bg-hover:     var(--space-800)
--bg-overlay:   rgba(6, 8, 16, 0.75)

--fg:           var(--bone-100)
--fg-secondary: var(--steel-300)
--fg-muted:     var(--steel-400)
--fg-on-accent: var(--space-950)

--border:        var(--space-700)
--border-strong: var(--space-600)

--accent:       var(--cyan)
--accent-hover: var(--cyan-dim)
--accent-soft:  rgba(127, 219, 255, 0.18)
--link:         var(--cyan)
--success:      var(--green-hud)
--warning:      var(--amber-hud)
--danger:       var(--red-hud)
```

### Type

| Family | Role | Source |
|---|---|---|
| **Space Grotesk** (300–700) | Display, headings, body | Google Fonts |
| **JetBrains Mono** (300–700) | HUD chrome — labels, badges, breadcrumbs, axis ticks | Google Fonts |
| **Source Serif 4** (300–700, opsz 8..60) | Reserved: opt-in long-form reading body, blockquotes | Google Fonts |

**Type scale** (rem at 16px root): `12 · 14 · 16 · 17 · 20 · 24 · 30 · 36 · 48 · 64 · 88`.

**Line heights:** `tight 1.1 · snug 1.25 · normal 1.5 · relaxed 1.65`.

**Letter spacing:** `tight -0.03em · normal 0 · wide 0.04em · wider 0.14em` (the last is reserved for uppercase HUD labels).

### Spacing

4px base scale: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96`. Default vertical rhythm 24px; sections 48–64px; hero 96px.

### Radii

Sharp by default: `0 · 2 · 4 · 6` + pill (999). Buttons 2, cards 4, modals 6.

### Shadows

Borders, not soft drop shadows.

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 0 0 1px var(--space-700)` | Subtle outline |
| `--shadow-md` | `0 0 0 1px var(--space-600), 0 4px 24px rgba(0, 0, 0, 0.4)` | Cards |
| `--shadow-lg` | `0 0 0 1px var(--space-600), 0 12px 48px rgba(0, 0, 0, 0.6)` | Modals |
| `--shadow-glow` | `0 0 24px rgba(127, 219, 255, 0.18)` | Focused / active elements |

### Motion

- Hover: **120ms** `cubic-bezier(0.2, 0, 0, 1)`
- Open/close (menus, drawers, inspector): **220ms** with same easing
- Page-level: **420ms** (rare — only theme/route transitions)
- **No bounces. No springs.**

### Focus

```
--focus-ring: 0 0 0 2px var(--space-900), 0 0 0 4px var(--cyan);
```

Mimics a HUD reticle — 2px space-color gap inside the cyan ring.

### Grain / scan lines

```
--grain: repeating-linear-gradient(0deg, transparent 0px, transparent 2px,
         rgba(127, 219, 255, 0.015) 2px, rgba(127, 219, 255, 0.015) 3px);
```

Apply via `background-image` on hero areas, app body, and other large surfaces. Subtle (1.5% opacity) — never on top of editable text.

---

## Iconography

System: **[Tabler Icons](https://tabler.io/icons)**. 2px stroke, geometric, line style.

- Body UI: 16px · Section headers: 20px · Toolbars: 24px · Empty states: 32px
- Stroke weight stays at 2px regardless of icon size
- Inherits `currentColor` always — never colored independently of context
- Always paired with a visible label or `aria-label`
- **No emoji.** Unicode for typographic glyphs only (`— · → ‹ ›`).

In production: **install `@tabler/icons-react`** instead of maintaining the curated set. The visual result is identical. Audit `reference/ui_kits/**/*.jsx` for the names used — the working set is roughly:

`timeline · map · compass · planet · globe · star · moon-stars · rocket · target · chart-arcs · radioactive · galaxy · signal · database · alien · book · book-2 · scroll · faction (custom — shield with chevron) · plus · x · check · search · menu-2 · dots-vertical · chevron-{left,right,down} · arrow-right · arrow-up-right · file · file-text · file-description · paperclip · link · external-link · folder · pencil · trash · eye · eye-off · copy · bookmark · user · user-circle · settings · logout · bell · alert-circle · info-circle · circle-check · hash · calendar · layout-grid · drag-vertical · photo · upload · device-floppy`

**One custom icon** — `faction` — is a shield + chevron. The path is in `assets/icons/Icon.jsx` (search for `faction:`). Replicate it as an SVG asset in the production project.

---

## Screens / views

The product has three surfaces. Open the matching `reference/ui_kits/<surface>/index.html` to see them rendered.

### 1. Marketing landing — `reference/ui_kits/marketing/`

**Purpose:** convert visitors into accounts. Tone is restrained, literary, sci-fi-curious.

**Layout** (top → bottom):

1. **Nav** — sticky 56px header. Logotype left. Center: 3 anchor links (Features / Tour / Help). Right: Sign in (ghost) + "Start a world" (primary). Background fades from transparent to `rgba(11, 14, 20, 0.85)` + `backdrop-filter: blur(10px) saturate(140%)` after 16px scroll.
2. **Hero** — 1080px center column. Constellation backdrop (sparse animated stars + lines) at `opacity: 0.7`. Bottom protection gradient. Stack: kicker pill `★ FOR FICTION WRITERS` → 88px serif-style h1 *"A quiet place to build worlds."* (the phrase "build worlds" has an SVG underline that draws in over 1.4s on load) → 20px lede → CTA row (primary "Start your first world" + secondary "See a sample world") → fine print `Free for the first three worlds. No credit card.`
3. **Features** — 1320px wide. Title block (kicker + 48px h2 *"Tools for thinking, not posting."*) → 3-column × 2-row grid of features. Cells separated by 1px `--border` lines (no padding around the grid — flush). Each feature: icon (in `--accent`) + h3 + body.
4. **Product tour** — 1080px. Three alternating-direction rows (sketch + copy). Each sketch is a simplified preview of a real surface: timeline-with-eras, article editor, idea inbox. Builds out of real `var(--bg-elevated)` cards.
5. **Footer** — 1320px. 2fr 1fr 1fr 1fr grid: logotype + tagline, then three link columns (Product / Account / Quiet). Bottom: copyright + version, separated by border.

**Source files:** `Nav.jsx`, `Hero.jsx` (incl. `ConstellationBackdrop`), `Features.jsx`, `ProductTour.jsx` (incl. `TourRow`, `TimelineSketch`, `EditorSketch`, `InboxSketch`), `Footer.jsx`, `Primitives.jsx` (Button, Section, Kicker).

**Interactions:**
- Nav background blur engages past 16px scroll.
- Hero underline draws once on mount (`stroke-dasharray: 300; stroke-dashoffset: 300 → 0` over 1.4s).
- Constellation backdrop: each constellation (line group + endpoint dots, kept in one `<g>`) drifts on a 36–54s loop; individual stars twinkle on 4–7s offset loops; cyan anchor stars pulse with a `drop-shadow` glow.

---

### 2. App — `reference/ui_kits/app/`

**Purpose:** the working surface. Sidebar + top bar shell. Four views per world: Timeline, Articles, Ideas, Help.

**Shell layout:**
- **Sidebar** (244px, sticky, full height). Logo top, then "YOUR WORLDS" list (dot + name), then "NEW WORLD". When inside a world, a second block appears: the world's name as a label, then 4 view items (Timeline / Articles / Ideas / Help) with a left cyan accent bar on the active item. Bottom: Settings / What's quiet.
- **Top bar** (56px, sticky). Crumbs (`WORLDS › Erathine › TIMELINE`) all uppercase mono with chevron separators. Right cluster: 260px search input + bell + avatar.

**View 1 — Worlds Dashboard:**
Grid of world cards. Each card: 110px constellation cover with tinted gradient bg (each world has its own color), then padding block with `● GENRE` kicker, world name h3, tagline, count row (`4 eras · 47 articles · 12 ideas`). One "new world" card at the end with dashed border + circular plus.

**View 2 — Timeline editor:**
- Header row: era cycle name h2 + date range tag + "AUTO-SAVED" tag + spacer + "Eras:" select (Era/Age/Cycle/Reign/Saga — picks the user's term) + add-era button + add-event button.
- Era track: 4 bands across 100% width, each clickable, with a dot + label + percentage. Clicking an era highlights its left border in cyan (rename UI not implemented).
- Year ticks row (5 ticks across).
- **Spine + events:** absolute-positioned 360px canvas. 1px horizontal line at 50%. Era boundary vertical 10px ticks. Events alternate above/below the spine: a 10px dot (12px when selected, with cyan glow) + a 140px label card with date kicker + title. Click an event → it's now selected → inspector populates on the right.
- **Inspector** (340px right rail): kind tag + ID tag, more/close buttons, date kicker, h3 title, body paragraph, mini info-box (Date/Era/Place grid), "Linked articles" buttons. Footer: Edit (primary, flex 1) + delete icon button.

**View 3 — Article editor:**
- Left: **article list** (240px). Filter input + new-article icon button at top. Then grouped sections: Characters / Places / Factions. Each item: dot + name. Active item has cyan left bar.
- Right: **article body** (max-width 720px center). Sticky article toolbar: kind tag + ID tag + spacer + "Edited X ago" + preview icon + Edit/Save button + more. Below: 140px square image (`Replace` overlay in edit mode) + title block (kind/subtitle kicker + 40px h1 + 17px tagline). Then info box (auto top-right "INFO BOX" label), body blocks (h2 / p / blockquote with serif italic + cite), attachments (file tiles by extension), linked articles (chip row with up-right-arrow icons). In edit mode, an "Add section" rail appears at the bottom with options: Subtitle / Paragraph / Date / Linked article / Image / Attachment.
- **File tiles:** 40px square with bottom-right colored extension tag (`docx` blue, `pdf` red, `pptx` orange, `kra` purple, `md` green) + a centered file icon ghost.

**View 4 — Idea inbox:**
- Header: `IDEA INBOX · N UNFILED` kicker → "Sparks" h1 → explanatory copy → right-aligned "+ Capture" primary button.
- **Capture composer** (appears on click): 88px square image placeholder + title input (large serif-style) + 2-row note textarea + footer row with "Unfiled" tag and Cancel / Capture. Has a cyan glow shadow.
- **Idea cards grid** (`auto-fill, minmax(280px, 1fr)`): each card has a 96px image area with colored Tabler icon centered + ID badge top-right, then padding block with 16px h4 + 13px 2-line clamped note + bottom row with timestamp + "Unfiled" warning tag (or section name as success tag).
- Two sections: "Unfiled" and "Filed".

**View 5 — Help library:**
- Left: **help sidebar** (280px). Header: "Library" kicker + "Help & how-to" h3. Below: collapsible categories (Getting started / Designing worlds / Calendars & time / Files & uploads), each with an icon label and a list of articles. Active article has cyan left bar.
- Right: **article body** (max-width 760px). Category kicker with icon → 38px h1 → 19px lede.
- **Editable-template banner**: cyan icon, "This template is editable" text, "Copy to world" secondary button. Indicates that help articles are real templates the user can fork.
- Body blocks: h2 / p / list / video (16:9 player with cyan play circle + glow + source caption) / image (16:9 placeholder + figcaption).
- **Try next** footer block: cyan-tinted kicker + a list of related-article links with right-arrow icons.

**Source files:** `Sidebar.jsx` + `TopBar.jsx` (in `Chrome.jsx`), `Dashboard.jsx` (incl. `WorldCard`, `NewWorldCard`), `Timeline.jsx` (incl. `EventCard`, `EventInspector`), `Article.jsx` (incl. `ArticleList`, `ArticleHeader`, `InfoBox`, `ArticleBody`, `Attachments`, `FileTile`, `LinkedArticles`, `AddSectionRail`), `IdeaInbox.jsx` (incl. `IdeaGrid`, `IdeaCard`, `CaptureComposer`), `Help.jsx` (incl. `HelpSidebar`, `HelpArticle`, `VideoEmbed`), `EmptyState.jsx`, `Primitives.jsx`.

**Sample data shapes** (treat as suggestion, not schema):

```ts
type World = {
  id: string;
  name: string;
  genre: string;
  color: string;     // hex — used as the world's accent dot
  cover: string;     // CSS gradient string
  starColor: string; // hex for constellation cover
  tagline: string;
  eras: number; articles: number; ideas: number;
};

type Era = { id: string; label: string; from: number; to: number; color: string; };

type Event = {
  id: string; x: number; year: string; title: string; desc: string; kind: string;
};

type Article = {
  id: string;       // "ART-001"
  title: string;
  subtitle: string; // "Character · 312–388 SA"
  tagline: string;
  kind: "character" | "place" | "faction" | string;
  imageGlyph?: string; // a Tabler icon name as placeholder
  facts: { k: string; v: string; linked?: boolean }[];
  body: ({ type: "h2" | "p"; text: string } | { type: "quote"; text: string; cite?: string })[];
  attachments: { name: string; label?: string; ext: string; size: string }[];
  links: string[];
};

type Idea = {
  id: string; title: string; note: string;
  glyph: string; color: string;     // for the cover icon
  captured: string;                 // relative time label
  unfiled: boolean;
  section?: string;                 // when filed
};
```

---

### 3. Auth — `reference/ui_kits/auth/`

**Purpose:** sign in, create account, one-time-code path.

**Layout:** `grid-template-columns: minmax(380px, 1fr) minmax(0, 1.1fr)`. Full viewport height.

- **Left column** — form. 48px padding, max-width 560px, vertically centered. Logo top. Form stack: kicker → 36px h1 → 16px subtitle → fields. Bottom: `v0.1 · alpha` version stamp.
- **Right column** — brand panel. Linear gradient `#11151d → #060810`. Animated constellation backdrop (same component as marketing hero, vertical orientation). Bottom 55% has a dark protection gradient. Foreground content: kicker (`FROM THE HELP LIBRARY`) + 28px blockquote + attribution. Plus the scan-line grain overlay.

**Three views** toggled by the app router (`view` state: `login | signup | code`):

1. **Login:** Email + Password fields, "Sign in" primary button (full-width, with right arrow), divider, OAuth row (Google / Apple / GitHub plain buttons), "Or send me a one-time code →" link, "Don't have an account? Create one →" footer.
2. **Signup:** Name + Email + Password + agreement checkbox (`I've read what's quiet — no tracking, no training on your worlds, plain-Markdown export at any time.`) + "Create account" primary + divider + OAuth + "Already have an account? Sign in →" footer.
3. **Code:** Tag showing sent-to email, 6-digit code input row (focus moves right on input), "Verify and sign in" primary, "Didn't get it? Resend · expires in 9:48" line, "← Back to password" link.

**Source files:** `AuthFrame.jsx` (incl. `BrandPanel`, `ConstellationLive`), `LoginForm.jsx` (incl. `Divider`, `OAuthRow`), `SignupForm.jsx`, `CodeForm.jsx`, `Primitives.jsx`.

---

## Interactions & behavior

| Element | Interaction |
|---|---|
| Button — primary | Hover: bg `--accent-hover`. Press: `opacity: 0.85` (no scale). Focus: `--focus-ring`. |
| Button — secondary | Hover: bg `--bg-hover`. Press: `opacity: 0.85`. |
| Card | Hover: bg `--bg-hover`, border `--border-strong`. Selected: `box-shadow: var(--shadow-glow)` (the cyan glow + 1px cyan border). |
| Input | Focus: border `--accent`, inset 1px cyan, `0 0 16px var(--cyan-glow)`. |
| Sidebar item (active) | 2px cyan left border. Background `--bg-hover`. Foreground `--fg`. |
| Crumb (current view) | `color: var(--cyan)` (uppercase mono). |
| Timeline event | Selected: dot grows 10 → 12px, gains cyan glow + 4px soft halo (`var(--accent-soft)`). Inspector slides in (220ms). |
| Event "appear" | When user adds an event, the inserted dot pulses cyan once (320ms ease-out, decays). Not implemented in the prototype — described in `README.md`'s *Animation* section. |
| Capture composer | Opens with a cyan glow ring around the box. Title input has a cyan dashed underline. |
| Theme | None — single theme. Do not add a toggle. |

### Form validation rules

The prototype does not validate. Production rules suggested:
- Email: standard RFC 5322
- Password (signup): "At least 10 characters" (per the hint copy) — encourage long passphrases over complexity rules
- One-time code: numeric, 6 digits, 10-minute expiry (per the "expires in 9:48" copy)

### Responsive behavior

The prototype is **desktop-first** (1280–1440px design width). For production:
- Sidebar collapses to icon-only at <1024px, hides behind a sheet at <768px
- Auth two-column collapses to single column at <960px (brand panel becomes a stacked header)
- Article + Timeline + Help reading panes stay desktop-only for v1 — mobile read-only later

---

## Content & voice rules

Critical. The brand is restrained on purpose.

- **Sentence case** for body copy, marketing buttons, anything >3 words.
- **UPPERCASE mono with `0.14em` tracking** for short HUD chrome labels (`SECTOR 04`, `ID-042`, `SY 4192`, `EDITED 2 DAYS AGO`). Never long sentences.
- **Second person** ("your world", "you've drafted 3 ideas") in UI strings. **No "we"** in buttons.
- **No exclamation points.** No "Awesome!" or "Let's go!". No 🎉.
- **No emoji** anywhere.
- Numerals always for counts (`3 eras`, not `three eras`).
- **HUD vocabulary:** `SECTOR · ARCHIVE · ENTRY · WAYPOINT · LOG · SURVEY · SY (standard year)`. Use sparingly — content is the user's, chrome shouldn't compete.
- **User renames concepts.** "Era" is the default; users can change it to Age / Cycle / Saga / Reign. UI strings reference *their* term, not the default. Implement as a per-world string setting.

Full rules in `brand/README.md` § *Content Fundamentals*.

---

## State management

The prototype keeps everything in component-level React state. For production:

- **Theme:** none (single theme). Skip.
- **Auth:** standard session cookie / JWT.
- **World list / world content:** server state via Tanstack Query (or framework equivalent). Auto-save on edit (the toolbar shows `AUTO-SAVED` as the default state — implement debounced PATCH).
- **Drafts:** ideas in the inbox are essentially drafts. Treat as a separate resource (`idea`) until filed into a section, where they become first-class entries.
- **The user's chosen term for "era"** (Era / Age / Cycle / etc.) is per-world settings — store on the world record, cascade through UI.

---

## Assets

| Path in handoff | Notes |
|---|---|
| `assets/logo/Logo.jsx` | Typographic logotype component. Two variants: `full` and `short` (the `Wt.` monogram). Reimplement in your component library — but keep the type treatment exactly: Space Grotesk, 500 weight, `-0.02em` letter-spacing, second word in `--fg-muted` with 400 weight. |
| `assets/logo/favicon.svg` | 32×32 favicon with W glyph + small oxblood accent dot. (Note: the dot is currently oxblood `#7a2e2a` from an earlier theme version — change to cyan `#7fdbff` if you want full brand consistency.) |
| `assets/illustrations/constellation-backdrop.svg` | Hero backdrop. Inherits `currentColor` for stars. |
| `assets/illustrations/empty-constellation.svg` | Empty state — small 5-point constellation. |
| `assets/illustrations/empty-timeline.svg` | Empty state — dashed timeline spine + ghost event. |
| `assets/illustrations/empty-notebook.svg` | Empty state — open notebook with blank pages. |
| `assets/icons/Icon.jsx` | Reference only. **Don't ship this — install `@tabler/icons-react`** and use icon names directly. The single custom icon (`faction`) needs to be added as a local SVG; its path is in this file. |

No raster images, no photography, no people. The brand is all linework + type.

---

## Files in this bundle

```
design_handoff_worldbuilding_toolbox/
├── README.md                        ← this file
├── SKILL.md                         ← skill manifest (for AI agents reading this bundle)
├── colors_and_type.css              ← design tokens (source of truth)
├── brand/
│   └── README.md                    ← long-form brand guide (content + visual + iconography)
├── fonts/
│   └── README.md                    ← font notes + substitution map
├── assets/
│   ├── icons/
│   │   ├── Icon.jsx                 ← curated Tabler set (reference)
│   │   └── README.md
│   ├── logo/
│   │   ├── Logo.jsx                 ← logotype component (reference)
│   │   └── favicon.svg
│   └── illustrations/
│       ├── constellation-backdrop.svg
│       ├── empty-constellation.svg
│       ├── empty-timeline.svg
│       └── empty-notebook.svg
└── reference/                       ← visual references — open these in a browser
    ├── preview/                     ← 18 single-purpose HTML cards (one per token / component)
    │   ├── _card.css
    │   ├── type-*.html              (4 cards: display, body, mono, scale)
    │   ├── colors-*.html            (3 cards: space scale, accents, semantic)
    │   ├── spacing-scale.html
    │   ├── radii.html
    │   ├── shadows.html
    │   ├── components-*.html        (4 cards: buttons, inputs, cards, badges)
    │   └── brand-*.html             (4 cards: logo, imagery, icons, empty states)
    └── ui_kits/
        ├── marketing/index.html     ← landing page
        ├── app/index.html           ← dashboard → timeline → article → ideas → help
        └── auth/index.html          ← sign in / sign up / one-time code
```

---

## Implementation checklist

1. ✅ Mirror tokens from `colors_and_type.css` into the project's token system. Keep semantic names (`bg`, `fg`, `accent`, `border`, etc.) and the raw scales (`space-900`, `cyan`, etc.).
2. ✅ Install fonts (Space Grotesk, JetBrains Mono, Source Serif 4). Use `next/font` or self-host WOFF2.
3. ✅ Install `@tabler/icons-react`. Audit `reference/ui_kits/**/*.jsx` for icon names.
4. ✅ Add the custom `faction` SVG (path in `assets/icons/Icon.jsx`).
5. ✅ Build base primitives: `Button` (primary/secondary/ghost/danger × sm/md/lg, with optional icon), `IconButton`, `Input`, `Textarea`, `Field`, `Tag` (neutral/accent/success/warning), `Avatar`, `Divider`. Match the inline-style values in `reference/ui_kits/app/Primitives.jsx`.
6. ✅ Build the app shell: `Sidebar` + `TopBar`. Get crumbs, search, and sidebar groups right.
7. ✅ Build each screen against the descriptions above and the JSX references.
8. ✅ Add the constellation backdrop component (drift + twinkle + cyan anchor pulse). The SVG markup + CSS animations are in `reference/ui_kits/auth/AuthFrame.jsx` (`ConstellationLive`) and `reference/ui_kits/marketing/Hero.jsx` (`ConstellationBackdrop`).
9. ✅ Smoke-test against the prototype side-by-side in two browser windows.

---

## Open questions for the team

- **Calendars.** The product accepts user-named eras and standard-year shorthand (`SY 4192.06.12`). The backend needs to support arbitrary date formats per world. Worth scoping early.
- **Attachments.** The prototype shows `.docx`, `.pdf`, `.pptx`, `.kra`, `.md`. Each gets a colored extension badge. Decide which formats are first-class (rich preview vs. download-only).
- **Idea → Article promotion.** When a user files an idea into a section, does it remain a "card-shaped" thing or become a full article? The prototype suggests the latter (the editor takes the idea's title + image + note as seed). Confirm.
- **Linked articles.** The prototype shows them as flat chips. If the backend supports types of links ("related", "supersedes", "parent of"), surface that in the UI.

---

Questions while implementing? The brand README at `brand/README.md` answers most "but what should I do for X?" cases. If it doesn't, ask.
