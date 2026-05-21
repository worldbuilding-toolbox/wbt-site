"use client";
import React from "react";
import { Icon, Logo, IconButton, Avatar } from "./Primitives";
import type { User, World } from "./store";

type WorldView = "timeline" | "articles" | "ideas" | "help";

const WORLD_SECTIONS: { key: WorldView; icon: string; label: string }[] = [
  { key: "timeline", icon: "timeline", label: "Timeline" },
  { key: "articles", icon: "book-2", label: "Articles" },
  { key: "ideas", icon: "bookmark", label: "Ideas" },
  { key: "help", icon: "compass", label: "Help" },
];

// ============================================================================
// Sidebar
// ============================================================================

export function Sidebar({
  user, worlds, world, view, onGoToDashboard, onSelectWorld, onChangeView, onSignOut,
}: {
  user: User;
  worlds: World[];
  world: World | null;
  view: WorldView;
  onGoToDashboard: () => void;
  onSelectWorld: (id: string) => void;
  onChangeView: (v: WorldView) => void;
  onSignOut: () => void;
}) {
  return (
    <aside style={{
      width: 244,
      flexShrink: 0,
      borderRight: "1px solid var(--border)",
      background: "var(--bg-sunken)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px", borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={onGoToDashboard}
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
        >
          <Logo size="md" />
        </button>
      </div>

      {/* Worlds list */}
      <div style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)" }}>
        <SidebarLabel>Your worlds</SidebarLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 6 }}>
          {worlds.map((w) => (
            <SidebarItem
              key={w.id}
              active={world?.id === w.id}
              onClick={() => onSelectWorld(w.id)}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: w.color, flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</span>
            </SidebarItem>
          ))}
          <SidebarItem active={false} onClick={onGoToDashboard} muted>
            <Icon name="plus" size={13} />
            <span>New world</span>
          </SidebarItem>
        </div>
      </div>

      {/* In-world nav */}
      {world && (
        <div style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)" }}>
          <SidebarLabel>{world.name}</SidebarLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 6 }}>
            {WORLD_SECTIONS.map((s) => (
              <SidebarItem
                key={s.key}
                active={view === s.key}
                activeBar
                onClick={() => onChangeView(s.key)}
              >
                <Icon name={s.icon} size={14} />
                <span>{s.label}</span>
                {view === s.key && (
                  <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)", letterSpacing: "0.1em" }}>•</span>
                )}
              </SidebarItem>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Bottom */}
      <div style={{ padding: "10px 10px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 4 }}>
          <Avatar initials={user.name.slice(0, 2).toUpperCase()} size={24} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.name}
          </span>
        </div>
        <SidebarItem active={false} muted onClick={onSignOut}>
          <Icon name="logout" size={13} />
          <span>Sign out</span>
        </SidebarItem>
      </div>
    </aside>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "var(--font-mono)", fontSize: 10,
      textTransform: "uppercase", letterSpacing: "0.16em",
      color: "var(--fg-muted)", fontWeight: 500, padding: "0 8px 4px",
    }}>
      {children}
    </div>
  );
}

function SidebarItem({
  children, active, activeBar, muted, onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  activeBar?: boolean;
  muted?: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "7px 10px",
        background: active ? "var(--bg-hover)" : hover ? "rgba(255,255,255,0.03)" : "transparent",
        border: "none",
        borderLeft: activeBar ? (active ? "2px solid var(--accent)" : "2px solid transparent") : "none",
        paddingLeft: activeBar ? 9 : 10,
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: active ? "var(--fg)" : muted ? "var(--fg-muted)" : "var(--fg-secondary)",
        width: "100%",
        textAlign: "left",
        lineHeight: 1.4,
        transition: "background 120ms, color 120ms",
      }}
    >
      {children}
    </button>
  );
}

// ============================================================================
// TopBar
// ============================================================================

export function TopBar({
  world, view, onGoToDashboard, searchQuery, onSearch,
}: {
  world: World | null;
  view: WorldView;
  onGoToDashboard: () => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}) {
  const viewLabel = ({ timeline: "Timeline", articles: "Articles", ideas: "Ideas", help: "Help" })[view] || "";

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 10,
      height: 56, background: "var(--bg)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", gap: 12, padding: "0 20px",
    }}>
      {/* Crumbs */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--fg-secondary)", textTransform: "uppercase", letterSpacing: "0.1em",
      }}>
        <button
          onClick={onGoToDashboard}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--fg-secondary)", fontFamily: "var(--font-mono)",
            fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em",
            padding: 0,
          }}
        >
          Worlds
        </button>
        {world && (
          <>
            <Icon name="chevron-right" size={12} style={{ color: "var(--fg-muted)" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: world.color }} />
              {world.name}
            </span>
            <Icon name="chevron-right" size={12} style={{ color: "var(--fg-muted)" }} />
            <span style={{ color: "var(--accent)" }}>{viewLabel}</span>
          </>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 12px",
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)", width: 240, color: "var(--fg-muted)",
      }}>
        <Icon name="search" size={13} />
        <input
          placeholder="QUERY..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            background: "transparent", border: "none", outline: "none",
            color: "var(--fg)", fontFamily: "var(--font-mono)", fontSize: 11,
            flex: 1, textTransform: "uppercase", letterSpacing: "0.08em",
          }}
        />
      </div>

      <IconButton icon="bell" variant="outlined" label="Notifications" />
    </div>
  );
}
