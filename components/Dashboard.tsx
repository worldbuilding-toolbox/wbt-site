"use client";
import React from "react";
import { Button, Icon, Modal, Input, Field, Textarea, Tag } from "./Primitives";
import { useIsMobile } from "./hooks";
import {
  createWorld, seedWorld,
  softDeleteWorld, restoreFromTrash, purgeTrash, clearTrash, getTrash,
  getLastExportAt, getNudgeDismissedUntil, dismissNudge,
  getSnapshots,
  type User, type World, type SnapshotEnvelope, type TrashEntry,
} from "./store";
import { exportAccount, exportWorld, type ExportFile } from "./export";
import { exportAccountZip, exportWorldZip } from "./export-zip";
import { parseImportFile, importWorldBundle, importAccount, summarise, ImportError } from "./import";
import { useToast } from "./Toast";

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
  const [importPayload, setImportPayload] = React.useState<ExportFile | null>(null);
  const [importError, setImportError] = React.useState<string | null>(null);
  const [importConfirm, setImportConfirm] = React.useState("");
  const importFileRef = React.useRef<HTMLInputElement>(null);
  const [snapshotWorldId, setSnapshotWorldId] = React.useState<string | null>(null);
  const [showTrash, setShowTrash] = React.useState(false);
  const [nudgeRefresh, setNudgeRefresh] = React.useState(0);
  const isMobile = useIsMobile();
  const toast = useToast();

  const nudgeDays = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    if (worlds.length === 0) return null;
    const dismissed = getNudgeDismissedUntil();
    if (dismissed && new Date(dismissed) > new Date()) return null;
    const last = getLastExportAt();
    if (!last) {
      const oldest = Math.min(...worlds.map((w) => new Date(w.createdAt).getTime()));
      const ageDays = Math.floor((Date.now() - oldest) / 86_400_000);
      return ageDays >= 7 ? -1 : null; // -1 sentinel: "never exported"
    }
    const days = Math.floor((Date.now() - new Date(last).getTime()) / 86_400_000);
    return days >= 7 ? days : null;
    // re-evaluated whenever nudgeRefresh changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worlds, nudgeRefresh]);

  const handleExportAccountZip = async () => {
    await exportAccountZip(user);
    setNudgeRefresh((n) => n + 1);
  };

  const handleDismissNudge = () => {
    dismissNudge(7);
    setNudgeRefresh((n) => n + 1);
  };

  const handleCreate = (name: string, genre: string, tagline: string) => {
    const world = createWorld(user.id, name, genre, tagline);
    seedWorld(world);
    onWorldsChange();
    setShowCreate(false);
    onOpenWorld(world.id);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const world = worlds.find((w) => w.id === deleteId);
    const trashId = softDeleteWorld(deleteId);
    onWorldsChange();
    setDeleteId(null);
    setDeleteConfirm("");
    if (trashId && world) {
      toast.push({
        message: `Deleted "${world.name}". You can restore it for the next 30 days.`,
        tone: "info",
        durationMs: 8000,
        action: {
          label: "Undo",
          onClick: () => {
            const result = restoreFromTrash(user.id, trashId);
            if (result.ok) {
              onWorldsChange();
              toast.push({ message: `Restored "${world.name}".`, tone: "success" });
            }
          },
        },
      });
    }
  };

  const handlePickFile = () => importFileRef.current?.click();

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = await parseImportFile(file);
      setImportPayload(parsed);
      setImportError(null);
    } catch (err) {
      setImportPayload(null);
      setImportError(err instanceof ImportError ? err.message : "Could not read that file.");
    }
  };

  const dismissImport = () => {
    setImportPayload(null);
    setImportError(null);
    setImportConfirm("");
  };

  const runImport = () => {
    if (!importPayload) return;
    if (importPayload.scope === "world") {
      const fresh = importWorldBundle(importPayload.world, user.id);
      dismissImport();
      onWorldsChange();
      onOpenWorld(fresh.id);
    } else {
      importAccount(importPayload, user.id);
      dismissImport();
      onWorldsChange();
    }
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
            <>
              <Button
                variant="secondary"
                icon="device-floppy"
                onClick={() => { exportAccount(user); setNudgeRefresh((n) => n + 1); }}
                style={isMobile ? { alignSelf: "stretch", justifyContent: "center" } : undefined}
              >
                Export JSON
              </Button>
              <Button
                variant="secondary"
                icon="paperclip"
                onClick={handleExportAccountZip}
                style={isMobile ? { alignSelf: "stretch", justifyContent: "center" } : undefined}
              >
                Export ZIP
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            icon="upload"
            onClick={handlePickFile}
            style={isMobile ? { alignSelf: "stretch", justifyContent: "center" } : undefined}
          >
            Import
          </Button>
          <Button
            variant="ghost"
            icon="trash"
            onClick={() => setShowTrash(true)}
            style={isMobile ? { alignSelf: "stretch", justifyContent: "center" } : undefined}
          >
            Trash
          </Button>
          <input
            ref={importFileRef}
            type="file"
            accept="application/json,application/zip,.json,.zip"
            style={{ display: "none" }}
            onChange={handleFileChosen}
          />
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

      {nudgeDays !== null && (
        <ExportNudge
          days={nudgeDays}
          onExport={handleExportAccountZip}
          onDismiss={handleDismissNudge}
          isMobile={isMobile}
        />
      )}

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: isMobile ? 12 : 16 }}>
        {worlds.map((w) => (
          <WorldCard
            key={w.id}
            world={w}
            onOpen={() => onOpenWorld(w.id)}
            onDelete={() => setDeleteId(w.id)}
            onExportJson={() => { exportWorld(w); setNudgeRefresh((n) => n + 1); }}
            onExportZip={async () => { await exportWorldZip(w); setNudgeRefresh((n) => n + 1); }}
            onShowSnapshots={() => setSnapshotWorldId(w.id)}
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
              This deletes <strong style={{ color: "var(--fg)" }}>{worldToDelete.name}</strong> and everything inside it — all eras, events, articles, and ideas. It will sit in <em>Trash</em> for 30 days so you can restore it; after that it's gone for good.
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

      {importError && (
        <Modal title="Couldn't read that file" onClose={dismissImport} width={420}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)", lineHeight: 1.6, margin: 0 }}>
              {importError}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={dismissImport}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {importPayload && (
        <ImportPreviewModal
          payload={importPayload}
          confirmText={importConfirm}
          onConfirmText={setImportConfirm}
          onClose={dismissImport}
          onImport={runImport}
        />
      )}

      {snapshotWorldId && (
        <SnapshotsModal
          world={worlds.find((w) => w.id === snapshotWorldId)!}
          onClose={() => setSnapshotWorldId(null)}
          onRestore={(bundle) => {
            const fresh = importWorldBundle(bundle, user.id);
            setSnapshotWorldId(null);
            onWorldsChange();
            onOpenWorld(fresh.id);
          }}
        />
      )}

      {showTrash && (
        <TrashModal
          userId={user.id}
          onClose={() => setShowTrash(false)}
          onChanged={onWorldsChange}
        />
      )}
    </div>
  );
}

// ============================================================================
// Trash modal — "Recently deleted"
// ============================================================================

function TrashModal({
  userId, onClose, onChanged,
}: {
  userId: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const toast = useToast();
  const [entries, setEntries] = React.useState<TrashEntry[]>(() => getTrash(userId));
  const reload = () => setEntries(getTrash(userId));

  const restore = (entry: TrashEntry) => {
    const result = restoreFromTrash(userId, entry.id);
    if (result.ok) {
      reload();
      onChanged();
      toast.push({ message: `Restored ${describe(entry)}.`, tone: "success" });
    } else {
      toast.push({ message: result.reason, tone: "danger" });
    }
  };

  const purge = (entry: TrashEntry) => {
    purgeTrash(userId, entry.id);
    reload();
    toast.push({ message: `Permanently deleted ${describe(entry)}.`, tone: "info" });
  };

  const emptyAll = () => {
    if (!confirm("Permanently delete every item in the trash? This cannot be undone.")) return;
    clearTrash(userId);
    reload();
    toast.push({ message: "Trash emptied.", tone: "info" });
  };

  return (
    <Modal title="Recently deleted" onClose={onClose} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-secondary)", lineHeight: 1.55 }}>
          Anything you've deleted in the last 30 days sits here. After that it's removed for good.
        </p>
        {entries.length === 0 ? (
          <div style={{ padding: "16px 14px", textAlign: "center", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Trash is empty.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {entries.map((entry) => (
              <TrashRow key={entry.id} entry={entry} onRestore={() => restore(entry)} onPurge={() => purge(entry)} />
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <Button variant="danger" size="sm" icon="trash" disabled={entries.length === 0} onClick={emptyAll}>
            Empty trash
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

function TrashRow({ entry, onRestore, onPurge }: { entry: TrashEntry; onRestore: () => void; onPurge: () => void }) {
  const captured = new Date(entry.deletedAt);
  const ageMs = Date.now() - captured.getTime();
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px",
      background: "var(--bg)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {describe(entry)}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
          {entry.kind.toUpperCase()} · deleted {formatAge(ageMs)} · {captured.toLocaleString()}
        </div>
      </div>
      <Button variant="secondary" size="sm" icon="upload" onClick={onRestore}>Restore</Button>
      <Button variant="danger" size="sm" icon="trash" onClick={() => { if (confirm("Permanently delete this item?")) onPurge(); }} />
    </div>
  );
}

function describe(entry: TrashEntry): string {
  switch (entry.kind) {
    case "world": return `world "${entry.world.name}"`;
    case "era": return `era "${entry.payload.name}"`;
    case "event": return `event "${entry.payload.title}"`;
    case "article": return `article "${entry.payload.title}"`;
    case "idea": return `idea "${entry.payload.title}"`;
  }
}

// ============================================================================
// Export nudge banner
// ============================================================================

function ExportNudge({
  days, onExport, onDismiss, isMobile,
}: {
  days: number;
  onExport: () => void;
  onDismiss: () => void;
  isMobile: boolean;
}) {
  const headline = days < 0
    ? "You haven't exported any of your worlds yet."
    : `It's been ${days} days since your last export.`;
  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: 12,
      padding: "12px 16px",
      background: "var(--bg-elevated)",
      border: "1px solid var(--accent)",
      borderRadius: "var(--radius-md)",
      marginBottom: isMobile ? 16 : 20,
    }}>
      <Icon name="alert-circle" size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", fontWeight: 500 }}>
          {headline}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>
          A file you can keep off-device is the safest backup of your writing.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Button variant="ghost" size="sm" onClick={onDismiss}>Remind me later</Button>
        <Button variant="primary" size="sm" icon="paperclip" onClick={onExport}>Export ZIP</Button>
      </div>
    </div>
  );
}

// ============================================================================
// Snapshots modal
// ============================================================================

function SnapshotsModal({
  world, onClose, onRestore,
}: {
  world: World;
  onClose: () => void;
  onRestore: (bundle: SnapshotEnvelope["bundle"]) => void;
}) {
  const snapshots = React.useMemo(() => getSnapshots(world.id), [world.id]);
  return (
    <Modal title={`Snapshots · ${world.name}`} onClose={onClose} width={500}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-secondary)", lineHeight: 1.55, margin: 0 }}>
          The toolbox keeps up to three automatic snapshots of every world as you write. Restoring brings the snapshot back as a new world — your current{" "}
          <strong style={{ color: "var(--fg)" }}>{world.name}</strong> stays put.
        </p>
        {snapshots.length === 0 ? (
          <div style={{ padding: "16px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)" }}>
            No snapshots yet. Keep editing — they appear after a couple of seconds of writing.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {snapshots.map((env) => (
              <SnapshotRow key={env.ts} env={env} onRestore={() => onRestore(env.bundle)} />
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

function SnapshotRow({ env, onRestore }: { env: SnapshotEnvelope; onRestore: () => void }) {
  const captured = new Date(env.ts);
  const ageMs = Date.now() - captured.getTime();
  const ageLabel = formatAge(ageMs);
  const b = env.bundle;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px",
      background: "var(--bg)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)" }}>
          {ageLabel}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
          {captured.toLocaleString()} · {b.eras.length} eras · {b.events.length} events · {b.articles.length} articles · {b.ideas.length} ideas
        </div>
      </div>
      <Button variant="secondary" size="sm" icon="upload" onClick={onRestore}>Restore</Button>
    </div>
  );
}

function formatAge(ms: number): string {
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

// ============================================================================
// Import preview modal
// ============================================================================

function ImportPreviewModal({
  payload, confirmText, onConfirmText, onClose, onImport,
}: {
  payload: ExportFile;
  confirmText: string;
  onConfirmText: (v: string) => void;
  onClose: () => void;
  onImport: () => void;
}) {
  const s = summarise(payload);
  const isAccount = payload.scope === "account";
  const title = isAccount ? "Replace account from file" : "Import world from file";
  const worldName = payload.scope === "world" ? payload.world.world.name : null;

  return (
    <Modal title={title} onClose={onClose} width={460}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {payload.scope === "world" ? (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)", lineHeight: 1.6, margin: 0 }}>
            This will create a new world on your account called{" "}
            <strong style={{ color: "var(--fg)" }}>{worldName}</strong>. Existing worlds are untouched.
          </p>
        ) : (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--danger)", lineHeight: 1.6, margin: 0 }}>
            <strong>This will replace every world on your account</strong> with the {s.worlds} {s.worlds === 1 ? "world" : "worlds"} in this file. Anything you haven't exported will be lost.
          </p>
        )}

        <div style={{ padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
            File contents
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 16px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)" }}>
            <span style={{ color: "var(--fg-muted)" }}>Worlds</span><span>{s.worlds}</span>
            <span style={{ color: "var(--fg-muted)" }}>Eras</span><span>{s.eras}</span>
            <span style={{ color: "var(--fg-muted)" }}>Events</span><span>{s.events}</span>
            <span style={{ color: "var(--fg-muted)" }}>Articles</span><span>{s.articles}</span>
            <span style={{ color: "var(--fg-muted)" }}>Ideas</span><span>{s.ideas}</span>
            {s.help > 0 && <><span style={{ color: "var(--fg-muted)" }}>Guides</span><span>{s.help}</span></>}
          </div>
        </div>

        {isAccount && (
          <Field label='Type "REPLACE" to confirm'>
            <Input autoFocus placeholder="REPLACE" value={confirmText} onChange={onConfirmText} />
          </Field>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {isAccount ? (
            <Button
              variant="danger"
              icon="upload"
              disabled={confirmText !== "REPLACE"}
              onClick={onImport}
            >
              Replace everything
            </Button>
          ) : (
            <Button variant="primary" icon="upload" onClick={onImport}>
              Import world
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// World card
// ============================================================================

function WorldCard({ world, onOpen, onDelete, onExportJson, onExportZip, onShowSnapshots }: { world: World; onOpen: () => void; onDelete: () => void; onExportJson: () => void; onExportZip: () => void; onShowSnapshots: () => void }) {
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
          <MenuItem icon="device-floppy" onClick={() => { setMenu(false); onExportJson(); }}>Export JSON</MenuItem>
          <MenuItem icon="paperclip" onClick={() => { setMenu(false); onExportZip(); }}>Export ZIP</MenuItem>
          <MenuItem icon="database" onClick={() => { setMenu(false); onShowSnapshots(); }}>Snapshots</MenuItem>
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
