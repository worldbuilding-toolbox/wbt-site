"use client";
import React from "react";
import {
  IconPlus, IconX, IconCheck, IconSearch, IconMenu2, IconDotsVertical,
  IconChevronLeft, IconChevronRight, IconChevronDown, IconArrowRight,
  IconArrowUpRight, IconFile, IconFileText, IconFileDescription, IconPaperclip,
  IconLink, IconExternalLink, IconFolder, IconPencil, IconTrash, IconEye, IconEyeOff,
  IconCopy, IconBookmark, IconUser, IconUserCircle, IconSettings, IconLogout,
  IconBell, IconAlertCircle, IconInfoCircle, IconCircleCheck, IconHash,
  IconCalendar, IconLayoutGrid, IconDragDrop, IconPhoto, IconUpload,
  IconDeviceFloppy, IconTimeline, IconMap, IconCompass, IconPlanet, IconGlobe,
  IconStar, IconMoonStars, IconRocket, IconTarget, IconChartArcs, IconGalaxy,
  IconSignal2g, IconDatabase, IconBook, IconBook2, IconNotebook, IconBooks,
  IconTelescope,
} from "@tabler/icons-react";

// ============================================================================
// Icon mapping
// ============================================================================

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>> = {
  "plus": IconPlus, "x": IconX, "check": IconCheck, "search": IconSearch,
  "menu-2": IconMenu2, "dots-vertical": IconDotsVertical,
  "chevron-left": IconChevronLeft, "chevron-right": IconChevronRight,
  "chevron-down": IconChevronDown, "arrow-right": IconArrowRight,
  "arrow-up-right": IconArrowUpRight, "file": IconFile, "file-text": IconFileText,
  "file-description": IconFileDescription, "paperclip": IconPaperclip, "link": IconLink,
  "external-link": IconExternalLink, "folder": IconFolder, "pencil": IconPencil,
  "trash": IconTrash, "eye": IconEye, "eye-off": IconEyeOff, "copy": IconCopy,
  "bookmark": IconBookmark, "user": IconUser, "user-circle": IconUserCircle,
  "settings": IconSettings, "logout": IconLogout, "bell": IconBell,
  "alert-circle": IconAlertCircle, "info-circle": IconInfoCircle,
  "circle-check": IconCircleCheck, "hash": IconHash, "calendar": IconCalendar,
  "layout-grid": IconLayoutGrid, "drag-vertical": IconDragDrop, "photo": IconPhoto,
  "upload": IconUpload, "device-floppy": IconDeviceFloppy, "timeline": IconTimeline,
  "map": IconMap, "compass": IconCompass, "planet": IconPlanet, "globe": IconGlobe,
  "star": IconStar, "moon-stars": IconMoonStars, "rocket": IconRocket,
  "target": IconTarget, "chart-arcs": IconChartArcs, "galaxy": IconGalaxy,
  "signal": IconSignal2g, "database": IconDatabase, "book": IconBook, "book-2": IconBook2,
  "scroll": IconNotebook, "book-open": IconBooks, "telescope": IconTelescope,
};

export function Icon({ name, size = 16, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  const Comp = ICONS[name];
  if (!Comp) return <span style={{ display: "inline-block", width: size, height: size, ...style }} />;
  return <Comp size={size} style={{ flexShrink: 0, ...style }} />;
}

// ============================================================================
// Logo
// ============================================================================

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: 14, md: 18, lg: 24 };
  const fs = sizes[size];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, userSelect: "none" }}>
      <div style={{
        width: fs * 1.6, height: fs * 1.6,
        background: "var(--accent)",
        borderRadius: "var(--radius-md)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="globe" size={fs} style={{ color: "var(--fg-on-accent)" }} />
      </div>
      <span style={{
        fontFamily: "var(--font-sans)", fontWeight: 500,
        fontSize: fs, letterSpacing: "-0.02em", color: "var(--fg)",
      }}>
        World<span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>builder</span>
      </span>
    </div>
  );
}

// ============================================================================
// Button
// ============================================================================

