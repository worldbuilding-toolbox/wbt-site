"use client";
import React from "react";
import { Button, Icon } from "./Primitives";
import { exportAccount } from "./export";
import { exportAccountZip } from "./export-zip";
import { getCurrentUser } from "./store";

type Props = {
  /** Label shown in the fallback heading. "the app" by default. */
  scope?: string;
  /** Optional custom fallback. Overrides the built-in card. */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
  children: React.ReactNode;
};

type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep console noise small in prod but useful in dev.
    if (typeof console !== "undefined") {
      console.error("[ErrorBoundary]", this.props.scope ?? "app", error, info);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return <DefaultFallback error={this.state.error} reset={this.reset} scope={this.props.scope} />;
    }
    return this.props.children;
  }
}

function DefaultFallback({ error, reset, scope }: { error: Error; reset: () => void; scope?: string }) {
  const exportJson = () => {
    const u = getCurrentUser();
    if (u) exportAccount(u);
  };
  const exportZip = async () => {
    const u = getCurrentUser();
    if (u) await exportAccountZip(u);
  };

  return (
    <div
      role="alert"
      style={{
        flex: 1,
        minHeight: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        style={{
          maxWidth: 460,
          width: "100%",
          padding: "22px 24px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--danger)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="alert-circle" size={18} style={{ color: "var(--danger)" }} />
          <div
            style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              color: "var(--danger)", textTransform: "uppercase", letterSpacing: "0.14em",
            }}
          >
            Something broke in {scope ?? "the app"}
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)", fontSize: 14,
            color: "var(--fg)", lineHeight: 1.55,
          }}
        >
          Your data is still here, in the browser. Before reloading, save a copy
          to your computer — that's the safest thing to do right now.
        </p>
        <pre
          style={{
            margin: 0,
            padding: "8px 10px",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-muted)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: 120,
            overflow: "auto",
          }}
        >
          {error.message || String(error)}
        </pre>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="secondary" icon="paperclip" size="sm" onClick={exportZip}>
            Export ZIP
          </Button>
          <Button variant="secondary" icon="device-floppy" size="sm" onClick={exportJson}>
            Export JSON
          </Button>
          <div style={{ flex: 1 }} />
          <Button variant="primary" icon="arrow-right" size="sm" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
