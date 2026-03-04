"use client";
import { useState } from "react";
import {
  Shield, KeyRound, Bot, Zap, Github, ArrowUpRight, ChevronRight,
} from "lucide-react";
import { ProjectModal } from "@/components/ui/project-modal";
import { MultiClientTerminalWarm } from "@/components/ui/multi-client-terminal-warm";

/* ── Warm brand tokens ────────────────────────────────────────────────────── */
const W = {
  amber:       "#f59e0b",
  amberGlass:  "rgba(245,158,11,0.08)",
  amberBorder: "rgba(245,158,11,0.28)",
  teal2:       "#0d9488",              // deep teal for secondary labels
  teal2Glass:  "rgba(13,148,136,0.08)",
  teal2Border: "rgba(13,148,136,0.25)",
  redGlass:    "rgba(239,68,68,0.06)",
  redBorder:   "rgba(239,68,68,0.22)",
  cardBg:      "rgba(255,255,255,0.82)",
  cardBorder:  "rgba(245,158,11,0.18)",
  text:        "#1f2937",
  textMuted:   "#6b7280",
  textFaint:   "#9ca3af",
} as const;

/* ── CSS animations (warm-scoped) ─────────────────────────────────────────── */
const WARM_CSS = `
  @keyframes wpf-fade-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes wpf-glow-pulse {
    0%,100% { text-shadow: 0 0 10px rgba(245,158,11,0.55); }
    50%     { text-shadow: 0 0 22px rgba(245,158,11,0.95), 0 0 44px rgba(245,158,11,0.35); }
  }
  @keyframes wpf-arrow-pulse {
    from { transform: translateX(-2px); opacity: 0.55; }
    to   { transform: translateX(2px);  opacity: 1;    }
  }
  .wpf-a0  { animation: wpf-fade-up 0.55s ease both; }
  .wpf-a1  { animation: wpf-fade-up 0.55s 0.12s ease both; }
  .wpf-a2  { animation: wpf-fade-up 0.55s 0.22s ease both; }
  .wpf-a3  { animation: wpf-fade-up 0.55s 0.34s ease both; }
  .wpf-glow-text { animation: wpf-glow-pulse 2.6s ease-in-out infinite; }
  .wpf-arr  { animation: wpf-arrow-pulse 0.65s ease-in-out infinite alternate; }
  .wpf-arr2 { animation: wpf-arrow-pulse 0.65s 0.18s ease-in-out infinite alternate; }
`;

