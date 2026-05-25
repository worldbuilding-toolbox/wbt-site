"use client";
import React from "react";
import { Icon } from "./Primitives";
import { useIsMobile } from "./hooks";

export type ToastTone = "info" | "success" | "danger";

export type Toast = {
  id: string;
  message: string;
  tone?: ToastTone;
  action?: { label: string; onClick: () => void };
  durationMs?: number;
};

type ToastInput = Omit<Toast, "id">;

type ToastContextValue = {
  push: (t: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 5000;
const MAX_VISIBLE = 4;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = React.useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const push = React.useCallback((input: ToastInput): string => {
    const id = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => {
      const next = [...prev, { ...input, id }];
      // Keep only the newest MAX_VISIBLE; drop the oldest with its timer.
      if (next.length > MAX_VISIBLE) {
        const dropped = next.slice(0, next.length - MAX_VISIBLE);
        for (const d of dropped) {
          const t = timers.current.get(d.id);
          if (t) {
            clearTimeout(t);
            timers.current.delete(d.id);
          }
        }
        return next.slice(-MAX_VISIBLE);
      }
      return next;
    });
    const duration = input.durationMs ?? DEFAULT_DURATION_MS;
    if (duration > 0) {
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
    }
    return id;
  }, [dismiss]);

  // Cleanup timers on unmount
  React.useEffect(() => {
    const t = timers.current;
    return () => {
      for (const id of t.keys()) clearTimeout(t.get(id)!);
      t.clear();
    };
  }, []);

  const value = React.useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastList toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ============================================================================
// Visual stack
// ============================================================================

function ToastList({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  const isMobile = useIsMobile();
  if (toasts.length === 0) return null;
  return (
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: "fixed",
        zIndex: 200,
        bottom: isMobile ? 16 : 20,
        right: isMobile ? 16 : 20,
        left: isMobile ? 16 : "auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const tones: Record<ToastTone, { border: string; accent: string; icon: string }> = {
    info: { border: "var(--border-strong)", accent: "var(--accent)", icon: "info-circle" },
    success: { border: "var(--success)", accent: "var(--success)", icon: "circle-check" },
    danger: { border: "var(--danger)", accent: "var(--danger)", icon: "alert-circle" },
  };
  const tone = tones[toast.tone ?? "info"];

  return (
    <div
      role="status"
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 12px",
        background: "var(--bg-elevated)",
        border: `1px solid ${tone.border}`,
        borderLeft: `2px solid ${tone.accent}`,
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)",
        minWidth: 240,
        maxWidth: 380,
        animation: "fade-in 0.18s var(--ease-out)",
      }}
    >
      <Icon name={tone.icon} size={14} style={{ color: tone.accent, marginTop: 2, flexShrink: 0 }} />
      <div style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)", lineHeight: 1.45 }}>
        {toast.message}
      </div>
      {toast.action && (
        <button
          onClick={() => { toast.action!.onClick(); onDismiss(); }}
          style={{
            background: "transparent",
            border: "none",
            color: tone.accent,
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "2px 6px",
            flexShrink: 0,
          }}
        >
          {toast.action.label}
        </button>
      )}
      <button
        aria-label="Dismiss"
        onClick={onDismiss}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--fg-muted)",
          cursor: "pointer",
          padding: 2,
          display: "flex",
          flexShrink: 0,
        }}
      >
        <Icon name="x" size={12} />
      </button>
    </div>
  );
}
