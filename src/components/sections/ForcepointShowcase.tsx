"use client";
import {
  Shield, KeyRound, Bot, Zap, Github, ArrowUpRight, ChevronRight,
} from "lucide-react";

/* ── Forcepoint brand tokens ─────────────────────────────────────────────── */
const FP = {
  navy:       "#063b58",
  navyGlass:  "rgba(6,59,88,0.50)",
  teal:       "#4cc7b8",
  tealGlass:  "rgba(76,199,184,0.12)",
  tealBorder: "rgba(76,199,184,0.28)",
  redGlass:   "rgba(248,113,113,0.07)",
  redBorder:  "rgba(248,113,113,0.22)",
} as const;

/* ── CSS animations (scoped) ─────────────────────────────────────────────── */
const SHOWCASE_CSS = `
  @keyframes fp-fade-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  @keyframes fp-glow-pulse {
    0%,100% { text-shadow: 0 0 10px rgba(76,199,184,0.55); }
    50%     { text-shadow: 0 0 22px rgba(76,199,184,0.95), 0 0 44px rgba(76,199,184,0.35); }
  }
  @keyframes fp-arrow-pulse {
    from { transform: translateX(-2px); opacity: 0.55; }
    to   { transform: translateX(2px);  opacity: 1;    }
  }
  .fp-a0  { animation: fp-fade-up 0.55s ease both; }
  .fp-a1  { animation: fp-fade-up 0.55s 0.12s ease both; }
  .fp-a2  { animation: fp-fade-up 0.55s 0.22s ease both; }
  .fp-a3  { animation: fp-fade-up 0.55s 0.34s ease both; }
  .fp-glow-text { animation: fp-glow-pulse 2.6s ease-in-out infinite; }
  .fp-arr  { animation: fp-arrow-pulse 0.65s ease-in-out infinite alternate; }
  .fp-arr2 { animation: fp-arrow-pulse 0.65s 0.18s ease-in-out infinite alternate; }
`;

/* ── Pill tag ────────────────────────────────────────────────────────────── */
function FpPill({
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
        style={{ background: FP.tealGlass, borderColor: FP.tealBorder, color: FP.teal }}
      >
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-mono font-medium text-slate-400">
      {children}
    </span>
  );
}

