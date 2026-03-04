"use client";
import { useRef, useState, useEffect } from "react";
import { Database, Play, FileText, Trash2 } from "lucide-react";

type LineType = "cmd" | "output" | "error" | "success" | "info";

interface TerminalLine {
  text: string;
  type: LineType;
  complete: boolean;
}

interface ScenarioStep {
  type: LineType;
  text: string;
}

interface Scenario {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  steps: ScenarioStep[];
}

// Real data from github.com/omerzilber1403/assignment3-world-cup
// Events derived from client/data/events1.json | summary from summary-example-event1.txt
const SCENARIOS: Scenario[] = [
  /* ── 1. Init Stack ──────────────────────────────────────────────────────── */
  {
    id: "init-stack",
    label: "Init Stack",
    icon: <Database className="w-3.5 h-3.5" />,
    description: "Start Python SQL server (7778) + Java STOMP server (7777 TPC)",
    steps: [
      { type: "cmd",     text: "cd data && rm -f stomp_server.db" },
      { type: "success", text: "Removed stale database." },
      { type: "cmd",     text: "python3 sql_server.py 7778 &" },
      { type: "output",  text: "[STOMP_PYTHON_SQL_SERVER] Database initialized: stomp_server.db" },
      { type: "success", text: "[STOMP_PYTHON_SQL_SERVER] Server started on 127.0.0.1:7778" },
      { type: "cmd",     text: "cd ../server" },
      { type: "cmd",     text: "mvn exec:java -Dexec.mainClass=\"bgu.spl.net.impl.stomp.StompServer\" -Dexec.args=\"7777 tpc\"" },
      { type: "output",  text: "[INFO] Scanning for projects..." },
      { type: "output",  text: "[INFO] --- exec-maven-plugin:3.1.0:java (default-cli) ---" },
      { type: "output",  text: "[INFO] BUILD SUCCESS" },
      { type: "output",  text: "Server started" },
      { type: "success", text: "STOMP server online — port 7777  |  mode: TPC (thread-per-client)" },
    ],
  },

  /* ── 2. Match Session ───────────────────────────────────────────────────── */
  {
    id: "match-session",
    label: "Match Session",
    icon: <Play className="w-3.5 h-3.5" />,
    description: "Compile C++ client → login → subscribe → report 8 live events (Germany vs Japan)",
    steps: [
      { type: "cmd",    text: "cd client && make StompWCIClient" },
      { type: "output", text: "g++ -std=c++17 -pthread -o ./bin/StompWCIClient src/ConnectionHandler.cpp src/Frame.cpp src/event.cpp src/StompProtocol.cpp src/StompClient.cpp" },
      { type: "success",text: "Build complete: ./bin/StompWCIClient" },
      { type: "cmd",    text: "./bin/StompWCIClient" },
      { type: "output", text: "STOMP World Cup Intelligence Client v1.0" },
      // Login
      { type: "cmd",    text: "login 127.0.0.1:7777 messi pass123" },
      { type: "success",text: "CONNECTED — user: messi  |  session-id: 4f8a2c" },
      // Subscribe
      { type: "cmd",    text: "join Germany_Japan" },
      { type: "output", text: "SUBSCRIBE /topic/Germany_Japan  id:sub-0" },
      { type: "success",text: "Subscribed to channel: Germany_Japan" },
      // Report event file — real 8 events from events1.json
      { type: "cmd",    text: "report client/data/events1.json" },
      { type: "output", text: "Parsing events1.json — Germany vs Japan — 8 events" },
      { type: "output", text: "  [ 0:00]  kickoff ..................... publishing" },
      { type: "output", text: "  [33:00]  goal!!!! .................... publishing  ← Germany 1:0" },
      { type: "output", text: "  [49:00]  Another goal!!!! ............. publishing  (VAR pending)" },
      { type: "output", text: "  [50:00]  No goal ...................... publishing  ← VAR overrules" },
      { type: "output", text: "  [51:00]  halftime .................... publishing  ← Germany 1:0" },
      { type: "output", text: "  [75:00]  goalgoalgoalgoalgoal!!! ..... publishing  ← Japan 1:1" },
      { type: "output", text: "  [83:00]  goalgoalgoalgoalgoal!!! ..... publishing  ← Japan 2:1" },
      { type: "output", text: "  [90:00]  final whistle ............... publishing" },
      { type: "success",text: "All 8 events published to Germany_Japan ✓" },
      // Summary + logout
      { type: "cmd",    text: "summary Germany_Japan messi game_summary.txt" },
      { type: "success",text: "Summary written → game_summary.txt" },
      { type: "cmd",    text: "logout" },
      { type: "output", text: "DISCONNECT sent. Bye, messi." },
    ],
  },

  /* ── 3. Game Summary ────────────────────────────────────────────────────── */
  {
    id: "game-summary",
    label: "Game Summary",
    icon: <FileText className="w-3.5 h-3.5" />,
    description: "Read the generated game summary file (actual match data)",
    steps: [
      { type: "cmd",    text: "cat game_summary.txt" },
      { type: "info",   text: "─────────────────────────────────────────────" },
      { type: "output", text: "Germany vs Japan" },
      { type: "output", text: "Game stats:" },
      { type: "output", text: "General stats:" },
      { type: "output", text: "  active: false" },
      { type: "output", text: "  before halftime: false" },
      { type: "output", text: "Germany stats:" },
      { type: "output", text: "  goals: 1" },
      { type: "output", text: "  possession: 51%" },
      { type: "output", text: "Japan stats:" },
      { type: "output", text: "  goals: 2" },
      { type: "output", text: "  possession: 49%" },
      { type: "output", text: "Game event reports:" },
      { type: "output", text: "  0 - kickoff:" },
      { type: "output", text: "    The game has started! What an exciting evening!" },
      { type: "output", text: "  1980 - goal!!!!:" },
      { type: "output", text: "    GOOOAAALLL!!! Germany lead!!! Gundogan slots it into the corner — Germany 1:0" },
      { type: "output", text: "  4500 - goalgoalgoalgoalgoal!!!:" },
      { type: "success",text: "    GOOOOAAAALLLL!!!!! Japan have parity!!! Doan smashes it in — 1:1" },
      { type: "output", text: "  4980 - goalgoalgoalgoalgoal!!!:" },
      { type: "success",text: "    GOOOOOOAAAAALLLL!!!! Asano from the tightest angle — Japan 2:1 !!!" },
      { type: "output", text: "  5400 - final whistle:" },
      { type: "output", text: "    Germany sit bottom of Group E. Japan top with one win from one." },
      { type: "info",   text: "─────────────────────────────────────────────" },
      { type: "success",text: "FINAL: Germany 1 — 2 Japan  (World Cup 2022, Group E)" },
    ],
  },
];

