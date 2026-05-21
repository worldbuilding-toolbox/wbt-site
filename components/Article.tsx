"use client";
import React from "react";
import { Button, IconButton, Icon, Tag, Divider, Modal, Input, Field, Textarea, Select } from "./Primitives";
import {
  getArticles, saveArticles, createArticle,
  type World, type Article, type BodyBlock, type Attachment, type Fact,
} from "./store";

const KINDS = ["character", "place", "faction", "creature", "technology", "concept", "object", "other"];
const KIND_COLORS: Record<string, string> = {
  character: "#7a2e2a", place: "#f0b860", faction: "#7fdbff",
  creature: "#6ad6a3", technology: "#5a4be3", concept: "#8a91a3",
  object: "#a06a1d", other: "#3d485e",
};

const EXT_COLORS: Record<string, string> = {
  docx: "#2c6ddb", doc: "#2c6ddb", pdf: "#cc3a3a",
  pptx: "#d04b1d", ppt: "#d04b1d", kra: "#5a4be3",
  md: "#6ad6a3", txt: "#6ad6a3", xlsx: "#1a7a3c", png: "#a06a1d", jpg: "#a06a1d",
};

// Group articles by kind
function groupByKind(articles: Article[]) {
  const groups: Record<string, Article[]> = {};
  for (const a of articles) {
    if (!groups[a.kind]) groups[a.kind] = [];
    groups[a.kind].push(a);
  }
  return groups;
}

