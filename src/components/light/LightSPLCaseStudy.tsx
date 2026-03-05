"use client";

import React, { useState, useEffect, useRef } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type PanelId = "messi" | "ronaldo" | "server";

type LineType =
  | "cmd"
  | "output"
  | "error"
  | "success"
  | "info"
  | "frame-in"
  | "frame-err"
  | "sql";

type StepId = "boot" | "login" | "pubsub" | "summary" | "logout";

interface TerminalLine {
  type: LineType;
  text: string;
  complete: boolean;
}

interface StorySectionData {
  stepId: StepId;
  badge: string;
  headline: string;
  body: React.ReactNode;
  btnLabel: string;
}

/* ─── Colour tokens — terminal stays dark, UX plan §5.3 ─────────────────── */
const LINE_COLORS: Record<LineType, string> = {
  cmd:         "#34d399", // emerald — commands on dark panel
  output:      "#D6D3D1", // stone-300 — plain output
  error:       "#f87171",
  success:     "#4ade80",
  info:        "#a5b4fc", // indigo-300
  "frame-in":  "#c084fc",
  "frame-err": "#f87171",
  sql:         "#fbbf24", // amber
};

/* ─── Timing ─────────────────────────────────────────────────────────────── */
const CHAR_DELAY = 15;
const LINE_GAP   = 155;
const PROMPT     = "$ ";
const BORDER     = 47;

/* ─── Game data ──────────────────────────────────────────────────────────── */
const AF_EVENTS = [
  { time: "0:00",  type: "kickoff",  team: null,       desc: "Argentina vs France — 2022 FIFA World Cup Final" },
  { time: "36:00", type: "goal!!!!", team: "Argentina", desc: "Di María fires Argentina ahead — 2:0!" },
  { time: "80:00", type: "goal!!!!", team: "France",    desc: "Mbappé converts penalty — 2:1" },
  { time: "81:00", type: "goal!!!!", team: "France",    desc: "Mbappé volleys in — 2:2. France level!" },
];

/* ─── Frame builders ─────────────────────────────────────────────────────── */
function buildFrame(frameType: string, headers: string[], body: string[]): string {
  const top = `┌─ ${frameType} ${"─".repeat(Math.max(0, BORDER - frameType.length - 2))}`;
  const bot = `└${"─".repeat(BORDER)}`;
  const hdr = headers.map(h => `│ ${h}`);
  const bdy = body.map(b => `│ ${b}`);
  return (body.length ? [top, ...hdr, "│", ...bdy, bot] : [top, ...hdr, bot]).join("\n");
}

/* ─── Light-themed code token helper ────────────────────────────────────── */
const LC: React.CSSProperties = {
  fontFamily: "ui-monospace, 'Cascadia Code', monospace",
  fontSize: "0.75rem",
  color: "#BE123C",
  background: "rgba(190,18,60,0.07)",
  borderRadius: 4,
  padding: "0.1rem 0.35rem",
};

