/* Help.jsx — help library: category sidebar + article view */

const HELP_CATS = [
  { label: "Getting started", icon: "compass", items: [
    { id: "h-1", title: "Start your first world" },
    { id: "h-2", title: "Eras, ages, cycles — name your time" },
    { id: "h-3", title: "Capture an idea before it evaporates" },
  ]},
  { label: "Designing worlds", icon: "planet", items: [
    { id: "h-4", title: "How to design a planet" },
    { id: "h-5", title: "How to design a creature" },
    { id: "h-6", title: "How to design a faction" },
    { id: "h-7", title: "How to design a language (a primer)" },
  ]},
  { label: "Calendars & time", icon: "calendar", items: [
    { id: "h-8", title: "Custom calendars without losing your mind" },
    { id: "h-9", title: "Era conversion rates" },
  ]},
  { label: "Files & uploads", icon: "paperclip", items: [
    { id: "h-10", title: "Attach Word, PowerPoint, Krita" },
    { id: "h-11", title: "Rename what a link says" },
  ]},
];

function Help() {
  const [active, setActive] = React.useState("h-4");
  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
      <HelpSidebar active={active} onSelect={setActive} />
      <div style={{ flex: 1, overflow: "auto" }}>
        <HelpArticle id={active} />
      </div>
    </div>
  );
}

