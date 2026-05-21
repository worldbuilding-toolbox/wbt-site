# App UI Kit

The main Worldbuilding Toolbox app shell + the surfaces inside a world.

This kit is a click-through prototype. Open `index.html` and:

1. You land on the **Worlds dashboard** — your list of worlds.
2. Click a world → opens **World home**, with tabs: Timeline · Articles · Ideas · Help.
3. **Timeline** — eras as labeled bands, events on the spine, click an event to inspect.
4. **Articles** — sidebar of entries, click one to view; switch to Edit mode to add subtitles / info-boxes / links / images.
5. **Ideas** — the unsorted inbox; capture button is always reachable.
6. **Help** — world's help library; one article showing inline.

Theme toggle is in the top bar (top-right). Persists to `localStorage("wbt:theme")`.

## Components

| File | What it is |
|---|---|
| `index.html` | Mounts the app + router. Default route = dashboard. |
| `Primitives.jsx` | Button, Input, Field, IconButton, Tag, Avatar. Theme-aware. |
| `Sidebar.jsx` | Left nav (240px). Worlds switcher, sections within a world. |
| `TopBar.jsx` | Sticky top bar with crumb, search, theme toggle, account. |
| `Dashboard.jsx` | Worlds list grid + "New world" card. |
| `WorldHome.jsx` | Tab container that hosts the four world surfaces. |
| `Timeline.jsx` | Horizontal scroll timeline. Eras + events + drag-to-pan + inspector. |
| `Article.jsx` | Single-article view + edit mode toggle + attachments. |
| `IdeaInbox.jsx` | Idea cards grid + Capture dialog. |
| `Help.jsx` | Help library — sidebar + article body. |
| `EmptyState.jsx` | Shared empty-state component (illustration + title + tip + CTA). |

## Visual fidelity notes

- All component styles use **semantic tokens only** (`var(--bg)`, etc.) so the same components render in both themes.
- Sharp Constellation corners + sans/mono are picked up automatically via theme tokens. The few places that need theme-specific tweaks (HUD labels) check `document.documentElement.dataset.theme` inline.
- Tabler icons via the shared `Icon.jsx` at `assets/icons/Icon.jsx`.
- This kit reproduces the design — it isn't real persistence. State is in-memory only.
