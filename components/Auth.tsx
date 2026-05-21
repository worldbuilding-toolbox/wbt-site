"use client";
import React from "react";
import { Logo, ConstellationBackdrop, Button, Input, Field } from "./Primitives";
import { signIn, signUp, type User } from "./store";

type AuthView = "login" | "signup";

export function AuthScreen({ onAuth }: { onAuth: (user: User) => void }) {
  const [view, setView] = React.useState<AuthView>("login");

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(380px, 1fr) minmax(0, 1.1fr)",
      height: "100vh",
      background: "var(--bg)",
    }}>
      {/* Left — form column */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: "48px",
        justifyContent: "center",
        borderRight: "1px solid var(--border)",
        maxWidth: 560,
        width: "100%",
      }}>
        <div style={{ marginBottom: 48 }}>
          <Logo size="md" />
        </div>

        {view === "login" ? (
          <LoginForm onAuth={onAuth} onSwitchToSignup={() => setView("signup")} />
        ) : (
          <SignupForm onAuth={onAuth} onSwitchToLogin={() => setView("login")} />
        )}

        <div style={{
          marginTop: "auto",
          paddingTop: 48,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--fg-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}>
          v0.1 · alpha
        </div>
      </div>

      {/* Right — brand panel */}
      <div style={{
        position: "relative",
        background: "linear-gradient(180deg, var(--space-850) 0%, var(--space-950) 100%)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "48px 56px",
      }}>
        <ConstellationBackdrop />

        {/* Bottom gradient protection */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "55%",
          background: "linear-gradient(to top, var(--space-950) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Foreground text */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.14em",
            marginBottom: 16,
          }}>
            From the help library
          </div>
          <blockquote style={{
            margin: 0, fontFamily: "var(--font-serif)",
            fontSize: 20, color: "var(--fg-secondary)",
            fontStyle: "italic", lineHeight: 1.6,
          }}>
            "Build only what you need for the next chapter.
            The Toolbox will keep your blank sections forever."
          </blockquote>
          <footer style={{
            marginTop: 12, fontFamily: "var(--font-mono)",
            fontSize: 11, color: "var(--fg-muted)",
            textTransform: "uppercase", letterSpacing: "0.12em",
          }}>
            — Help & how-to: Designing your first world
          </footer>
        </div>

        {/* Scan-line overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "var(--grain)",
          pointerEvents: "none",
          opacity: 0.6,
        }} />
      </div>
    </div>
  );
}

// ============================================================================
// Login form
// ============================================================================

function LoginForm({ onAuth, onSwitchToSignup }: { onAuth: (u: User) => void; onSwitchToSignup: () => void }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = signIn(email, password);
    setLoading(false);
    if (typeof result === "string") { setError(result); return; }
    onAuth(result);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>
          Welcome back
        </div>
        <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--fg)" }}>
          Sign in
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--fg-secondary)", marginTop: 8 }}>
          Pick up where you left off.
        </p>
      </div>

      {error && (
        <div style={{ padding: "10px 14px", background: "rgba(232,100,100,0.1)", border: "1px solid var(--danger)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--danger)" }}>
          {error}
        </div>
      )}

      <Field label="Email">
        <Input type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
      </Field>

      <Field label="Password">
        <Input type="password" placeholder="Your passphrase" value={password} onChange={setPassword} />
      </Field>

      <Button type="submit" variant="primary" size="lg" iconRight="arrow-right" style={{ width: "100%", justifyContent: "center" }}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-secondary)", textAlign: "center" }}>
        No account?{" "}
        <button type="button" onClick={onSwitchToSignup} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", textDecoration: "underline" }}>
          Create one
        </button>
      </p>
    </form>
  );
}

// ============================================================================
// Signup form
// ============================================================================

function SignupForm({ onAuth, onSwitchToLogin }: { onAuth: (u: User) => void; onSwitchToLogin: () => void }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agreed) { setError("Please agree to the terms to continue."); return; }
    if (password.length < 10) { setError("Password must be at least 10 characters."); return; }
    const result = signUp(name, email, password);
    if (typeof result === "string") { setError(result); return; }
    onAuth(result);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>
          New here
        </div>
        <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--fg)" }}>
          Create an account
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--fg-secondary)", marginTop: 8 }}>
          Your worlds wait for you.
        </p>
      </div>

      {error && (
        <div style={{ padding: "10px 14px", background: "rgba(232,100,100,0.1)", border: "1px solid var(--danger)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--danger)" }}>
          {error}
        </div>
      )}

      <Field label="Name">
        <Input placeholder="Your name" value={name} onChange={setName} />
      </Field>

      <Field label="Email">
        <Input type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
      </Field>

      <Field label="Password" hint="At least 10 characters — a long passphrase works best.">
        <Input type="password" placeholder="Long passphrase" value={password} onChange={setPassword} />
      </Field>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: 2, accentColor: "var(--accent)", cursor: "pointer" }}
        />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-secondary)", lineHeight: 1.5 }}>
          I understand: no tracking, no training on my worlds, plain-text export at any time.
        </span>
      </label>

      <Button type="submit" variant="primary" size="lg" iconRight="arrow-right" style={{ width: "100%", justifyContent: "center" }}>
        Create account
      </Button>

      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-secondary)", textAlign: "center" }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", textDecoration: "underline" }}>
          Sign in
        </button>
      </p>
    </form>
  );
}