type ButtonVariant = "primary" | "secondary" | "ghost" | "subtle" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  variant = "primary", size = "md", icon, iconRight, children,
  style = {}, onClick, disabled, type = "button",
}: {
  variant?: ButtonVariant; size?: ButtonSize; icon?: string; iconRight?: string;
  children?: React.ReactNode; style?: React.CSSProperties;
  onClick?: () => void; disabled?: boolean; type?: "button" | "submit";
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const sizes = {
    sm: { fontSize: 11, padding: "6px 10px", gap: 5, iconSize: 13 },
    md: { fontSize: 12, padding: "8px 14px", gap: 6, iconSize: 15 },
    lg: { fontSize: 13, padding: "11px 18px", gap: 8, iconSize: 17 },
  };
  const variants = {
    primary: {
      background: hover ? "var(--accent-hover)" : "var(--accent)",
      color: "var(--fg-on-accent)",
      border: "1px solid transparent",
    },
    secondary: {
      background: hover ? "var(--bg-hover)" : "var(--bg-elevated)",
      color: "var(--fg)",
      border: "1px solid var(--border-strong)",
    },
    ghost: {
      background: hover ? "var(--bg-hover)" : "transparent",
      color: "var(--fg)",
      border: "1px solid transparent",
    },
    subtle: {
      background: hover ? "var(--bg-elevated)" : "var(--bg-hover)",
      color: "var(--fg)",
      border: "1px solid transparent",
    },
    danger: {
      background: hover ? "rgba(232,100,100,0.12)" : "transparent",
      color: "var(--danger)",
      border: "1px solid var(--danger)",
    },
  };
  const s = sizes[size];
  const v = variants[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        borderRadius: "var(--radius-md)",
        whiteSpace: "nowrap",
        transition: "background 120ms, opacity 120ms",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontSize: s.fontSize,
        padding: s.padding,
        opacity: disabled ? 0.5 : press ? 0.85 : 1,
        ...v,
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={s.iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.iconSize} />}
    </button>
  );
}

// ============================================================================
// IconButton
// ============================================================================

export function IconButton({
  icon, size = 16, variant = "ghost", label, onClick, style = {},
}: {
  icon: string; size?: number; variant?: "ghost" | "outlined" | "filled";
  label: string; onClick?: () => void; style?: React.CSSProperties;
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    ghost: { background: hover ? "var(--bg-hover)" : "transparent", color: "var(--fg-secondary)", border: "1px solid transparent" },
    outlined: { background: hover ? "var(--bg-hover)" : "transparent", color: "var(--fg-secondary)", border: "1px solid var(--border)" },
    filled: { background: hover ? "var(--bg-hover)" : "var(--bg-elevated)", color: "var(--fg)", border: "1px solid var(--border)" },
  };
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 7,
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 120ms",
        ...variants[variant],
        ...style,
      }}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

// ============================================================================
// Input / Textarea / Field
// ============================================================================

export function Input({
  style = {}, placeholder, value, onChange, type = "text", autoFocus, onKeyDown,
}: {
  style?: React.CSSProperties; placeholder?: string; value?: string;
  onChange?: (v: string) => void; type?: string; autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <input
      type={type}
      autoFocus={autoFocus}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--accent)";
        e.target.style.boxShadow = "var(--focus-ring)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--border-strong)";
        e.target.style.boxShadow = "none";
      }}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        padding: "9px 12px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-elevated)",
        color: "var(--fg)",
        outline: "none",
        width: "100%",
        transition: "border-color 120ms, box-shadow 120ms",
        ...style,
      }}
    />
  );
}

export function Textarea({
  style = {}, placeholder, value, onChange, rows = 3,
}: {
  style?: React.CSSProperties; placeholder?: string; value?: string;
  onChange?: (v: string) => void; rows?: number;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      rows={rows}
      onChange={(e) => onChange?.(e.target.value)}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--accent)";
        e.target.style.boxShadow = "var(--focus-ring)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--border-strong)";
        e.target.style.boxShadow = "none";
      }}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        lineHeight: 1.6,
        padding: "10px 12px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-elevated)",
        color: "var(--fg)",
        outline: "none",
        resize: "vertical",
        width: "100%",
        minHeight: 80,
        transition: "border-color 120ms, box-shadow 120ms",
        ...style,
      }}
    />
  );
}

export function Field({
  label, hint, children, style = {},
}: {
  label?: string; hint?: string; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label style={{
          fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)",
          textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 500,
        }}>
          {label}
        </label>
      )}
      {children}
      {hint && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)" }}>{hint}</span>}
    </div>
  );
}

// ============================================================================
// Tag
// ============================================================================

export function Tag({
  tone = "neutral", children, icon, style = {},
}: {
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
  children: React.ReactNode; icon?: string; style?: React.CSSProperties;
}) {
  const tones = {
    neutral: { color: "var(--fg-secondary)", borderColor: "var(--border-strong)" },
    accent:  { color: "var(--accent)", borderColor: "var(--accent)" },
    success: { color: "var(--success)", borderColor: "var(--success)" },
    warning: { color: "var(--warning)", borderColor: "var(--warning)" },
    danger:  { color: "var(--danger)", borderColor: "var(--danger)" },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase",
      letterSpacing: "0.1em", padding: "3px 8px",
      borderRadius: "var(--radius-sm)",
      border: `1px solid ${t.borderColor}`,
      color: t.color,
      background: "transparent",
      lineHeight: 1.5,
      ...style,
    }}>
      {icon && <Icon name={icon} size={10} />}
      {children}
    </span>
  );
}