export function ArticleView({ world, searchQuery }: { world: World; searchQuery: string }) {
  const [articles, setArticles] = React.useState<Article[]>(() => getArticles(world.id));
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [filterQ, setFilterQ] = React.useState("");

  const reload = () => {
    const arts = getArticles(world.id);
    setArticles(arts);
    if (!arts.find((a) => a.id === activeId)) setActiveId(arts[0]?.id || null);
  };

  React.useEffect(() => {
    if (!activeId && articles.length) setActiveId(articles[0].id);
  }, []);

  const active = articles.find((a) => a.id === activeId) || null;
  const q = (filterQ || searchQuery).toLowerCase();
  const filtered = q ? articles.filter((a) => a.title.toLowerCase().includes(q) || a.kind.toLowerCase().includes(q)) : articles;
  const groups = groupByKind(filtered);

  const updateActive = (patch: Partial<Article>) => {
    if (!active) return;
    const updated = articles.map((a) => a.id === active.id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a);
    saveArticles(world.id, updated);
    setArticles(updated);
  };

  const handleCreate = (title: string, kind: string) => {
    createArticle(world.id, title, kind);
    reload();
    setShowCreate(false);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
      {/* Article list */}
      <aside style={{ width: 240, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--bg-sunken)", overflow: "auto" }}>
        <div style={{ padding: "12px 12px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
          <Icon name="search" size={13} style={{ color: "var(--fg-muted)" }} />
          <input
            placeholder="FILTER..."
            value={filterQ}
            onChange={(e) => setFilterQ(e.target.value)}
            style={{
              background: "transparent", border: "none", outline: "none",
              fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg)",
              textTransform: "uppercase", letterSpacing: "0.08em", flex: 1, minWidth: 0,
            }}
          />
          <IconButton icon="plus" label="New article" size={14} onClick={() => setShowCreate(true)} />
        </div>

        <div style={{ padding: "8px 6px" }}>
          {Object.keys(groups).length === 0 && (
            <div style={{ padding: "24px 12px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-muted)", textAlign: "center" }}>
              {articles.length === 0 ? "No articles yet." : "No matches."}
            </div>
          )}
          {Object.entries(groups).map(([kind, items]) => (
            <div key={kind} style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)", padding: "0 8px 6px" }}>
                {kind}s · {items.length}
              </div>
              {items.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setActiveId(a.id); setEditing(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "7px 10px",
                    background: a.id === activeId ? "var(--bg-hover)" : "transparent",
                    border: "none",
                    borderLeft: a.id === activeId ? "2px solid var(--accent)" : "2px solid transparent",
                    color: a.id === activeId ? "var(--fg)" : "var(--fg-secondary)",
                    cursor: "pointer", textAlign: "left",
                    fontFamily: "var(--font-sans)", fontSize: 13,
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.color || KIND_COLORS[a.kind] || "#555", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Article body */}
      {active ? (
        <ArticleEditor
          article={active}
          editing={editing}
          world={world}
          articles={articles}
          onToggleEdit={() => { setEditing(!editing); }}
          onUpdate={updateActive}
          onDelete={() => {
            const updated = articles.filter((a) => a.id !== active.id);
            saveArticles(world.id, updated);
            setArticles(updated);
            setActiveId(updated[0]?.id || null);
            setEditing(false);
          }}
        />
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
          <Icon name="book-open" size={40} style={{ color: "var(--fg-muted)" }} />
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--fg-secondary)" }}>No article selected</div>
          <Button variant="primary" icon="plus" onClick={() => setShowCreate(true)}>New article</Button>
        </div>
      )}

      {showCreate && (
        <CreateArticleModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

// ============================================================================
// Article editor
// ============================================================================

function ArticleEditor({ article, editing, world, articles, onToggleEdit, onUpdate, onDelete }: {
  article: Article; editing: boolean; world: World; articles: Article[];
  onToggleEdit: () => void; onUpdate: (p: Partial<Article>) => void; onDelete: () => void;
}) {
  const [showAddSection, setShowAddSection] = React.useState(false);
  const [showAddAttachment, setShowAddAttachment] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpdate({ imageUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const addBlock = (type: BodyBlock["type"]) => {
    let newBlock: BodyBlock;
    switch (type) {
      case "h2": newBlock = { type: "h2", text: "New heading" }; break;
      case "p": newBlock = { type: "p", text: "" }; break;
      case "quote": newBlock = { type: "quote", text: "" }; break;
      case "date": newBlock = { type: "date", label: "Date", value: "" }; break;
      case "conversion": newBlock = { type: "conversion", from: "", to: "", rate: "" }; break;
      default: newBlock = { type: "p", text: "" };
    }
    onUpdate({ body: [...article.body, newBlock] });
  };

  const updateBlock = (idx: number, patch: Partial<BodyBlock>) => {
    const updated = article.body.map((b, i) => i === idx ? { ...b, ...patch } as BodyBlock : b);
    onUpdate({ body: updated });
  };

  const removeBlock = (idx: number) => {
    onUpdate({ body: article.body.filter((_, i) => i !== idx) });
  };

  const addFact = () => {
    onUpdate({ facts: [...article.facts, { k: "Field", v: "" }] });
  };

  const updateFact = (idx: number, patch: Partial<Fact>) => {
    onUpdate({ facts: article.facts.map((f, i) => i === idx ? { ...f, ...patch } : f) });
  };

  const removeFact = (idx: number) => {
    onUpdate({ facts: article.facts.filter((_, i) => i !== idx) });
  };

  const addLink = (title: string) => {
    if (!article.links.includes(title)) onUpdate({ links: [...article.links, title] });
  };

  const removeLink = (title: string) => {
    onUpdate({ links: article.links.filter((l) => l !== title) });
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() || "file";
    const size = file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const att: Attachment = {
        id: crypto.randomUUID(),
        name: file.name,
        label: file.name,
        ext,
        size,
        dataUrl: ev.target?.result as string,
      };
      onUpdate({ attachments: [...article.attachments, att] });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 }}>
      {/* Toolbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 5, background: "var(--bg)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, padding: "10px 32px" }}>
        <Tag tone="accent">{article.kind}</Tag>
        <Tag tone="neutral">{article.id}</Tag>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {editing ? "Editing" : `Updated ${new Date(article.updatedAt).toLocaleDateString()}`}
        </span>
        <Divider vertical />
        {editing && (
          <Button variant="danger" size="sm" icon="trash" onClick={() => { if (confirm("Delete this article?")) onDelete(); }} />
        )}
        <Button
          variant={editing ? "primary" : "secondary"}
          icon={editing ? "device-floppy" : "pencil"}
          size="sm"
          onClick={onToggleEdit}
        >
          {editing ? "Save" : "Edit"}
        </Button>
        <IconButton icon="dots-vertical" label="More" />
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "40px 32px 96px", overflow: "auto" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Header: image + title */}
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            {/* Image */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 140, height: 140,
                background: article.imageUrl ? "transparent" : "var(--bg-elevated)",
                border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--fg-muted)",
              }}>
                {article.imageUrl ? (
                  <img src={article.imageUrl} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Icon name="photo" size={32} />
                )}
              </div>
              {editing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: "absolute", inset: 0,
                      background: "rgba(6,8,16,0.65)",
                      border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexDirection: "column", gap: 4, borderRadius: "var(--radius-md)",
                    }}
                  >
                    <Icon name="upload" size={18} style={{ color: "var(--fg)" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Replace</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                </>
              )}
            </div>

            {/* Title block */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {editing ? (
                <Input value={article.subtitle} onChange={(v) => onUpdate({ subtitle: v })} style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)", background: "transparent", border: "none", borderBottom: "1px solid var(--border)", borderRadius: 0, padding: "4px 0" }} />
              ) : (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)" }}>
                  {article.subtitle}
                </div>
              )}
              {editing ? (
                <input
                  value={article.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em",
                    background: "transparent", border: "none", outline: "none", color: "var(--fg)",
                    borderBottom: "1px dashed var(--accent)", paddingBottom: 4, width: "100%",
                  }}
                />
              ) : (
                <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--fg)", lineHeight: 1.05 }}>
                  {article.title}
                </h1>
              )}
              {editing ? (
                <Input
                  value={article.tagline}
                  onChange={(v) => onUpdate({ tagline: v })}
                  placeholder="One-line description..."
                  style={{ fontSize: 16, color: "var(--fg-secondary)", background: "transparent", border: "none", borderBottom: "1px solid var(--border)", borderRadius: 0, padding: "4px 0" }}
                />
              ) : article.tagline ? (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--fg-secondary)", lineHeight: 1.5, fontWeight: 300 }}>
                  {article.tagline}
                </p>
              ) : null}
            </div>
          </div>

          {/* Info box */}
          <div style={{ padding: "14px 18px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", position: "relative" }}>
            <div style={{ position: "absolute", top: 12, right: 14, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "0.14em" }}>
              Info box
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 20px", alignItems: "baseline" }}>
              {article.facts.map((f, i) => (
                <React.Fragment key={i}>
                  {editing ? (
                    <>
                      <input
                        value={f.k}
                        onChange={(e) => updateFact(i, { k: e.target.value })}
                        style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", background: "transparent", border: "none", outline: "none", width: 100 }}
                      />
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          value={f.v}
                          onChange={(e) => updateFact(i, { v: e.target.value })}
                          style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", background: "transparent", border: "none", outline: "none", flex: 1, borderBottom: "1px solid var(--border)" }}
                        />
                        <button onClick={() => removeFact(i)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: 0 }}>
                          <Icon name="x" size={12} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>{f.k}</span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)" }}>{f.v}</span>
                    </>
                  )}
                </React.Fragment>
              ))}
              {editing && (
                <>
                  <button onClick={addFact} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "left", padding: 0 }}>
                    + field
                  </button>
                  <span />
                </>
              )}
            </div>
          </div>

          {/* Body blocks */}
          {article.body.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {article.body.map((block, i) => (
                <BlockEditor key={i} block={block} editing={editing} onUpdate={(p) => updateBlock(i, p)} onDelete={() => removeBlock(i)} />
              ))}
            </div>
          )}

          {/* Attachments */}
          {(article.attachments.length > 0 || editing) && (
            <AttachmentsSection
              attachments={article.attachments}
              editing={editing}
              onRemove={(id) => onUpdate({ attachments: article.attachments.filter((a) => a.id !== id) })}
              onRename={(id, label) => onUpdate({ attachments: article.attachments.map((a) => a.id === id ? { ...a, label } : a) })}
              onAdd={handleFileAttach}
            />
          )}

          {/* Linked articles */}
          {(article.links.length > 0 || editing) && (
            <LinkedSection
              links={article.links}
              editing={editing}
              allArticles={articles.filter((a) => a.id !== article.id)}
              onAdd={addLink}
              onRemove={removeLink}
            />
          )}

          {/* Add section rail */}
          {editing && (
            <AddSectionRail onAdd={addBlock} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Block editor
// ============================================================================

function BlockEditor({ block, editing, onUpdate, onDelete }: {
  block: BodyBlock; editing: boolean;
  onUpdate: (p: Partial<BodyBlock>) => void;
  onDelete: () => void;
}) {
  if (block.type === "h2") return editing ? (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <input
        value={block.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, color: "var(--fg)", background: "transparent", border: "none", outline: "none", flex: 1, borderBottom: "1px solid var(--border)", paddingBottom: 4 }}
      />
      <button onClick={onDelete} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: 4, marginTop: 4 }}><Icon name="trash" size={14} /></button>
    </div>
  ) : (
    <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em", marginTop: 8 }}>{block.text}</h2>
  );

  if (block.type === "p") return editing ? (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <textarea
        value={block.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        rows={3}
        placeholder="Paragraph text..."
        style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7, color: "var(--fg)", background: "var(--bg-elevated)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "8px 10px", flex: 1, resize: "vertical", outline: "none" }}
      />
      <button onClick={onDelete} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: 4, marginTop: 4 }}><Icon name="trash" size={14} /></button>
    </div>
  ) : (
    <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7, color: "var(--fg)" }}>{block.text}</p>
  );

  if (block.type === "quote") return editing ? (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <div style={{ flex: 1, borderLeft: "2px solid var(--accent)", paddingLeft: 16 }}>
        <textarea
          value={block.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={2}
          placeholder="Quote text..."
          style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontStyle: "italic", color: "var(--fg-secondary)", background: "transparent", border: "none", outline: "none", width: "100%", resize: "vertical" }}
        />
        <input
          value={block.cite || ""}
          onChange={(e) => onUpdate({ cite: e.target.value })}
          placeholder="— Attribution (optional)"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", background: "transparent", border: "none", outline: "none", width: "100%", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}
        />
      </div>
      <button onClick={onDelete} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: 4, marginTop: 4 }}><Icon name="trash" size={14} /></button>
    </div>
  ) : (
    <blockquote style={{ margin: 0, padding: "8px 0 8px 16px", borderLeft: "2px solid var(--accent)", fontFamily: "var(--font-serif)", fontSize: 16, fontStyle: "italic", color: "var(--fg-secondary)", lineHeight: 1.6 }}>
      {block.text}
      {block.cite && <footer style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 6, fontStyle: "normal" }}>— {block.cite}</footer>}
    </blockquote>
  );

  if (block.type === "date") return editing ? (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ flex: 1, display: "flex", gap: 8, padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
        <Icon name="calendar" size={14} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />
        <input value={block.label} onChange={(e) => onUpdate({ label: e.target.value })} placeholder="Label" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", background: "transparent", border: "none", outline: "none", width: 80 }} />
        <input value={block.value} onChange={(e) => onUpdate({ value: e.target.value })} placeholder="Date value" style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", background: "transparent", border: "none", outline: "none", flex: 1 }} />
      </div>
      <button onClick={onDelete} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: 4 }}><Icon name="trash" size={14} /></button>
    </div>
  ) : (
    <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
      <Icon name="calendar" size={14} style={{ color: "var(--accent)" }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{block.label}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)" }}>{block.value}</span>
    </div>
  );

  if (block.type === "conversion") return editing ? (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", alignItems: "center" }}>
        <input value={block.from} onChange={(e) => onUpdate({ from: e.target.value })} placeholder="From unit" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)", background: "transparent", border: "none", outline: "none", borderBottom: "1px solid var(--border)" }} />
        <div style={{ textAlign: "center" }}>
          <input value={block.rate} onChange={(e) => onUpdate({ rate: e.target.value })} placeholder="1 =" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", background: "transparent", border: "none", outline: "none", textAlign: "center", width: 60 }} />
        </div>
        <input value={block.to} onChange={(e) => onUpdate({ to: e.target.value })} placeholder="To unit" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)", background: "transparent", border: "none", outline: "none", borderBottom: "1px solid var(--border)" }} />
      </div>
      <button onClick={onDelete} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: 4 }}><Icon name="trash" size={14} /></button>
    </div>
  ) : (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", alignItems: "center" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)" }}>{block.from}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", textAlign: "center" }}>{block.rate}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)" }}>{block.to}</span>
    </div>
  );

  return null;
}

