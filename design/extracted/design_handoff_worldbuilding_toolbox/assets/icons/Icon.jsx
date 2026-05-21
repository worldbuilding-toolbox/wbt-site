/* Icon.jsx — Tabler-style icon component
   Inlined SVG paths so icons inherit currentColor and work offline.
   All icons: 24×24 viewBox, 2px stroke, round caps + joins, no fill.

   Usage:
     <Icon name="timeline" size={20} />
     <Icon name="star" size={16} strokeWidth={1.5} />

   To add an icon: copy the path data from https://tabler.io/icons/icon/<name>
   and append it below. Keep the 24-viewBox geometry intact.
*/

const ICONS = {
  // --- Worldbuilding ------------------------------------------------------
  timeline: (
    <>
      <path d="M4 16l6 -7l5 5l5 -6" />
      <circle cx="4" cy="16" r="1" />
      <circle cx="10" cy="9" r="1" />
      <circle cx="15" cy="14" r="1" />
      <circle cx="20" cy="8" r="1" />
    </>
  ),
  map: (
    <>
      <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3z" />
      <path d="M9 4v13" />
      <path d="M15 7v13" />
    </>
  ),
  compass: (
    <>
      <path d="M8 16l2.5 -6.5l6.5 -2.5l-2.5 6.5z" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  planet: (
    <>
      <circle cx="12" cy="12" r="4" />
      <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-22 12 12)" />
    </>
  ),
  star: (
    <>
      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
    </>
  ),
  "star-filled": (
    <>
      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" fill="currentColor" stroke="none" />
    </>
  ),
  book: (
    <>
      <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
      <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
      <path d="M3 6l0 13" />
      <path d="M12 6l0 13" />
      <path d="M21 6l0 13" />
    </>
  ),
  "book-2": (
    <>
      <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z" />
      <path d="M19 16h-12a2 2 0 0 0 -2 2" />
      <path d="M9 8h6" />
    </>
  ),
  scroll: (
    <>
      <path d="M19 17v2a2 2 0 0 1 -2 2h-11a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 1 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
    </>
  ),

  // --- Sci-fi extras (HUD) ----------------------------------------------
  rocket: (
    <>
      <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
      <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
      <circle cx="15" cy="9" r="1" />
    </>
  ),
  faction: (
    /* heraldic shield with a chevron — "faction" / sigil */
    <>
      <path d="M12 3l8 3v6c0 4.5 -3.5 8 -8 9c-4.5 -1 -8 -4.5 -8 -9v-6z" />
      <path d="M8 12l4 -3l4 3" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1" />
      <path d="M20.5 12c0 -3.038 -3.806 -5.5 -8.5 -5.5s-8.5 2.462 -8.5 5.5s3.806 5.5 8.5 5.5s8.5 -2.462 8.5 -5.5z" />
      <path d="M16.243 7.757c2.149 -2.149 1.93 -6.305 -.488 -7.7c-2.418 -1.394 -6.058 .53 -8.207 2.678c-2.149 2.149 -4.073 5.789 -2.678 8.207c1.394 2.418 5.55 2.637 7.7 .488z" transform="rotate(45 12 12)" opacity="0" />
      <path d="M3.5 3.5c2.5 2.5 6 6 8.5 8.5s6 6 8.5 8.5" />
      <path d="M3.5 20.5c2.5 -2.5 6 -6 8.5 -8.5s6 -6 8.5 -8.5" />
    </>
  ),
  "moon-stars": (
    <>
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
      <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
      <path d="M19 11h1m-.5 -.5v1" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  "chart-arcs": (
    <>
      <circle cx="12" cy="12" r="1" />
      <path d="M16.924 11.132a5 5 0 1 0 -4.056 5.792" />
      <path d="M3.1 10.5a9 9 0 1 0 11.3 -6.4" />
    </>
  ),
  radioactive: (
    <>
      <path d="M13.5 14.6l3 5.19a9 9 0 0 0 4.5 -7.79h-6a3 3 0 0 1 -1.5 2.6z" />
      <path d="M13.5 9.4l3 -5.19a9 9 0 0 0 -9 0l3 5.19a3 3 0 0 1 3 0z" />
      <path d="M10.5 14.6l-3 5.19a9 9 0 0 1 -4.5 -7.79h6a3 3 0 0 0 1.5 2.6z" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  alien: (
    /* Large simple alien — bulbous head + two slanted eyes */
    <>
      <path d="M12 3c-4.5 0 -7 3.6 -7 8.5c0 4.2 2.6 8.5 7 8.5s7 -4.3 7 -8.5c0 -4.9 -2.5 -8.5 -7 -8.5z" />
      <ellipse cx="9" cy="12" rx="1.4" ry="2.4" transform="rotate(-18 9 12)" fill="currentColor" stroke="none" />
      <ellipse cx="15" cy="12" rx="1.4" ry="2.4" transform="rotate(18 15 12)" fill="currentColor" stroke="none" />
    </>
  ),
  galaxy: (
    <>
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M20.985 12.518a9 9 0 1 0 -8.45 8.466" />
      <path d="M14.5 19c-1 -3 -1.5 -5.5 -.5 -7s4 -1 5.5 -3" />
    </>
  ),
  signal: (
    <>
      <path d="M3 12h.01" />
      <path d="M7 12c0 -1.66 .67 -3.16 1.76 -4.24" />
      <path d="M17 12c0 1.66 -.67 3.16 -1.76 4.24" />
      <path d="M11 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
      <path d="M21 12h-.01" />
      <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
      <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
    </>
  ),

  // --- UI primitives ------------------------------------------------------
  plus: (
    <>
      <path d="M12 5l0 14" />
      <path d="M5 12l14 0" />
    </>
  ),
  x: (
    <>
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </>
  ),
  check: (
    <>
      <path d="M5 12l5 5l10 -10" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M21 21l-6 -6" />
    </>
  ),
  "menu-2": (
    <>
      <path d="M4 6l16 0" />
      <path d="M4 12l16 0" />
      <path d="M4 18l16 0" />
    </>
  ),
  "dots-vertical": (
    <>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  "chevron-left": (
    <>
      <path d="M15 6l-6 6l6 6" />
    </>
  ),
  "chevron-right": (
    <>
      <path d="M9 6l6 6l-6 6" />
    </>
  ),
  "chevron-down": (
    <>
      <path d="M6 9l6 6l6 -6" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12l14 0" />
      <path d="M13 18l6 -6" />
      <path d="M13 6l6 6" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M17 7l-10 10" />
      <path d="M8 7l9 0l0 9" />
    </>
  ),

  // --- File / link --------------------------------------------------------
  file: (
    <>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    </>
  ),
  "file-text": (
    <>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      <path d="M9 9l1 0" />
      <path d="M9 13l6 0" />
      <path d="M9 17l6 0" />
    </>
  ),
  "file-description": (
    <>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      <path d="M9 17h6" />
      <path d="M9 13h6" />
    </>
  ),
  paperclip: (
    <>
      <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5" />
    </>
  ),
  link: (
    <>
      <path d="M9 15l6 -6" />
      <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
      <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
    </>
  ),
  "external-link": (
    <>
      <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
      <path d="M11 13l9 -9" />
      <path d="M15 4h5v5" />
    </>
  ),
  folder: (
    <>
      <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
    </>
  ),

  // --- Editing ------------------------------------------------------------
  pencil: (
    <>
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7l16 0" />
      <path d="M10 11l0 6" />
      <path d="M14 11l0 6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </>
  ),
  eye: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
      <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341m3.368 -1.524a9.026 9.026 0 0 1 2 -.135c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488" />
      <path d="M3 3l18 18" />
    </>
  ),
  copy: (
    <>
      <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
      <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  bookmark: (
    <>
      <path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2" />
    </>
  ),

  // --- Account / system ---------------------------------------------------
  user: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </>
  ),
  "user-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
    </>
  ),
  settings: (
    <>
      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  logout: (
    <>
      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M9 12h12l-3 -3" />
      <path d="M18 15l3 -3" />
    </>
  ),
  bell: (
    <>
      <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
      <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
    </>
  ),

  // --- Theme --------------------------------------------------------------
  moon: (
    <>
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
    </>
  ),

  // --- Status -------------------------------------------------------------
  "alert-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  "info-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01" />
      <path d="M11 12h1v4h1" />
    </>
  ),
  "circle-check": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2l4 -4" />
    </>
  ),

  // --- Worldbuilding extras ----------------------------------------------
  hash: (
    <>
      <path d="M5 9l14 0" />
      <path d="M5 15l14 0" />
      <path d="M11 4l-4 16" />
      <path d="M17 4l-4 16" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M4 11h16" />
    </>
  ),
  "layout-grid": (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  "drag-vertical": (
    <>
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="19" r="1" />
    </>
  ),
  photo: (
    <>
      <path d="M15 8h.01" />
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
      <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
    </>
  ),
  upload: (
    <>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 9l5 -5l5 5" />
      <path d="M12 4l0 12" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8" />
      <path d="M3.6 15h16.8" />
      <path d="M11.5 3a17 17 0 0 0 0 18" />
      <path d="M12.5 3a17 17 0 0 1 0 18" />
    </>
  ),
  "device-floppy": (
    <>
      <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
      <circle cx="12" cy="14" r="2" />
      <path d="M14 4l0 4l-6 0l0 -4" />
    </>
  ),
};

function Icon({ name, size = 20, strokeWidth = 2, className = "", style = {}, ...rest }) {
  const path = ICONS[name];
  if (!path) {
    console.warn(`Icon "${name}" not found in curated set.`);
    return null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle", ...style }}
      aria-hidden="true"
      {...rest}
    >
      {path}
    </svg>
  );
}

// Expose to other Babel scripts via window
if (typeof window !== "undefined") {
  window.Icon = Icon;
  window.ICONS = ICONS;
}
