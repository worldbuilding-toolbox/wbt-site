"use client";
import React from "react";
import { Button, IconButton, Icon, Tag, Modal, Input, Field } from "./Primitives";
import { useIsMobile } from "./hooks";
import {
  getIdeas, saveIdeas, createIdea, getArticles,
  softDeleteIdea, restoreLast,
  type World, type Idea,
} from "./store";
import { useToast } from "./Toast";

export function IdeaInbox({ world, searchQuery }: { world: World; searchQuery: string }) {
  const [ideas, setIdeas] = React.useState<Idea[]>(() => getIdeas(world.id));
  const [capturing, setCapturing] = React.useState(false);
  const [draft, setDraft] = React.useState({ title: "", note: "", imageUrl: "" });
  const [selectedIdea, setSelectedIdea] = React.useState<Idea | null>(null);
  const [showFileIdea, setShowFileIdea] = React.useState<Idea | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const toast = useToast();

  const reload = () => setIdeas(getIdeas(world.id));

  const q = searchQuery.toLowerCase();
  const filtered = q ? ideas.filter((i) => i.title.toLowerCase().includes(q) || i.note.toLowerCase().includes(q)) : ideas;
  const unfiled = filtered.filter((i) => !i.filed);
  const filed = filtered.filter((i) => i.filed);

  const handleCapture = () => {
    if (!draft.title.trim()) return;
    createIdea(world.id, draft.title.trim(), draft.note, draft.imageUrl || undefined);
    setDraft({ title: "", note: "", imageUrl: "" });
    setCapturing(false);
    reload();
  };

  const handleFile = (idea: Idea, section: string) => {
    const updated = ideas.map((i) => i.id === idea.id ? { ...i, filed: true, section } : i);
    saveIdeas(world.id, updated);
    setIdeas(updated);
    setShowFileIdea(null);
    if (selectedIdea?.id === idea.id) setSelectedIdea({ ...idea, filed: true, section });
  };

  const handleDelete = (id: string) => {
    const deleted = ideas.find((i) => i.id === id);
    const trashId = softDeleteIdea(world.id, id);
    setIdeas(ideas.filter((i) => i.id !== id));
    if (selectedIdea?.id === id) setSelectedIdea(null);
    if (trashId && deleted) {
      toast.push({
        message: `Deleted idea "${deleted.title}".`,
        durationMs: 8000,
        action: {
          label: "Undo",
          onClick: () => {
            if (restoreLast(trashId).ok) {
              reload();
              toast.push({ message: `Restored "${deleted.title}".`, tone: "success" });
            }
          },
        },
      });
    }
  };

  const handleUnfile = (idea: Idea) => {
    const updated = ideas.map((i) => i.id === idea.id ? { ...i, filed: false, section: undefined } : i);
    saveIdeas(world.id, updated);
    setIdeas(updated);
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDraft((d) => ({ ...d, imageUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const topBarHeight = isMobile ? 52 : 56;

  return (
    <div style={{ display: "flex", height: `calc(100vh - ${topBarHeight}px)` }}>
      {/* Main inbox */}
      <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "20px 16px 64px" : "32px 40px 80px" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "flex-end",
          justifyContent: "space-between",
          gap: isMobile ? 14 : 0,
          marginBottom: isMobile ? 20 : 28,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)", fontWeight: 500, marginBottom: 8 }}>
              Idea inbox · {unfiled.length} unfiled
            </div>
            <h1 style={{ fontFamily: "var(--font-sans)", fontSize: isMobile ? 24 : 30, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--fg)" }}>
              Sparks
            </h1>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: isMobile ? 14 : 15, color: "var(--fg-secondary)", marginTop: 8, maxWidth: "56ch", lineHeight: 1.6 }}>
              Capture an idea fast. Each idea keeps its main picture, title, and a short note. Slot it into a section later — or never.
            </p>
          </div>
          <Button
            variant="primary"
            icon="plus"
            size={isMobile ? "md" : "lg"}
            onClick={() => setCapturing(true)}
            style={isMobile ? { alignSelf: "stretch", justifyContent: "center" } : undefined}
          >
            Capture
          </Button>
        </div>

        {/* Capture composer */}
        {capturing && (
          <CaptureComposer
            draft={draft}
            onChange={setDraft}
            onCapture={handleCapture}
            onCancel={() => { setCapturing(false); setDraft({ title: "", note: "", imageUrl: "" }); }}
            onImageClick={() => fileRef.current?.click()}
          />
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageCapture} />

        {/* Unfiled */}
        {unfiled.length > 0 && (
          <>
            <SectionDivider label="Unfiled" count={unfiled.length} />
            <IdeaGrid ideas={unfiled} onSelect={setSelectedIdea} selected={selectedIdea} onFile={(i) => setShowFileIdea(i)} onDelete={handleDelete} />
          </>
        )}

        {/* Filed */}
        {filed.length > 0 && (
          <>
            <SectionDivider label="Filed" count={filed.length} style={{ marginTop: 40 }} />
            <IdeaGrid ideas={filed} onSelect={setSelectedIdea} selected={selectedIdea} onFile={(i) => setShowFileIdea(i)} onDelete={handleDelete} onUnfile={handleUnfile} />
          </>
        )}

        {ideas.length === 0 && !capturing && (
          <div style={{ textAlign: "center", paddingTop: 64 }}>
            <Icon name="star" size={40} style={{ color: "var(--fg-muted)", marginBottom: 16 }} />
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 500, color: "var(--fg)", marginBottom: 8 }}>No ideas yet</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)", marginBottom: 20 }}>
              Tap Capture whenever a spark hits.
            </div>
            <Button variant="primary" icon="plus" onClick={() => setCapturing(true)}>Capture first idea</Button>
          </div>
        )}
      </div>

      {/* Idea inspector */}
      {selectedIdea && (
        <IdeaInspector
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          onFile={() => setShowFileIdea(selectedIdea)}
          onUnfile={() => handleUnfile(selectedIdea)}
          onDelete={() => handleDelete(selectedIdea.id)}
          onUpdate={(patch) => {
            const updated = ideas.map((i) => i.id === selectedIdea.id ? { ...i, ...patch } : i);
            saveIdeas(world.id, updated);
            setIdeas(updated);
            setSelectedIdea({ ...selectedIdea, ...patch });
          }}
        />
      )}

      {/* File idea modal */}
      {showFileIdea && (
        <FileIdeaModal
          idea={showFileIdea}
          world={world}
          onClose={() => setShowFileIdea(null)}
          onFile={handleFile}
        />
      )}
    </div>
  );
}

