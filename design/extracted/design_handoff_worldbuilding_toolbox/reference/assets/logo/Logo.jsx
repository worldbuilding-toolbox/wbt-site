/* Logo.jsx — Worldbuilding Toolbox logotype
   Typographic-only (no mark). Two presentations, theme-bound.

   Usage:
     <Logo />                  // primary, current theme
     <Logo size="sm" />        // small
     <Logo variant="short" />  // "WT" monogram
*/

function Logo({ size = "md", variant = "full", className = "", style = {} }) {
  const sizes = {
    sm: { full: 18, short: 16 },
    md: { full: 22, short: 20 },
    lg: { full: 32, short: 28 },
    xl: { full: 48, short: 40 },
  };
  const fontSize = sizes[size][variant];

  if (variant === "short") {
    return (
      <span
        className={`wbt-logo wbt-logo-short ${className}`}
        style={{
          fontFamily: "var(--font-display)",
          fontSize,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          color: "var(--fg)",
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "baseline",
          ...style,
        }}
      >
        Wt
        <span style={{ color: "var(--accent)" }}>.</span>
      </span>
    );
  }

  return (
    <span
      className={`wbt-logo ${className}`}
      style={{
        fontFamily: "var(--font-display)",
        fontSize,
        fontWeight: 500,
        letterSpacing: "-0.02em",
        color: "var(--fg)",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.18em",
        ...style,
      }}
    >
      <span>Worldbuilding</span>
      <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>Toolbox</span>
    </span>
  );
}

if (typeof window !== "undefined") {
  window.Logo = Logo;
}
