"use client";

import React, { useState, useEffect, useRef } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type PanelId = "messi" | "ronaldo" | "server";

type LineType =
  | "cmd"        // cyan   — user-typed command
  | "output"     // slate  — plain output
  | "error"      // red    — runtime errors
  | "success"    // green  — confirmed / OK
  | "info"       // indigo — section headers
  | "frame-in"   // violet — STOMP frame (box-drawing)
  | "frame-err"  // red    — STOMP ERROR frame
  | "sql";       // orange — Python SQL layer

type StepId = "boot" | "login" | "pubsub" | "summary" | "logout";

interface TerminalLine {
  type: LineType;
  text: string;
  complete: boolean;
}

interface StorySectionData {
  stepId:   StepId;
  badge:    string;
  headline: string;
  body:     React.ReactNode;
  btnLabel: string;
}

/* ─── Colour tokens ──────────────────────────────────────────────────────── */
const LINE_COLORS: Record<LineType, string> = {
  cmd:         "#22d3ee",
  output:      "#94a3b8",
  error:       "#f87171",
  success:     "#4ade80",
  info:        "#818cf8",
  "frame-in":  "#c084fc",
  "frame-err": "#f87171",
  sql:         "#fb923c",
};

/* ─── Timing constants ───────────────────────────────────────────────────── */
const CHAR_DELAY = 15;
const LINE_GAP   = 155;
const PROMPT     = "$ ";
const BORDER     = 47;

/* ─── Game data (Argentina vs France — 2022 World Cup Final) ─────────────── */
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

function buildErrorFrame(message: string, details: string[]): string {
  const top = `╔═ ERROR ${"═".repeat(BORDER - 6)}`;
  const bot = `╚${"═".repeat(BORDER)}`;
  return [top, `║  message:  ${message}`, ...details.map(d => `║  ${d}`), bot].join("\n");
}

