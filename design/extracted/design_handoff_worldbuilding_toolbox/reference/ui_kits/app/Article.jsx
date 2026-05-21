/* Article.jsx — view + edit mode for an article (a "world entity") */

function Article() {
  const [editing, setEditing] = React.useState(false);
  const [doc, setDoc] = React.useState(SAMPLE_ARTICLE);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
      <ArticleList active={doc.id} onSelect={(a) => setDoc(a)} />

      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Article toolbar */}
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: "var(--bg)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, padding: "12px 36px" }}>
          <Tag tone="accent">{doc.kind.toUpperCase()}</Tag>
          <Tag tone="neutral">{doc.id}</Tag>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Edited {doc.updated}
          </span>
          <Divider vertical />
          <IconButton icon="eye" label="Preview" variant="outlined" />
          <Button
            variant={editing ? "primary" : "secondary"}
            icon={editing ? "device-floppy" : "pencil"}
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Save" : "Edit"}
          </Button>
          <IconButton icon="dots-vertical" label="More" />
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "48px 36px 96px", overflow: "auto" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
            <ArticleHeader doc={doc} editing={editing} />
            <InfoBox doc={doc} editing={editing} />
            <ArticleBody doc={doc} editing={editing} />
            <Attachments doc={doc} editing={editing} />
            <LinkedArticles doc={doc} editing={editing} />
            {editing && <AddSectionRail />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Article list (left pane) ---------- */

function ArticleList({ active, onSelect }) {
  const sections = [
    { label: "Characters", items: ARTICLES.filter((a) => a.kind === "character") },
    { label: "Places", items: ARTICLES.filter((a) => a.kind === "place") },
    { label: "Factions", items: ARTICLES.filter((a) => a.kind === "faction") },
  ];
  return (
    <aside style={{ width: 240, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--bg-sunken)", overflow: "auto" }}>
      <div style={{ padding: "16px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="search" size={14} style={{ color: "var(--fg-muted)" }} />
        <input
          placeholder="FILTER..."
          style={{
            background: "transparent", border: "none", outline: "none",
            fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg)",
            textTransform: "uppercase", letterSpacing: "0.08em",
            flex: 1, minWidth: 0,
          }}
        />
        <IconButton icon="plus" label="New article" size={14} />
      </div>
      <div style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 14 }}>
        {sections.map((s) => (
          <div key={s.label}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              textTransform: "uppercase", letterSpacing: "0.14em",
              color: "var(--fg-muted)", padding: "0 8px 6px",
            }}>
              {s.label} · {s.items.length}
            </div>
            {s.items.map((a) => (
              <button
                key={a.id}
                onClick={() => onSelect(a)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "7px 10px",
                  background: a.id === active ? "var(--bg-hover)" : "transparent",
                  border: "none",
                  borderLeft: a.id === active ? "2px solid var(--accent)" : "2px solid transparent",
                  color: a.id === active ? "var(--fg)" : "var(--fg-secondary)",
                  cursor: "pointer", textAlign: "left",
                  fontFamily: "var(--font-sans)", fontSize: 13,
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ---------- Header (title + main image) ---------- */

function ArticleHeader({ doc, editing }) {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{
        width: 140, height: 140, flexShrink: 0,
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--fg-muted)",
        position: "relative",
        overflow: "hidden",
      }}>
        {doc.imageGlyph ? (
          <Icon name={doc.imageGlyph} size={48} />
        ) : (
          <Icon name="photo" size={32} />
        )}
        {editing && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(6, 8, 16, 0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.1em",
            cursor: "pointer",
          }}>
            Replace
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: "var(--accent)", fontWeight: 500,
        }}>
          {doc.subtitle}
        </div>
        {editing ? (
          <input
            value={doc.title}
            onChange={() => {}}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40, fontWeight: 500, letterSpacing: "-0.02em",
              background: "transparent", border: "none", outline: "none",
              color: "var(--fg)", padding: 0, lineHeight: 1.05,
              borderBottom: "1px dashed var(--accent)",
            }}
          />
        ) : (
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.05, color: "var(--fg)" }}>
            {doc.title}
          </h1>
        )}
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "var(--fg-secondary)", margin: 0, lineHeight: 1.5, fontWeight: 300 }}>
          {doc.tagline}
        </p>
      </div>
    </div>
  );
}

