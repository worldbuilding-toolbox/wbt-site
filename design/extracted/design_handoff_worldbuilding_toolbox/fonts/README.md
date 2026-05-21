# Fonts

All four typefaces are loaded via Google Fonts CDN in `../colors_and_type.css`:

- **Source Serif 4** — Manuscript display + body. [Google Fonts](https://fonts.google.com/specimen/Source+Serif+4)
- **Geist** — Manuscript UI sans. [Google Fonts](https://fonts.google.com/specimen/Geist)
- **Space Grotesk** — Constellation display + body. [Google Fonts](https://fonts.google.com/specimen/Space+Grotesk)
- **JetBrains Mono** — Mono for both themes; Constellation UI labels. [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono)

## For production

Self-host these by downloading the WOFF2 files from Google Fonts and adding them to this folder, then replacing the `@import` block at the top of `colors_and_type.css` with `@font-face` declarations. Subset to Latin + needed punctuation to keep payload small.

## Substitutions

**None flagged.** All four are the intended families. If you must substitute:

- Source Serif 4 → Source Serif Pro, Charter, Iowan Old Style
- Geist → Inter (last resort — avoid if possible), system-ui
- Space Grotesk → Sora, IBM Plex Sans
- JetBrains Mono → IBM Plex Mono, Fira Code, SF Mono