/* ─── Story sections ─────────────────────────────────────────────────────── */
const SECTIONS: StorySectionData[] = [
  {
    stepId:   "boot",
    badge:    "01 / Architecture",
    headline: "A Three-Language Pipeline",
    btnLabel: "Boot the System",
    body: (
      <div className="spl-body">
        <p>
          The system is a three-tier architecture where each language owns a distinct protocol
          boundary. At the top sits a Java server supporting two I/O models — Thread-Per-Client{" "}
          <code>(TPC)</code>, where each connection owns a dedicated OS thread blocking on
          socket reads, and <code>Reactor</code>, where a single selector loop dispatches I/O
          readiness events to a bounded thread pool. The Reactor model is the course&apos;s
          central design lesson: handlers must <em>never</em> block, or the selector loop
          stalls every other active connection.
        </p>
        <p>
          Below it, a Python process exposes a raw TCP socket on <code>:7778</code> and owns
          the SQLite persistence layer — INSERT and SELECT operations for user registration,
          login timestamps, and event logs. This keeps the Java server fully stateless with
          respect to disk. The C++17 client is the most mechanically demanding tier: it
          implements the full STOMP 1.2 client-side state machine, including subscription
          tracking, in-memory event aggregation, and the two-thread concurrency model
          described in the next section.
        </p>
      </div>
    ),
  },
  {
    stepId:   "login",
    badge:    "02 / Concurrency",
    headline: "Two Threads, One Socket, Zero Data Races",
    btnLabel: "Connect Clients",
    body: (
      <div className="spl-body">
        <p>
          The C++ client spawns exactly two POSIX threads at login: a <em>keyboard thread</em>{" "}
          that reads <code>stdin</code> and writes STOMP frames to the socket, and a{" "}
          <em>socket thread</em> that reads incoming frames and dispatches them to handlers.
          The socket file descriptor is owned by the socket thread — the keyboard thread never
          reads from it. This ownership discipline eliminates the need for a read-side mutex
          entirely.
        </p>
        <p>
          Shared mutable state is limited to three fields: the subscription map, a connection
          boolean, and the receipt confirmation buffer. All three are guarded by a single{" "}
          <code>std::mutex</code>. <code>std::lock_guard</code> governs every acquisition,
          ensuring the lock is released on every control-flow path — including exceptions.
        </p>
        <p>
          The socket lifecycle is RAII-managed: the <code>StompClient</code> destructor calls{" "}
          <code>close(sockfd)</code> unconditionally, eliminating an entire class of descriptor
          leaks that appear when developers rely on explicit error-path cleanup. The guarantee
          cannot be bypassed by the caller.
        </p>
      </div>
    ),
  },
  {
    stepId:   "pubsub",
    badge:    "03 / Protocol",
    headline: "Implementing STOMP 1.2 from the RFC",
    btnLabel: "Subscribe & Report",
    body: (
      <div className="spl-body">
        <p>
          STOMP 1.2 has a deceptively simple wire format: command on the first line,
          colon-delimited headers, a blank line delimiter, an optional body, and a null byte{" "}
          <code>(\0)</code> terminator. A correct parser must handle the{" "}
          <code>content-length</code> header (which overrides null-byte scanning), multi-value
          headers, and frame bodies that may themselves contain newlines. The C++ parser reads
          the socket byte-by-byte, accumulating frames into an <code>std::string</code> buffer
          until the terminator is found.
        </p>
        <p>
          On the server, <code>ConnectionsImpl&lt;String&gt;</code> maintains a thread-safe
          map from connection ID to <code>ConnectionHandler</code>. When a <code>SEND</code>{" "}
          frame arrives, <code>send(channel, msg)</code> iterates every subscriber under a
          read lock and calls <code>handler.send()</code> for each. In Reactor mode, this call
          must be non-blocking: it writes to a per-connection output queue and registers the
          connection as write-ready on the selector — the actual flush happens on the next
          I/O dispatch cycle.
        </p>
        <p>
          Subscription IDs are assigned by the client, not the server. The client generates a
          monotonically increasing integer, stores the <code>(channel→subId)</code> mapping
          locally, and receives the same ID back in every <code>MESSAGE</code> frame as the{" "}
          <code>subscription</code> header. This enables O(1) lookup from incoming message to
          local subscription record without any server-side coordination.
        </p>
      </div>
    ),
  },
  {
    stepId:   "summary",
    badge:    "04 / Data Structures",
    headline: "The State the Server Never Sees",
    btnLabel: "Generate Summary",
    body: (
      <div className="spl-body">
        <p>
          The <code>summary</code> command exposes a data structure decision made entirely on
          the client: <code>map&lt;string, map&lt;string, vector&lt;Event&gt;&gt;&gt;</code>.
          Outer key = channel name, inner key = reporting user, vector = events in time order.
          This three-level structure provides per-reporter isolation with O(log n) lookup at
          every level — <code>std::map</code> uses a red-black tree, giving O(log n) insert
          and guaranteed lexicographic key ordering on iteration.
        </p>
        <p>
          Lexicographic ordering is not cosmetic. The output spec requires stats alphabetically:
          <code>active</code>, <code>before_halftime</code>, <code>goals</code>,{" "}
          <code>possession</code>… Because <code>std::map</code> iterates in key order by
          default, the correct format falls out without a post-sort step — the data structure
          encodes the ordering contract. Event ordering is handled by a secondary sort on the{" "}
          <code>vector&lt;Event&gt;</code> by the <code>time</code> field.
        </p>
        <p>
          The aggregation pass is O(n) over events after the O(n log n) sort. Stats are
          accumulative — later values overwrite earlier ones in a flat{" "}
          <code>map&lt;string, string&gt;</code>. The server is fully stateless with respect to
          this computation: it persists raw SEND frames and delegates all aggregation logic to
          the requesting client.
        </p>
      </div>
    ),
  },
  {
    stepId:   "logout",
    badge:    "05 / Graceful Shutdown",
    headline: "Closing Without Losing a Frame",
    btnLabel: "Graceful Logout",
    body: (
      <div className="spl-body">
        <p>
          Closing a TCP socket before the peer has processed all queued data silently discards
          bytes still in the kernel send buffer — a bug that only surfaces under load. STOMP
          1.2 defines a DISCONNECT handshake to prevent this: the client sends{" "}
          <code>DISCONNECT</code> with a <code>receipt</code> header and must not close the
          socket until it receives the matching <code>RECEIPT</code> frame.
        </p>
        <p>
          The implementation uses <code>std::condition_variable</code> to coordinate the two
          threads. The keyboard thread calls{" "}
          <code>cv.wait(lock, [&amp;]&#123; return receiptReceived; &#125;)</code> after
          sending <code>DISCONNECT</code>. The socket thread, on receiving the matching{" "}
          <code>RECEIPT</code>, sets <code>receiptReceived = true</code> under the lock and
          calls <code>cv.notify_one()</code>. The keyboard thread wakes, calls{" "}
          <code>close(sockfd)</code>, and exits. The socket thread&apos;s next{" "}
          <code>recv()</code> returns 0 (EOF) and it exits cleanly.
        </p>
        <p>
          Both threads reach their return statement through normal control flow — no{" "}
          <code>sleep()</code>, no polling, no forced termination. The STOMP 1.2 RFC specifies
          that RECEIPT is cumulative: it acknowledges <em>all</em> preceding frames, not just
          the DISCONNECT itself. This is the only protocol mechanism that provides that
          guarantee.
        </p>
      </div>
    ),
  },
];

/* ─── Scoped CSS ─────────────────────────────────────────────────────────── */
const SCOPED_CSS = `
/* ── Root ──────────────────────────────────────────────────────────────── */
.spl-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #e2e8f0;
  position: relative;
  overflow: visible;
}
.spl-bg-orb {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 75% 65% at 50% 50%,
    rgba(6,59,88,0.22) 0%, transparent 70%);
  z-index: 0;
}

/* ── Inner wrapper ──────────────────────────────────────────────────────── */
.spl-inner {
  position: relative; z-index: 1;
  max-width: 72rem; margin: 0 auto;
  padding: 5rem 1.5rem 6rem;
}

/* ── Section header ─────────────────────────────────────────────────────── */
.spl-header { text-align: center; margin-bottom: 3.5rem; }
.spl-header-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  border-radius: 9999px; border: 1px solid rgba(76,199,184,0.28);
  padding: 0.375rem 1rem; font-size: 0.7rem; font-family: monospace;
  font-weight: 600; letter-spacing: 0.04em; margin-bottom: 1.25rem;
  background: rgba(76,199,184,0.12); color: #4cc7b8; cursor: default;
}
.spl-header-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #4cc7b8;
  animation: spl-pulse 2s infinite;
}
@keyframes spl-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.spl-title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 700; color: #ffffff; line-height: 1.15; margin-bottom: 0.75rem;
}
.spl-title-em { color: #4cc7b8; }
.spl-subtitle {
  font-size: 0.9rem; color: #94a3b8; max-width: 38rem;
  margin: 0 auto; line-height: 1.75;
}

/* ── Mobile tab switcher ─────────────────────────────────────────────────── */
.spl-tabs {
  display: grid; grid-template-columns: 1fr 1fr;
  border-radius: 0.75rem; overflow: hidden;
  border: 1px solid rgba(76,199,184,0.25); margin-bottom: 1.5rem;
}
.spl-tab {
  padding: 0.625rem 1rem; font-size: 0.8rem; font-weight: 600;
  font-family: monospace; letter-spacing: 0.03em;
  border: none; cursor: pointer; transition: all 0.2s ease; text-align: center;
}
.spl-tab--active   { background: #4cc7b8; color: #063b58; }
.spl-tab--inactive { background: rgba(6,59,88,0.6); color: #94a3b8; }

/* ── Split layout ───────────────────────────────────────────────────────── */
.spl-split {
  display: flex; gap: 2rem; align-items: flex-start;
}

/* ── Left: story pane ───────────────────────────────────────────────────── */
.spl-story {
  flex: 0 0 48%;
  display: flex; flex-direction: column; gap: 1.5rem;
}

/* ── Right: sticky terminal pane ────────────────────────────────────────── */
.spl-terminal {
  flex: 1;
  position: sticky; top: 4.5rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  max-height: calc(100vh - 6rem); overflow-y: auto;
}

/* ── Story section card ─────────────────────────────────────────────────── */
.spl-section {
  border-radius: 1rem; padding: 1.5rem;
  border: 1px solid rgba(76,199,184,0.10);
  background: rgba(6,59,88,0.25);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
}
.spl-section--active {
  border-left: 2px solid #4cc7b8;
  border-color: rgba(76,199,184,0.38);
  background: rgba(6,59,88,0.38);
  box-shadow: 0 0 24px rgba(76,199,184,0.08), inset 0 0 18px rgba(251,146,60,0.04);
}

/* ── Step badge ─────────────────────────────────────────────────────────── */
.spl-step-badge {
  display: inline-block; margin-bottom: 0.75rem;
  font-size: 0.65rem; font-family: monospace; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 0.2rem 0.6rem; border-radius: 9999px;
  background: rgba(251,146,60,0.15); color: #fb923c;
  border: 1px solid rgba(251,146,60,0.28);
}

/* ── Section headline ───────────────────────────────────────────────────── */
.spl-headline {
  font-size: 1.05rem; font-weight: 700; color: #ffffff;
  margin: 0 0 0.75rem; line-height: 1.35;
}

/* ── Prose body ─────────────────────────────────────────────────────────── */
.spl-body {
  font-size: 0.84rem; color: #94a3b8; line-height: 1.8;
  display: flex; flex-direction: column; gap: 0.65rem;
  margin-bottom: 1.25rem;
}
.spl-body p { margin: 0; }
.spl-body em { color: #cbd5e1; font-style: italic; }
.spl-body code {
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.77rem; padding: 0.1rem 0.35rem;
  border-radius: 4px; background: rgba(76,199,184,0.10); color: #4cc7b8;
}

/* ── Trigger button ─────────────────────────────────────────────────────── */
.spl-trigger-btn {
  display: inline-flex; align-items: center; gap: 0.45rem;
  padding: 0.45rem 1.1rem; border-radius: 9999px;
  border: 1px solid #4cc7b8; background: transparent; color: #4cc7b8;
  font-size: 0.78rem; font-family: monospace; font-weight: 600;
  cursor: pointer; transition: all 0.22s ease; letter-spacing: 0.03em;
}
.spl-trigger-btn:hover {
  background: #4cc7b8; color: #063b58;
  box-shadow: 0 4px 16px rgba(76,199,184,0.35);
  transform: translateY(-1px);
}
.spl-trigger-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.spl-trigger-btn--active  { background: rgba(76,199,184,0.15); box-shadow: 0 0 0 1px #4cc7b8 inset; }
.spl-trigger-arrow { font-size: 0.85rem; transition: transform 0.2s ease; }
.spl-trigger-btn:hover .spl-trigger-arrow { transform: translateX(3px); }

/* ── Terminal panel ─────────────────────────────────────────────────────── */
.spl-panel {
  border-radius: 0.75rem; overflow: hidden;
  border: 1px solid rgba(76,199,184,0.25);
  background: rgba(6,59,88,0.55);
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
}

/* ── Panel chrome (window header) ───────────────────────────────────────── */
.spl-panel-chrome {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.75rem; flex-shrink: 0;
  background: rgba(6,59,88,0.80);
  border-bottom: 1px solid rgba(76,199,184,0.15);
}
.spl-panel-dot  { width: 0.6rem; height: 0.6rem; border-radius: 50%; flex-shrink: 0; }
.spl-panel-title {
  margin-left: 0.5rem; font-size: 0.7rem; font-family: monospace;
  font-weight: 600; color: #4cc7b8;
}
.spl-panel-sub {
  font-size: 0.7rem; font-family: monospace; color: #475569;
}

/* ── Panel output area ──────────────────────────────────────────────────── */
.spl-panel-output {
  overflow-y: auto; padding: 0.75rem;
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.68rem; line-height: 1.55;
  background: rgba(4,19,30,1);
  min-height: 90px;
}
.spl-line {
  display: flex; align-items: flex-start; min-height: 1.1rem;
}
.spl-line-text { word-break: break-all; white-space: pre-wrap; }
.spl-cursor {
  display: inline-block; width: 0.375rem; height: 0.875rem;
  margin-left: 1px; background: #22d3ee; flex-shrink: 0; margin-top: 1px;
  animation: spl-blink 1s step-end infinite;
}
@keyframes spl-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* ── STOMP frame blocks ─────────────────────────────────────────────────── */
.spl-frame {
  color: #c084fc;
  background: rgba(192,132,252,0.07);
  border-left: 2px solid #c084fc;
  border-radius: 0 4px 4px 0;
  padding: 4px 8px; margin: 3px 0;
  font-family: inherit; font-size: 0.65rem; line-height: 1.55;
  white-space: pre; overflow-x: auto;
}
.spl-frame--err {
  color: #f87171;
  background: rgba(248,113,113,0.07);
  border-left-color: #f87171;
}

/* ── Legend ─────────────────────────────────────────────────────────────── */
.spl-legend { display: flex; flex-wrap: wrap; gap: 0.75rem; padding: 0.125rem 0; }
.spl-legend-item {
  display: flex; align-items: center; gap: 0.375rem;
  font-size: 0.68rem; font-family: monospace; color: #475569;
}
.spl-legend-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; flex-shrink: 0; }

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 767px) {
  .spl-split     { flex-direction: column; }
  .spl-story     { flex: none; width: 100%; }
  .spl-terminal  { position: static; max-height: none; }
}
@media (min-width: 768px) {
  .spl-tabs      { display: none; }
  .spl-story,
  .spl-terminal  { display: flex !important; }
}
`;

/* ─── StyleInjector ──────────────────────────────────────────────────────── */
function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />;
}

