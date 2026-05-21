/* Primitives.jsx — shared building blocks for the app kit.
   Theme-aware via CSS tokens; a few inline conditionals where Constellation
   needs HUD-style typography (mono + uppercase). */

/* Single-theme (Constellation) — the helper always returns true so any
   theme-aware branch always lights up the HUD/mono code path. */

const isConstellation = () => true;

function Button({ variant = "primary", size = "md", icon, iconRight, children, style = {}, ...rest }) {
  const sizes = {
    sm: { fontSize: 12, padding: "6px 10px", gap: 6, iconSize: 14 },
    md: { fontSize: 13, padding: "8px 14px", gap: 6, iconSize: 16 },
    lg: { fontSize: 14, padding: "11px 18px", gap: 8, iconSize: 18 },
  };
  const variants = {
    primary: { background: "var(--accent)", color: "var(--fg-on-accent)", border: "1px solid var(--accent)" },
    secondary: { background: "var(--bg-elevated)", color: "var(--fg)", border: "1px solid var(--border-strong)" },
    ghost: { background: "transparent", color: "var(--fg)", border: "1px solid transparent" },
    subtle: { background: "var(--bg-hover)", color: "var(--fg)", border: "1px solid transparent" },
    danger: { background: "transparent", color: "var(--danger)", border: "1px solid var(--danger)" },
  };
  const s = sizes[size];
  const v = variants[variant];
  const hud = isConstellation();
  return (
    <button
      style={{
        fontFamily: hud ? "var(--font-mono)" : "var(--font-ui)",
        fontWeight: 500,
        cursor: "pointer",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        borderRadius: "var(--radius-md)",
        whiteSpace: "nowrap",
        transition: "background 120ms ease-out, border-color 120ms ease-out",
        textTransform: hud ? "uppercase" : "none",
        letterSpacing: hud ? "0.08em" : "0",
        fontSize: hud ? s.fontSize - 1 : s.fontSize,
        padding: s.padding,
        ...v,
        ...style,
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={s.iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.iconSize} />}
    </button>
  );
}

function IconButton({ icon, size = 16, variant = "ghost", label, style = {}, ...rest }) {
  const variants = {
    ghost: { background: "transparent", color: "var(--fg-secondary)", border: "1px solid transparent" },
    outlined: { background: "transparent", color: "var(--fg-secondary)", border: "1px solid var(--border)" },
    filled: { background: "var(--bg-elevated)", color: "var(--fg)", border: "1px solid var(--border)" },
  };
  return (
    <button
      aria-label={label}
      title={label}
      style={{
        padding: 7,
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 120ms ease-out, color 120ms ease-out",
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

function Field({ label, hint, children, style = {} }) {
  const hud = isConstellation();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label
          style={{
            fontFamily: hud ? "var(--font-mono)" : "var(--font-ui)",
            fontSize: hud ? 10 : 12,
            color: hud ? "var(--accent)" : "var(--fg-secondary)",
            textTransform: hud ? "uppercase" : "none",
            letterSpacing: hud ? "0.14em" : "0",
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      {children}
      {hint && (
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--fg-muted)" }}>{hint}</span>
      )}
    </div>
  );
}

function Input({ style = {}, ...rest }) {
  return (
    <input
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: 14,
        padding: "9px 12px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-elevated)",
        color: "var(--fg)",
        outline: "none",
        transition: "border-color 120ms ease-out, box-shadow 120ms ease-out",
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--accent)";
        e.target.style.boxShadow = "var(--focus-ring)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--border-strong)";
        e.target.style.boxShadow = "none";
      }}
      {...rest}
    />
  );
}

function Textarea({ style = {}, ...rest }) {
  return (
    <textarea
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 15,
        lineHeight: 1.6,
        padding: "10px 14px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-elevated)",
        color: "var(--fg)",
        outline: "none",
        resize: "vertical",
        minHeight: 100,
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--accent)";
        e.target.style.boxShadow = "var(--focus-ring)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--border-strong)";
        e.target.style.boxShadow = "none";
      }}
      {...rest}
    />
  );
}

function Tag({ tone = "neutral", children, icon, style = {} }) {
  const hud = isConstellation();
  const tones = hud
    ? {
        neutral: { color: "var(--fg-secondary)", border: "var(--border-strong)" },
        accent: { color: "var(--accent)", border: "var(--accent)" },
        success: { color: "var(--success)", border: "var(--success)" },
        warning: { color: "var(--warning)", border: "var(--warning)" },
      }
    : {
        neutral: { color: "var(--fg-secondary)", border: "var(--border-strong)", background: "var(--bg-hover)" },
        accent: { color: "var(--accent)", border: "transparent", background: "var(--accent-soft)" },
        success: { color: "var(--success)", border: "transparent", background: "rgba(74, 96, 66, 0.10)" },
        warning: { color: "var(--warning)", border: "transparent", background: "rgba(160, 106, 29, 0.12)" },
      };
  const t = tones[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: hud ? "var(--font-mono)" : "var(--font-ui)",
        fontSize: hud ? 10 : 11,
        textTransform: hud ? "uppercase" : "none",
        letterSpacing: hud ? "0.1em" : "0",
        padding: "3px 8px",
        borderRadius: hud ? "var(--radius-sm)" : "var(--radius-pill)",
        border: `1px solid ${t.border}`,
        color: t.color,
        background: t.background || "transparent",
        lineHeight: 1.5,
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={10} />}
      {children}
    </span>
  );
}

function Avatar({ initials, color = "var(--accent)", size = 28 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        color: "var(--fg-on-accent)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-ui)",
        fontSize: size * 0.4,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function Divider({ vertical, style = {} }) {
  return (
    <div
      style={{
        background: "var(--border)",
        ...(vertical
          ? { width: 1, alignSelf: "stretch" }
          : { height: 1, width: "100%" }),
        ...style,
      }}
    />
  );
}

if (typeof window !== "undefined") {
  Object.assign(window, { Button, IconButton, Field, Input, Textarea, Tag, Avatar, Divider, isConstellation });
}