// ============================================================================
// Add section rail
// ============================================================================

function AddSectionRail({ onAdd }: { onAdd: (type: BodyBlock["type"]) => void }) {
  const opts: { type: BodyBlock["type"]; icon: string; label: string }[] = [
    { type: "h2", icon: "hash", label: "Subtitle" },
    { type: "p", icon: "file-description", label: "Paragraph" },
    { type: "quote", icon: "scroll", label: "Quote" },
    { type: "date", icon: "calendar", label: "Date" },
    { type: "conversion", icon: "chart-arcs", label: "Conversion" },
  ];
  return (
    <div style={{ padding: "14px 18px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "0.14em", marginRight: 4 }}>Add section</span>
      {opts.map((o) => (
        <button
          key={o.type}
          onClick={() => onAdd(o.type)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 10px", border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)", background: "transparent",
            fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg)",
            cursor: "pointer",
          }}
        >
          <Icon name={o.icon} size={12} style={{ color: "var(--fg-muted)" }} />
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Attachments
// ============================================================================

function AttachmentsSection({ attachments, editing, onRemove, onRename, onAdd }: {
  attachments: Attachment[]; editing: boolean;
  onRemove: (id: string) => void;
  onRename: (id: string, label: string) => void;
  onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
        <Icon name="paperclip" size={12} />
        Attachments · {attachments.length}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {attachments.map((a) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
            <FileTile ext={a.ext} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {editing ? (
                <input
                  value={a.label}
                  onChange={(e) => onRename(a.id, e.target.value)}
                  style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", fontWeight: 500, background: "transparent", border: "none", outline: "none", width: "100%", borderBottom: "1px solid var(--border)" }}
                />
              ) : (
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", fontWeight: 500 }}>{a.label}</div>
              )}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{a.name} · {a.size}</div>
            </div>
            {a.dataUrl && (
              <a href={a.dataUrl} download={a.name} style={{ display: "flex" }}>
                <IconButton icon="external-link" label="Download" size={14} />
              </a>
            )}
            {editing && (
              <IconButton icon="trash" label="Remove" size={14} onClick={() => onRemove(a.id)} />
            )}
          </div>
        ))}
        {editing && (
          <button
            onClick={() => fileRef.current?.click()}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--fg-muted)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", justifyContent: "center" }}
          >
            <Icon name="upload" size={14} /> Drop a file, or click to browse
          </button>
        )}
        <input ref={fileRef} type="file" style={{ display: "none" }} onChange={onAdd} />
      </div>
    </div>
  );
}

function FileTile({ ext }: { ext: string }) {
  const c = EXT_COLORS[ext] || "var(--steel-400)";
  return (
    <div style={{ width: 40, height: 40, flexShrink: 0, background: "var(--bg-sunken)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 4 }}>
      <Icon name="file" size={20} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "var(--fg-muted)" }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: c, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1, position: "relative" }}>
        {ext.slice(0, 5)}
      </span>
    </div>
  );
}

// ============================================================================
// Linked articles
// ============================================================================

function LinkedSection({ links, editing, allArticles, onAdd, onRemove }: {
  links: string[]; editing: boolean; allArticles: Article[];
  onAdd: (title: string) => void; onRemove: (title: string) => void;
}) {
  const [showPicker, setShowPicker] = React.useState(false);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
        <Icon name="link" size={12} />
        Linked · {links.length}
        {editing && <button onClick={() => setShowPicker(!showPicker)} style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", color: "var(--accent)" }}><Icon name="plus" size={13} /></button>}
      </div>
      {showPicker && editing && (
        <div style={{ marginBottom: 8, padding: "10px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {allArticles.filter((a) => !links.includes(a.title)).map((a) => (
            <button key={a.id} onClick={() => { onAdd(a.title); }} style={{ padding: "4px 8px", background: "transparent", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg)" }}>
              {a.title}
            </button>
          ))}
          {allArticles.filter((a) => !links.includes(a.title)).length === 0 && (
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-muted)" }}>No other articles to link.</span>
          )}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {links.map((l) => (
          <div key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)" }}>
            <Icon name="arrow-up-right" size={12} style={{ color: "var(--accent)" }} />
            {l}
            {editing && <button onClick={() => onRemove(l)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: 0, marginLeft: 4, display: "flex" }}><Icon name="x" size={11} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Create article modal
// ============================================================================

function CreateArticleModal({ onClose, onCreate }: { onClose: () => void; onCreate: (title: string, kind: string) => void }) {
  const [title, setTitle] = React.useState("");
  const [kind, setKind] = React.useState("character");

  return (
    <Modal title="New article" onClose={onClose} width={420}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Title">
          <Input autoFocus placeholder="e.g. Kael of Vethran" value={title} onChange={setTitle} />
        </Field>
        <Field label="Type">
          <Select
            value={kind}
            onChange={setKind}
            options={KINDS.map((k) => ({ value: k, label: k.charAt(0).toUpperCase() + k.slice(1) }))}
          />
        </Field>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="plus" onClick={() => { if (title.trim()) onCreate(title.trim(), kind); }}>Create</Button>
        </div>
      </div>
    </Modal>
  );
}
