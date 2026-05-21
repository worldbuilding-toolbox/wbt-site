/* Dashboard.jsx — list of worlds + "new world" tile */

function Dashboard({ worlds, onOpenWorld, onCreateWorld }) {
  const hud = isConstellation();
  return (
    <div style={{ padding: "40px 48px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: hud ? "var(--font-mono)" : "var(--font-ui)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--fg-muted)", fontWeight: 500, marginBottom: 8 }}>
            {hud ? "ARCHIVE / WORLDS" : "Your library"}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, letterSpacing: "-0.02em", fontWeight: 500, margin: 0, color: "var(--fg)" }}>
            Worlds
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--fg-secondary)", margin: "8px 0 0" }}>
            {worlds.length} {worlds.length === 1 ? "world" : "worlds"}. Open one, or start fresh.
          </p>
        </div>
        <Button variant="primary" icon="plus" onClick={onCreateWorld}>New world</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {worlds.map((w) => (
          <WorldCard key={w.id} world={w} onOpen={() => onOpenWorld(w.id)} />
        ))}
        <NewWorldCard onClick={onCreateWorld} />
      </div>
    </div>
  );
}

function WorldCard({ world, onOpen }) {
  const hud = isConstellation();
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "var(--bg-hover)" : "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        overflow: "hidden",
        boxShadow: hud ? "none" : (hover ? "var(--shadow-md)" : "var(--shadow-sm)"),
        transition: "background 120ms, box-shadow 120ms",
        display: "flex",
        flexDirection: "column",
        minHeight: 220,
      }}
    >
      {/* Cover — constellation pattern */}
      <div style={{ height: 110, background: world.cover, position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <svg viewBox="0 0 400 110" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", color: world.starColor || "#fff" }} fill="none">
          <g stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.35">
            <line x1="40" y1="30" x2="100" y2="60" />
            <line x1="100" y1="60" x2="160" y2="35" />
            <line x1="240" y1="40" x2="320" y2="75" />
          </g>
          <g fill="currentColor">
            <circle cx="40" cy="30" r="1.4" />
            <circle cx="100" cy="60" r="1.8" />
            <circle cx="160" cy="35" r="1.4" />
            <circle cx="240" cy="40" r="1.6" />
            <circle cx="320" cy="75" r="2" />
            <circle cx="60" cy="80" r="0.8" opacity="0.6" />
            <circle cx="200" cy="80" r="0.8" opacity="0.6" />
            <circle cx="350" cy="25" r="0.8" opacity="0.6" />
          </g>
        </svg>
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: world.color, flexShrink: 0 }} />
          <span style={{ fontFamily: hud ? "var(--font-mono)" : "var(--font-ui)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)" }}>
            {world.genre}
          </span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 500, color: "var(--fg)", margin: 0, letterSpacing: "-0.01em" }}>{world.name}</h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg-secondary)", margin: 0, lineHeight: 1.5, flex: 1 }}>{world.tagline}</p>
        <div style={{ display: "flex", gap: 12, fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--fg-muted)", marginTop: 4 }}>
          <span>{world.eras} eras</span>
          <span>·</span>
          <span>{world.articles} articles</span>
          <span>·</span>
          <span>{world.ideas} ideas</span>
        </div>
      </div>
    </button>
  );
}

function NewWorldCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "1px dashed var(--border-strong)",
        borderRadius: "var(--radius-lg)",
        cursor: "pointer",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        color: "var(--fg-muted)",
        minHeight: 220,
        fontFamily: "var(--font-ui)",
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="plus" size={20} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--fg)", fontWeight: 500 }}>Start a new world</div>
        <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }}>A blank slate, named by you.</div>
      </div>
    </button>
  );
}

if (typeof window !== "undefined") { window.Dashboard = Dashboard; }