/* ---------- Info box (facts table) ---------- */

function InfoBox({ doc, editing }) {
  return (
    <div style={{
      padding: "16px 20px",
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 12, right: 16,
        fontFamily: "var(--font-mono)", fontSize: 10,
        color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "0.14em",
      }}>
        Info box
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px", fontFamily: "var(--font-sans)", fontSize: 14, alignItems: "baseline" }}>
        {doc.facts.map((f) => (
          <React.Fragment key={f.k}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em",
              whiteSpace: "nowrap",
            }}>
              {f.k}
            </span>
            <span style={{ color: "var(--fg)" }}>
              {f.linked ? <a href="#" style={{ color: "var(--cyan)", textDecoration: "none" }}>{f.v}</a> : f.v}
            </span>
          </React.Fragment>
        ))}
        {editing && (
          <>
            <span style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>+ field</span>
            <input placeholder="Add a fact..." style={{ background: "transparent", border: "none", outline: "none", color: "var(--fg)", fontFamily: "var(--font-sans)", fontSize: 13 }} />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Body ---------- */

function ArticleBody({ doc, editing }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {doc.body.map((block, i) => {
        if (block.type === "h2") return (
          <h2 key={i} style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 500, color: "var(--fg)", margin: "8px 0 0", letterSpacing: "-0.01em" }}>{block.text}</h2>
        );
        if (block.type === "p") return (
          <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.7, color: "var(--fg)", margin: 0 }} dangerouslySetInnerHTML={{ __html: block.text }} />
        );
        if (block.type === "quote") return (
          <blockquote key={i} style={{
            margin: 0,
            padding: "10px 0 10px 20px",
            borderLeft: "2px solid var(--accent)",
            fontFamily: "var(--font-serif)",
            fontSize: 17,
            color: "var(--fg-secondary)",
            fontStyle: "italic",
            lineHeight: 1.55,
          }}>
            {block.text}
            {block.cite && <footer style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 8, fontStyle: "normal" }}>— {block.cite}</footer>}
          </blockquote>
        );
        return null;
      })}
      {editing && (
        <button style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "10px 14px", border: "1px dashed var(--border-strong)",
          borderRadius: "var(--radius-md)", background: "transparent",
          color: "var(--fg-muted)", cursor: "pointer",
          fontFamily: "var(--font-mono)", fontSize: 11,
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          <Icon name="plus" size={14} /> Add paragraph
        </button>
      )}
    </div>
  );
}

/* ---------- Attachments ---------- */

function Attachments({ doc, editing }) {
  if (!doc.attachments?.length && !editing) return null;
  return (
    <div>
      <SectionLabel icon="paperclip">Attachments · {doc.attachments.length}</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
        {doc.attachments.map((a) => (
          <div key={a.name} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          }}>
            <FileTile ext={a.ext} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", fontWeight: 500, lineHeight: 1.3 }}>{a.label || a.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{a.name} · {a.size}</div>
            </div>
            {editing && (
              <button style={{
                fontFamily: "var(--font-mono)", fontSize: 10, padding: "4px 8px",
                background: "transparent", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", color: "var(--fg-muted)",
                textTransform: "uppercase", letterSpacing: "0.1em",
                cursor: "pointer",
              }}>
                Rename link
              </button>
            )}
            <IconButton icon="external-link" label="Open" size={14} />
          </div>
        ))}
        {editing && (
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", border: "1px dashed var(--border-strong)",
            borderRadius: "var(--radius-md)", background: "transparent",
            color: "var(--fg-muted)", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: 11,
            textTransform: "uppercase", letterSpacing: "0.1em", justifyContent: "center",
          }}>
            <Icon name="upload" size={14} /> Drop a file, or browse
          </button>
        )}
      </div>
    </div>
  );
}

function FileTile({ ext }) {
  const colorMap = { docx: "#2c6ddb", pdf: "#cc3a3a", pptx: "#d04b1d", kra: "#5a4be3", md: "#6ad6a3" };
  const c = colorMap[ext] || "var(--steel-400)";
  return (
    <div style={{
      width: 40, height: 40, flexShrink: 0,
      background: "var(--bg-sunken)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)",
      position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "flex-end",
      padding: 4,
    }}>
      <Icon name="file" size={20} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "var(--fg-muted)" }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: c, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1 }}>
        {ext}
      </span>
    </div>
  );
}

