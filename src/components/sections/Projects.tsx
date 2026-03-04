"use client";

import { useState, useRef, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Badge } from "@/components/ui/badge";
import { ProjectModal } from "@/components/ui/project-modal";
import { TerminalUI } from "@/components/ui/terminal-ui";
import { PROJECTS } from "@/lib/data";
import type { Project } from "@/types";
import {
  ArrowRight, ArrowUpRight, Github, ExternalLink,
  Terminal, Cpu, Layers, GitBranch, Play, RotateCcw,
  Bot, Copy, Check,
} from "lucide-react";

/* ─── Projects Section Title ────────────────────────────────────────────── */
function ProjectTitleComponent() {
  return (
    <>
      <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
        Featured Work
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
        Projects that ship
      </h2>
      <p className="mt-3 text-text-secondary max-w-xl mx-auto">
        Two real projects. Concrete metrics. Built with the exact tools Forcepoint needs.
      </p>
    </>
  );
}

/* ─── Sales Bot Chat Demo ────────────────────────────────────────────────── */
const DEMO_MESSAGES = [
  { role: "user", text: "Hi, I'd like to learn more about your product" },
  {
    role: "bot",
    text: "Hi! Happy to help 👋  Are you looking for a solution for your business, or for personal use?",
    node: "check_handoff → business_type_router",
  },
  { role: "user", text: "It's for our company — 120-person tech team" },
  {
    role: "bot",
    text: "Perfect fit! Tech orgs your size are exactly who we built this for. What's the main challenge — lead gen, support automation, or closing speed?",
    node: "b2b_sales_agent · extracted: size=120, industry=tech",
  },
  { role: "user", text: "What does pricing look like?" },
  {
    role: "bot",
    text: "I won't give estimates that might be off — I'll loop in the team for exact numbers. Quick question first: what does your current sales cycle look like?",
    node: "b2b_sales_agent · pricing rule enforced",
  },
  { role: "user", text: "Can I just speak to a real person?" },
  {
    role: "bot",
    text: "Of course! Flagging for handoff now 🤝  Your profile has been forwarded — a rep will reach out to your team shortly.",
    node: "generate_handoff_response · handoff=true",
  },
] as const;

// Timing between messages (ms)
const MSG_DELAYS = [0, 700, 1500, 2300, 3200, 4000, 4900, 5800];

function SalesBotChatDemo() {
  const [visible, setVisible] = useState(0);
  const [playing, setPlaying] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visible]);

  useEffect(() => () => { timersRef.current.forEach(clearTimeout); }, []);

  function play() {
    timersRef.current.forEach(clearTimeout);
    setVisible(0);
    setPlaying(true);
    MSG_DELAYS.forEach((delay, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setVisible(i + 1);
          if (i === DEMO_MESSAGES.length - 1) setPlaying(false);
        }, delay + 200)
      );
    });
  }

  function reset() {
    timersRef.current.forEach(clearTimeout);
    setVisible(0);
    setPlaying(false);
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.09)",
      }}
    >
      {/* Chat header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <Bot className="w-4 h-4" style={{ color: "#818cf8" }} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary leading-none">AGENT Sales Bot</p>
            <p className="text-[10px] mt-0.5" style={{ color: "#4ade80" }}>
              ● B2B mode · LangGraph
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={playing ? undefined : play}
            disabled={playing}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono border transition-all"
            style={{
              background: playing ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.15)",
              borderColor: "rgba(99,102,241,0.35)",
              color: playing ? "#6366f1" : "#818cf8",
              cursor: playing ? "not-allowed" : "pointer",
            }}
          >
            <Play className="w-3 h-3" />
            {playing ? "Playing…" : visible === 0 ? "Play demo" : "Replay"}
          </button>
          {visible > 0 && !playing && (
            <button
              onClick={reset}
              className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs border transition-all"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "#475569" }}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "340px", minHeight: "200px" }}>
        {visible === 0 && (
          <p className="text-center text-xs py-6" style={{ color: "#475569" }}>
            Press "Play demo" to watch a live B2B qualification session
          </p>
        )}

        {DEMO_MESSAGES.slice(0, visible).map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.25)" }}
              >
                <Bot className="w-3.5 h-3.5" style={{ color: "#818cf8" }} />
              </div>
            )}

            <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? {
                        background: "rgba(99,102,241,0.25)",
                        border: "1px solid rgba(99,102,241,0.3)",
                        color: "#e0e7ff",
                        borderBottomRightRadius: "4px",
                      }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        color: "#cbd5e1",
                        borderBottomLeftRadius: "4px",
                      }
                }
              >
                {msg.text}
              </div>

              {/* Graph node badge — bot only */}
              {"node" in msg && (
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(34,211,238,0.08)",
                    border: "1px solid rgba(34,211,238,0.18)",
                    color: "#22d3ee",
                  }}
                >
                  ↳ {msg.node}
                </span>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/* ─── Copy-on-click code block ───────────────────────────────────────────── */