/* ─── TerminalPanel ──────────────────────────────────────────────────────── */
function TerminalPanel({
  title, subtitle, lines, bottomRef, maxHeight = "195px",
}: {
  title:     string;
  subtitle:  string;
  lines:     TerminalLine[];
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
      <div className="spl-panel-output" style={{ maxHeight }}>
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
              <span
                className="spl-line-text"
                style={{ color: LINE_COLORS[line.type] }}
              >
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
  section:   StorySectionData;
  isActive:  boolean;
  isPlaying: boolean;
  onTrigger: () => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isActive]);

  return (
    <div
      ref={sectionRef}
      className={`spl-section${isActive ? " spl-section--active" : ""}`}
    >
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

/* ─── SPLCaseStudy ───────────────────────────────────────────────────────── */
export default function SPLCaseStudy() {
  const welcome = (who: string): TerminalLine[] => [
    { type: "info",   text: `StompWCIClient — ${who}`, complete: true },
    { type: "output", text: "Click a button on the left to run a scenario ↑", complete: true },
  ];
  const welcomeServer = (): TerminalLine[] => [
    { type: "info",   text: "Java Reactor :7777  |  Python SQL :7778", complete: true },
    { type: "output", text: "Click a button on the left to run a scenario ↑", complete: true },
  ];

  const [activeStep,    setActiveStep]    = useState<StepId | null>(null);
  const [messiLines,    setMessiLines]    = useState<TerminalLine[]>(welcome("messi"));
  const [ronaldoLines,  setRonaldoLines]  = useState<TerminalLine[]>(welcome("ronaldo"));
  const [serverLines,   setServerLines]   = useState<TerminalLine[]>(welcomeServer());
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [activeTab,     setActiveTab]     = useState<"story" | "demo">("story");

  const messiBot   = useRef<HTMLDivElement>(null);
  const ronaldoBot = useRef<HTMLDivElement>(null);
  const serverBot  = useRef<HTMLDivElement>(null);
  const tosRef     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const eventsRef  = useRef<typeof AF_EVENTS>([]);

  useEffect(() => { messiBot.current?.scrollIntoView({ behavior: "smooth" }); },   [messiLines]);
  useEffect(() => { ronaldoBot.current?.scrollIntoView({ behavior: "smooth" }); }, [ronaldoLines]);
  useEffect(() => { serverBot.current?.scrollIntoView({ behavior: "smooth" }); },  [serverLines]);
  useEffect(() => () => { tosRef.current.forEach(clearTimeout); }, []);

  /* ── Playback engine ────────────────────────────────────────────────────── */
  function playScenario(id: StepId) {
    tosRef.current.forEach(clearTimeout);
    tosRef.current = [];
    eventsRef.current = [];
    setIsPlaying(true);
    setActiveStep(id);

    setMessiLines([{  type: "info", text: "bash — messi@stomp-client",               complete: true }]);
    setRonaldoLines([{ type: "info", text: "bash — ronaldo@stomp-client",             complete: true }]);
    setServerLines([{  type: "info", text: "Java Reactor :7777  |  Python SQL :7778", complete: true }]);

    const tos = tosRef.current;
    const T: Record<PanelId, number> = { messi: 200, ronaldo: 200, server: 200 };
    const set: Record<PanelId, React.Dispatch<React.SetStateAction<TerminalLine[]>>> = {
      messi:   setMessiLines,
      ronaldo: setRonaldoLines,
      server:  setServerLines,
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
      const t0   = T[panel];
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

    /* ── Scenario 1: Boot ─────────────────────────────────────────────────── */
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

    /* ── Scenario 2: Login ────────────────────────────────────────────────── */
    if (id === "login") {
      ln("server", "info", "[Reactor] Selector loop active — accepting connections...");

      cmd("messi", "login 127.0.0.1:7777 messi pass123");
      const messiRefT = T.messi;

      const messiConnectFrame = buildFrame("SEND → CONNECT", [
        "accept-version:1.2",
        "host:stomp.cs.bgu.ac.il",
        "login:messi",
        "passcode:pass123",
      ], []);
      ln("messi", "frame-in", messiConnectFrame);

      cmd("ronaldo", "login 127.0.0.1:7777 ronaldo pass12", 200);
      const ronaldoRefT = T.ronaldo;

      const ronaldoConnectFrame = buildFrame("SEND → CONNECT", [
        "accept-version:1.2",
        "host:stomp.cs.bgu.ac.il",
        "login:ronaldo",
        "passcode:pass12",
      ], []);
      ln("ronaldo", "frame-in", ronaldoConnectFrame);

      atLeast("server", messiRefT - 100);
      ln("server", "info",    "[Reactor] New connection → Thread-1 assigned to: messi");
      ln("server", "info",    "[Thread-1] CONNECT messi ......... AUTH OK ✓");

      atLeast("messi", T.server);
      const messiConnectedFrame = buildFrame("RECV ← CONNECTED", [
        "version:1.2",
        "session:sess-messi-4f8a2c",
      ], []);
      ln("messi", "frame-in",  messiConnectedFrame);
      ln("messi", "success",   "Login successful — user: messi  |  session: 4f8a2c");

      atLeast("server", ronaldoRefT - 80);
      ln("server", "info",    "[Reactor] New connection → Thread-2 assigned to: ronaldo");
      ln("server", "info",    "[Thread-2] CONNECT ronaldo ....... AUTH OK ✓");

      atLeast("ronaldo", T.server);
      const ronaldoConnectedFrame = buildFrame("RECV ← CONNECTED", [
        "version:1.2",
        "session:sess-ronaldo-9d3b1a",
      ], []);
      ln("ronaldo", "frame-in",  ronaldoConnectedFrame);
      ln("ronaldo", "success",   "Login successful — user: ronaldo  |  session: 9d3b1a");
    }

    /* ── Scenario 3: Pub/Sub ──────────────────────────────────────────────── */
    if (id === "pubsub") {
      ln("messi",   "success", "CONNECTED — user: messi   |  session: 4f8a2c");
      ln("ronaldo", "success", "CONNECTED — user: ronaldo |  session: 9d3b1a");
      ln("server",  "info",    "[Thread-1] Client: messi   — authenticated ✓");
      ln("server",  "info",    "[Thread-2] Client: ronaldo — authenticated ✓");

      cmd("messi",   "join argentina_france", 150);
      const messiSubFrame = buildFrame("SEND → SUBSCRIBE", [
        "destination:/argentina_france",
        "id:sub-0",
        "receipt:r-001",
      ], []);
      ln("messi", "frame-in", messiSubFrame);

      cmd("ronaldo", "join argentina_france", 300);
      const ronaldoSubFrame = buildFrame("SEND → SUBSCRIBE", [
        "destination:/argentina_france",
        "id:sub-0",
        "receipt:r-001",
      ], []);
      ln("ronaldo", "frame-in", ronaldoSubFrame);

      const subEnd = Math.max(T.messi, T.ronaldo) + 100;
      atLeast("server",  subEnd);
      atLeast("messi",   subEnd);
      atLeast("ronaldo", subEnd);

      ln("server",  "info",    "[Thread-1] SUBSCRIBE /argentina_france  id:sub-0 (messi)");
      ln("server",  "info",    "[Thread-2] SUBSCRIBE /argentina_france  id:sub-0 (ronaldo)");
      ln("messi",   "success", "Joined channel: argentina_france ✓");
      ln("ronaldo", "success", "Joined channel: argentina_france ✓");

      cmd("messi", "report data/argentina_france_events.json", 300);
      ln("messi", "output", `Parsing argentina_france_events.json — ${AF_EVENTS.length} events`);

      const eventMeta = [
        { hdr: ["event_name:kickoff",  "time:0",    "active:true", "before_halftime:true"], body: ["description: Argentina vs France — 2022 FIFA World Cup Final"] },
        { hdr: ["event_name:goal!!!!", "time:2160", "team_a goals:2", "team_b goals:0"],    body: ["description: Di María fires Argentina ahead — 2:0!"] },
        { hdr: ["event_name:goal!!!!", "time:4800", "team_a goals:2", "team_b goals:1"],    body: ["description: Mbappé converts penalty — 2:1"] },
        { hdr: ["event_name:goal!!!!", "time:4860", "team_a goals:2", "team_b goals:2"],    body: ["description: Mbappé volleys in — 2:2. France level!"] },
      ];

      for (let i = 0; i < AF_EVENTS.length; i++) {
        const ev  = AF_EVENTS[i];
        const pad = ".".repeat(Math.max(2, 22 - ev.time.length - ev.type.length));
        ln("messi", "output", `  [${ev.time}]  ${ev.type} ${pad} publishing`);

        const publishedAt = T.messi - LINE_GAP;
        atLeast("server", publishedAt + 60);

        const sendFrame = buildFrame("SEND → server", [
          "destination:/argentina_france",
          `user:messi`,
          ...eventMeta[i].hdr,
        ], eventMeta[i].body);
        ln("server", "info",  `[Thread-1] SEND /argentina_france  event:${ev.type}`);
        ln("server", "frame-in", sendFrame);
        ln("server", "sql",   `[Python SQL :7778] INSERT INTO events row ${i + 1} — channel:argentina_france`);

        const storedAt = T.server - LINE_GAP;
        tos.push(setTimeout(() => { eventsRef.current.push(ev); }, storedAt));

        atLeast("ronaldo", T.server + 100);
        const msgFrame = buildFrame("RECV ← MESSAGE", [
          "subscription:sub-0",
          `message-id:msg-${String(i + 1).padStart(3, "0")}`,
          "destination:/argentina_france",
          ...eventMeta[i].hdr,
        ], eventMeta[i].body);
        ln("ronaldo", "frame-in", msgFrame);
      }

      atLeast("messi", Math.max(T.messi, T.server));
      ln("server", "sql",     "[Python SQL :7778] Committed. 4 rows — argentina_france");
      ln("server", "success", "[Reactor] Broadcast complete — 1 subscriber (ronaldo) notified ✓");
      atLeast("messi", T.server - LINE_GAP);
      ln("messi",  "success", `All ${AF_EVENTS.length} events published to argentina_france ✓`);
    }

    /* ── Scenario 4: Summary ──────────────────────────────────────────────── */
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
      for (const sl of summaryLines) {
        ln("ronaldo", sl.type, sl.text);
      }
      ln("ronaldo", "success", "Summary written → file.txt ✓");
    }

    /* ── Scenario 5: Logout ───────────────────────────────────────────────── */
    if (id === "logout") {
      ln("messi",  "success", "CONNECTED — user: messi");
      ln("ronaldo","success", "CONNECTED — user: ronaldo");
      ln("server", "info",   "[Thread-1] messi   — active connection");
      ln("server", "info",   "[Thread-2] ronaldo — active connection");

      cmd("messi", "logout");
      const messiDisconFrame = buildFrame("SEND → DISCONNECT", [
        "receipt:r-113",
      ], []);
      ln("messi", "frame-in", messiDisconFrame);
      ln("messi", "output",   "[Keyboard thread] DISCONNECT sent — cv.wait() blocking...");

      atLeast("server", T.messi - LINE_GAP - 80);
      ln("server", "info",    "[Thread-1] DISCONNECT messi → dispatching RECEIPT:r-113");

      atLeast("messi", T.server);
      const messiReceiptFrame = buildFrame("RECV ← RECEIPT", [
        "receipt-id:r-113",
      ], []);
      ln("messi", "frame-in", messiReceiptFrame);
      ln("messi", "success",  "RECEIPT received — receipt-id: r-113");
      ln("messi", "output",   "[Socket thread]   receiptReceived = true → cv.notify_one()");
      ln("messi", "output",   "[Keyboard thread] CV unblocked → close(sockfd)");
      ln("messi", "output",   "[Socket thread]   recv() = 0 (EOF) → thread exiting");
      ln("messi", "success",  "Socket closed. Both threads joined cleanly. ✓");

      cmd("ronaldo", "logout", 200);
      const ronaldoDisconFrame = buildFrame("SEND → DISCONNECT", [
        "receipt:r-114",
      ], []);
      ln("ronaldo", "frame-in", ronaldoDisconFrame);
      ln("ronaldo", "output",   "[Keyboard thread] DISCONNECT sent — cv.wait() blocking...");

      atLeast("server", T.ronaldo - LINE_GAP - 80);
      ln("server", "info",    "[Thread-2] DISCONNECT ronaldo → dispatching RECEIPT:r-114");
      ln("server", "output",  "[Reactor] All clients disconnected — selector loop idle.");

      atLeast("ronaldo", T.server);
      const ronaldoReceiptFrame = buildFrame("RECV ← RECEIPT", [
        "receipt-id:r-114",
      ], []);
      ln("ronaldo", "frame-in", ronaldoReceiptFrame);
      ln("ronaldo", "success",  "RECEIPT received — receipt-id: r-114");
      ln("ronaldo", "output",   "[Socket thread]   receiptReceived = true → cv.notify_one()");
      ln("ronaldo", "output",   "[Keyboard thread] CV unblocked → close(sockfd)");
      ln("ronaldo", "output",   "[Socket thread]   recv() = 0 (EOF) → thread exiting");
      ln("ronaldo", "success",  "Socket closed. Both threads joined cleanly. ✓");
    }

    const maxT = Math.max(T.messi, T.ronaldo, T.server) + 400;
    tos.push(setTimeout(() => setIsPlaying(false), maxT));
  }

  /* ── Render ─────────────────────────────────────────────────────────────── */
  const storyVisible  = activeTab === "story";
  const demoVisible   = activeTab === "demo";

  return (
    <section className="spl-root">
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
            Java Reactor server · Python SQLite bridge · C++17 multithreaded client ·
            Custom STOMP 1.2 protocol over TCP. Five engineering decisions that shaped
            the implementation — click any button to watch the live protocol exchange.
          </p>
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
            ▶ Live Demo
          </button>
        </div>

        {/* Split pane */}
        <div className="spl-split">
          {/* Left: story */}
          <div
            className="spl-story"
            style={{ display: storyVisible ? undefined : "none" }}
          >
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

          {/* Right: terminal */}
          <div
            className="spl-terminal"
            style={{ display: demoVisible ? undefined : "none" }}
          >
            <TerminalPanel
              title="bash — messi"
              subtitle="@stomp-client  [keyboard-thread + socket-thread]"
              lines={messiLines}
              bottomRef={messiBot}
              maxHeight="185px"
            />
            <TerminalPanel
              title="bash — ronaldo"
              subtitle="@stomp-client  [keyboard-thread + socket-thread]"
              lines={ronaldoLines}
              bottomRef={ronaldoBot}
              maxHeight="185px"
            />
            <TerminalPanel
              title="bash — StompServer"
              subtitle=":7777 (JavaReactor)  |  Python SQL :7778"
              lines={serverLines}
              bottomRef={serverBot}
              maxHeight="160px"
            />

            {/* Legend */}
            <div className="spl-legend">
              {[
                { color: LINE_COLORS["frame-in"],  label: "STOMP frame (out/in)" },
                { color: LINE_COLORS.info,         label: "Thread annotation" },
                { color: LINE_COLORS.sql,          label: "Python SQL layer" },
                { color: LINE_COLORS.success,      label: "Confirmed" },
                { color: LINE_COLORS.error,        label: "Error frame" },
              ].map(({ color, label }) => (
                <div key={label} className="spl-legend-item">
                  <span className="spl-legend-dot" style={{ background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
