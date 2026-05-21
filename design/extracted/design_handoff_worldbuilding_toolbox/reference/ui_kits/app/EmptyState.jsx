/* EmptyState.jsx — shared empty state with illustration + tip + CTA */

function EmptyState({ illustration = "constellation", title, body, primary, secondary }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 48,
        border: "1px dashed var(--border-strong)",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-elevated)",
        textAlign: "center",
        maxWidth: 520,
        margin: "0 auto",
      }}
    >
      <Illustration kind={illustration} />
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500, color: "var(--fg)", margin: 0, letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      {body && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, color: "var(--fg-secondary)", margin: 0, maxWidth: 36 + "ch" }}>
          {body}
        </p>
      )}
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        {primary}
        {secondary}
      </div>
    </div>
  );
}

function Illustration({ kind }) {
  if (kind === "timeline") {
    return (
      <svg width="220" height="100" viewBox="0 0 240 120" fill="none" style={{ color: "var(--steel-300)" }}>
        <line x1="20" y1="60" x2="220" y2="60" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="2 6" strokeLinecap="round" />
        <g stroke="currentColor" strokeOpacity="0.5" fill="none">
          <circle cx="20" cy="60" r="3" />
          <circle cx="220" cy="60" r="3" />
        </g>
        <rect x="100" y="30" width="40" height="22" rx="2" stroke="var(--cyan)" strokeOpacity="0.5" strokeDasharray="2 3" />
      </svg>
    );
  }
  if (kind === "notebook") {
    return (
      <svg width="220" height="140" viewBox="0 0 240 160" fill="none" style={{ color: "var(--steel-300)" }}>
        <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M40 40 L120 50 L200 40 L200 130 L120 140 L40 130 Z" />
          <line x1="120" y1="50" x2="120" y2="140" />
        </g>
        <g stroke="currentColor" strokeOpacity="0.25" strokeWidth="1">
          <line x1="55" y1="65" x2="105" y2="68" />
          <line x1="55" y1="80" x2="100" y2="83" />
          <line x1="135" y1="65" x2="185" y2="62" />
          <line x1="135" y1="80" x2="180" y2="78" />
        </g>
      </svg>
    );
  }
  // default: constellation
  return (
    <svg width="220" height="140" viewBox="0 0 240 160" fill="none" style={{ color: "var(--steel-300)" }}>
      <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5">
        <line x1="60" y1="50" x2="110" y2="80" />
        <line x1="110" y1="80" x2="150" y2="55" />
        <line x1="150" y1="55" x2="180" y2="95" />
        <line x1="110" y1="80" x2="130" y2="125" />
      </g>
      <g fill="currentColor">
        <circle cx="60" cy="50" r="2" />
        <circle cx="110" cy="80" r="2.5" fill="var(--cyan)" />
        <circle cx="150" cy="55" r="2" />
        <circle cx="180" cy="95" r="2.2" />
        <circle cx="130" cy="125" r="1.8" />
        <circle cx="30" cy="100" r="1" opacity="0.5" />
        <circle cx="200" cy="40" r="1" opacity="0.5" />
        <circle cx="210" cy="135" r="1" opacity="0.5" />
      </g>
    </svg>
  );
}

if (typeof window !== "undefined") { window.EmptyState = EmptyState; window.Illustration = Illustration; }