/* ─── Story sections (strong: stone-900, code: rose-700) ─────────────────── */
const SECTIONS: StorySectionData[] = [
  {
    stepId:   "boot",
    badge:    "01 / Architecture",
    headline: "A Three-Tier Stack",
    btnLabel: "Boot the System",
    body: (
      <div className="spl-body">
        <p>
          <strong style={{ color: "#1C1917" }}>Java Server (top tier):</strong>{" "}
          Implemented in Java, supporting both <code>Thread-Per-Client (TPC)</code> —
          each connection owns a dedicated OS thread blocking on socket reads — and a
          non-blocking <code>Reactor</code> model, where a selector loop dispatches
          I/O-readiness events to a bounded thread pool.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>Python DB bridge (middle tier):</strong>{" "}
          A Python server bridging via raw TCP on port <code>7778</code>, executing SQL
          queries on a <code>SQLite</code> database. Handles user registration, login
          records, and persisted event logs — keeping the Java server stateless.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>C++ Client (bottom tier):</strong>{" "}
          Implemented in C++, acting as the client-side <code>STOMP 1.2</code> interface
          for channel subscription, event reporting, and summary generation.
        </p>
      </div>
    ),
  },
  {
    stepId:   "login",
    badge:    "02 / Concurrency",
    headline: "Two-Thread Client Model",
    btnLabel: "Connect Clients",
    body: (
      <div className="spl-body">
        <p>
          <strong style={{ color: "#1C1917" }}>Dedicated threads:</strong>{" "}
          The C++ client runs two concurrent threads at login to prevent UI blocking
          during network I/O — one for input, one for the live socket stream.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>Keyboard thread:</strong>{" "}
          Exclusively reads commands from <code>stdin</code> and writes outgoing STOMP
          frames to the socket. Never reads from the socket — ownership is strict.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>Socket thread:</strong>{" "}
          Exclusively listens on the socket and dispatches incoming frames to registered
          handlers. Owns the read side of the connection from login to teardown.
        </p>
      </div>
    ),
  },
  {
    stepId:   "pubsub",
    badge:    "03 / Protocol",
    headline: "STOMP 1.2 from Scratch",
    btnLabel: "Subscribe & Report",
    body: (
      <div className="spl-body">
        <p>
          <strong style={{ color: "#1C1917" }}>Full lifecycle:</strong>{" "}
          Implements the complete STOMP frame set —{" "}
          <code>CONNECT</code>, <code>SUBSCRIBE</code>, <code>SEND</code>,{" "}
          <code>MESSAGE</code>, <code>DISCONNECT</code>, <code>RECEIPT</code>,{" "}
          <code>ERROR</code> — across both client and server.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>Client-generated IDs:</strong>{" "}
          Subscription IDs and receipt IDs are generated uniquely by the client and
          tracked locally. The server echoes them back in <code>MESSAGE</code> and{" "}
          <code>RECEIPT</code> frames for O(1) client-side lookup.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>Frame parsing:</strong>{" "}
          Reads the raw socket stream, parses <code>header:value</code> pairs line by
          line, and extracts the body until the null-char (<code>\0</code>) terminator.
        </p>
      </div>
    ),
  },
  {
    stepId:   "summary",
    badge:    "04 / Data Structures",
    headline: "Client-Side Aggregation",
    btnLabel: "Generate Summary",
    body: (
      <div className="spl-body">
        <p>
          <strong style={{ color: "#1C1917" }}>Event tracking:</strong>{" "}
          Parses JSON event files and stores game events in a nested map keyed by
          channel name and reporting user. The server only persists raw frames — all
          aggregation logic lives entirely on the client.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>Chronological ordering:</strong>{" "}
          Events are stored and printed ordered by occurrence time. A secondary sort
          on the event list by the <code>time</code> field produces the final output.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>Lexicographical stats:</strong>{" "}
          Stats are aggregated locally and printed in lexicographical order by stat
          name — the data structure guarantees order without a post-sort step.
        </p>
      </div>
    ),
  },
  {
    stepId:   "logout",
    badge:    "05 / Lifecycle",
    headline: "Graceful Shutdown",
    btnLabel: "Graceful Logout",
    body: (
      <div className="spl-body">
        <p>
          <strong style={{ color: "#1C1917" }}>DISCONNECT frame:</strong>{" "}
          Client sends a <code>DISCONNECT</code> frame with a unique receipt ID before
          closing. Closing the socket without this handshake risks silently dropping
          bytes still queued in the kernel send buffer.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>Server acknowledgment:</strong>{" "}
          Client strictly waits for the matching <code>RECEIPT</code> frame before
          calling <code>close(sockfd)</code>. The keyboard thread blocks on a
          condition variable until the socket thread signals receipt confirmed.
        </p>
        <p>
          <strong style={{ color: "#1C1917" }}>Zero message loss:</strong>{" "}
          Per the STOMP 1.2 RFC, a <code>RECEIPT</code> is cumulative — it acknowledges
          all preceding frames. This handshake guarantees every <code>SEND</code>
          before the <code>DISCONNECT</code> was processed. No data is silently dropped.
        </p>
      </div>
    ),
  },
];

