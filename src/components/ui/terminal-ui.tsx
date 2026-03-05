"use client";
import { useRef, useState, useEffect } from "react";
import { Database, Play, FileText, Trash2 } from "lucide-react";
import type { LineType, ScenarioStep } from "@/data/terminal-scenarios";

interface TerminalLine {
  text: string;
  type: LineType;
  complete: boolean;
}

interface Scenario {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// Metadata only — steps are served by /api/terminal/[scenario]
const SCENARIOS: Scenario[] = [
  {
    id: "init-stack",
    label: "Init Stack",
    icon: <Database className="w-3.5 h-3.5" />,
    description: "Start Python SQL server (7778) + Java STOMP server (7777 TPC)",
  },
  {
    id: "match-session",
    label: "Match Session",
    icon: <Play className="w-3.5 h-3.5" />,
    description: "Compile C++ client → login → subscribe → report 8 live events (Germany vs Japan)",
  },
  {
    id: "game-summary",
    label: "Game Summary",
    icon: <FileText className="w-3.5 h-3.5" />,
    description: "Read the generated game summary file (actual match data)",
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
const CHAR_DELAY = 18;
const OUTPUT_DELAY = 180;

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
    const p = bottomRef.current?.parentElement;
    if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight; });
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

  async function playScenario(scenario: Scenario) {
    clearAllTimeouts();
    setIsPlaying(true);
    setActiveScenario(scenario.id);
    setLines([{ type: "info", text: `▶  ${scenario.description}`, complete: true }]);

    // Fetch steps from Next.js API route (/api/terminal/[scenario])
    let steps: ScenarioStep[];
    try {
      const res = await fetch(`/api/terminal/${scenario.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      steps = data.steps as ScenarioStep[];
    } catch {
      setLines(prev => [...prev, {
        type: "error",
        text: "Failed to load scenario data.",
        complete: true,
      }]);
      setIsPlaying(false);
      return;
    }

    let t = 280;

    for (const step of steps) {
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
              onClick={() => { if (!isPlaying) void playScenario(sc); }}
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