const LINE_COLORS: Record<LineType, string> = {
  cmd:     "#22d3ee",
  output:  "#94a3b8",
  error:   "#f87171",
  success: "#4ade80",
  info:    "#818cf8",
};

const PROMPT = "$ ";
const CHAR_DELAY = 18;    // ms per character (slightly faster than before)
const OUTPUT_DELAY = 180; // ms before output line appears

export function TerminalUI() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "info",   text: "StompWCI — World Cup Event Intelligence System", complete: true },
    { type: "output", text: "github.com/omerzilber1403/assignment3-world-cup", complete: true },
    { type: "output", text: "Select a scenario above ↑", complete: true },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function clearAllTimeouts() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function clearTerminal() {
    clearAllTimeouts();
    setIsPlaying(false);
    setActiveScenario(null);
    setLines([{ type: "info", text: "Terminal cleared.", complete: true }]);
  }

  function playScenario(scenario: Scenario) {
    clearAllTimeouts();
    setIsPlaying(true);
    setActiveScenario(scenario.id);
    setLines([{ type: "info", text: `▶  ${scenario.description}`, complete: true }]);

    let t = 280;

    for (const step of scenario.steps) {
      if (step.type === "cmd") {
        const fullText = PROMPT + step.text;
        const t0 = t;

        const to0 = setTimeout(() => {
          setLines(prev => [...prev, { type: "cmd", text: "", complete: false }]);
        }, t0);
        timeoutsRef.current.push(to0);

        for (let c = 1; c <= fullText.length; c++) {
          const partial = fullText.slice(0, c);
          const done = c === fullText.length;
          const delay = t + c * CHAR_DELAY;
          const toChar = setTimeout(() => {
            setLines(prev => {
              const copy = [...prev];
              copy[copy.length - 1] = { type: "cmd", text: partial, complete: done };
              return copy;
            });
          }, delay);
          timeoutsRef.current.push(toChar);
        }

        t += fullText.length * CHAR_DELAY + OUTPUT_DELAY;
      } else {
        const delay = t;
        const toOut = setTimeout(() => {
          setLines(prev => [...prev, { type: step.type, text: step.text, complete: true }]);
        }, delay);
        timeoutsRef.current.push(toOut);
        t += OUTPUT_DELAY;
      }
    }

    const tDone = setTimeout(() => setIsPlaying(false), t + 200);
    timeoutsRef.current.push(tDone);
  }

  useEffect(() => () => clearAllTimeouts(), []);

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border"
      style={{ borderColor: "#1e1e2e", height: "100%", minHeight: "420px" }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0 border-b"
        style={{ background: "#12121a", borderColor: "#1e1e2e" }}
      >
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "#ff5f57" }} />
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "#febc2e" }} />
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "#28c840" }} />
        <span className="ml-3 text-xs font-mono truncate" style={{ color: "#475569" }}>
          bash — assignment3-world-cup
        </span>
      </div>

      {/* Scenario buttons */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0 flex-wrap border-b"
        style={{ background: "#0d0d14", borderColor: "#1e1e2e" }}
      >
        <span className="text-xs font-mono" style={{ color: "#475569" }}>run:</span>
        {SCENARIOS.map(sc => {
          const isActive = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => !isPlaying && playScenario(sc)}
              title={sc.description}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono border transition-all"
              style={{
                background:  isActive ? "rgba(99,102,241,0.15)" : "#1e1e2e",
                color:       isActive ? "#818cf8" : "#94a3b8",
                borderColor: isActive ? "rgba(99,102,241,0.4)" : "transparent",
                cursor:      isPlaying ? "not-allowed" : "pointer",
                opacity:     isPlaying && !isActive ? 0.45 : 1,
              }}
            >
              {sc.icon}
              {sc.label}
            </button>
          );
        })}
        <button
          onClick={clearTerminal}
          title="Clear terminal"
          className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono border transition-colors"
          style={{ background: "#1e1e2e", color: "#475569", borderColor: "transparent" }}
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* Output area */}
      <div
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-6"
        style={{ background: "#080810" }}
      >
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-start min-h-[1.5rem]">
            <span
              style={{
                color: LINE_COLORS[line.type],
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
              }}
            >
              {line.text}
            </span>
            {idx === lines.length - 1 && !line.complete && (
              <span
                className="inline-block w-1.5 h-4 ml-px flex-shrink-0 mt-0.5"
                style={{ background: "#22d3ee", animation: "term-blink 1s step-end infinite" }}
              />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes term-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
