"use client";
import { useRef, useState, useEffect } from "react";
import { Database, Server, Play, Trash2 } from "lucide-react";

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

const SCENARIOS: Scenario[] = [
  {
    id: "init-db",
    label: "Init DB",
    icon: <Database className="w-3.5 h-3.5" />,
    description: "Initialize SQLite event store on port 7778",
    steps: [
      { type: "cmd",     text: "cd data" },
      { type: "output",  text: "~/assignment3/data" },
      { type: "cmd",     text: "rm -f stomp_server.db" },
      { type: "success", text: "Removed stale database." },
      { type: "cmd",     text: "python3 sql_server.py 7778" },
      { type: "output",  text: "Connecting to SQLite..." },
      { type: "success", text: "SQL server listening on port 7778. Ready." },
    ],
  },
  {
    id: "start-server",
    label: "Start Server",
    icon: <Server className="w-3.5 h-3.5" />,
    description: "Launch STOMP server on port 7777 (TPC mode)",
    steps: [
      { type: "cmd",    text: "cd server" },
      { type: "cmd",    text: "mvn exec:java -Dexec.mainClass=\"bgu.spl.net.impl.stomp.StompServer\" -Dexec.args=\"7777 tpc\"" },
      { type: "output", text: "[INFO] Scanning for projects..." },
      { type: "output", text: "[INFO] --- exec-maven-plugin:3.1.0:java ---" },
      { type: "output", text: "[INFO] BUILD SUCCESS" },
      { type: "success",text: "STOMP server online — port 7777 (TPC threading model)" },
    ],
  },
  {
    id: "client-demo",
    label: "Client Demo",
    icon: <Play className="w-3.5 h-3.5" />,
    description: "Full match session: compile, login, subscribe, report events",
    steps: [
      { type: "cmd",    text: "cd client && make StompWCIClient" },
      { type: "output", text: "g++ -std=c++17 -o ./bin/StompWCIClient src/*.cpp" },
      { type: "success",text: "Build complete: ./bin/StompWCIClient" },
      { type: "cmd",    text: "./bin/StompWCIClient" },
      { type: "output", text: "STOMP World Cup Intelligence Client v1.0" },
      { type: "cmd",    text: "login 127.0.0.1:7777 messi pass123" },
      { type: "success",text: "CONNECTED — session: messi@127.0.0.1:7777" },
      { type: "cmd",    text: "login 127.0.0.1:7777 ronaldo pass12" },
      { type: "success",text: "CONNECTED — session: ronaldo@127.0.0.1:7777" },
      { type: "cmd",    text: "join Germany_Japan" },
      { type: "output", text: "Subscribed to topic: /topic/Germany_Japan" },
      { type: "cmd",    text: "login 127.0.0.1:7777 messi WRONG_PASSWORD" },
      { type: "error",  text: "ERROR — Authentication failed for user: messi" },
      { type: "cmd",    text: "join germany_spain" },
      { type: "output", text: "Subscribed to topic: /topic/germany_spain" },
      { type: "cmd",    text: "report data/events1_partial.json" },
      { type: "output", text: "Parsing 14 game events from events1_partial.json..." },
      { type: "output", text: "Publishing to Germany_Japan: [GOAL] Germany 1:0 Japan (12')" },
      { type: "success",text: "All 14 events published successfully." },
      { type: "cmd",    text: "exit germany_spain" },
      { type: "output", text: "UNSUBSCRIBE sent for /topic/germany_spain" },
      { type: "cmd",    text: "exit Germany_Japan" },
      { type: "output", text: "UNSUBSCRIBE sent for /topic/Germany_Japan" },
      { type: "cmd",    text: "summary Germany_Japan messi file.txt" },
      { type: "output", text: "Fetching game summary from server..." },
      { type: "success",text: "Summary written to file.txt (Germany 2:1 Japan, Final)" },
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
const CHAR_DELAY = 22;   // ms per character
const OUTPUT_DELAY = 220; // ms before output line after cmd

export function TerminalUI() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "info",   text: "World Cup STOMP Simulator — SPL Assignment 3", complete: true },
    { type: "output", text: "Select a scenario above to run a demo.", complete: true },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

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
    setLines([{ type: "info", text: `▶ ${scenario.label} — ${scenario.description}`, complete: true }]);

    let t = 300;

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

  // Cleanup on unmount
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
          bash — StompWCIClient
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
          <div key={idx} className="flex items-center min-h-[1.5rem]">
            <span style={{ color: LINE_COLORS[line.type], wordBreak: "break-all" }}>
              {line.text}
            </span>
            {idx === lines.length - 1 && !line.complete && (
              <span
                className="inline-block w-1.5 h-4 ml-px flex-shrink-0"
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
