"use client";
import React from "react";
import { Button, Icon, Modal, Input, Field, Textarea, Tag } from "./Primitives";
import { useIsMobile } from "./hooks";
import { createWorld, seedWorld, deleteWorld, type User, type World } from "./store";
import { exportAccount, exportWorld } from "./export";

export function Dashboard({
  user, worlds, onOpenWorld, onWorldsChange,
}: {
  user: User;
  worlds: World[];
  onOpenWorld: (id: string) => void;
  onWorldsChange: () => void;
}) {
  const [showCreate, setShowCreate] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState("");
  const isMobile = useIsMobile();

  const handleCreate = (name: string, genre: string, tagline: string) => {
    const world = createWorld(user.id, name, genre, tagline);
    seedWorld(world);
    onWorldsChange();
    setShowCreate(false);
    onOpenWorld(world.id);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteWorld(deleteId);
    onWorldsChange();
    setDeleteId(null);
    setDeleteConfirm("");
  };

  const worldToDelete = worlds.find((w) => w.id === deleteId) ?? null;

  return (
    <div style={{ padding: isMobile ? "24px 16px 32px" : "40px 48px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "flex-end",
        justifyContent: "space-between",
        gap: isMobile ? 18 : 0,
        marginBottom: isMobile ? 24 : 32,
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--fg-muted)", fontWeight: 500, marginBottom: 8 }}>
            Archive / Worlds
          </div>
          <h1 style={{ fontFamily: "var(--font-sans)", fontSize: isMobile ? 28 : 36, letterSpacing: "-0.02em", fontWeight: 500, color: "var(--fg)" }}>
            Worlds
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: isMobile ? 14 : 16, color: "var(--fg-secondary)", marginTop: 8 }}>
            {worlds.length} {worlds.length === 1 ? "world" : "worlds"}.
            {worlds.length === 0 ? " Start your first." : " Open one, or start fresh."}
          </p>
        </div>
        <div style={{
          display: "flex",
          gap: 8,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
        }}>
          {worlds.length > 0 && (
            <Button
              variant="secondary"
              icon="device-floppy"
              onClick={() => exportAccount(user)}
              style={isMobile ? { alignSelf: "stretch", justifyContent: "center" } : undefined}
            >
              Export everything
            </Button>
          )}
          <Button
            variant="primary"
            icon="plus"
            onClick={() => setShowCreate(true)}
            style={isMobile ? { alignSelf: "stretch", justifyContent: "center" } : undefined}
          >
            New world
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: isMobile ? 12 : 16 }}>
        {worlds.map((w) => (
          <WorldCard
            key={w.id}
            world={w}
            onOpen={() => onOpenWorld(w.id)}
            onDelete={() => setDeleteId(w.id)}
            onExport={() => exportWorld(w)}
          />
        ))}
        <NewWorldCard onClick={() => setShowCreate(true)} />
      </div>

      {showCreate && (
        <CreateWorldModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}

      {deleteId && worldToDelete && (
        <Modal title="Delete world" onClose={() => { setDeleteId(null); setDeleteConfirm(""); }} width={420}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)", lineHeight: 1.6, margin: 0 }}>
              This will permanently delete <strong style={{ color: "var(--fg)" }}>{worldToDelete.name}</strong> and everything inside it — all eras, events, articles, and ideas. This cannot be undone.
            </p>
            <Field label={`Type "${worldToDelete.name}" to confirm`}>
              <Input
                autoFocus
                placeholder={worldToDelete.name}
                value={deleteConfirm}
                onChange={setDeleteConfirm}
              />
            </Field>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={() => { setDeleteId(null); setDeleteConfirm(""); }}>Cancel</Button>
              <Button
                variant="danger"
                icon="trash"
                disabled={deleteConfirm !== worldToDelete.name}
                onClick={handleDelete}
              >
                Delete world
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================================
// World card
// ============================================================================

function WorldCard({ world, onOpen, onDelete, onExport }: { world: World; onOpen: () => void; onDelete: () => void; onExport: () => void }) {
  const [hover, setHover] = React.useState(false);
  const [menu, setMenu] = React.useState(false);

  return (
    <div
      style={{
        background: hover ? "var(--bg-hover)" : "var(--bg-elevated)",
        border: "1px solid " + (hover ? "var(--border-strong)" : "var(--border)"),
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "background 120ms, border-color 120ms",
        display: "flex", flexDirection: "column",
        minHeight: 220,
        position: "relative",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setMenu(false); }}
    >
      {/* Cover */}
      <div
        style={{ height: 110, background: world.cover, position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
        onClick={onOpen}
      >
        <svg viewBox="0 0 400 110" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }} fill="none">
          <g stroke={world.color} strokeWidth="0.5" strokeOpacity="0.4">
            <line x1="40" y1="30" x2="100" y2="60" />
            <line x1="100" y1="60" x2="160" y2="35" />
            <line x1="240" y1="40" x2="320" y2="75" />
          </g>
          <g fill={world.color}>
            <circle cx="40" cy="30" r="1.4" />
            <circle cx="100" cy="60" r="2" />
            <circle cx="160" cy="35" r="1.4" />
            <circle cx="240" cy="40" r="1.6" />
            <circle cx="320" cy="75" r="2.2" />
          </g>
          <g fill="white" fillOpacity="0.4">
            <circle cx="60" cy="80" r="0.8" />
            <circle cx="200" cy="20" r="0.8" />
            <circle cx="350" cy="25" r="0.8" />
            <circle cx="180" cy="90" r="0.6" />
          </g>
        </svg>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }} onClick={onOpen}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: world.color }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)" }}>
            {world.genre}
          </span>
        </div>
        <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 19, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em" }}>
          {world.name}
        </h3>
        {world.tagline && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-secondary)", lineHeight: 1.5, flex: 1 }}>
            {world.tagline}
          </p>
        )}
      </div>

      {/* Menu button */}
      <button
        onClick={(e) => { e.stopPropagation(); setMenu(!menu); }}
        style={{
          position: "absolute", top: 8, right: 8,
          background: "var(--bg-overlay)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)", padding: 5,
          color: "var(--fg-muted)", cursor: "pointer",
          opacity: hover ? 1 : 0, transition: "opacity 120ms",
          display: "flex", alignItems: "center",
        }}
      >
        <Icon name="dots-vertical" size={14} />
      </button>

      {/* Dropdown menu */}
      {menu && (
        <div
          style={{
            position: "absolute", top: 36, right: 8, zIndex: 20,
            background: "var(--bg-elevated)", border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)",
            overflow: "hidden", minWidth: 140,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem icon="arrow-right" onClick={() => { setMenu(false); onOpen(); }}>Open</MenuItem>
          <MenuItem icon="device-floppy" onClick={() => { setMenu(false); onExport(); }}>Export</MenuItem>
          <MenuItem icon="trash" danger onClick={() => { setMenu(false); onDelete(); }}>Delete</MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, children, onClick, danger }: { icon: string; children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        width: "100%", padding: "9px 14px",
        background: hover ? "var(--bg-hover)" : "transparent",
        border: "none", cursor: "pointer",
        fontFamily: "var(--font-sans)", fontSize: 13,
        color: danger ? "var(--danger)" : "var(--fg)",
        textAlign: "left",
      }}
    >
      <Icon name={icon} size={14} />
      {children}
    </button>
  );
}