/* ─── Light scoped CSS ───────────────────────────────────────────────────── */
const SCOPED_CSS = `
/* ── Root ──────────────────────────────────────────────────────────────── */
.spl-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1C1917;
  position: relative;
  overflow: visible;
  background: #FAFAF9;
}
.spl-bg-orb { display: none; }

/* ── Inner ──────────────────────────────────────────────────────────────── */
.spl-inner {
  position: relative; z-index: 1;
  max-width: 72rem; margin: 0 auto;
  padding: 5rem 1.5rem 6rem;
}

/* ── Section header ─────────────────────────────────────────────────────── */
.spl-header { text-align: center; margin-bottom: 3.5rem; }
.spl-header-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  border-radius: 9999px; border: 1px solid #C7D2FE;
  padding: 0.375rem 1rem; font-size: 0.7rem; font-family: monospace;
  font-weight: 600; letter-spacing: 0.04em; margin-bottom: 1.25rem;
  background: #EEF2FF; color: #4338CA; cursor: default;
}
.spl-header-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #4F46E5;
  animation: spl-pulse 2s infinite;
}
@keyframes spl-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.spl-title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 700; color: #1C1917; line-height: 1.15; margin-bottom: 0.75rem;
}
.spl-title-em { color: #4F46E5; }
.spl-subtitle { font-size: 0.9rem; color: #57534E; max-width: 38rem; margin: 0 auto; line-height: 1.75; }

/* ── Mobile tabs ─────────────────────────────────────────────────────────── */
.spl-tabs {
  display: grid; grid-template-columns: 1fr 1fr;
  border-radius: 0.75rem; overflow: hidden;
  border: 1px solid #E7E5E4; margin-bottom: 1.5rem;
}
.spl-tab {
  padding: 0.625rem 1rem; font-size: 0.8rem; font-weight: 600;
  font-family: monospace; letter-spacing: 0.03em;
  border: none; cursor: pointer; transition: all 0.2s ease; text-align: center;
}
.spl-tab--active   { background: #4F46E5; color: #FFFFFF; }
.spl-tab--inactive { background: #F5F5F4; color: #57534E; }

/* ── Split layout ───────────────────────────────────────────────────────── */
.spl-split { display: flex; gap: 2rem; align-items: flex-start; }

/* ── Left: story ────────────────────────────────────────────────────────── */
.spl-story { flex: 0 0 48%; display: flex; flex-direction: column; gap: 1.5rem; }

/* ── Right: sticky terminal ─────────────────────────────────────────────── */
.spl-terminal {
  flex: 1; position: sticky; top: 4.5rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  height: calc(100vh - 6rem); overflow: hidden;
}

/* ── Story section card ─────────────────────────────────────────────────── */
.spl-section {
  border-radius: 1rem; padding: 1.5rem;
  border: 1px solid #E7E5E4;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(28,25,23,0.05);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.spl-section--active {
  border-left: 3px solid #4F46E5;
  border-color: #C7D2FE;
  background: #FAFAFA;
  box-shadow: 0 8px 24px -4px rgba(28,25,23,0.10);
}

/* ── Step badge ─────────────────────────────────────────────────────────── */
.spl-step-badge {
  display: inline-block; margin-bottom: 0.75rem;
  font-size: 0.65rem; font-family: monospace; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 0.2rem 0.6rem; border-radius: 9999px;
  background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE;
}

/* ── Headline ───────────────────────────────────────────────────────────── */
.spl-headline { font-size: 1.05rem; font-weight: 700; color: #1C1917; margin: 0 0 0.75rem; }

/* ── Prose body ─────────────────────────────────────────────────────────── */
.spl-body {
  font-size: 0.84rem; color: #57534E; line-height: 1.8;
  display: flex; flex-direction: column; gap: 0.65rem;
  margin-bottom: 1.25rem;
}
.spl-body p { margin: 0; }
.spl-body code {
  font-family: ui-monospace, 'Cascadia Code', monospace;
  font-size: 0.77rem; padding: 0.1rem 0.35rem;
  border-radius: 4px; background: rgba(190,18,60,0.07); color: #BE123C;
}

/* ── Trigger button ─────────────────────────────────────────────────────── */
.spl-trigger-btn {
  display: inline-flex; align-items: center; gap: 0.45rem;
  padding: 0.45rem 1.1rem; border-radius: 9999px;
  border: 1px solid #4F46E5; background: transparent; color: #4F46E5;
  font-size: 0.78rem; font-family: monospace; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.spl-trigger-btn:hover {
  background: #4F46E5; color: #FFFFFF;
  box-shadow: 0 4px 16px rgba(79,70,229,0.28);
  transform: translateY(-1px);
}
.spl-trigger-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.spl-trigger-btn--active  { background: #EEF2FF; }
.spl-trigger-arrow { font-size: 0.85rem; transition: transform 0.2s ease; }
.spl-trigger-btn:hover .spl-trigger-arrow { transform: translateX(3px); }

/* ── Terminal panel — intentionally dark (UX plan §5.3) ─────────────────── */
.spl-panel {
  flex: 1; display: flex; flex-direction: column; min-height: 0;
  border-radius: 0.75rem; overflow: hidden;
  border: 1px solid #3C3834;
  background: #1C1917;
}
.spl-panel-chrome {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.75rem; flex-shrink: 0;
  background: #292524;
  border-bottom: 1px solid #3C3834;
}
.spl-panel-dot  { width: 0.6rem; height: 0.6rem; border-radius: 50%; flex-shrink: 0; }
.spl-panel-title { margin-left: 0.5rem; font-size: 0.7rem; font-family: monospace; font-weight: 600; color: #A8A29E; }
.spl-panel-sub   { font-size: 0.7rem; font-family: monospace; color: #78716C; }
.spl-panel-output {
  flex: 1; min-height: 0; overflow-y: auto;
  padding: 0.75rem 0.75rem 1.1rem;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  font-size: 0.68rem; line-height: 1.55;
  background: #0C0A09;
}
.spl-line { display: flex; align-items: flex-start; min-height: 1.1rem; }
.spl-line-text { word-break: break-all; white-space: pre-wrap; }
.spl-cursor {
  display: inline-block; width: 0.375rem; height: 0.875rem;
  margin-left: 1px; background: #6366f1; flex-shrink: 0; margin-top: 1px;
  animation: spl-blink 1s step-end infinite;
}
@keyframes spl-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.spl-frame {
  color: #c084fc; background: rgba(192,132,252,0.07);
  border-left: 2px solid #c084fc;
  border-radius: 0 4px 4px 0;
  padding: 4px 8px; margin: 3px 0;
  font-family: inherit; font-size: 0.65rem; line-height: 1.55;
  white-space: pre; overflow-x: auto;
}
.spl-frame--err { color: #f87171; background: rgba(248,113,113,0.07); border-left-color: #f87171; }

/* ── Context cards ──────────────────────────────────────────────────────── */
.spl-context {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem; margin-bottom: 2.5rem;
}
.spl-context-card {
  border-radius: 0.75rem; padding: 1rem 1.1rem;
  border: 1px solid #E7E5E4;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(28,25,23,0.06);
}
.spl-context-card-label {
  font-size: 0.6rem; font-family: monospace; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: #4F46E5; margin-bottom: 0.45rem;
}
.spl-context-card-body { font-size: 0.8rem; color: #57534E; line-height: 1.7; }
.spl-context-card-body strong { color: #1C1917; font-weight: 600; }
@media (max-width: 767px) { .spl-context { grid-template-columns: 1fr; } }

/* ── Legend ─────────────────────────────────────────────────────────────── */
.spl-legend { display: flex; flex-wrap: wrap; gap: 0.75rem; padding: 0.125rem 0; }
.spl-legend-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.68rem; font-family: monospace; color: #78716C; }
.spl-legend-dot  { width: 0.5rem; height: 0.5rem; border-radius: 50%; flex-shrink: 0; }

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 767px) {
  .spl-split    { flex-direction: column; }
  .spl-story    { flex: none; width: 100%; }
  .spl-terminal { position: static; height: auto; overflow: visible; }
  .spl-panel    { flex: none; }
  .spl-panel-output { max-height: 220px; min-height: 90px; }
}
@media (min-width: 768px) {
  .spl-tabs { display: none; }
  .spl-story, .spl-terminal { display: flex !important; }
}
`;

