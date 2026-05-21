/* IdeaInbox.jsx — capture and triage stray ideas */

const SAMPLE_IDEAS = [
  { id: "IDEA-091", title: "A city built on salt locks", note: "Tidal — the city floods twice an age. The lock-keepers' guild predates the dynasty.", glyph: "globe", color: "#7a2e2a", captured: "3 days ago", unfiled: true },
  { id: "IDEA-088", title: "Names that pass between siblings", note: "Surnames inherited diagonally, not down. The oldest gets the mother's mother's family name.", glyph: "user", color: "#f0b860", captured: "5 days ago", unfiled: true },
  { id: "IDEA-085", title: "A god of unfinished maps", note: "Worshipped by cartographers and liars. Shrines on every shore that hasn't been fully surveyed.", glyph: "compass", color: "#7fdbff", captured: "1 week ago", unfiled: true },
  { id: "IDEA-079", title: "Months named after dead astronomers", note: "The court astronomer renames the calendar after the last person who looked through her telescope.", glyph: "telescope", color: "#6ad6a3", captured: "2 weeks ago", unfiled: false, section: "Vethran" },
  { id: "IDEA-072", title: "A war fought entirely by letter", note: "Two houses, three years, twelve thousand pages. No casualties.", glyph: "scroll", color: "#a06a1d", captured: "3 weeks ago", unfiled: false, section: "Salt Wars" },
  { id: "IDEA-068", title: "Tide-driven libraries", note: "Books rotate between shore vaults and inland archives twice a year.", glyph: "book-2", color: "#7fdbff", captured: "a month ago", unfiled: true },
];

function IdeaInbox() {
  const [capturing, setCapturing] = React.useState(false);
  const [draft, setDraft] = React.useState({ title: "", note: "" });
  const [ideas, setIdeas] = React.useState(SAMPLE_IDEAS);

  const unfiled = ideas.filter((i) => i.unfiled);
  const filed = ideas.filter((i) => !i.unfiled);

  const onCapture = () => {
    if (!draft.title.trim()) return;
    setIdeas((prev) => [
      { id: `IDEA-${100 + prev.length}`, title: draft.title, note: draft.note, glyph: "star", color: "#7fdbff", captured: "just now", unfiled: true },
      ...prev,
    ]);
    setDraft({ title: "", note: "" });
    setCapturing(false);
  };

  return (
    <div style={{ padding: "32px 40px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)", fontWeight: 500, marginBottom: 8 }}>
            Idea inbox · {unfiled.length} unfiled
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, color: "var(--fg)" }}>
            Sparks
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-secondary)", margin: "8px 0 0", maxWidth: 56 + "ch" }}>
            Capture an idea fast. Slot it into a section later — or never. Each idea keeps its main picture, title, and a short note.
          </p>
        </div>
        <Button variant="primary" icon="plus" size="lg" onClick={() => setCapturing(true)}>
          Capture
        </Button>
      </div>

      {/* Capture composer */}
      {capturing && (
        <CaptureComposer
          draft={draft}
          onChange={setDraft}
          onCapture={onCapture}
          onCancel={() => { setCapturing(false); setDraft({ title: "", note: "" }); }}
        />
      )}

      {/* Unfiled */}
      <SectionHeader count={unfiled.length}>Unfiled</SectionHeader>
      <IdeaGrid ideas={unfiled} />

      {/* Filed */}
      {filed.length > 0 && (
        <>
          <SectionHeader count={filed.length} style={{ marginTop: 40 }}>Filed</SectionHeader>
          <IdeaGrid ideas={filed} />
        </>
      )}
    </div>
  );
}

function SectionHeader({ children, count, style = {} }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "0 0 12px",
      marginBottom: 14,
      borderBottom: "1px solid var(--border)",
      ...style,
    }}>
      <h3 style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        textTransform: "uppercase", letterSpacing: "0.16em",
        color: "var(--fg-muted)", fontWeight: 500, margin: 0,
      }}>
        {children}
      </h3>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{count}</span>
    </div>
  );
}

function IdeaGrid({ ideas }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
      {ideas.map((i) => <IdeaCard key={i.id} idea={i} />)}
    </div>
  );
}

function IdeaCard({ idea }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "var(--bg-hover)" : "var(--bg-elevated)",
        border: "1px solid " + (hover ? "var(--border-strong)" : "var(--border)"),
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "background 120ms, border-color 120ms",
        position: "relative",
      }}
    >
      {/* Main picture */}
      <div style={{
        height: 96,
        background: "var(--bg-sunken)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: idea.color, position: "relative",
        overflow: "hidden",
      }}>
        <Icon name={idea.glyph} size={32} />
        <span style={{
          position: "absolute", top: 8, right: 10,
          fontFamily: "var(--font-mono)", fontSize: 9,
          color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em",
        }}>{idea.id}</span>
      </div>
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--fg)", margin: 0, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
          {idea.title}
        </h4>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg-secondary)", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {idea.note}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>{idea.captured}</span>
          {idea.unfiled
            ? <Tag tone="warning">Unfiled</Tag>
            : <Tag tone="success">{idea.section}</Tag>}
        </div>
      </div>
    </div>
  );
}

function CaptureComposer({ draft, onChange, onCapture, onCancel }) {
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--accent)",
      borderRadius: "var(--radius-md)",
      padding: 20,
      marginBottom: 32,
      display: "flex",
      gap: 16,
      boxShadow: "0 0 24px var(--cyan-glow)",
    }}>
      <div style={{
        width: 88, height: 88, flexShrink: 0,
        background: "var(--bg-sunken)", border: "1px dashed var(--border-strong)",
        borderRadius: "var(--radius-sm)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
        color: "var(--fg-muted)",
      }}>
        <Icon name="photo" size={18} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>Picture</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          autoFocus
          placeholder="A spark — what is it?"
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
          style={{
            background: "transparent", border: "none", outline: "none",
            fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500,
            letterSpacing: "-0.01em", color: "var(--fg)", padding: 0,
            borderBottom: "1px dashed var(--accent)", paddingBottom: 6,
          }}
        />
        <textarea
          placeholder="A line or two. You can expand it later."
          value={draft.note}
          onChange={(e) => onChange({ ...draft, note: e.target.value })}
          rows={2}
          style={{
            background: "transparent", border: "none", outline: "none",
            fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg-secondary)",
            padding: 0, resize: "none", lineHeight: 1.5,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <Tag tone="accent">Unfiled</Tag>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Slot into a section later.
          </span>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" icon="device-floppy" onClick={onCapture}>Capture</Button>
        </div>
      </div>
    </div>
  );
}

if (typeof window !== "undefined") { window.IdeaInbox = IdeaInbox; }
