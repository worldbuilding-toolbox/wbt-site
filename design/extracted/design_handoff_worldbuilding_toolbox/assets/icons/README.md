# Icons

**System:** [Tabler Icons](https://tabler.io/icons) — MIT licensed.

## How icons load in UI kits

Each UI kit imports `Icon.jsx` (a small React component) that holds a curated set of inlined Tabler SVG paths. All icons:

- 24×24 viewBox
- 2px stroke
- `stroke="currentColor"` (inherits text color)
- Round linecaps + joins
- `fill="none"` (line-style)

Use as `<Icon name="timeline" size={20} />`. Size defaults to 20.

## Curated set (loaded into Icon.jsx)

Worldbuilding-adjacent:
- `timeline`, `map`, `compass`, `planet`, `star`, `book`, `book-2`, `scroll`, `sword`, `crown`

UI primitives:
- `plus`, `x`, `check`, `search`, `menu-2`, `dots-vertical`, `chevron-left`, `chevron-right`, `chevron-down`, `arrow-right`, `arrow-up-right`

File / link:
- `file`, `file-text`, `file-description`, `paperclip`, `link`, `external-link`, `folder`

Editing:
- `pencil`, `trash`, `eye`, `eye-off`, `copy`, `bookmark`

Account / system:
- `user`, `user-circle`, `settings`, `logout`, `bell`

Theme:
- `moon`, `sun`

Status:
- `alert-circle`, `info-circle`, `circle-check`

## Adding new icons

When a kit needs an icon not in the set, copy the path data from `https://tabler.io/icons/icon/<name>` and append a new entry to the `ICONS` object in `Icon.jsx`. Do **not** substitute icons from other sets — Tabler's stroke style is intentional and must stay consistent.

## Production

For a real codebase, install `@tabler/icons-react` instead of maintaining this curated map. The visual result is identical.