/* ── Sales Bot card ──────────────────────────────────────────────────────── */
function SalesBotCard() {
  return (
    <div
      className="fp-a1 relative flex flex-col rounded-2xl border p-5 gap-4 h-full"
      style={{
        background: FP.navyGlass,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderColor: "rgba(76,199,184,0.18)",
        boxShadow: "0 8px 32px rgba(6,59,88,0.35)",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-semibold"
          style={{ background: FP.tealGlass, borderColor: FP.tealBorder, color: FP.teal }}
        >
          <Zap className="w-3 h-3" />
          AI Automation
        </span>
        <a
          href="https://github.com/omerzilber1403/agent-sales-bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-mono transition-opacity hover:opacity-100"
          style={{ color: FP.teal, opacity: 0.7 }}
        >
          <Github className="w-3.5 h-3.5" />
          GitHub
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Title */}
      <h3 className="font-bold text-white text-lg leading-tight">
        Intelligent Sales &amp; Lead Agent
      </h3>

      {/* Metric: before → after */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 border"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="text-center">
          <div className="text-xs font-mono text-slate-500 mb-0.5">standard approach</div>
          <div className="text-sm font-bold font-mono text-slate-500 line-through">Generic cold call</div>
        </div>
        <div className="flex items-center gap-0.5">
          <ChevronRight className="fp-arr  w-4 h-4" style={{ color: FP.teal }} />
          <ChevronRight className="fp-arr2 w-4 h-4" style={{ color: FP.teal, opacity: 0.55 }} />
        </div>
        <div className="text-center">
          <div className="text-xs font-mono text-slate-500 mb-0.5">with AI agent</div>
          <div className="text-sm font-bold font-mono fp-glow-text" style={{ color: FP.teal }}>
            Prepared lead
          </div>
        </div>
        <span
          className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold"
          style={{ background: FP.tealGlass, color: FP.teal, border: `1px solid ${FP.tealBorder}` }}
        >
          Personalized
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed">
        Graph-based agent (LangGraph) with multi-tenant architecture — each company&apos;s products, objection playbook, ICP definition, and competitive map live in a single DB row, hot-swappable with zero restart required.
      </p>

      {/* Forcepoint callout */}
      <div
        className="rounded-xl px-4 py-3 border"
        style={{
          background: "rgba(76,199,184,0.06)",
          borderColor: "rgba(76,199,184,0.22)",
        }}
      >
        <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
          <span style={{ color: "#4cc7b8", fontWeight: 600 }}>
            ✦ Forcepoint&apos;s real data is live in the demo.
          </span>{" "}
          Product catalog, DLP objection playbook, and competitive positioning (Netskope, Zscaler, Purview, Symantec) were scraped from{" "}
          <span style={{ fontFamily: "monospace", color: "#cbd5e1" }}>forcepoint.com</span>{" "}
          using{" "}
          <span style={{ color: "#4cc7b8", fontWeight: 600 }}>Antigravity</span>{" "}
          and loaded as a single tenant. Try it below.
        </p>
      </div>

      {/* Tech pills */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <FpPill tier="core">LangGraph</FpPill>
          <FpPill tier="core">FastAPI</FpPill>
          <FpPill tier="core">GPT-4o</FpPill>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FpPill>Python</FpPill>
          <FpPill>SQLite</FpPill>
          <FpPill>React</FpPill>
        </div>
      </div>

      {/* Navigate to project section */}
      <div className="mt-auto pt-1">
        <button
          onClick={() => document.getElementById("salesbot")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85 active:opacity-70"
          style={{
            background: FP.teal,
            color: FP.navy,
            boxShadow: `0 4px 18px rgba(76,199,184,0.35)`,
          }}
        >
          <Zap className="w-3.5 h-3.5" />
          Try the Forcepoint Bot ↓
        </button>
      </div>
    </div>
  );
}

/* ── STOMP / World Cup card ──────────────────────────────────────────────── */
function StompCard() {
  return (
    <div
      className="fp-a2 relative flex flex-col rounded-2xl border p-5 gap-4 h-full"
      style={{
        background: FP.navyGlass,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderColor: "rgba(76,199,184,0.18)",
        boxShadow: "0 8px 32px rgba(6,59,88,0.35)",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-semibold"
          style={{ background: FP.tealGlass, borderColor: FP.tealBorder, color: FP.teal }}
        >
          <Bot className="w-3 h-3" />
          AI-Accelerated Engineering
        </span>
        <a
          href="https://github.com/omerzilber1403/assignment3-world-cup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-mono transition-opacity hover:opacity-100"
          style={{ color: FP.teal, opacity: 0.7 }}
        >
          <Github className="w-3.5 h-3.5" />
          GitHub
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Title */}
      <h3 className="font-bold text-white text-lg leading-tight">
        Multi-Protocol Event System (STOMP)
      </h3>

      {/* Project description */}
      <p className="text-sm text-slate-400 leading-relaxed">
        Real-time pub/sub system for live football match events — reporters upload event JSON to named channels; all subscribers receive instant MESSAGE frames. Built with a Java Reactor server, Python SQLite bridge, and a two-threaded C++ client implementing the STOMP 1.2 protocol from scratch over raw TCP.
      </p>

      {/* ─── VELOCITY BLOCK ─── */}
      <div className="flex items-stretch gap-2 w-full">
        {/* Without AI */}
        <div
          className="flex-1 rounded-xl p-3 border flex flex-col items-center justify-center text-center gap-1"
          style={{ background: FP.redGlass, borderColor: FP.redBorder }}
        >
          <div className="text-xs font-mono text-red-400/55 uppercase tracking-widest">
            Without AI
          </div>
          <div className="text-xl font-bold font-mono text-red-300/60 line-through">
            ~3–4 weeks
          </div>
          <div className="text-xs text-red-300/45">industry average</div>
        </div>

        {/* Arrows */}
        <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0">
          <ChevronRight className="fp-arr  w-5 h-5" style={{ color: FP.teal }} />
          <ChevronRight className="fp-arr2 w-5 h-5" style={{ color: FP.teal, opacity: 0.5 }} />
        </div>

        {/* With AI */}
        <div
          className="flex-1 rounded-xl p-3 border flex flex-col items-center justify-center text-center gap-1"
          style={{
            background: FP.tealGlass,
            borderColor: FP.tealBorder,
            boxShadow: `0 0 24px rgba(76,199,184,0.15)`,
          }}
        >
          <div
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: `${FP.teal}99` }}
          >
            AI Velocity
          </div>
          <div className="text-xl font-bold font-mono fp-glow-text" style={{ color: FP.teal }}>
            2 days
          </div>
          <div className="text-xs" style={{ color: `${FP.teal}70` }}>
            Cursor · Claude · Copilot
          </div>
        </div>
      </div>

      {/* What AI solved */}
      <ul className="flex flex-col gap-1.5">
        {[
          "C++ multi-threading & thread-safety solved with AI pair programming",
          "Java Reactor pattern generated & reviewed with Claude in hours",
          "STOMP protocol client–server integration debugged via AI",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-px" style={{ color: FP.teal }} />
            {item}
          </li>
        ))}
      </ul>

      {/* Tech pills */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <FpPill tier="core">Java Reactor</FpPill>
          <FpPill tier="core">C++</FpPill>
          <FpPill tier="core">STOMP Protocol</FpPill>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FpPill>Python / SQL</FpPill>
          <FpPill>Multi-threading</FpPill>
          <FpPill>Thread-Safety</FpPill>
        </div>
      </div>

      {/* Navigate to SPL case study */}
      <div className="mt-auto pt-1">
        <button
          onClick={() => document.getElementById("spl")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85 active:opacity-70"
          style={{
            background: FP.teal,
            color: FP.navy,
            boxShadow: `0 4px 18px rgba(76,199,184,0.35)`,
          }}
        >
          <Bot className="w-3.5 h-3.5" />
          Explore Live Case Study ↓
        </button>
      </div>
    </div>
  );
}

/* ── Security strip panel ────────────────────────────────────────────────── */
function SecurityPanel({
  icon,
  label,
  desc,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-4 border"
      style={{
        borderLeftWidth: "2px",
        borderLeftColor: FP.teal,
        borderColor: "rgba(76,199,184,0.14)",
        background: FP.navyGlass,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <span style={{ color: FP.teal, flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <div>
        <div className="text-sm font-semibold text-white mb-1">{label}</div>
        <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export function ForcepointShowcase() {
  return (
    <section
      id="projects"
      className="relative py-24 px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(6,59,88,0.10) 40%, rgba(6,59,88,0.10) 60%, transparent 100%)",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: SHOWCASE_CSS }} />

      {/* Subtle navy orb behind the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(6,59,88,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        {/* ── Section header ── */}
        <div className="fp-a0 text-center mb-12">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-semibold mb-5"
            style={{ background: FP.tealGlass, borderColor: FP.tealBorder, color: FP.teal }}
          >
            <Shield className="w-3.5 h-3.5" />
            Forcepoint-Ready Engineering
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-display, system-ui)" }}
          >
            Built for{" "}
            <span style={{ color: FP.teal }}>Data Security Roles</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            AI automation velocity paired with low-level systems engineering — the exact combination Forcepoint needs to build and ship AI-native security tooling fast.
          </p>
        </div>

        {/* ── Project cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 items-start">
          <SalesBotCard />
          <StompCard />
        </div>

        {/* ── Security strip ── */}
        <div className="fp-a3 grid grid-cols-1 sm:grid-cols-3 gap-3">
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
    </section>
  );
}