function HelpSidebar({ active, onSelect }) {
  return (
    <aside style={{ width: 280, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--bg-sunken)", overflow: "auto" }}>
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 6 }}>
          Library
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500, color: "var(--fg)", margin: 0, letterSpacing: "-0.01em" }}>Help & how-to</h3>
      </div>
      <div style={{ padding: "12px 8px" }}>
        {HELP_CATS.map((c) => (
          <div key={c.label} style={{ marginBottom: 14 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 10px",
              fontFamily: "var(--font-mono)", fontSize: 10,
              color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em",
            }}>
              <Icon name={c.icon} size={12} />
              {c.label}
            </div>
            {c.items.map((it) => (
              <button
                key={it.id}
                onClick={() => onSelect(it.id)}
                style={{
                  display: "flex", width: "100%", padding: "7px 12px 7px 28px",
                  background: it.id === active ? "var(--bg-hover)" : "transparent",
                  border: "none",
                  borderLeft: it.id === active ? "2px solid var(--accent)" : "2px solid transparent",
                  color: it.id === active ? "var(--fg)" : "var(--fg-secondary)",
                  cursor: "pointer", textAlign: "left",
                  fontFamily: "var(--font-sans)", fontSize: 13,
                  lineHeight: 1.4,
                }}
              >
                {it.title}
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

function HelpArticle({ id }) {
  const article = HELP_ARTICLES[id] || HELP_ARTICLES["h-4"];
  return (
    <article style={{ padding: "48px 56px 96px", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)" }}>
        <Icon name={article.icon} size={12} style={{ color: "var(--accent)" }} />
        {article.category}
        <span style={{ color: "var(--space-600)" }}>·</span>
        <span>{article.minutes} min read</span>
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, color: "var(--fg)", lineHeight: 1.1 }}>
        {article.title}
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 19, color: "var(--fg-secondary)", marginTop: 14, lineHeight: 1.5, fontWeight: 300 }}>
        {article.lede}
      </p>

      {/* Modifiable template banner */}
      <div style={{
        marginTop: 32,
        padding: "12px 16px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Icon name="settings" size={16} style={{ color: "var(--accent)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", fontWeight: 500 }}>This template is editable</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>
            Copy it to your world, then change the sections to fit how your world works.
          </div>
        </div>
        <Button variant="secondary" size="sm" icon="copy">Copy to world</Button>
      </div>

      {/* Body */}
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
        {article.body.map((b, i) => {
          if (b.type === "h2") return <h2 key={i} style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 500, color: "var(--fg)", margin: "16px 0 0", letterSpacing: "-0.01em" }}>{b.text}</h2>;
          if (b.type === "p") return <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.7, color: "var(--fg)", margin: 0 }}>{b.text}</p>;
          if (b.type === "list") return (
            <ul key={i} style={{ margin: 0, paddingLeft: 22, fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.7, color: "var(--fg)" }}>
              {b.items.map((it, j) => <li key={j} style={{ marginBottom: 4 }}>{it}</li>)}
            </ul>
          );
          if (b.type === "video") return <VideoEmbed key={i} title={b.title} source={b.source} />;
          if (b.type === "image") return (
            <figure key={i} style={{ margin: "12px 0", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-elevated)" }}>
              <div style={{
                aspectRatio: "16/9",
                background: "var(--bg-sunken)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--fg-muted)",
              }}>
                <Icon name="photo" size={28} />
              </div>
              <figcaption style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Fig — {b.caption}
              </figcaption>
            </figure>
          );
          return null;
        })}
      </div>

      {/* Footer next steps */}
      <div style={{
        marginTop: 56, padding: "20px 24px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
      }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>
          Try next
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {article.next.map((n) => (
            <a key={n} href="#" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", background: "var(--bg)",
              border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
              color: "var(--fg)", textDecoration: "none",
              fontFamily: "var(--font-sans)", fontSize: 14,
            }}>
              <span>{n}</span>
              <Icon name="arrow-right" size={14} style={{ color: "var(--accent)" }} />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function VideoEmbed({ title, source }) {
  return (
    <div style={{ margin: "12px 0", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-elevated)" }}>
      <div style={{
        aspectRatio: "16/9",
        background: "linear-gradient(180deg, #11151d 0%, #060810 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          border: "2px solid var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--accent)",
          boxShadow: "0 0 24px var(--cyan-glow)",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 14, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{source}</div>
      </div>
      <div style={{ padding: "10px 14px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)" }}>{title}</div>
    </div>
  );
}

const HELP_ARTICLES = {
  "h-4": {
    title: "How to design a planet",
    lede: "A starting template for building a world's central body. Modify the sections to fit how your world works — drop what doesn't apply, add what does.",
    category: "Designing worlds",
    icon: "planet",
    minutes: 8,
    body: [
      { type: "h2", text: "Start with one anchor" },
      { type: "p", text: "Pick one thing about the planet that everything else hangs on. A binary sun. A tidal lock. A ring system. A near-extinction event. The anchor decides what's possible for everything else." },
      { type: "h2", text: "The seven default sections" },
      { type: "list", items: [
        "Astronomical context — star, orbit, satellites, year, day",
        "Geography — continents, oceans, climate bands",
        "Life — kingdoms, dominant kinds, what's missing",
        "Civilizations — number, age, where they meet",
        "History — three eras at most for the rough cut",
        "Conflicts — what people are willing to die over",
        "Strangeness — the one thing that's not like Earth",
      ]},
      { type: "video", title: "What 'tidal lock' actually means for storytelling", source: "PBS Space Time · 12:14" },
      { type: "h2", text: "What to leave blank" },
      { type: "p", text: "Plenty. A planet is not an encyclopedia. Build only what you need for the next chapter. The Toolbox will keep your blank sections forever — they're never broken, they're just not filled in yet." },
      { type: "image", caption: "Default planet template, with three sections collapsed and one expanded" },
      { type: "h2", text: "When you outgrow the template" },
      { type: "p", text: "You will. The template is a starting hand, not a contract. Right-click any section to remove it, or add your own from the section rail at the bottom of the editor." },
    ],
    next: [
      "How to design a creature",
      "How to design a faction",
      "Custom calendars without losing your mind",
    ],
  },
};
// Fallback for any other id — reuses the planet article
Object.keys(HELP_ARTICLES).length === 1;
HELP_CATS.forEach((c) => c.items.forEach((it) => {
  if (!HELP_ARTICLES[it.id]) HELP_ARTICLES[it.id] = { ...HELP_ARTICLES["h-4"], title: it.title, category: c.label, icon: c.icon };
}));

if (typeof window !== "undefined") { window.Help = Help; }