// ============================================================================
// New world card
// ============================================================================

function NewWorldCard({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "transparent",
        border: `1px dashed ${hover ? "var(--accent)" : "var(--border-strong)"}`,
        borderRadius: "var(--radius-lg)",
        cursor: "pointer", padding: 24,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 12,
        color: hover ? "var(--fg)" : "var(--fg-muted)",
        minHeight: 220,
        transition: "border-color 120ms, color 120ms",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        border: `1px solid ${hover ? "var(--accent)" : "var(--border-strong)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 120ms",
      }}>
        <Icon name="plus" size={20} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>Start a new world</div>
        <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 4 }}>A blank slate, named by you.</div>
      </div>
    </button>
  );
}

// ============================================================================
// Create world modal
// ============================================================================

function CreateWorldModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, genre: string, tagline: string) => void }) {
  const [name, setName] = React.useState("");
  const [genre, setGenre] = React.useState("Science Fiction");
  const [tagline, setTagline] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), genre.trim(), tagline.trim());
  };

  return (
    <Modal title="New world" onClose={onClose} width={440}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="World name">
          <Input
            autoFocus
            placeholder="e.g. The Erathine Compact"
            value={name}
            onChange={setName}
          />
        </Field>
        <Field label="Genre">
          <Input
            placeholder="e.g. Science Fiction, Fantasy, Space Opera"
            value={genre}
            onChange={setGenre}
          />
        </Field>
        <Field label="Tagline" hint="One sentence. What is this world, at a glance?">
          <Input
            placeholder="e.g. A civilisation rebuilding after the signal."
            value={tagline}
            onChange={setTagline}
          />
        </Field>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" icon="plus" type="submit">Create world</Button>
        </div>
      </form>
    </Modal>
  );
}
