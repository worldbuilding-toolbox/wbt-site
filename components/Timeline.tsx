"use client";
import React from "react";
import { Button, IconButton, Icon, Tag, Modal, Input, Field, Select } from "./Primitives";
import { useIsMobile } from "./hooks";
import {
  getEras, saveEras, getEvents, saveEvents, createEra, createEvent, updateWorld,
  type World, type Era, type TimelineEvent,
} from "./store";

const ERA_COLORS = ["#7fdbff", "#6ad6a3", "#f0b860", "#e86464", "#a06a1d", "#8a91a3", "#5a4be3"];

export function Timeline({ world, onWorldChange }: { world: World; onWorldChange: () => void }) {
  const [eras, setEras] = React.useState<Era[]>(() => getEras(world.id));
  const [events, setEvents] = React.useState<TimelineEvent[]>(() => getEvents(world.id));
  const [selectedEvent, setSelectedEvent] = React.useState<TimelineEvent | null>(null);
  const [showAddEra, setShowAddEra] = React.useState(false);
  const [showAddEvent, setShowAddEvent] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [editEraId, setEditEraId] = React.useState<string | null>(null);
  const isMobile = useIsMobile();

  const reload = () => {
    setEras(getEras(world.id));
    setEvents(getEvents(world.id));
  };

  // Absolute year for timeline positioning
  const absYear = React.useCallback((ev: TimelineEvent) => {
    const era = eras.find((e) => e.id === ev.eraId);
    return era ? era.from + ev.eraYear : ev.eraYear;
  }, [eras]);

  // Era-relative display: "150 SVF"
  const formatEraYear = React.useCallback((ev: TimelineEvent) => {
    const era = eras.find((e) => e.id === ev.eraId);
    const label = era?.shortLabel || era?.name || "";
    return label ? `${ev.eraYear} ${label}` : String(ev.eraYear);
  }, [eras]);

  // Absolute year display for the spine ruler
  const formatAbsYear = (y: number) => {
    if (y < 0) return `${Math.abs(y)} ${world.negLabel || "BF"}`;
    return `${y} ${world.posLabel || "AF"}`;
  };

  const eraForEvent = (ev: TimelineEvent) => eras.find((e) => e.id === ev.eraId);

  // Compute absolute year range for timeline
  const allYears = [
    ...eras.flatMap((e) => [e.from, e.to]),
    ...events.map((e) => absYear(e)),
  ];
  const minYear = allYears.length ? Math.min(...allYears) : -100;
  const maxYear = allYears.length ? Math.max(...allYears) : 500;
  const span = maxYear - minYear || 1;

  const pct = (year: number) => `${((year - minYear) / span) * 100}%`;

  const topBarHeight = isMobile ? 52 : 56;

  return (
    <div style={{ display: "flex", height: `calc(100vh - ${topBarHeight}px)` }}>
      {/* Main timeline area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 }}>
        {/* Toolbar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 5,
          background: "var(--bg)", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: isMobile ? 8 : 10, padding: isMobile ? "10px 14px" : "10px 24px",
          flexWrap: "wrap",
        }}>
          <div style={{ flex: isMobile ? "1 1 100%" : "0 0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: isMobile ? 16 : 18, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em" }}>
              {world.name} · Timeline
            </h2>
            {eras.length > 0 && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>
                {formatAbsYear(minYear)} — {formatAbsYear(maxYear)}
              </div>
            )}
          </div>
          {!isMobile && <Tag tone="success" style={{ marginLeft: 8 }}>Auto-saved</Tag>}
          <div style={{ flex: 1 }} />
          <IconButton icon="settings" label="Timeline settings" onClick={() => setShowSettings(true)} />
          <Button variant="secondary" icon="plus" size="sm" onClick={() => setShowAddEra(true)}>
            {isMobile ? (world.eraLabel || "Era") : `Add ${world.eraLabel || "Era"}`}
          </Button>
          <Button variant="primary" icon="plus" size="sm" onClick={() => setShowAddEvent(true)}>
            {isMobile ? "Event" : "Add event"}
          </Button>
        </div>

        {eras.length === 0 && events.length === 0 ? (
          <EmptyTimeline eraLabel={world.eraLabel} onAddEra={() => setShowAddEra(true)} />
        ) : (
          <div style={{
            padding: isMobile ? "20px 16px 80px" : "32px 24px 96px",
            minWidth: isMobile ? undefined : 800,
          }}>
            <div style={{
              overflowX: isMobile ? "auto" : "visible",
              marginLeft: isMobile ? -16 : 0,
              marginRight: isMobile ? -16 : 0,
              paddingLeft: isMobile ? 16 : 0,
              paddingRight: isMobile ? 16 : 0,
            }}>
            <div style={{ minWidth: isMobile ? 668 : "auto" }}>
            {/* Era bands */}
            {eras.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
                  {world.eraLabel || "Era"}s · {eras.length}
                </div>
                <div style={{ position: "relative", height: 32 }}>
                  {eras.map((era) => {
                    const left = ((era.from - minYear) / span) * 100;
                    const width = ((era.to - era.from) / span) * 100;
                    return (
                      <button
                        key={era.id}
                        onClick={() => setEditEraId(era.id)}
                        style={{
                          position: "absolute",
                          left: `${Math.max(0, left)}%`,
                          width: `${Math.min(width, 100 - Math.max(0, left))}%`,
                          height: "100%",
                          background: `${era.color}22`,
                          border: `1px solid ${era.color}66`,
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          overflow: "hidden",
                          transition: "background 120ms",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${era.color}44`; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${era.color}22`; }}
                      >
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: era.color, textTransform: "uppercase", letterSpacing: "0.12em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 8px" }}>
                          {era.name}{era.shortLabel ? ` · ${era.shortLabel}` : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timeline spine */}
            <div style={{ position: "relative", marginTop: 24, marginBottom: 24 }}>
              {/* Absolute year ticks — for orientation only */}
              <div style={{ position: "relative", height: 24, marginBottom: 0 }}>
                {[0, 25, 50, 75, 100].map((p) => {
                  const year = minYear + (p / 100) * span;
                  return (
                    <div
                      key={p}
                      style={{ position: "absolute", left: `${p}%`, transform: "translateX(-50%)", textAlign: "center" }}
                    >
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                        {formatAbsYear(Math.round(year))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Spine */}
              <div style={{ position: "relative", height: 280, marginTop: 8 }}>
                {/* Horizontal spine line */}
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--border-strong)" }} />

                {/* Era boundary ticks */}
                {eras.map((era) => (
                  <React.Fragment key={era.id}>
                    <div style={{ position: "absolute", top: "calc(50% - 8px)", left: pct(era.from), width: 1, height: 16, background: era.color + "99" }} />
                    <div style={{ position: "absolute", top: "calc(50% - 8px)", left: pct(era.to), width: 1, height: 16, background: era.color + "99" }} />
                  </React.Fragment>
                ))}

                {/* Events */}
                {events.map((ev, i) => {
                  const isAbove = i % 2 === 0;
                  const isSelected = selectedEvent?.id === ev.id;
                  const era = eraForEvent(ev);
                  const evAbsYear = absYear(ev);
                  const dotSz = isSelected ? 12 : 10;
                  const connH = 8;

                  return (
                    // Zero-size anchor centered exactly on the spine — all children absolutely positioned
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvent(isSelected ? null : ev)}
                      style={{
                        position: "absolute",
                        left: pct(evAbsYear),
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 0, height: 0,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        zIndex: isSelected ? 5 : 2,
                      }}
                    >
                      {/* Dot — centered on the anchor */}
                      <div style={{
                        position: "absolute",
                        width: dotSz, height: dotSz,
                        borderRadius: "50%",
                        top: -dotSz / 2, left: -dotSz / 2,
                        background: isSelected ? "var(--accent)" : (era?.color || "var(--fg-secondary)"),
                        boxShadow: isSelected ? "0 0 12px var(--cyan-glow)" : "none",
                        transition: "width 120ms, height 120ms, top 120ms, left 120ms, box-shadow 120ms",
                        pointerEvents: "none",
                      }} />

                      {/* Connector — starts at dot edge, runs toward card */}
                      <div style={{
                        position: "absolute",
                        left: -0.5,
                        [isAbove ? "bottom" : "top"]: dotSz / 2,
                        width: 1, height: connH,
                        background: isSelected ? "var(--accent)" : "var(--fg-muted)",
                        pointerEvents: "none",
                      }} />

                      {/* Event card — sits beyond the connector */}
                      <div style={{
                        position: "absolute",
                        [isAbove ? "bottom" : "top"]: dotSz / 2 + connH,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 140,
                        background: isSelected ? "var(--bg-hover)" : "var(--bg-elevated)",
                        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "var(--radius-md)",
                        padding: "8px 10px",
                        boxShadow: isSelected ? "var(--shadow-glow)" : "none",
                        transition: "border-color 120ms, box-shadow 120ms",
                        textAlign: "left",
                        pointerEvents: "none",
                      }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: era?.color || "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
                          {formatEraYear(ev)}
                        </div>
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "var(--fg)", lineHeight: 1.3 }}>
                          {ev.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            </div>
            </div>

            {/* Events list */}
            {events.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
                  Events · {events.length}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[...events].sort((a, b) => absYear(a) - absYear(b)).map((ev) => {
                    const era = eraForEvent(ev);
                    const isSelected = selectedEvent?.id === ev.id;
                    return (
                      <div
                        key={ev.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedEvent(isSelected ? null : ev)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedEvent(isSelected ? null : ev); }}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 16,
                          padding: "12px 16px",
                          background: isSelected ? "var(--bg-hover)" : "var(--bg-elevated)",
                          border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: "var(--radius-md)",
                          cursor: "pointer",
                          transition: "border-color 120ms, background 120ms",
                        }}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: era?.color || "var(--fg-secondary)", marginTop: 4, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: era?.color || "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                              {formatEraYear(ev)}
                            </span>
                            {ev.kind && <Tag tone="neutral">{ev.kind}</Tag>}
                          </div>
                          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--fg)", marginTop: 4 }}>{ev.title}</div>
                          {ev.desc && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-secondary)", marginTop: 4, lineHeight: 1.5 }}>{ev.desc}</div>}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this event?")) {
                              const updated = events.filter((x) => x.id !== ev.id);
                              saveEvents(world.id, updated);
                              setEvents(updated);
                              if (selectedEvent?.id === ev.id) setSelectedEvent(null);
                            }
                          }}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: 4, display: "flex" }}
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inspector */}
      {selectedEvent && (
        <EventInspector
          event={selectedEvent}
          world={world}
          eras={eras}
          formatEraYear={formatEraYear}
          onClose={() => setSelectedEvent(null)}
          onDelete={() => {
            const updated = events.filter((e) => e.id !== selectedEvent.id);
            saveEvents(world.id, updated);
            setEvents(updated);
            setSelectedEvent(null);
          }}
          onSave={(updated) => {
            const evts = events.map((e) => e.id === updated.id ? updated : e);
            saveEvents(world.id, evts);
            setEvents(evts);
            setSelectedEvent(updated);
          }}
        />
      )}

      {/* Modals */}
      {showAddEra && (
        <AddEraModal
          world={world}
          eras={eras}
          onClose={() => setShowAddEra(false)}
          onAdd={(name, shortLabel, from, to) => {
            createEra(world.id, name, shortLabel, from, to);
            reload();
            setShowAddEra(false);
          }}
        />
      )}

      {showAddEvent && (
        <AddEventModal
          world={world}
          eras={eras}
          onClose={() => setShowAddEvent(false)}
          onAdd={(data) => {
            createEvent(world.id, data);
            reload();
            setShowAddEvent(false);
          }}
        />
      )}

      {showSettings && (
        <TimelineSettingsModal
          world={world}
          onClose={() => setShowSettings(false)}
          onSave={(patch) => {
            updateWorld(world.id, patch);
            onWorldChange();
            setShowSettings(false);
          }}
        />
      )}

      {editEraId && (
        <EditEraModal
          era={eras.find((e) => e.id === editEraId)!}
          otherEras={eras.filter((e) => e.id !== editEraId)}
          eventCount={events.filter((e) => e.eraId === editEraId).length}
          onClose={() => setEditEraId(null)}
          onSave={(patch) => {
            const updated = eras.map((e) => e.id === editEraId ? { ...e, ...patch } : e);
            saveEras(world.id, updated);
            setEras(updated);
            setEditEraId(null);
          }}
          onDelete={() => {
            const updated = eras.filter((e) => e.id !== editEraId);
            saveEras(world.id, updated);
            setEras(updated);
            setEditEraId(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Event inspector
// ============================================================================

function EventInspector({ event, world, eras, formatEraYear, onClose, onDelete, onSave }: {
  event: TimelineEvent; world: World; eras: Era[];
  formatEraYear: (ev: TimelineEvent) => string;
  onClose: () => void; onDelete: () => void;
  onSave: (e: TimelineEvent) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(event);
  const era = eras.find((e) => e.id === event.eraId);
  const draftEra = eras.find((e) => e.id === draft.eraId);
  const isMobile = useIsMobile();

  React.useEffect(() => { setDraft(event); setEditing(false); }, [event.id]);

  const eraLength = draftEra ? draftEra.to - draftEra.from : null;
  const yearError = eraLength !== null && (draft.eraYear < 0 || draft.eraYear > eraLength)
    ? `Must be 0 – ${eraLength}`
    : null;
  const previewYear = draftEra && !yearError
    ? `${draft.eraYear} ${draftEra.shortLabel || draftEra.name}`
    : null;

  const panel = (
    <div style={{
      width: isMobile ? "100%" : 320,
      flexShrink: 0,
      borderLeft: isMobile ? "none" : "1px solid var(--border)",
      background: "var(--bg-elevated)",
      display: "flex", flexDirection: "column",
      height: "100%",
      animation: "fade-in 0.22s var(--ease-out)",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <Tag tone="accent">{(editing ? draft.kind : event.kind) || "Event"}</Tag>
        <div style={{ flex: 1 }} />
        <IconButton icon="x" label="Close inspector" onClick={onClose} />
      </div>

      {/* Body */}
      <div style={{ padding: "20px 18px", flex: 1, overflow: "auto" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: era?.color || "var(--accent)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          {formatEraYear(event)}
        </div>

        {editing ? (
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            style={{
              fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500,
              background: "transparent", border: "none", outline: "none",
              color: "var(--fg)", width: "100%",
              borderBottom: "1px dashed var(--accent)", paddingBottom: 4, marginBottom: 12,
            }}
          />
        ) : (
          <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500, color: "var(--fg)", marginBottom: 12 }}>
            {event.title}
          </h3>
        )}

        {editing ? (
          <textarea
            value={draft.desc}
            onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
            rows={4}
            style={{
              fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6,
              background: "var(--bg)", border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-md)", color: "var(--fg)",
              width: "100%", padding: "8px 10px", resize: "vertical", outline: "none",
            }}
          />
        ) : (
          event.desc && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)", lineHeight: 1.6 }}>
              {event.desc}
            </p>
          )
        )}

        {/* Info grid */}
        <div style={{ marginTop: 18, padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", fontSize: 13 }}>
            <InfoRow label="Kind">
              {editing ? (
                <>
                  <input
                    list="kind-suggestions"
                    value={draft.kind}
                    onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
                    style={{ background: "transparent", border: "none", outline: "none", color: "var(--fg)", fontFamily: "var(--font-sans)", fontSize: 13, width: "100%" }}
                  />
                  <datalist id="kind-suggestions">
                    <option value="Discovery" />
                    <option value="Physical" />
                    <option value="Historical" />
                    <option value="Event" />
                  </datalist>
                </>
              ) : event.kind || "Event"}
            </InfoRow>
            <InfoRow label={world.eraLabel || "Era"}>
              {editing ? (
                <select
                  value={draft.eraId}
                  onChange={(e) => setDraft({ ...draft, eraId: e.target.value, eraYear: 0 })}
                  style={{ background: "transparent", border: "none", outline: "none", color: "var(--fg)", fontFamily: "var(--font-sans)", fontSize: 13, cursor: "pointer" }}
                >
                  {eras.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              ) : era?.name || "—"}
            </InfoRow>
            <InfoRow label="Year">
              {editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <input
                    value={draft.eraYear}
                    onChange={(e) => setDraft({ ...draft, eraYear: Number(e.target.value) })}
                    type="number"
                    style={{ background: "transparent", border: "none", outline: "none", color: "var(--fg)", width: 80, fontFamily: "var(--font-sans)", fontSize: 13 }}
                  />
                  {yearError ? (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--error, #e86464)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{yearError}</span>
                  ) : previewYear ? (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{previewYear}</span>
                  ) : eraLength !== null ? (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>0 – {eraLength}</span>
                  ) : null}
                </div>
              ) : formatEraYear(event)}
            </InfoRow>
            {event.place && <InfoRow label="Place">{event.place}</InfoRow>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
        {editing ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setDraft(event); }}>Cancel</Button>
            <Button variant="primary" size="sm" icon="device-floppy" disabled={!!yearError} style={{ flex: 1, justifyContent: "center" }} onClick={() => { onSave(draft); setEditing(false); }}>Save</Button>
          </>
        ) : (
          <>
            <Button variant="danger" size="sm" icon="trash" onClick={onDelete} />
            <Button variant="secondary" size="sm" icon="pencil" style={{ flex: 1, justifyContent: "center" }} onClick={() => setEditing(true)}>Edit</Button>
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
          maxHeight: "85vh",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {panel}
      </div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", alignSelf: "baseline", paddingTop: 2 }}>{label}</span>
      <span style={{ color: "var(--fg)", fontFamily: "var(--font-sans)" }}>{children}</span>
    </>
  );
}

// ============================================================================
// Modals
// ============================================================================

function eraRangeError(from: number, to: number, otherEras: Era[]): string | null {
  if (to <= from) return "End year must be after start year";
  const clash = otherEras.find((e) => from < e.to && to > e.from);
  if (clash) return `Overlaps with "${clash.name}"`;
  return null;
}

function AddEraModal({ world, eras, onClose, onAdd }: {
  world: World; eras: Era[];
  onClose: () => void;
  onAdd: (name: string, shortLabel: string, from: number, to: number) => void;
}) {
  const [name, setName] = React.useState("");
  const [shortLabel, setShortLabel] = React.useState("");
  const [from, setFrom] = React.useState("0");
  const [to, setTo] = React.useState("500");

  const rangeError = eraRangeError(Number(from), Number(to), eras);

  return (
    <Modal title={`Add ${world.eraLabel || "Era"}`} onClose={onClose} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label={`${world.eraLabel || "Era"} name`}>
          <Input autoFocus placeholder="e.g. Voltov Formation" value={name} onChange={setName} />
        </Field>
        <Field label="Short label" hint={`Used as year suffix (like BCE/AD). Events in this era display as "150 ${shortLabel || "SVF"}".`}>
          <Input placeholder="e.g. SVF, BC, AE" value={shortLabel} onChange={setShortLabel} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Start year">
            <Input type="number" placeholder="-500" value={from} onChange={setFrom} />
          </Field>
          <Field label="End year">
            <Input type="number" placeholder="0" value={to} onChange={setTo} />
          </Field>
        </div>
        {rangeError ? (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--error, #e86464)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {rangeError}
          </div>
        ) : (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Use negative start years for "{world.negLabel || "BF"}" periods
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="plus" disabled={!name.trim() || !!rangeError} onClick={() => onAdd(name.trim(), shortLabel.trim(), Number(from), Number(to))}>
            Add {world.eraLabel || "Era"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function AddEventModal({ world, eras, onClose, onAdd }: {
  world: World; eras: Era[];
  onClose: () => void;
  onAdd: (data: Omit<TimelineEvent, "id" | "worldId">) => void;
}) {
  const [title, setTitle] = React.useState("");
  const [eraYear, setEraYear] = React.useState("0");
  const [desc, setDesc] = React.useState("");
  const [kind, setKind] = React.useState("event");
  const [eraId, setEraId] = React.useState(eras[0]?.id || "");
  const [place, setPlace] = React.useState("");

  const selectedEra = eras.find((e) => e.id === eraId);
  const eraLength = selectedEra ? selectedEra.to - selectedEra.from : null;
  const yearNum = Number(eraYear);
  const yearError = eraLength !== null && (yearNum < 0 || yearNum > eraLength)
    ? `Must be between 0 and ${eraLength}`
    : null;
  const previewLabel = selectedEra && !yearError
    ? `${eraYear} ${selectedEra.shortLabel || selectedEra.name}`
    : null;

  const handleEraChange = (id: string) => {
    setEraId(id);
    setEraYear("0");
  };

  return (
    <Modal title="Add event" onClose={onClose} width={460}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Event title">
          <Input autoFocus placeholder="e.g. The Great Collapse" value={title} onChange={setTitle} />
        </Field>
        {eras.length > 0 ? (
          <Field label={world.eraLabel || "Era"} hint="Events are timed relative to the start of their era">
            <Select
              value={eraId}
              onChange={handleEraChange}
              options={eras.map((e) => ({ value: e.id, label: e.shortLabel ? `${e.name} (${e.shortLabel})` : e.name }))}
            />
          </Field>
        ) : (
          <div style={{ padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Add an era first to set era-relative dates
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field
            label={`Year within ${world.eraLabel || "era"}`}
            hint={eraLength !== null ? `0 – ${eraLength}` : "0 = era start"}
          >
            <Input
              type="number"
              placeholder="0"
              value={eraYear}
              onChange={setEraYear}
            />
          </Field>
          <Field label="Kind">
            <Input placeholder="political, discovery, war..." value={kind} onChange={setKind} />
          </Field>
        </div>
        {yearError ? (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--error, #e86464)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {yearError}
          </div>
        ) : previewLabel ? (
          <div style={{ padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Displays as: {previewLabel}
            </div>
          </div>
        ) : null}
        <Field label="Place (optional)">
          <Input placeholder="e.g. Capital City" value={place} onChange={setPlace} />
        </Field>
        <Field label="Description">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            placeholder="What happened?"
            style={{
              fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6,
              padding: "9px 12px",
              background: "var(--bg-elevated)", border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-md)", color: "var(--fg)",
              width: "100%", resize: "vertical", outline: "none",
            }}
          />
        </Field>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="plus" disabled={!title.trim() || !!yearError} onClick={() => {
            onAdd({ eraYear: yearNum, title: title.trim(), desc, kind, eraId, place });
          }}>
            Add event
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function TimelineSettingsModal({ world, onClose, onSave }: {
  world: World;
  onClose: () => void;
  onSave: (patch: Partial<World>) => void;
}) {
  const [eraLabel, setEraLabel] = React.useState(world.eraLabel || "Era");
  const [negLabel, setNegLabel] = React.useState(world.negLabel || "BF");
  const [posLabel, setPosLabel] = React.useState(world.posLabel || "AF");

  return (
    <Modal title="Timeline settings" onClose={onClose} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Field label="Term for eras" hint={`This replaces "Era" throughout the timeline. E.g. Age, Cycle, Reign, Saga.`}>
          <Select
            value={eraLabel}
            onChange={setEraLabel}
            options={[
              { value: "Era", label: "Era" },
              { value: "Age", label: "Age" },
              { value: "Cycle", label: "Cycle" },
              { value: "Reign", label: "Reign" },
              { value: "Saga", label: "Saga" },
            ]}
          />
        </Field>
        <Field label="Custom era term (overrides above)">
          <Input placeholder="e.g. Period, Epoch..." value={eraLabel} onChange={setEraLabel} />
        </Field>
        <div style={{ padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>
            Absolute year labels (for the timeline ruler)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Negative years label">
              <Input placeholder="BCE, BF, Pre-..." value={negLabel} onChange={setNegLabel} />
            </Field>
            <Field label="Positive years label">
              <Input placeholder="AD, AF, Post-..." value={posLabel} onChange={setPosLabel} />
            </Field>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 10 }}>
            These appear on the timeline ruler only. Events use each era's own short label.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="device-floppy" onClick={() => onSave({ eraLabel, negLabel, posLabel })}>Save settings</Button>
        </div>
      </div>
    </Modal>
  );
}

function EditEraModal({ era, otherEras, eventCount, onClose, onSave, onDelete }: {
  era: Era; otherEras: Era[]; eventCount: number; onClose: () => void;
  onSave: (patch: Partial<Era>) => void;
  onDelete: () => void;
}) {
  const [name, setName] = React.useState(era.name);
  const [shortLabel, setShortLabel] = React.useState(era.shortLabel || "");
  const [from, setFrom] = React.useState(String(era.from));
  const [to, setTo] = React.useState(String(era.to));
  const [color, setColor] = React.useState(era.color);

  const rangeError = eraRangeError(Number(from), Number(to), otherEras);

  return (
    <Modal title="Edit era" onClose={onClose} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Name">
          <Input autoFocus value={name} onChange={setName} />
        </Field>
        <Field label="Short label" hint={`Used as year suffix. Events in this era display as "150 ${shortLabel || "SVF"}".`}>
          <Input placeholder="e.g. SVF, BC, AE" value={shortLabel} onChange={setShortLabel} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Start year">
            <Input type="number" value={from} onChange={setFrom} />
          </Field>
          <Field label="End year">
            <Input type="number" value={to} onChange={setTo} />
          </Field>
        </div>
        <Field label="Color">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ERA_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 24, height: 24, borderRadius: "50%", background: c, border: "none",
                  cursor: "pointer", outline: color === c ? `2px solid ${c}` : "none",
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </Field>
        {rangeError && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--error, #e86464)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {rangeError}
          </div>
        )}
        {eventCount > 0 && (
          <div style={{ padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {eventCount} event{eventCount !== 1 ? "s" : ""} belong to this era — reassign or delete them first
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="danger" size="sm" icon="trash" disabled={eventCount > 0} onClick={() => { if (confirm("Delete this era?")) onDelete(); }}>Delete</Button>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="device-floppy" disabled={!!rangeError} onClick={() => onSave({ name, shortLabel, from: Number(from), to: Number(to), color })}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}

function EmptyTimeline({ eraLabel, onAddEra }: { eraLabel: string; onAddEra: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 48 }}>
      <svg viewBox="0 0 240 80" style={{ width: 240, color: "var(--fg-muted)" }} fill="none">
        <line x1="20" y1="40" x2="220" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx="60" cy="40" r="5" stroke="currentColor" strokeWidth="1" />
        <circle cx="120" cy="40" r="5" stroke="currentColor" strokeWidth="1" />
        <circle cx="180" cy="40" r="5" stroke="currentColor" strokeWidth="1" />
        <rect x="45" y="15" width="30" height="18" rx="2" stroke="currentColor" strokeWidth="1" />
        <rect x="105" y="47" width="30" height="18" rx="2" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 500, color: "var(--fg)" }}>No timeline yet</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-secondary)", maxWidth: 320, textAlign: "center", lineHeight: 1.6 }}>
        Start by adding your first {eraLabel || "Era"} — a named time period with a short label like "SVF".
      </div>
      <Button variant="primary" icon="plus" onClick={onAddEra}>Add first {eraLabel || "Era"}</Button>
    </div>
  );
}