/* ---------- Linked articles ---------- */

function LinkedArticles({ doc, editing }) {
  if (!doc.links?.length && !editing) return null;
  return (
    <div>
      <SectionLabel icon="link">Linked · {doc.links.length}</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
        {doc.links.map((l) => (
          <a key={l} href="#" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 10px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-sans)", fontSize: 13,
            color: "var(--fg)", textDecoration: "none",
          }}>
            <Icon name="arrow-up-right" size={12} style={{ color: "var(--accent)" }} />
            {l}
          </a>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ icon, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      paddingBottom: 8, borderBottom: "1px solid var(--border)",
      fontFamily: "var(--font-mono)", fontSize: 11,
      color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em",
    }}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </div>
  );
}

/* ---------- Add section rail ---------- */

function AddSectionRail() {
  const opts = [
    { i: "hash", l: "Subtitle" },
    { i: "file-description", l: "Paragraph" },
    { i: "calendar", l: "Date" },
    { i: "link", l: "Linked article" },
    { i: "photo", l: "Image" },
    { i: "paperclip", l: "Attachment" },
  ];
  return (
    <div style={{
      padding: "16px 20px",
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
    }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "0.14em", marginRight: 6 }}>Add section</span>
      {opts.map((o) => (
        <button key={o.l} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 10px", border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-sm)", background: "transparent",
          fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg)",
          cursor: "pointer",
        }}>
          <Icon name={o.i} size={12} style={{ color: "var(--fg-muted)" }} />
          {o.l}
        </button>
      ))}
    </div>
  );
}

/* ---------- Sample data ---------- */

const ARTICLES = [
  { id: "ART-001", title: "Cael of Vethran", kind: "character", color: "#7a2e2a" },
  { id: "ART-014", title: "Erathine Dynasty", kind: "faction", color: "#7fdbff" },
  { id: "ART-022", title: "House of Salt", kind: "faction", color: "#6ad6a3" },
  { id: "ART-007", title: "Vethran-by-the-Salt", kind: "place", color: "#f0b860" },
  { id: "ART-031", title: "The Salt Locks", kind: "place", color: "#a06a1d" },
  { id: "ART-018", title: "Heru-the-Quiet", kind: "character", color: "#8a91a3" },
];

const SAMPLE_ARTICLE = {
  id: "ART-001",
  title: "Cael of Vethran",
  subtitle: "Character · 312–388 SA",
  tagline: "The last archivist of the Salt Court. Kept ledgers in three scripts and signed every page.",
  kind: "character",
  imageGlyph: "user-circle",
  updated: "2 days ago",
  facts: [
    { k: "Born", v: "312 SA" },
    { k: "Died", v: "388 SA · Vethran" },
    { k: "House", v: "Vethran", linked: true },
    { k: "Tongue", v: "Old Salt · Coastal · River" },
    { k: "Office", v: "Archivist of the Salt Court" },
  ],
  body: [
    { type: "h2", text: "Early years" },
    { type: "p", text: "Cael was born in Vethran the year the second tower came down, to a lock-keeper's family that had served the court for six generations. By twelve she could write in <em>Old Salt</em> and the coastal hand; by fifteen she had taught herself the river script from a single donated codex." },
    { type: "p", text: "When the Salt Wars opened in 412, the archive was already her work to keep. She refused to burn its second copy. Her ledgers are why we have any clean record of the early period of the conflict." },
    { type: "h2", text: "The Codex begun" },
    { type: "p", text: "In her later years she began the <em>Codex of the Three Tongues</em>, a comparative archive she would not live to finish. Her great-niece continued it for another forty years." },
    { type: "quote", text: "I am not a historian. I am a clerk. The difference matters.", cite: "Cael, ledger entry, 372 SA" },
  ],
  attachments: [
    { name: "ledger-372.docx", label: "Cael's 372 SA ledger (transcription)", ext: "docx", size: "84 KB" },
    { name: "salt-court-portrait.kra", label: "Sketch — Salt Court interior", ext: "kra", size: "1.2 MB" },
    { name: "three-tongues-outline.pptx", ext: "pptx", size: "412 KB" },
  ],
  links: ["Erathine Dynasty", "House of Salt", "The Salt Locks", "Heru-the-Quiet", "Codex of the Three Tongues"],
};

if (typeof window !== "undefined") { window.Article = Article; }