// ============================================================================
// Avatar
// ============================================================================

export function Avatar({ initials, size = 28 }: { initials: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "var(--accent)", color: "var(--fg-on-accent)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)", fontSize: size * 0.38, fontWeight: 600,
      flexShrink: 0, userSelect: "none",
    }}>
      {initials}
    </div>
  );
}

// ============================================================================
// Divider
// ============================================================================

export function Divider({ vertical, style = {} }: { vertical?: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--border)",
      ...(vertical ? { width: 1, alignSelf: "stretch" } : { height: 1, width: "100%" }),
      ...style,
    }} />
  );
}

// ============================================================================
// Select
// ============================================================================

export function Select({
  value, onChange, options, style = {},
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; style?: React.CSSProperties;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        padding: "6px 10px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-elevated)",
        color: "var(--fg)",
        outline: "none",
        cursor: "pointer",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        ...style,
      }}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ============================================================================
// Modal
// ============================================================================

export function Modal({
  title, children, onClose, width = 480,
}: {
  title: string; children: React.ReactNode; onClose: () => void; width?: number;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "var(--bg-overlay)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }} onClick={onClose}>
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          width: "100%", maxWidth: width,
          maxHeight: "85vh", overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: "18px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)" }}>
            {title}
          </span>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ConstellationBackdrop (animated stars)
// ============================================================================

export function ConstellationBackdrop({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", ...style,
      }}
      fill="none"
    >
      {/* Constellation group 1 */}
      <g style={{ animation: "drift 44s ease-in-out infinite" }}>
        <g stroke="#7fdbff" strokeWidth="0.5" strokeOpacity="0.3">
          <line x1="80" y1="120" x2="200" y2="180" />
          <line x1="200" y1="180" x2="280" y2="140" />
          <line x1="280" y1="140" x2="360" y2="200" />
        </g>
        <circle cx="80" cy="120" r="1.5" fill="#7fdbff" fillOpacity="0.6" style={{ animation: "twinkle 4s ease-in-out infinite" }} />
        <circle cx="200" cy="180" r="2.5" fill="#7fdbff" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
        <circle cx="280" cy="140" r="1.5" fill="#7fdbff" fillOpacity="0.7" style={{ animation: "twinkle 5s ease-in-out infinite 0.5s" }} />
        <circle cx="360" cy="200" r="2" fill="#7fdbff" fillOpacity="0.5" style={{ animation: "twinkle 6s ease-in-out infinite 1s" }} />
      </g>
      {/* Constellation group 2 */}
      <g style={{ animation: "drift 54s ease-in-out infinite reverse" }}>
        <g stroke="#7fdbff" strokeWidth="0.5" strokeOpacity="0.25">
          <line x1="500" y1="80" x2="620" y2="150" />
          <line x1="620" y1="150" x2="700" y2="100" />
        </g>
        <circle cx="500" cy="80" r="1.8" fill="#7fdbff" fillOpacity="0.5" style={{ animation: "twinkle 5.5s ease-in-out infinite 2s" }} />
        <circle cx="620" cy="150" r="2.5" fill="#7fdbff" style={{ animation: "pulse-glow 4s ease-in-out infinite 1s" }} />
        <circle cx="700" cy="100" r="1.3" fill="#7fdbff" fillOpacity="0.6" style={{ animation: "twinkle 4.5s ease-in-out infinite 0.3s" }} />
      </g>
      {/* Scattered stars */}
      {[
        [150, 300, 0.8, 3.2], [400, 60, 0.7, 4.8], [600, 350, 0.9, 5.1],
        [720, 280, 0.6, 3.9], [50, 450, 0.8, 6.2], [350, 420, 0.7, 4.1],
        [480, 320, 0.9, 5.5], [120, 220, 0.5, 7], [660, 480, 0.6, 4.4],
      ].map(([x, y, op, dur], i) => (
        <circle
          key={i} cx={x} cy={y} r={0.9}
          fill="white" fillOpacity={op}
          style={{ animation: `twinkle ${dur}s ease-in-out infinite ${i * 0.7}s` }}
        />
      ))}
    </svg>
  );
}
