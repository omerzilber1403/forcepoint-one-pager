"use client";
import { useRef, useState, useEffect } from "react";
import { Server, User, Zap, FileText, LogOut, Trash2 } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type PanelId = "messi" | "ronaldo" | "server";
type LineType =
  | "cmd" | "output" | "error" | "success" | "info"
  | "frame-in" | "frame-err"
  | "thread1" | "thread2"
  | "sql";

interface TerminalLine {
  type: LineType;
  text: string;
  complete: boolean;
}

interface GameEvent {
  time: string;
  type: string;
  team: string | null;
  desc: string;
}

/* ─── Warm brand tokens ───────────────────────────────────────────────────── */
// Chrome (scenario bar, tab strip) — warm light glass
const W_AMBER        = "#f59e0b";
const W_AMBER_BORDER = "rgba(245,158,11,0.30)";
const W_CHROME_BG    = "rgba(255,255,255,0.88)";
const W_CHROME_DARK  = "rgba(15,23,42,0.97)";   // terminal window header stays dark
const W_DARK_OUTPUT  = "rgba(4,19,30,1)";        // terminal output pane — stays obsidian

/* ─── Terminal output colours (unchanged — standard monokai palette) ──────── */
const LINE_COLORS: Record<LineType, string> = {
  cmd:        "#22d3ee",
  output:     "#94a3b8",
  error:      "#f87171",
  success:    "#4ade80",
  info:       "#818cf8",
  "frame-in": "#c084fc",
  "frame-err":"#f87171",
  thread1:    "#22d3ee",
  thread2:    "#818cf8",
  sql:        "#fb923c",
};

/* ─── Timing ─────────────────────────────────────────────────────────────── */
const CHAR_DELAY = 15;
const LINE_GAP   = 155;
const PROMPT     = "$ ";

/* ─── Pre-recorded events ────────────────────────────────────────────────── */
const PARTIAL_EVENTS: GameEvent[] = [
  { time: "0:00",  type: "kickoff",        team: null,      desc: "The game has started! What an exciting evening!" },
  { time: "33:00", type: "goal!!!!",        team: "Germany", desc: "GOOOAAALLL!!! Germany lead! Gundogan slots it in — 1:0" },
  { time: "75:00", type: "goalgoalgoal!!!", team: "Japan",   desc: "GOOOOAAAALLL! Japan parity! Doan smashes it in — 1:1" },
];

/* ─── Frame builders ─────────────────────────────────────────────────────── */
const BORDER = 47;

function buildFrame(type: string, headers: string[], body: string[]): string {
  const top = `┌─ ${type} ${"─".repeat(Math.max(0, BORDER - type.length - 2))}`;
  const hdr = headers.map(h => `│ ${h}`);
  const sep = "│";
  const bdy = body.map(b => `│ ${b}`);
  const bot = `└${"─".repeat(BORDER)}`;
  return (body.length ? [top, ...hdr, sep, ...bdy, bot] : [top, ...hdr, bot]).join("\n");
}

function buildErrorFrame(message: string, details: string[]): string {
  const top = `╔═ ERROR ${"═".repeat(BORDER - 6)}`;
  const msg = `║  message:  ${message}`;
  const dts = details.map(d => `║  ${d}`);
  const bot = `╚${"═".repeat(BORDER)}`;
  return [top, msg, ...dts, bot].join("\n");
}

function summaryOutput(events: GameEvent[]): { type: LineType; text: string }[] {
  const germany = events.filter(e => e.team === "Germany").length;
  const japan   = events.filter(e => e.team === "Japan").length;
  return [
    { type: "info",    text: "─────────────────────────────────────────────" },
    { type: "output",  text: "Germany vs Japan" },
    { type: "output",  text: "Germany stats:" },
    { type: "output",  text: `  goals: ${germany}   possession: 51%` },
    { type: "output",  text: "Japan stats:" },
    { type: "output",  text: `  goals: ${japan}   possession: 49%` },
    { type: "output",  text: `Event log: ${events.length} events reported by messi / Germany_Japan` },
    ...events.map(e => ({
      type: "output" as LineType,
      text: `  ${e.time.padEnd(6)} — ${e.type}: ${e.desc.slice(0, 48)}`,
    })),
    { type: "info",    text: "─────────────────────────────────────────────" },
    { type: "success", text: `FINAL: Germany ${germany} — ${japan} Japan  (World Cup 2022, Group E)` },
  ];
}

