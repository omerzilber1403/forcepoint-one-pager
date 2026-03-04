"use client";

import { Suspense, lazy, Component, type ReactNode } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

// ── Spinner shown while the WASM runtime loads ──────────────────────────────
function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
      />
    </div>
  );
}

// ── Animated CSS fallback shown when the scene fails to deserialize ──────────
function SplineFallback() {
  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "#12121a" }}
    >
      {/* Concentric pulsing rings */}
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="absolute rounded-full border"
          style={{
            width: `${n * 120}px`,
            height: `${n * 120}px`,
            borderColor: n % 2 === 0 ? "rgba(99,102,241,0.15)" : "rgba(34,211,238,0.1)",
            animation: `ring-pulse ${2 + n * 0.4}s ease-in-out infinite`,
            animationDelay: `${n * 0.3}s`,
          }}
        />
      ))}

      {/* Central glyph */}
      <div
        className="relative z-10 flex flex-col items-center gap-3"
        style={{ color: "#6366f1" }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: "slow-spin 12s linear infinite" }}
        >
          <path
            d="M24 4L44 14V34L24 44L4 34V14L24 4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M24 14L34 19V29L24 34L14 29V19L24 14Z"
            stroke="#22d3ee"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <circle cx="24" cy="24" r="3" fill="currentColor" />
        </svg>
        <span
          className="text-xs font-mono tracking-widest uppercase"
          style={{ color: "#475569" }}
        >
          AI · Automation
        </span>
      </div>

      <style>{`
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ── Class-based ErrorBoundary (React requires class for error catching) ───────
interface BoundaryState { hasError: boolean }

class SplineErrorBoundary extends Component<
  { children: ReactNode },
  BoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <SplineFallback />;
    return this.props.children;
  }
}

// ── Public component ─────────────────────────────────────────────────────────
interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <SplineErrorBoundary>
      <Suspense fallback={<SplineLoader />}>
        <Spline scene={scene} className={className} />
      </Suspense>
    </SplineErrorBoundary>
  );
}
