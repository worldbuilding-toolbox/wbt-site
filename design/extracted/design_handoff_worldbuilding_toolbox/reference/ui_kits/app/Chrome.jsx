/* Chrome.jsx — Sidebar + TopBar
   Shared chrome around every app view. Renders differently when viewing
   the dashboard vs inside a world. */

function Sidebar({ view, world, onNavigate, onChangeView, theme, worlds }) {
  const hud = isConstellation();
  const inWorld = !!world;

  return (
    <aside
      style={{
        width: 244,
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        background: "var(--bg-sunken)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ padding: "20px 18px", borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={() => onNavigate({ screen: "dashboard" })}
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "block" }}
        >
          <Logo size="md" />
        </button>
      </div>

      {/* Worlds switcher */}
      <div style={{ padding: "14px 12px", borderBottom: "1px solid var(--border)" }}>
        <SidebarLabel>Your worlds</SidebarLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 8 }}>
          {worlds.map((w) => (
            <button
              key={w.id}
              onClick={() => onNavigate({ screen: "world", worldId: w.id, view: "timeline" })}
              style={{
                ...sidebarItemStyle,
                background: world?.id === w.id ? "var(--bg-hover)" : "transparent",
                color: world?.id === w.id ? "var(--fg)" : "var(--fg-secondary)",
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: w.color, flexShrink: 0,
              }} />
              <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis" }}>{w.name}</span>
            </button>
          ))}
          <button onClick={() => onNavigate({ screen: "dashboard" })} style={{ ...sidebarItemStyle, color: "var(--fg-muted)" }}>
            <Icon name="plus" size={14} />
            <span>New world</span>
          </button>
        </div>
      </div>

      {/* In-world sections */}
      {inWorld && (
        <div style={{ padding: "14px 12px", borderBottom: "1px solid var(--border)" }}>
          <SidebarLabel>{world.name}</SidebarLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 8 }}>
            {[
              { key: "timeline", icon: "timeline", label: "Timeline" },
              { key: "articles", icon: "book-2", label: "Articles" },
              { key: "ideas", icon: "bookmark", label: "Ideas" },
              { key: "help", icon: "compass", label: "Help" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => onChangeView(s.key)}
                style={{
                  ...sidebarItemStyle,
                  background: view === s.key ? (hud ? "var(--bg-hover)" : "var(--bg-elevated)") : "transparent",
                  color: view === s.key ? "var(--fg)" : "var(--fg-secondary)",
                  borderLeft: view === s.key ? "2px solid var(--accent)" : "2px solid transparent",
                  paddingLeft: 10,
                }}
              >
                <Icon name={s.icon} size={15} />
                <span>{s.label}</span>
                {view === s.key && hud && (
                  <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)", letterSpacing: "0.1em" }}>•</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom */}
      <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
        <button style={{ ...sidebarItemStyle, color: "var(--fg-secondary)" }}>
          <Icon name="settings" size={15} />
          <span>Settings</span>
        </button>
        <button style={{ ...sidebarItemStyle, color: "var(--fg-secondary)" }}>
          <Icon name="info-circle" size={15} />
          <span>What's quiet</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarLabel({ children }) {
  const hud = isConstellation();
  return (
    <div
      style={{
        fontFamily: hud ? "var(--font-mono)" : "var(--font-ui)",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "var(--fg-muted)",
        fontWeight: 500,
        padding: "0 6px",
      }}
    >
      {children}
    </div>
  );
}

const sidebarItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 12px",
  background: "transparent",
  border: "none",
  borderLeft: "2px solid transparent",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  color: "var(--fg-secondary)",
  width: "100%",
  textAlign: "left",
  lineHeight: 1.4,
};


function TopBar({ world, view, onNavigate }) {
  const viewLabel = ({
    timeline: "Timeline",
    articles: "Articles",
    ideas: "Ideas",
    help: "Help",
  })[view];
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        height: 56,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 20px",
      }}
    >
      {/* Crumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        <button
          onClick={() => onNavigate({ screen: "dashboard" })}
          style={{ background: "transparent", border: "none", color: "var(--fg-secondary)", cursor: "pointer", padding: 0, fontFamily: "inherit", fontSize: "inherit", textTransform: "inherit", letterSpacing: "inherit" }}
        >
          WORLDS
        </button>
        {world && (
          <>
            <Icon name="chevron-right" size={14} style={{ color: "var(--fg-muted)" }} />
            <span style={{ color: "var(--fg)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: world.color }} />
              {world.name}
            </span>
            <Icon name="chevron-right" size={14} style={{ color: "var(--fg-muted)" }} />
            <span style={{ color: "var(--cyan)" }}>{viewLabel}</span>
          </>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          width: 260,
          color: "var(--fg-muted)",
        }}
      >
        <Icon name="search" size={14} />
        <input
          placeholder="QUERY..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--fg)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            flex: 1,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        />
        <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", border: "1px solid var(--border)", padding: "1px 5px", borderRadius: 3 }}>⌘K</kbd>
      </div>

      <IconButton icon="bell" variant="outlined" label="Notifications" />
      <Avatar initials="EJ" />
    </div>
  );
}

if (typeof window !== "undefined") { window.Sidebar = Sidebar; window.TopBar = TopBar; }