/* ─── Scoped CSS ─────────────────────────────────────────────────────────── */
const MCT_WARM_CSS = `
  @keyframes mctw-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes mctw-tab-pulse {
    0%   { box-shadow: 0 0 0 0   rgba(245,158,11,0.5); }
    70%  { box-shadow: 0 0 0 6px rgba(245,158,11,0);   }
    100% { box-shadow: 0 0 0 0   rgba(245,158,11,0);   }
  }
  .mctw-tab-active { animation: mctw-tab-pulse 1.4s ease-out; }
`;

/* ─── Scenario metadata ──────────────────────────────────────────────────── */
const SCENARIOS = [
  { id: "boot",     label: "System Boot",  icon: <Server   className="w-3 h-3" /> },
  { id: "login",    label: "Dual Login",   icon: <User     className="w-3 h-3" /> },
  { id: "pubsub",   label: "Pub / Sub",    icon: <Zap      className="w-3 h-3" /> },
  { id: "summary",  label: "Summary",      icon: <FileText className="w-3 h-3" /> },
  { id: "shutdown", label: "Shutdown",     icon: <LogOut   className="w-3 h-3" /> },
];

/* ─── TerminalPanel ──────────────────────────────────────────────────────── */
function TerminalPanel({
  title, subtitle, lines, bottomRef, compact = false,
}: {
  title: string;
  subtitle: string;
  lines: TerminalLine[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  compact?: boolean;
}) {
  const maxH = compact ? "170px" : "215px";

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${W_AMBER_BORDER}`,
        boxShadow: "0 4px 20px rgba(245,158,11,0.10), 0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {/* Window chrome — stays dark for authentic terminal feel */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0 border-b"
        style={{ background: W_CHROME_DARK, borderColor: "rgba(245,158,11,0.18)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
        <span className="ml-2 text-xs font-mono font-semibold" style={{ color: W_AMBER }}>
          {title}
        </span>
        <span className="text-xs font-mono" style={{ color: "#64748b" }}>{subtitle}</span>
      </div>

      {/* Output — obsidian background, full monokai colours */}
      <div
        className="overflow-y-auto p-3 font-mono text-xs leading-[1.55]"
        style={{ background: W_DARK_OUTPUT, minHeight: "120px", maxHeight: maxH }}
      >
        {lines.map((line, idx) => {
          const isFrame = line.type === "frame-in" || line.type === "frame-err";
          if (isFrame) {
            return (
              <pre
                key={idx}
                style={{
                  color:       LINE_COLORS[line.type],
                  background:  line.type === "frame-err"
                    ? "rgba(248,113,113,0.07)" : "rgba(192,132,252,0.07)",
                  borderLeft:  `2px solid ${LINE_COLORS[line.type]}`,
                  borderRadius: "0 4px 4px 0",
                  padding:     "4px 8px",
                  margin:      "3px 0",
                  fontFamily:  "inherit",
                  fontSize:    "0.68rem",
                  lineHeight:  1.55,
                  whiteSpace:  "pre",
                  overflowX:   "auto",
                }}
              >
                {line.text}
              </pre>
            );
          }
          return (
            <div key={idx} className="flex items-start min-h-[1.2rem]">
              <span style={{ color: LINE_COLORS[line.type], wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
                {line.text}
              </span>
              {idx === lines.length - 1 && !line.complete && (
                <span
                  className="inline-block w-1.5 h-3.5 ml-px flex-shrink-0 mt-px"
                  style={{ background: W_AMBER, animation: "mctw-blink 1s step-end infinite" }}
                />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/* ─── MultiClientTerminalWarm ────────────────────────────────────────────── */
export function MultiClientTerminalWarm() {
  const welcome = (who: string): TerminalLine[] => [
    { type: "info", text: `StompWCI Client — ${who}`, complete: true },
    { type: "output", text: "Run a scenario above ↑", complete: true },
  ];
  const welcomeServer = (): TerminalLine[] => [
    { type: "info", text: "Java Reactor / Python SQL Architecture", complete: true },
    { type: "output", text: "Run a scenario above ↑", complete: true },
  ];

  const [messiLines,   setMessiLines]   = useState<TerminalLine[]>(welcome("messi"));
  const [ronaldoLines, setRonaldoLines] = useState<TerminalLine[]>(welcome("ronaldo"));
  const [serverLines,  setServerLines]  = useState<TerminalLine[]>(welcomeServer());
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [activeId,     setActiveId]     = useState<string | null>(null);
  const [activeTab,    setActiveTab]    = useState<PanelId>("messi");

  const messiBot   = useRef<HTMLDivElement>(null);
  const ronaldoBot = useRef<HTMLDivElement>(null);
  const serverBot  = useRef<HTMLDivElement>(null);
  const tosRef     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const eventsRef  = useRef<GameEvent[]>([]);

  useEffect(() => { messiBot.current?.scrollIntoView({ behavior: "smooth" }); }, [messiLines]);
  useEffect(() => { ronaldoBot.current?.scrollIntoView({ behavior: "smooth" }); }, [ronaldoLines]);
  useEffect(() => { serverBot.current?.scrollIntoView({ behavior: "smooth" }); }, [serverLines]);
  useEffect(() => () => { tosRef.current.forEach(clearTimeout); }, []);

  /* ── Playback engine ─────────────────────────────────────────────────── */
  function playScenario(scenarioId: string) {
    tosRef.current.forEach(clearTimeout);
    tosRef.current = [];
    eventsRef.current = [];
    setIsPlaying(true);
    setActiveId(scenarioId);

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

    /* ── Scenario 1: System Boot ─────────────────────────────────────── */
    if (scenarioId === "boot") {
      ln("server", "info",    "=== StompWCI Start Sequence ===");
      cmd("server", "rm -f stomp_server.db", 100);
      ln("server", "success", "[Python] Stale database removed.");
      cmd("server", "python3 sql_server.py 7778 &", 80);
      ln("server", "output",  "[Python SQL :7778] Initializing: stomp_server.db");
      ln("server", "success", "[Python SQL :7778] Listening on port 7778 — Ready");
      cmd("server", "mvn exec:java -Dexec.mainClass=\"...StompServer\" -Dexec.args=\"7777 reactor\"", 200);
      ln("server", "output",  "[INFO] Scanning for projects...");
      ln("server", "output",  "[INFO] --- exec-maven-plugin:3.1.0:java ---");
      ln("server", "output",  "[INFO] BUILD SUCCESS");
      ln("server", "thread1", "[Reactor] STOMP server up — port 7777  |  mode: REACTOR");
      ln("server", "success", "[Reactor] Thread pool ready. Waiting for connections...");
      ln("messi",  "output",  "(server is up — ready to connect)");
      ln("ronaldo","output",  "(server is up — ready to connect)");
    }

    /* ── Scenario 2: Dual Login + Auth Fail ──────────────────────────── */
    if (scenarioId === "login") {
      ln("server", "info", "[Reactor] Accepting connections...");

      cmd("messi",   "login 127.0.0.1:7777 messi pass123");
      const messiCmdEnd = T.messi;

      cmd("ronaldo", "login 127.0.0.1:7777 ronaldo pass12", 200);
      const ronaldoCmdEnd = T.ronaldo;

      atLeast("server", messiCmdEnd - 100);
      ln("server", "thread1", "[Reactor] New connection → Thread-1 assigned to: messi");
      ln("server", "thread1", "[Thread-1] CONNECT messi ................. AUTH OK ✓");

      atLeast("messi", T.server);
      ln("messi", "success", "CONNECTED — user: messi   |  session-id: 4f8a2c");

      atLeast("server", ronaldoCmdEnd - 80);
      ln("server", "thread2", "[Reactor] New connection → Thread-2 assigned to: ronaldo");
      ln("server", "thread2", "[Thread-2] CONNECT ronaldo ............... AUTH OK ✓");

      atLeast("ronaldo", T.server);
      ln("ronaldo", "success", "CONNECTED — user: ronaldo |  session-id: 9d3b1a");

      const failStart = Math.max(T.messi, T.ronaldo, T.server) + 400;
      atLeast("messi",  failStart);
      atLeast("server", failStart);

      ln("messi",  "info",    "── Auth Fail Test (wrong password) ──────────");
      cmd("messi", "login 127.0.0.1:7777 messi WRONG_PASSWORD");

      atLeast("server", T.messi - 180);
      ln("server", "output", "[Reactor] New connection → Thread-3 (guest)");
      ln("server", "error",  "[Thread-3] CONNECT messi → AUTH FAILED: Wrong password");
      ln("server", "error",  "[Thread-3] ERROR frame dispatched → Thread-3 terminated");

      atLeast("messi", T.server - LINE_GAP);
      const errFrame = buildErrorFrame("Wrong password for user: messi", [
        "receipt:   conn-fail-003",
        "action:    server rejected connection",
        "hint:      check credentials and retry",
      ]);
      ln("messi", "frame-err", errFrame);
      ln("messi", "output",   "(Existing session on Thread-1 is unaffected ✓)");
    }

    /* ── Scenario 3: Pub / Sub ───────────────────────────────────────── */
    if (scenarioId === "pubsub") {
      ln("messi",   "success", "CONNECTED — user: messi   |  session-id: 4f8a2c");
      ln("ronaldo", "success", "CONNECTED — user: ronaldo |  session-id: 9d3b1a");
      ln("server",  "thread1", "[Thread-1] Client: messi   — authenticated");
      ln("server",  "thread2", "[Thread-2] Client: ronaldo — authenticated");

      cmd("messi",   "join Germany_Japan", 150);
      cmd("ronaldo", "join Germany_Japan", 300);

      const subEnd = Math.max(T.messi, T.ronaldo) + 100;
      atLeast("server",  subEnd);
      atLeast("messi",   subEnd);
      atLeast("ronaldo", subEnd);

      ln("server",  "thread1", "[Thread-1] SUBSCRIBE /topic/Germany_Japan  id:sub-0 (messi)");
      ln("server",  "thread2", "[Thread-2] SUBSCRIBE /topic/Germany_Japan  id:sub-0 (ronaldo)");
      ln("messi",   "success", "Subscribed to channel: Germany_Japan");
      ln("ronaldo", "success", "Subscribed to channel: Germany_Japan");

      cmd("messi", "report data/events1_partial.json", 300);
      ln("messi", "output", `Parsing events1_partial.json — ${PARTIAL_EVENTS.length} events`);

      for (let i = 0; i < PARTIAL_EVENTS.length; i++) {
        const ev  = PARTIAL_EVENTS[i];
        const pad = ".".repeat(Math.max(2, 26 - ev.time.length - ev.type.length));
        ln("messi", "output", `  [${ev.time}]  ${ev.type} ${pad} publishing`);

        const publishedAt = T.messi - LINE_GAP;
        atLeast("server", publishedAt + 60);

        ln("server", "thread1", `[Thread-1] SEND /topic/Germany_Japan  event:${ev.type}`);
        ln("server", "sql",     `[Python SQL :7778] INSERT event ${i + 1} — channel:Germany_Japan`);

        const storedAt = T.server - LINE_GAP;
        tos.push(setTimeout(() => { eventsRef.current.push(ev); }, storedAt));

        atLeast("ronaldo", T.server + 100);
        const frameText = buildFrame("MESSAGE", [
          `subscription:sub-0`,
          `message-id:rx-${String(i + 1).padStart(3, "0")}`,
          `destination:/topic/Germany_Japan`,
        ], [
          `event:  [${ev.time}] ${ev.type}`,
          `detail: ${ev.desc.slice(0, 44)}`,
        ]);
        ln("ronaldo", "frame-in", frameText);
      }

      atLeast("messi", Math.max(T.messi, T.server));

      ln("server", "sql",     `[Python SQL :7778] Committed. ${PARTIAL_EVENTS.length} rows — Germany_Japan`);
      ln("server", "success", `[Reactor] Broadcast complete — 1 subscriber notified`);
      atLeast("messi", T.server - LINE_GAP);
      ln("messi",  "success", `All ${PARTIAL_EVENTS.length} events published to Germany_Japan ✓`);
    }

    /* ── Scenario 4: Summary ─────────────────────────────────────────── */
    if (scenarioId === "summary") {
      ln("messi",   "success", "CONNECTED — user: messi   |  subscribed: Germany_Japan");
      ln("ronaldo", "success", "CONNECTED — user: ronaldo |  subscribed: Germany_Japan");

      cmd("messi", "exit Germany_Japan");
      ln("messi", "output", "UNSUBSCRIBE sent — Germany_Japan");

      atLeast("server", T.messi - LINE_GAP - 80);
      ln("server", "thread1", "[Thread-1] UNSUBSCRIBE sub-0 (messi) — Germany_Japan");

      cmd("ronaldo", "summary Germany_Japan messi file.txt", 400);
      ln("ronaldo", "output", "Requesting summary from server...");

      atLeast("server", T.ronaldo - LINE_GAP - 80);
      ln("server", "thread2", "[Thread-2] SUMMARY request — channel:Germany_Japan user:messi");
      ln("server", "sql",     "[Python SQL :7778] SELECT * FROM events WHERE channel='Germany_Japan'");
      const evSrc = eventsRef.current.length > 0 ? eventsRef.current : PARTIAL_EVENTS;
      ln("server", "sql",     `[Python SQL :7778] Fetched ${evSrc.length} rows — computing stats...`);
      ln("server", "success", "[Thread-2] SUMMARY complete → payload sent to ronaldo");

      atLeast("ronaldo", T.server + 100);
      for (const sl of summaryOutput(evSrc)) {
        ln("ronaldo", sl.type, sl.text);
      }
      ln("ronaldo", "success", "Summary written → file.txt");
    }

    /* ── Scenario 5: Shutdown ────────────────────────────────────────── */
    if (scenarioId === "shutdown") {
      ln("messi",  "success",  "CONNECTED — user: messi");
      ln("ronaldo","success",  "CONNECTED — user: ronaldo");
      ln("server", "thread1",  "[Thread-1] messi   — active");
      ln("server", "thread2",  "[Thread-2] ronaldo — active");

      cmd("messi",   "logout");
      cmd("ronaldo", "logout", 200);

      ln("messi",  "output",  "DISCONNECT");
      ln("messi",  "output",  "receipt:receipt-007");
      ln("messi",  "success", "RECEIPT — receipt-id:receipt-007  |  Bye, messi.");

      atLeast("ronaldo", T.messi - LINE_GAP * 2);
      ln("ronaldo", "output",  "DISCONNECT");
      ln("ronaldo", "output",  "receipt:receipt-008");
      ln("ronaldo", "success", "RECEIPT — receipt-id:receipt-008  |  Bye, ronaldo.");

      const shutdownAt = Math.max(T.messi, T.ronaldo);
      atLeast("server", shutdownAt);
      ln("server", "thread1", "[Thread-1] DISCONNECT messi   → session closed. Thread released.");
      ln("server", "thread2", "[Thread-2] DISCONNECT ronaldo → session closed. Thread released.");
      ln("server", "output",  "[Reactor] All clients disconnected.");
      ln("server", "success", "[Reactor] Server idle — ready for new connections.");
    }

    const maxT = Math.max(T.messi, T.ronaldo, T.server) + 400;
    tos.push(setTimeout(() => setIsPlaying(false), maxT));
  }

  function clearAll() {
    tosRef.current.forEach(clearTimeout);
    tosRef.current = [];
    eventsRef.current = [];
    setIsPlaying(false);
    setActiveId(null);
    const cleared: TerminalLine[] = [{ type: "info", text: "Terminal cleared.", complete: true }];
    setMessiLines([...cleared]);
    setRonaldoLines([...cleared]);
    setServerLines([...cleared]);
  }

  /* ─── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-2.5">
      <style dangerouslySetInnerHTML={{ __html: MCT_WARM_CSS }} />

      {/* Scenario controls — warm glass bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border flex-wrap"
        style={{
          background:   W_CHROME_BG,
          borderColor:  W_AMBER_BORDER,
          boxShadow:    "0 2px 12px rgba(245,158,11,0.10)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <span className="text-xs font-mono mr-1" style={{ color: W_AMBER, opacity: 0.8 }}>
          step:
        </span>
        {SCENARIOS.map((sc, idx) => {
          const isActive = activeId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => { if (!isPlaying) playScenario(sc.id); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all"
              style={{
                background:  isActive ? W_AMBER                      : "rgba(255,255,255,0.60)",
                color:       isActive ? "#1f2937"                    : "#6b7280",
                borderColor: isActive ? W_AMBER                      : "rgba(245,158,11,0.20)",
                fontWeight:  isActive ? 700                          : 400,
                cursor:      isPlaying ? "not-allowed"               : "pointer",
                opacity:     isPlaying && !isActive ? 0.45           : 1,
                boxShadow:   isActive  ? "0 2px 8px rgba(245,158,11,0.30)" : "none",
              }}
            >
              {sc.icon}
              <span className="hidden sm:inline ml-0.5">{idx + 1}.</span>
              {sc.label}
            </button>
          );
        })}
        <button
          onClick={clearAll}
          className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors"
          style={{
            background:  "rgba(255,255,255,0.55)",
            color:       "#9ca3af",
            borderColor: "rgba(245,158,11,0.14)",
          }}
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* ── Desktop: 2-col top + full-width server bottom ── */}
      <div className="hidden md:flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <TerminalPanel title="bash — messi"   subtitle="@stomp-client" lines={messiLines}   bottomRef={messiBot} />
          <TerminalPanel title="bash — ronaldo" subtitle="@stomp-client" lines={ronaldoLines} bottomRef={ronaldoBot} />
        </div>
        <TerminalPanel
          title="bash — StompServer"
          subtitle=":7777 (JavaReactor)  |  Python SQL :7778"
          lines={serverLines}
          bottomRef={serverBot}
          compact
        />
      </div>

      {/* ── Mobile: tabs ── */}
      <div className="md:hidden flex flex-col gap-2">
        <div
          className="grid grid-cols-3 rounded-xl overflow-hidden border"
          style={{ borderColor: W_AMBER_BORDER, background: W_CHROME_BG }}
        >
          {(["messi", "ronaldo", "server"] as PanelId[]).map(p => {
            const active = activeTab === p;
            return (
              <button
                key={p}
                onClick={() => setActiveTab(p)}
                className="py-2 text-xs font-mono font-semibold transition-all capitalize"
                style={{
                  background:  active ? W_AMBER              : "transparent",
                  color:       active ? "#1f2937"            : "#6b7280",
                  borderRight: p !== "server" ? `1px solid ${W_AMBER_BORDER}` : undefined,
                  boxShadow:   active ? "inset 0 -2px 0 rgba(0,0,0,0.08)" : "none",
                }}
              >
                {p === "server" ? "System" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            );
          })}
        </div>
        {activeTab === "messi"   && <TerminalPanel title="bash — messi"       subtitle="@stomp-client" lines={messiLines}   bottomRef={messiBot} />}
        {activeTab === "ronaldo" && <TerminalPanel title="bash — ronaldo"     subtitle="@stomp-client" lines={ronaldoLines} bottomRef={ronaldoBot} />}
        {activeTab === "server"  && <TerminalPanel title="bash — StompServer" subtitle=":7777 reactor" lines={serverLines}  bottomRef={serverBot} />}
      </div>

      {/* Legend — warm text */}
      <div className="flex flex-wrap gap-3 px-1">
        {[
          { color: LINE_COLORS.thread1,     label: "Thread-1 (Messi)" },
          { color: LINE_COLORS.thread2,     label: "Thread-2 (Ronaldo)" },
          { color: LINE_COLORS.sql,         label: "Python SQL layer" },
          { color: LINE_COLORS["frame-in"], label: "Incoming STOMP frame" },
          { color: LINE_COLORS["frame-err"],label: "Auth error frame" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#9ca3af" }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