function CodeLine({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 group cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onClick={copy}
    >
      <code className="text-xs font-mono flex-1 truncate" style={{ color: "#22d3ee" }}>
        {code}
      </code>
      <span className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#475569" }}>
        {copied ? <Check className="w-3.5 h-3.5" style={{ color: "#4ade80" }} /> : <Copy className="w-3.5 h-3.5" />}
      </span>
    </div>
  );
}

/* ─── Sales Bot Modal Content ───────────────────────────────────────────── */
function SalesBotDetail({ project }: { project: Project }) {
  return (
    <div className="space-y-7 max-w-2xl mx-auto">
      <p className="text-text-secondary leading-relaxed">{project.description}</p>

      {/* Before → After metric callout */}
      <div className="rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Impact</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-text-muted text-sm line-through font-mono">{project.metricBefore}</span>
          <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />
          <span className="text-xl font-black font-mono" style={{ color: "#22d3ee" }}>{project.metricAfter}</span>
        </div>
        <p className="mt-2 text-sm font-semibold" style={{ color: "#818cf8" }}>{project.metricLabel}</p>
      </div>

      {/* Live Demo */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Live Demo Replay</p>
        <SalesBotChatDemo />
      </div>

      {/* Architecture highlights */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Architecture</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <GitBranch className="w-4 h-4" />, label: "LangGraph multi-agent graph", detail: "B2B / B2C intent routing — separate nodes per market segment" },
            { icon: <Cpu className="w-4 h-4" />,       label: "Hot-swap config",             detail: "Company profiles + YAML config reload with zero server restart" },
            { icon: <Layers className="w-4 h-4" />,    label: "Live debug view",             detail: "React dashboard shows every graph node decision in real time" },
            { icon: <Terminal className="w-4 h-4" />,  label: "FastAPI backend",             detail: "REST + WhatsApp webhook, async SQLAlchemy, RBAC multi-tenant" },
          ].map(({ icon, label, detail }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-lg p-3 border"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <span className="flex-shrink-0 mt-0.5" style={{ color: "#6366f1" }}>{icon}</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">{label}</p>
                <p className="text-xs text-text-muted mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Run Locally */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Run Locally</p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
            <span className="ml-2 text-xs font-mono" style={{ color: "#475569" }}>bash — click any line to copy</span>
          </div>
          {/* Commands */}
          <div className="p-3 space-y-1.5" style={{ background: "rgba(6,6,16,0.7)" }}>
            <CodeLine code="pip install -r requirements.txt" />
            <CodeLine code='python -c "from backend.database.init_db import init_db; init_db()"' />
            <CodeLine code="cp .env.example .env  # add OPENAI_API_KEY" />
            <CodeLine code=".\start_servers.bat" />
            <div className="pt-1.5 flex items-center gap-2 text-xs font-mono px-2" style={{ color: "#475569" }}>
              <span style={{ color: "#4ade80" }}>✓</span>
              Frontend: http://localhost:5173  ·  Backend: http://localhost:8080
            </div>
          </div>
        </div>
      </div>

      {/* FP alignment */}
      <div
        className="rounded-r-lg pl-4 py-3 border-l-2 text-sm italic"
        style={{ borderColor: "#6366f1", color: "#a5b4fc" }}
      >
        <span className="font-semibold not-italic" style={{ color: "#818cf8" }}>Forcepoint alignment: </span>
        {project.fpAlignment}
      </div>

      {/* Stack */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Stack</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map(tech => (
            <Badge key={tech} variant="muted">{tech}</Badge>
          ))}
        </div>
      </div>

      {/* GitHub CTA */}
      <a
        href={project.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border hover:border-accent transition-colors"
        style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}
      >
        <Github className="w-4 h-4" />
        View source on GitHub
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

/* ─── World Cup Terminal Modal Content ──────────────────────────────────── */
function WorldCupDetail({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-5" style={{ minHeight: "480px" }}>
      {/* Description + GitHub */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <p className="text-text-secondary text-sm leading-relaxed max-w-xl">{project.description}</p>
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-mono border hover:border-accent transition-colors"
          style={{ borderColor: "#1e1e2e", color: "#94a3b8" }}
        >
          <Github className="w-3.5 h-3.5" />
          GitHub
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Terminal */}
      <div className="flex-1" style={{ minHeight: "380px" }}>
        <TerminalUI />
      </div>
    </div>
  );
}

/* ─── Projects Section ───────────────────────────────────────────────────── */
export function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = PROJECTS.find(p => p.id === selectedId) ?? null;

  return (
    <section id="projects">
      <ContainerScroll titleComponent={<ProjectTitleComponent />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {PROJECTS.map((project) => (
            <CardSpotlight
              key={project.id}
              className="flex flex-col h-full"
              onClick={() => setSelectedId(project.id)}
            >
              {/* Title + GitHub icon */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-bold text-text-primary leading-tight">
                  {project.title}
                </h3>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex-shrink-0 text-text-muted hover:text-accent transition-colors"
                  aria-label={`${project.title} GitHub`}
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>

              {/* Tagline */}
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                {project.tagline}
              </p>

              {/* Before → After metric */}
              <div
                className="rounded-xl p-3 mb-4 border"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-muted text-xs line-through font-mono">
                    {project.metricBefore}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                  <span className="text-base font-bold font-mono" style={{ color: "#22d3ee" }}>
                    {project.metricAfter}
                  </span>
                </div>
                <div className="mt-1.5">
                  <Badge variant="indigo">{project.metricLabel}</Badge>
                </div>
              </div>

              {/* Forcepoint alignment callout */}
              <div
                className="rounded-r-lg pl-3 py-2 mb-4 border-l-2 text-xs italic flex-1"
                style={{ borderColor: "#6366f1", color: "#a5b4fc" }}
              >
                <span className="font-semibold not-italic" style={{ color: "#818cf8" }}>
                  FP alignment:{" "}
                </span>
                {project.fpAlignment}
              </div>

              {/* Stack badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.stack.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="muted">{tech}</Badge>
                ))}
                {project.stack.length > 4 && (
                  <Badge variant="muted">+{project.stack.length - 4}</Badge>
                )}
              </div>

              {/* Footer */}
              <div
                className="mt-auto flex items-center gap-4 pt-3 border-t"
                style={{ borderColor: "rgba(255, 255, 255, 0.07)" }}
              >
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  Source
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <span className="text-xs font-mono" style={{ color: "#6366f1" }}>
                  Click to explore →
                </span>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </ContainerScroll>

      {/* Project modals */}
      <ProjectModal
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        title={selectedProject?.title ?? ""}
      >
        {selectedProject?.id === "world-cup" && (
          <WorldCupDetail project={selectedProject} />
        )}
        {selectedProject?.id === "sales-bot" && (
          <SalesBotDetail project={selectedProject} />
        )}
      </ProjectModal>
    </section>
  );
}