// ============================================================================
// Capture composer
// ============================================================================

function CaptureComposer({ draft, onChange, onCapture, onCancel, onImageClick }: {
  draft: { title: string; note: string; imageUrl: string };
  onChange: (d: { title: string; note: string; imageUrl: string }) => void;
  onCapture: () => void; onCancel: () => void; onImageClick: () => void;
}) {
  const isMobile = useIsMobile();
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--accent)",
      borderRadius: "var(--radius-md)",
      padding: isMobile ? 14 : 20,
      marginBottom: isMobile ? 24 : 32,
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? 12 : 16,
      boxShadow: "0 0 24px var(--cyan-glow)",
    }}>
      {/* Image placeholder */}
      <button
        onClick={onImageClick}
        style={{
          width: 88, height: 88, flexShrink: 0,
          background: draft.imageUrl ? "transparent" : "var(--bg-sunken)",
          border: "1px dashed var(--border-strong)",
          borderRadius: "var(--radius-sm)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 4,
          color: "var(--fg-muted)", cursor: "pointer", overflow: "hidden", padding: 0,
        }}
      >
        {draft.imageUrl ? (
          <img src={draft.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <>
            <Icon name="photo" size={18} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>Picture</span>
          </>
        )}
      </button>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          autoFocus
          placeholder="A spark — what is it?"
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
          onKeyDown={(e) => { if (e.key === "Enter") onCapture(); }}
          style={{
            background: "transparent", border: "none", outline: "none",
            fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500,
            letterSpacing: "-0.01em", color: "var(--fg)",
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
            fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)",
            resize: "none", lineHeight: 1.5,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
          <Tag tone="warning">Unfiled</Tag>
          {!isMobile && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Slot into a section later.
            </span>
          )}
          <div style={{ flex: 1 }} />
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" icon="device-floppy" onClick={onCapture}>Capture</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Section divider
// ============================================================================

function SectionDivider({ label, count, style = {} }: { label: string; count: number; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, marginBottom: 14, borderBottom: "1px solid var(--border)", ...style }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--fg-muted)", fontWeight: 500 }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{count}</span>
    </div>
  );
}

