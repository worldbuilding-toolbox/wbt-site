---
name: worldbuilding-toolbox-design
description: Use this skill to generate well-branded interfaces and assets for the Worldbuilding Toolbox, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## What this skill contains

- `README.md` — brand, content + visual foundations, iconography manifest, file index
- `colors_and_type.css` — the single source of truth for design tokens. **Constellation** theme: deep-space dark UI, cyan accent, sharp corners, mono HUD chrome
- `fonts/` — font notes (Google Fonts CDN, fallbacks documented)
- `assets/` — logos, favicons, Tabler icon set (`Icon.jsx`), constellation illustrations, empty-state SVGs
- `preview/` — 18 small HTML cards demonstrating individual design tokens, components, and brand elements
- `ui_kits/marketing/` — landing page composition with theme-locked components
- `ui_kits/app/` — full app shell (dashboard → timeline → article editor → idea inbox → help)
- `ui_kits/auth/` — login + signup + one-time-code

## Quick reminders

- **One theme only — Constellation.** Do not propose lighter variants. Deep space (`#0b0e14`), bone foreground (`#e6e7eb`), cyan accent (`#7fdbff`).
- **Two type families.** Space Grotesk for display + body, JetBrains Mono for HUD labels / chrome / metadata. Source Serif 4 is reserved for opt-in long-form reading body only.
- **Sharp corners.** Radii 0–6px. Sharp by default; rounded feels off-brand.
- **Borders, not shadows.** Elevation comes from 1px borders + faint cyan glow on focus.
- **Mono for UI chrome.** Labels, badges, breadcrumbs, axis ticks, status — all uppercase, `0.14em` letter-spacing.
- **Star map imagery only.** Sparse SVG dots + linework with cyan anchors. Never photographs. Never illustrations of people.
- **Tabler icons.** Use the curated set in `assets/icons/Icon.jsx`. 2px stroke. Always inherit `currentColor`.
- **No emoji. No bouncy animations. No bluish-purple gradients. No glassmorphism.**
- **Tone.** Calm, plainspoken, faintly literary. No exclamation points in UI. Sentence case for body; uppercase HUD only for short chrome labels.