/* ─── StyleInjector ──────────────────────────────────────────────────────── */
function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />;
}

/* ─── TerminalPanel ──────────────────────────────────────────────────────── */
function TerminalPanel({
  title, subtitle, lines, bottomRef, maxHeight,
}: {
  title: string;
  subtitle: string;
  lines: TerminalLine[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  maxHeight?: string;
}) {
  return (
    <div className="spl-panel">
      <div className="spl-panel-chrome">
        <span className="spl-panel-dot" style={{ background: "#ff5f57" }} />
        <span className="spl-panel-dot" style={{ background: "#febc2e" }} />
        <span className="spl-panel-dot" style={{ background: "#28c840" }} />
        <span className="spl-panel-title">{title}</span>
        <span className="spl-panel-sub">{subtitle}</span>
      </div>
      <div className="spl-panel-output" style={maxHeight ? { maxHeight } : undefined}>
        {lines.map((line, idx) => {
          const isFrame = line.type === "frame-in" || line.type === "frame-err";
          if (isFrame) {
            return (
              <pre
                key={idx}
                className={`spl-frame${line.type === "frame-err" ? " spl-frame--err" : ""}`}
              >
                {line.text}
              </pre>
            );
          }
          return (
            <div key={idx} className="spl-line">
              <span className="spl-line-text" style={{ color: LINE_COLORS[line.type] }}>
                {line.text}
              </span>
              {idx === lines.length - 1 && !line.complete && (
                <span className="spl-cursor" />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/* ─── StorySection ───────────────────────────────────────────────────────── */
function StorySection({
  section, isActive, isPlaying, onTrigger,
}: {
  section: StorySectionData;
  isActive: boolean;
  isPlaying: boolean;
  onTrigger: () => void;
}) {
  return (
    <div className={`spl-section${isActive ? " spl-section--active" : ""}`}>
      <span className="spl-step-badge">{section.badge}</span>
      <h3 className="spl-headline">{section.headline}</h3>
      {section.body}
      <button
        className={`spl-trigger-btn${isActive ? " spl-trigger-btn--active" : ""}`}
        onClick={onTrigger}
        disabled={isPlaying && !isActive}
        title={isPlaying && !isActive ? "Wait for current scenario to finish" : undefined}
      >
        <span>▶</span>
        {section.btnLabel}
        <span className="spl-trigger-arrow">→</span>
      </button>
    </div>
  );
}

/* ─── LightSPLCaseStudy ──────────────────────────────────────────────────── */
export default function LightSPLCaseStudy() {
  const welcome       = (who: string): TerminalLine[] => [
    { type: "info",   text: `StompWCIClient — ${who}`, complete: true },
    { type: "output", text: "Click a button on the left to run a scenario ↑", complete: true },
  ];
  const welcomeServer = (): TerminalLine[] => [
    { type: "info",   text: "Java Reactor :7777  |  Python SQL :7778", complete: true },
    { type: "output", text: "Click a button on the left to run a scenario ↑", complete: true },
  ];

  const [activeStep,   setActiveStep]   = useState<StepId | null>(null);
  const [messiLines,   setMessiLines]   = useState<TerminalLine[]>(welcome("messi"));
  const [ronaldoLines, setRonaldoLines] = useState<TerminalLine[]>(welcome("ronaldo"));
  const [serverLines,  setServerLines]  = useState<TerminalLine[]>(welcomeServer());
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [activeTab,    setActiveTab]    = useState<"story" | "demo">("story");

  const messiBot   = useRef<HTMLDivElement>(null);
  const ronaldoBot = useRef<HTMLDivElement>(null);
  const serverBot  = useRef<HTMLDivElement>(null);
  const tosRef     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const eventsRef  = useRef<typeof AF_EVENTS>([]);

  useEffect(() => { const p = messiBot.current?.parentElement;   if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight; }); }, [messiLines]);
  useEffect(() => { const p = ronaldoBot.current?.parentElement; if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight; }); }, [ronaldoLines]);
  useEffect(() => { const p = serverBot.current?.parentElement;  if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight; }); }, [serverLines]);
  useEffect(() => () => { tosRef.current.forEach(clearTimeout); }, []);

  /* ── Playback engine ─────────────────────────────────────────────────── */
  function playScenario(id: StepId) {
    tosRef.current.forEach(clearTimeout);
    tosRef.current = [];
    eventsRef.current = [];
    setIsPlaying(true);
    setActiveStep(id);

    setMessiLines([{   type: "info", text: "bash — messi@stomp-client",               complete: true }]);
    setRonaldoLines([{ type: "info", text: "bash — ronaldo@stomp-client",             complete: true }]);
    setServerLines([{  type: "info", text: "Java Reactor :7777  |  Python SQL :7778", complete: true }]);

    const tos = tosRef.current;
    const T: Record<PanelId, number> = { messi: 200, ronaldo: 200, server: 200 };
    const set: Record<PanelId, React.Dispatch<React.SetStateAction<TerminalLine[]>>> = {
      messi: setMessiLines, ronaldo: setRonaldoLines, server: setServerLines,
    };

    function ln(panel: PanelId, type: LineType, text: string, extra = 0) {
      T[panel] += extra;
      const d = T[panel];
      tos.push(setTimeout(() => {
        set[panel](prev => [...prev, { type, text, complete: true }]);
      }, d));
      T[panel] += LINE_GAP;
    }

    function cmd(panel: PanelId, text: string, extra = 0) {
      T[panel] += extra;
      const t0 = T[panel];
      const full = PROMPT + text;
      tos.push(setTimeout(() => {
        set[panel](prev => [...prev, { type: "cmd", text: "", complete: false }]);
      }, t0));
      for (let c = 1; c <= full.length; c++) {
        const partial = full.slice(0, c);
        const done    = c === full.length;
        tos.push(setTimeout(() => {
          set[panel](prev => {
            const copy = [...prev];
            copy[copy.length - 1] = { type: "cmd", text: partial, complete: done };
            return copy;
          });
        }, t0 + c * CHAR_DELAY));
      }
      T[panel] = t0 + full.length * CHAR_DELAY + LINE_GAP;
    }

    function atLeast(panel: PanelId, t: number) { T[panel] = Math.max(T[panel], t); }

    /* Scenario 1 — Boot */
    if (id === "boot") {
      ln("server", "info",    "=== SPL STOMP System Start Sequence ===");
      cmd("server", "rm -f stomp_server.db", 100);
      ln("server", "success", "[Python] Stale database removed.");
      cmd("server", "python3 sql_server.py 7778 &", 80);
      ln("server", "output",  "[Python SQL :7778] Initialising schema: stomp_server.db");
      ln("server", "success", "[Python SQL :7778] Listening on port 7778 — Ready ✓");
      cmd("server", "mvn exec:java -Dexec.mainClass=\"bgu.spl.net.impl.stomp.StompServer\" -Dexec.args=\"7777 reactor\"", 200);
      ln("server", "output",  "[INFO] Scanning for projects...");
      ln("server", "output",  "[INFO] --- exec-maven-plugin:3.1.0:java (default-cli) ---");
      ln("server", "output",  "[INFO] BUILD SUCCESS");
      ln("server", "info",    "[Reactor] STOMP server up — port 7777  |  mode: REACTOR");
      ln("server", "success", "[Reactor] Thread pool ready. Awaiting connections...");
      ln("messi",  "output",  "(server is up — ready to connect)");
      ln("ronaldo","output",  "(server is up — ready to connect)");
    }

    /* Scenario 2 — Login */
    if (id === "login") {
      ln("server", "info", "[Reactor] Selector loop active — accepting connections...");
      cmd("messi", "login 127.0.0.1:7777 messi pass123");
      const messiRefT = T.messi;
      ln("messi", "frame-in", buildFrame("SEND → CONNECT", ["accept-version:1.2","host:stomp.cs.bgu.ac.il","login:messi","passcode:pass123"], []));
      cmd("ronaldo", "login 127.0.0.1:7777 ronaldo pass12", 200);
      const ronaldoRefT = T.ronaldo;
      ln("ronaldo", "frame-in", buildFrame("SEND → CONNECT", ["accept-version:1.2","host:stomp.cs.bgu.ac.il","login:ronaldo","passcode:pass12"], []));
      atLeast("server", messiRefT - 100);
      ln("server", "info", "[Reactor] New connection → Thread-1 assigned to: messi");
      ln("server", "info", "[Thread-1] CONNECT messi ......... AUTH OK ✓");
      atLeast("messi", T.server);
      ln("messi", "frame-in", buildFrame("RECV ← CONNECTED", ["version:1.2","session:sess-messi-4f8a2c"], []));
      ln("messi", "success", "Login successful — user: messi  |  session: 4f8a2c");
      atLeast("server", ronaldoRefT - 80);
      ln("server", "info", "[Reactor] New connection → Thread-2 assigned to: ronaldo");
      ln("server", "info", "[Thread-2] CONNECT ronaldo ....... AUTH OK ✓");
      atLeast("ronaldo", T.server);
      ln("ronaldo", "frame-in", buildFrame("RECV ← CONNECTED", ["version:1.2","session:sess-ronaldo-9d3b1a"], []));
      ln("ronaldo", "success", "Login successful — user: ronaldo  |  session: 9d3b1a");
    }

    /* Scenario 3 — Pub/Sub */
    if (id === "pubsub") {
      ln("messi",   "success", "CONNECTED — user: messi   |  session: 4f8a2c");
      ln("ronaldo", "success", "CONNECTED — user: ronaldo |  session: 9d3b1a");
      ln("server",  "info",    "[Thread-1] Client: messi   — authenticated ✓");
      ln("server",  "info",    "[Thread-2] Client: ronaldo — authenticated ✓");
      cmd("messi",   "join argentina_france", 150);
      ln("messi", "frame-in", buildFrame("SEND → SUBSCRIBE", ["destination:/argentina_france","id:sub-0","receipt:r-001"], []));
      cmd("ronaldo", "join argentina_france", 300);
      ln("ronaldo", "frame-in", buildFrame("SEND → SUBSCRIBE", ["destination:/argentina_france","id:sub-0","receipt:r-001"], []));
      const subEnd = Math.max(T.messi, T.ronaldo) + 100;
      atLeast("server", subEnd); atLeast("messi", subEnd); atLeast("ronaldo", subEnd);
      ln("server",  "info",    "[Thread-1] SUBSCRIBE /argentina_france  id:sub-0 (messi)");
      ln("server",  "info",    "[Thread-2] SUBSCRIBE /argentina_france  id:sub-0 (ronaldo)");
      ln("messi",   "success", "Joined channel: argentina_france ✓");
      ln("ronaldo", "success", "Joined channel: argentina_france ✓");
      cmd("messi", "report data/argentina_france_events.json", 300);
      ln("messi", "output", `Parsing argentina_france_events.json — ${AF_EVENTS.length} events`);
      const eventMeta = [
        { hdr: ["event_name:kickoff",  "time:0",    "active:true","before_halftime:true"], body: ["description: Argentina vs France — 2022 FIFA World Cup Final"] },
        { hdr: ["event_name:goal!!!!", "time:2160", "team_a goals:2","team_b goals:0"],    body: ["description: Di María fires Argentina ahead — 2:0!"] },
        { hdr: ["event_name:goal!!!!", "time:4800", "team_a goals:2","team_b goals:1"],    body: ["description: Mbappé converts penalty — 2:1"] },
        { hdr: ["event_name:goal!!!!", "time:4860", "team_a goals:2","team_b goals:2"],    body: ["description: Mbappé volleys in — 2:2. France level!"] },
      ];
      for (let i = 0; i < AF_EVENTS.length; i++) {
        const ev = AF_EVENTS[i];
        const pad = ".".repeat(Math.max(2, 22 - ev.time.length - ev.type.length));
        ln("messi", "output", `  [${ev.time}]  ${ev.type} ${pad} publishing`);
        const publishedAt = T.messi - LINE_GAP;
        atLeast("server", publishedAt + 60);
        ln("server", "info",     `[Thread-1] SEND /argentina_france  event:${ev.type}`);
        ln("server", "frame-in", buildFrame("SEND → server", ["destination:/argentina_france","user:messi",...eventMeta[i].hdr], eventMeta[i].body));
        ln("server", "sql",      `[Python SQL :7778] INSERT INTO events row ${i + 1} — channel:argentina_france`);
        const storedAt = T.server - LINE_GAP;
        tos.push(setTimeout(() => { eventsRef.current.push(ev); }, storedAt));
        atLeast("ronaldo", T.server + 100);
        ln("ronaldo", "frame-in", buildFrame("RECV ← MESSAGE", ["subscription:sub-0",`message-id:msg-${String(i+1).padStart(3,"0")}`,"destination:/argentina_france",...eventMeta[i].hdr], eventMeta[i].body));
      }
      atLeast("messi", Math.max(T.messi, T.server));
      ln("server", "sql",     "[Python SQL :7778] Committed. 4 rows — argentina_france");
      ln("server", "success", "[Reactor] Broadcast complete — 1 subscriber (ronaldo) notified ✓");
      atLeast("messi", T.server - LINE_GAP);
      ln("messi",  "success", `All ${AF_EVENTS.length} events published to argentina_france ✓`);
    }

    /* Scenario 4 — Summary */
    if (id === "summary") {
      ln("messi",   "success", "CONNECTED — user: messi   |  subscribed: argentina_france");
      ln("ronaldo", "success", "CONNECTED — user: ronaldo |  subscribed: argentina_france");
      cmd("ronaldo", "summary argentina_france messi file.txt", 400);
      ln("ronaldo", "output", "Requesting summary from server...");
      atLeast("server", T.ronaldo - LINE_GAP - 80);
      ln("server", "info",    "[Thread-2] SUMMARY request — channel:argentina_france  user:messi");
      ln("server", "sql",     "[Python SQL :7778] SELECT * FROM events WHERE channel='argentina_france' AND user='messi'");
      const evSrc = eventsRef.current.length > 0 ? eventsRef.current : AF_EVENTS;
      ln("server", "sql",     `[Python SQL :7778] Fetched ${evSrc.length} rows — computing stats...`);
      ln("server", "success", "[Thread-2] SUMMARY payload → dispatching to ronaldo");
      atLeast("ronaldo", T.server + 100);
      const summaryLines: { type: LineType; text: string }[] = [
        { type: "info",    text: "─────────────────────────────────────────────────" },
        { type: "output",  text: "Argentina vs France" },
        { type: "info",    text: "General stats:" },
        { type: "output",  text: "  active:          true" },
        { type: "output",  text: "  before_halftime: 1 event" },
        { type: "output",  text: "  total_goals:     4  (ARG 3, FRA 3 — penalties)" },
        { type: "info",    text: "Argentina stats:" },
        { type: "output",  text: "  goals_scored:    3  (Messi ×2 pen, Di María ×1)" },
        { type: "output",  text: "  possession:      55%" },
        { type: "info",    text: "France stats:" },
        { type: "output",  text: "  goals_scored:    3  (Mbappé ×3)" },
        { type: "output",  text: "  possession:      45%" },
        { type: "info",    text: "Game event reports (reporter: messi):" },
        { type: "output",  text: "  0:00   kickoff  — Argentina vs France — 2022 FIFA World Cup Final" },
        { type: "output",  text: "  36:00  goal!!!! — Di María fires Argentina ahead — 2:0!" },
        { type: "output",  text: "  80:00  goal!!!! — Mbappé converts penalty — 2:1" },
        { type: "output",  text: "  81:00  goal!!!! — Mbappé volleys in — 2:2. France level!" },
        { type: "info",    text: "─────────────────────────────────────────────────" },
        { type: "success", text: "FINAL (AET): Argentina 3 — 3 France  |  ARG win on penalties ✓" },
      ];
      for (const sl of summaryLines) ln("ronaldo", sl.type, sl.text);
      ln("ronaldo", "success", "Summary written → file.txt ✓");
    }

    /* Scenario 5 — Logout */
    if (id === "logout") {
      ln("messi",  "success", "CONNECTED — user: messi");
      ln("ronaldo","success", "CONNECTED — user: ronaldo");
      ln("server", "info",   "[Thread-1] messi   — active connection");
      ln("server", "info",   "[Thread-2] ronaldo — active connection");
      cmd("messi", "logout");
      ln("messi", "frame-in", buildFrame("SEND → DISCONNECT", ["receipt:r-113"], []));
      ln("messi", "output",   "[Keyboard thread] DISCONNECT sent — cv.wait() blocking...");
      atLeast("server", T.messi - LINE_GAP - 80);
      ln("server", "info", "[Thread-1] DISCONNECT messi → dispatching RECEIPT:r-113");
      atLeast("messi", T.server);
      ln("messi", "frame-in", buildFrame("RECV ← RECEIPT", ["receipt-id:r-113"], []));
      ln("messi", "success",  "RECEIPT received — receipt-id: r-113");
      ln("messi", "output",   "[Socket thread]   receiptReceived = true → cv.notify_one()");
      ln("messi", "output",   "[Keyboard thread] CV unblocked → close(sockfd)");
      ln("messi", "output",   "[Socket thread]   recv() = 0 (EOF) → thread exiting");
      ln("messi", "success",  "Socket closed. Both threads joined cleanly. ✓");
      cmd("ronaldo", "logout", 200);
      ln("ronaldo", "frame-in", buildFrame("SEND → DISCONNECT", ["receipt:r-114"], []));
      ln("ronaldo", "output",   "[Keyboard thread] DISCONNECT sent — cv.wait() blocking...");
      atLeast("server", T.ronaldo - LINE_GAP - 80);
      ln("server", "info",   "[Thread-2] DISCONNECT ronaldo → dispatching RECEIPT:r-114");
      ln("server", "output", "[Reactor] All clients disconnected — selector loop idle.");
      atLeast("ronaldo", T.server);
      ln("ronaldo", "frame-in", buildFrame("RECV ← RECEIPT", ["receipt-id:r-114"], []));
      ln("ronaldo", "success", "RECEIPT received — receipt-id: r-114");
      ln("ronaldo", "output",  "[Socket thread]   receiptReceived = true → cv.notify_one()");
      ln("ronaldo", "output",  "[Keyboard thread] CV unblocked → close(sockfd)");
      ln("ronaldo", "output",  "[Socket thread]   recv() = 0 (EOF) → thread exiting");
      ln("ronaldo", "success", "Socket closed. Both threads joined cleanly. ✓");
    }

    const maxT = Math.max(T.messi, T.ronaldo, T.server) + 400;
    tos.push(setTimeout(() => setIsPlaying(false), maxT));
  }

  /* ── Render ─────────────────────────────────────────────────────────────── */
  const storyVisible = activeTab === "story";
  const demoVisible  = activeTab === "demo";

  return (
    <section id="spl" className="spl-root">
      <StyleInjector />
      <div aria-hidden className="spl-bg-orb" />

      <div className="spl-inner">
        {/* Section header */}
        <div className="spl-header">
          <span className="spl-header-badge">
            <span className="spl-header-dot" />
            BGU SPL Systems Programming — World Cup 2022 Informer
          </span>
          <h2 className="spl-title">
            A <span className="spl-title-em">Distributed</span> STOMP System
          </h2>
          <p className="spl-subtitle">
            Java Reactor server · Python SQLite bridge · C++ multithreaded client · Custom STOMP 1.2 protocol over TCP. Five engineering decisions that shaped the implementation — click any button to watch the live protocol exchange.
          </p>
          <p className="spl-subtitle" style={{ fontSize: "0.78rem", color: "#A8A29E", marginTop: "0.35rem" }}>
            Simulated demo — interactions reflect the real protocol flow.
          </p>
        </div>

        {/* Context cards */}
        <div className="spl-context">
          <div className="spl-context-card">
            <div className="spl-context-card-label">What it does</div>
            <div className="spl-context-card-body">
              A <strong>real-time pub/sub event system</strong> for football matches.
              Reporters upload game event JSON files to a named channel
              (e.g. <code style={LC}>argentina_france</code>).
              Every subscribed client instantly receives a MESSAGE frame per event —
              scores, kickoffs, substitutions — as they are published.
            </div>
          </div>
          <div className="spl-context-card">
            <div className="spl-context-card-label">Who uses it</div>
            <div className="spl-context-card-body">
              Two user roles share the same server.
              A <strong>reporter</strong> connects, subscribes to a channel,
              and uploads an event file. A <strong>subscriber</strong> connects
              and subscribes to receive live updates. Any client can call
              <code style={LC}> summary</code> to get aggregated stats for any reporter on any channel.
            </div>
          </div>
          <div className="spl-context-card">
            <div className="spl-context-card-label">Why STOMP</div>
            <div className="spl-context-card-body">
              STOMP 1.2 provides <strong>channel-based pub/sub over raw TCP</strong> with
              a standardized text frame format — CONNECT, SUBSCRIBE, SEND, MESSAGE,
              DISCONNECT. Its <strong>RECEIPT handshake</strong> guarantees all frames
              are processed before a client disconnects, making clean teardown reliable
              without application-level polling.
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="spl-tabs">
          <button
            className={`spl-tab${activeTab === "story" ? " spl-tab--active" : " spl-tab--inactive"}`}
            onClick={() => setActiveTab("story")}
          >
            📖 Engineering Story
          </button>
          <button
            className={`spl-tab${activeTab === "demo" ? " spl-tab--active" : " spl-tab--inactive"}`}
            onClick={() => setActiveTab("demo")}
          >
            ⚡ Live Terminal
          </button>
        </div>

        {/* Split pane */}
        <div className="spl-split">
          <div className="spl-story" style={{ display: storyVisible ? undefined : "none" }}>
            {SECTIONS.map(section => (
              <StorySection
                key={section.stepId}
                section={section}
                isActive={activeStep === section.stepId}
                isPlaying={isPlaying}
                onTrigger={() => playScenario(section.stepId)}
              />
            ))}
          </div>

          <div className="spl-terminal" style={{ display: demoVisible ? undefined : "none" }}>
            <TerminalPanel
              title="bash — messi"
              subtitle="@stomp-client  [keyboard-thread + socket-thread]"
              lines={messiLines}
              bottomRef={messiBot}
            />
            <TerminalPanel
              title="bash — ronaldo"
              subtitle="@stomp-client  [keyboard-thread + socket-thread]"
              lines={ronaldoLines}
              bottomRef={ronaldoBot}
            />
            <TerminalPanel
              title="bash — StompServer"
              subtitle=":7777 (JavaReactor)  |  Python SQL :7778"
              lines={serverLines}
              bottomRef={serverBot}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