// ============================================================================
// Idea grid
// ============================================================================

function IdeaGrid({ ideas, onSelect, selected, onFile, onDelete, onUnfile }: {
  ideas: Idea[];
  onSelect: (i: Idea) => void;
  selected: Idea | null;
  onFile: (i: Idea) => void;
  onDelete: (id: string) => void;
  onUnfile?: (i: Idea) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginBottom: 16 }}>
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          isSelected={selected?.id === idea.id}
          onSelect={() => onSelect(idea)}
          onFile={() => onFile(idea)}
          onDelete={() => onDelete(idea.id)}
          onUnfile={onUnfile ? () => onUnfile(idea) : undefined}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Idea card
// ============================================================================

function IdeaCard({ idea, isSelected, onSelect, onFile, onDelete, onUnfile }: {
  idea: Idea; isSelected: boolean;
  onSelect: () => void; onFile: () => void; onDelete: () => void; onUnfile?: () => void;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: isSelected ? "var(--bg-hover)" : (hover ? "var(--bg-hover)" : "var(--bg-elevated)"),
        border: `1px solid ${isSelected ? "var(--accent)" : (hover ? "var(--border-strong)" : "var(--border)")}`,
        boxShadow: isSelected ? "var(--shadow-glow)" : "none",
        borderRadius: "var(--radius-md)",
        overflow: "hidden", cursor: "pointer",
        transition: "background 120ms, border-color 120ms, box-shadow 120ms",
        position: "relative",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Main picture area */}
      <div
        onClick={onSelect}
        style={{
          height: 96, background: "var(--bg-sunken)",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: idea.color, position: "relative", overflow: "hidden",
        }}
      >
        {idea.imageUrl ? (
          <img src={idea.imageUrl} alt={idea.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Icon name={idea.glyph || "star"} size={32} />
        )}
        <span style={{ position: "absolute", top: 8, right: 10, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em" }}>
          {idea.id}
        </span>
      </div>

      {/* Info */}
      <div onClick={onSelect} style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <h4 style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "var(--fg)", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
          {idea.title}
        </h4>
        {idea.note && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-secondary)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
            {idea.note}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>{idea.captured}</span>
          {idea.filed && idea.section ? <Tag tone="success">{idea.section}</Tag> : <Tag tone="warning">Unfiled</Tag>}
        </div>
      </div>

      {/* Actions on hover */}
      {hover && (
        <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", gap: 4 }}>
          {idea.filed && onUnfile ? (
            <button onClick={(e) => { e.stopPropagation(); onUnfile(); }} style={{ padding: "4px 6px", background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Unfile
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onFile(); }} style={{ padding: "4px 6px", background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              File
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); if (confirm("Delete this idea?")) onDelete(); }} style={{ padding: "4px 6px", background: "var(--bg-overlay)", border: "1px solid var(--danger)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--danger)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Del
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Idea inspector
// ============================================================================

function IdeaInspector({ idea, onClose, onFile, onUnfile, onDelete, onUpdate }: {
  idea: Idea; onClose: () => void; onFile: () => void; onUnfile: () => void; onDelete: () => void;
  onUpdate: (patch: Partial<Idea>) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(idea);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => { setDraft(idea); setEditing(false); }, [idea.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDraft((d) => ({ ...d, imageUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const panel = (
    <div style={{
      width: isMobile ? "100%" : 320,
      flexShrink: 0,
      borderLeft: isMobile ? "none" : "1px solid var(--border)",
      background: "var(--bg-elevated)",
      display: "flex", flexDirection: "column",
      height: "100%",
      animation: "fade-in 0.22s",
    }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <Tag tone={idea.filed ? "success" : "warning"}>{idea.filed ? idea.section || "Filed" : "Unfiled"}</Tag>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{idea.id}</span>
        <div style={{ flex: 1 }} />
        <IconButton icon="x" label="Close" onClick={onClose} />
      </div>

      {/* Main image */}
      <div style={{ position: "relative" }}>
        <div style={{ height: 160, background: "var(--bg-sunken)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: idea.color }}>
          {draft.imageUrl ? (
            <img src={draft.imageUrl} alt={idea.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Icon name={idea.glyph || "star"} size={48} />
          )}
        </div>
        {editing && (
          <button onClick={() => fileRef.current?.click()} style={{ position: "absolute", inset: 0, background: "rgba(6,8,16,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
            <Icon name="upload" size={20} style={{ color: "var(--fg)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Change picture</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
      </div>

      <div style={{ padding: "18px 18px", flex: 1, overflow: "auto" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          {idea.captured}
        </div>

        {editing ? (
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            style={{ fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500, background: "transparent", border: "none", outline: "none", color: "var(--fg)", width: "100%", borderBottom: "1px dashed var(--accent)", paddingBottom: 6, marginBottom: 12 }}
          />
        ) : (
          <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500, color: "var(--fg)", marginBottom: 12, lineHeight: 1.3 }}>{idea.title}</h3>
        )}

        {editing ? (
          <textarea
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            rows={4}
            style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)", lineHeight: 1.6, background: "var(--bg)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "8px 10px", width: "100%", resize: "vertical", outline: "none" }}
          />
        ) : idea.note ? (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)", lineHeight: 1.6 }}>{idea.note}</p>
        ) : null}
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {editing ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setDraft(idea); }}>Cancel</Button>
            <Button variant="primary" size="sm" icon="device-floppy" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onUpdate(draft); setEditing(false); }}>Save</Button>
          </>
        ) : (
          <>
            <Button variant="danger" size="sm" icon="trash" onClick={() => { if (confirm("Delete this idea?")) onDelete(); }} />
            {idea.filed ? (
              <Button variant="secondary" size="sm" onClick={onUnfile}>Unfile</Button>
            ) : (
              <Button variant="secondary" size="sm" icon="bookmark" onClick={onFile}>File away</Button>
            )}
            <Button variant="secondary" size="sm" icon="pencil" onClick={() => setEditing(true)} style={{ flex: 1, justifyContent: "center" }}>Edit</Button>
          </>
        )}
      </div>
    </div>
  );

  if (!isMobile) return panel;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 70,
        background: "var(--bg-overlay)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        animation: "fade-in 0.18s var(--ease-out)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border-strong)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          maxHeight: "88vh",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {panel}
      </div>
    </div>
  );
}

// ============================================================================
// File idea modal
// ============================================================================

function FileIdeaModal({ idea, world, onClose, onFile }: {
  idea: Idea; world: World;
  onClose: () => void; onFile: (idea: Idea, section: string) => void;
}) {
  const [section, setSection] = React.useState("");
  const articles = getArticles(world.id);
  const kindGroups = [...new Set(articles.map((a) => a.kind))];

  return (
    <Modal title="File idea" onClose={onClose} width={420}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)" }}>
          Filing <strong style={{ color: "var(--fg)" }}>{idea.title}</strong> into a section.
        </div>
        <Field label="Section name (type or choose)">
          <Input autoFocus value={section} onChange={setSection} placeholder="e.g. Characters, Places, Salt Wars..." />
        </Field>
        {kindGroups.length > 0 && (
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Or pick an existing section</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {kindGroups.map((k) => (
                <button key={k} onClick={() => setSection(k)} style={{ padding: "5px 10px", background: section === k ? "var(--accent-soft)" : "var(--bg-elevated)", border: `1px solid ${section === k ? "var(--accent)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, color: section === k ? "var(--accent)" : "var(--fg)" }}>
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="bookmark" onClick={() => { if (section.trim()) onFile(idea, section.trim()); }}>File away</Button>
        </div>
      </div>
    </Modal>
  );
}