/* ── Pill tag ─────────────────────────────────────────────────────────────── */
function WPill({
  children,
  tier = "support",
}: {
  children: React.ReactNode;
  tier?: "core" | "support";
}) {
  if (tier === "core") {
    return (
      <span
        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium"
        style={{ background: W.amberGlass, borderColor: W.amberBorder, color: W.amber }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium"
      style={{ background: W.teal2Glass, borderColor: W.teal2Border, color: W.teal2 }}
    >
      {children}
    </span>
  );
}

/* ── FP Alignment callout ─────────────────────────────────────────────────── */
function WAlignment({ text }: { text: string }) {
  return (
    <div
      className="rounded-r-lg pl-3 py-2 border-l-2 text-xs italic"
      style={{ borderColor: W.amber, color: "rgba(245,158,11,0.70)" }}
    >
      <span className="font-semibold not-italic" style={{ color: W.amber }}>
        FP alignment:{" "}
      </span>
      {text}
    </div>
  );
}

/* ── Card shell ───────────────────────────────────────────────────────────── */
function WCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-5 gap-4 h-full ${className}`}
      style={{
        background:          W.cardBg,
        backdropFilter:      "blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        borderColor:         W.cardBorder,
        boxShadow:           "0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(245,158,11,0.06)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Sales Bot card ───────────────────────────────────────────────────────── */
function SalesBotCard() {
  return (
    <WCard className="wpf-a1">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-semibold"
          style={{ background: W.amberGlass, borderColor: W.amberBorder, color: W.amber }}
        >
          <Zap className="w-3 h-3" />
          AI Automation
        </span>
        <a
          href="https://github.com/omerzilber1403/agent-sales-bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-mono transition-opacity hover:opacity-100"
          style={{ color: W.teal2, opacity: 0.75 }}
        >
          <Github className="w-3.5 h-3.5" />
          GitHub
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg leading-tight" style={{ color: W.text }}>
        Intelligent Sales &amp; Lead Agent
      </h3>

      {/* Metric block */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 border"
        style={{ background: "rgba(245,158,11,0.04)", borderColor: W.amberBorder }}
      >
        <div className="text-center">
          <div className="text-xs font-mono mb-0.5" style={{ color: W.textFaint }}>manual call</div>
          <div className="text-lg font-bold font-mono line-through" style={{ color: W.textFaint }}>~45 min</div>
        </div>
        <div className="flex items-center gap-0.5">
          <ChevronRight className="wpf-arr  w-4 h-4" style={{ color: W.amber }} />
          <ChevronRight className="wpf-arr2 w-4 h-4" style={{ color: W.amber, opacity: 0.5 }} />
        </div>
        <div className="text-center">
          <div className="text-xs font-mono mb-0.5" style={{ color: W.textFaint }}>AI agent</div>
          <div className="text-lg font-bold font-mono wpf-glow-text" style={{ color: W.amber }}>
            ~8 min
          </div>
        </div>
        <span
          className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold"
          style={{ background: W.amberGlass, color: W.amber, border: `1px solid ${W.amberBorder}` }}
        >
          5.6× faster
        </span>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: W.textMuted }}>
        Graph-based agent (LangGraph) that autonomously filters leads and handles initial
        inquiries using a company-specific Rulebook. Multi-tenant architecture — zero
        restart required for config swaps. Full audit trail of every graph node decision.
      </p>

      {/* Tech pills */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <WPill tier="core">LangGraph</WPill>
          <WPill tier="core">FastAPI</WPill>
          <WPill tier="core">GPT-4o</WPill>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <WPill>Python</WPill>
          <WPill>SQLite</WPill>
          <WPill>React</WPill>
          <WPill>SQLAlchemy</WPill>
        </div>
      </div>

      {/* Alignment */}
      <WAlignment text="Mirrors Forcepoint's DLP philosophy: route sensitive content through policy-aware pipelines, not ad-hoc logic." />
    </WCard>
  );
}

/* ── STOMP / World Cup card ───────────────────────────────────────────────── */
function StompCard({ onLiveDemo }: { onLiveDemo: () => void }) {
  return (
    <WCard className="wpf-a2">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-semibold"
          style={{ background: W.amberGlass, borderColor: W.amberBorder, color: W.amber }}
        >
          <Bot className="w-3 h-3" />
          AI-Accelerated Engineering
        </span>
        <a
          href="https://github.com/omerzilber1403/assignment3-world-cup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-mono transition-opacity hover:opacity-100"
          style={{ color: W.teal2, opacity: 0.75 }}
        >
          <Github className="w-3.5 h-3.5" />
          GitHub
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg leading-tight" style={{ color: W.text }}>
        Multi-Protocol Event System (STOMP)
      </h3>

      {/* Velocity block */}
      <div className="flex items-stretch gap-2 w-full">
        {/* Without AI — red tinted */}
        <div
          className="flex-1 rounded-xl p-3 border flex flex-col items-center justify-center text-center gap-1"
          style={{ background: W.redGlass, borderColor: W.redBorder }}
        >
          <div className="text-xs font-mono uppercase tracking-widest" style={{ color: "rgba(239,68,68,0.60)" }}>
            Without AI
          </div>
          <div className="text-xl font-bold font-mono line-through" style={{ color: "rgba(239,68,68,0.55)" }}>
            ~3–4 weeks
          </div>
          <div className="text-xs" style={{ color: "rgba(239,68,68,0.45)" }}>industry average</div>
        </div>

        {/* Arrows — amber heat */}
        <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0">
          <ChevronRight className="wpf-arr  w-5 h-5" style={{ color: W.amber }} />
          <ChevronRight className="wpf-arr2 w-5 h-5" style={{ color: W.amber, opacity: 0.5 }} />
        </div>

        {/* With AI — amber glow */}
        <div
          className="flex-1 rounded-xl p-3 border flex flex-col items-center justify-center text-center gap-1"
          style={{
            background:  W.amberGlass,
            borderColor: W.amberBorder,
            boxShadow:   "0 0 24px rgba(245,158,11,0.18)",
          }}
        >
          <div className="text-xs font-mono uppercase tracking-widest" style={{ color: `${W.amber}99` }}>
            AI Velocity
          </div>
          <div className="text-xl font-bold font-mono wpf-glow-text" style={{ color: W.amber }}>
            2 days
          </div>
          <div className="text-xs" style={{ color: `${W.amber}80` }}>
            Cursor · Claude · Copilot
          </div>
        </div>
      </div>

      {/* What AI solved */}
      <ul className="flex flex-col gap-1.5">
        {[
          "C++17 multi-threading & thread-safety solved with AI pair programming",
          "Java Reactor pattern generated & reviewed with Claude in hours",
          "STOMP protocol client–server integration debugged via AI",
        ].map(item => (
          <li key={item} className="flex items-start gap-2 text-xs" style={{ color: W.textMuted }}>
            <ChevronRight
              className="w-3.5 h-3.5 flex-shrink-0 mt-px"
              style={{ color: W.amber }}
            />
            {item}
          </li>
        ))}
      </ul>

      {/* Tech pills */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <WPill tier="core">Java Reactor</WPill>
          <WPill tier="core">C++17</WPill>
          <WPill tier="core">STOMP Protocol</WPill>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <WPill>Python / SQL</WPill>
          <WPill>Multi-threading</WPill>
          <WPill>Thread-Safety</WPill>
        </div>
      </div>

      {/* Alignment */}
      <WAlignment text="Systems C++ and Java depth — the foundation to instrument and modernize legacy security tooling with AI." />

      {/* Live demo CTA */}
      <div className="mt-auto pt-1">
        <button
          onClick={onLiveDemo}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85 active:opacity-70"
          style={{
            background: W.amber,
            color:      "#1f2937",
            boxShadow:  "0 4px 18px rgba(245,158,11,0.35)",
          }}
        >
          <Zap className="w-3.5 h-3.5" />
          Live Terminal Demo
        </button>
      </div>
    </WCard>
  );
}

/* ── Security strip panel ─────────────────────────────────────────────────── */
function SecurityPanel({
  icon, label, desc,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-4 border"
      style={{
        borderLeftWidth:  "2px",
        borderLeftColor:  W.amber,
        borderColor:      W.cardBorder,
        background:       W.cardBg,
        backdropFilter:   "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow:        "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <span style={{ color: W.amber, flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <div>
        <div className="text-sm font-semibold mb-1" style={{ color: W.text }}>{label}</div>
        <div className="text-xs leading-relaxed" style={{ color: W.textMuted }}>{desc}</div>
      </div>
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────────────────────── */
export function ForcepointShowcaseWarm() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section
      className="relative py-24 px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(245,158,11,0.04) 35%, rgba(245,158,11,0.04) 65%, transparent 100%)",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: WARM_CSS }} />

      {/* Subtle warm orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(245,158,11,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        {/* ── Section header ── */}
        <div className="wpf-a0 text-center mb-12">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-semibold mb-5"
            style={{ background: W.amberGlass, borderColor: W.amberBorder, color: W.amber }}
          >
            <Shield className="w-3.5 h-3.5" />
            Forcepoint-Ready Engineering
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: W.text, fontFamily: "var(--font-display, system-ui)" }}
          >
            Built for{" "}
            <span style={{ color: W.amber }}>Data Security Roles</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: W.textMuted }}>
            AI automation velocity paired with low-level systems engineering — the exact
            combination Forcepoint needs to build and ship AI-native security tooling fast.
          </p>
        </div>

        {/* ── Project cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 items-start">
          <SalesBotCard />
          <StompCard onLiveDemo={() => setShowDemo(true)} />
        </div>

        {/* ── Security strip ── */}
        <div className="wpf-a3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SecurityPanel
            icon={<Shield className="w-4 h-4" />}
            label="Zero-PII Prompting"
            desc="All code and logs sanitized before LLM interaction — no real user data ever reaches the model."
          />
          <SecurityPanel
            icon={<KeyRound className="w-4 h-4" />}
            label="Access Control"
            desc="Strict .env & .gitignore for all AI API keys — never committed to source control."
          />
          <SecurityPanel
            icon={<Bot className="w-4 h-4" />}
            label="Policy-Aware Agents"
            desc="LangGraph agents sandboxed with strict system prompts — preventing hallucinations and data leaks."
          />
        </div>
      </div>

      {/* ── Live Terminal Modal ── */}
      <ProjectModal
        open={showDemo}
        onClose={() => setShowDemo(false)}
        title="Multi-Protocol Event System — Live Terminal"
      >
        <div className="flex flex-col gap-5" style={{ minHeight: "480px" }}>
          <p className="text-slate-400 text-sm leading-relaxed">
            Java Reactor / TPC server · Python SQL layer · C++17 multi-threaded client — all
            communicating over a custom STOMP protocol. Built in{" "}
            <span style={{ color: W.amber }} className="font-semibold">
              2 days
            </span>{" "}
            with AI assistance (Cursor, Claude, Copilot).
          </p>
          <MultiClientTerminalWarm />
        </div>
      </ProjectModal>
    </section>
  );
}
