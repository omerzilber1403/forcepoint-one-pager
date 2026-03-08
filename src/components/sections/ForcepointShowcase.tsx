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

type Lang = "en" | "he";

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
  @keyframes fp-arrow-pulse-rtl {
    from { transform: scaleX(-1) translateX(2px);  opacity: 0.55; }
    to   { transform: scaleX(-1) translateX(-2px); opacity: 1;    }
  }
  .fp-arr-rtl  { animation: fp-arrow-pulse-rtl 0.65s ease-in-out infinite alternate; }
  .fp-arr2-rtl { animation: fp-arrow-pulse-rtl 0.65s 0.18s ease-in-out infinite alternate; }
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
function SalesBotCard({ lang }: { lang: Lang }) {
  const isHe = lang === "he";
  return (
    <div
      dir={isHe ? "rtl" : undefined}
      className="fp-a1 relative flex flex-col rounded-2xl border p-5 gap-4 h-full"
      style={{
        background: FP.navyGlass,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderColor: "rgba(76,199,184,0.18)",
        boxShadow: "0 8px 32px rgba(6,59,88,0.35)",
        fontFamily: isHe ? "var(--font-heebo)" : undefined,
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-semibold"
          style={{ background: FP.tealGlass, borderColor: FP.tealBorder, color: FP.teal }}
        >
          <Zap className="w-3 h-3" />
          {isHe ? "אוטומציה עם AI" : "AI Automation"}
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

      <h3 className="font-bold text-white text-lg leading-tight">
        {isHe ? "סוכן AI חכם להסמכת לידים" : "Intelligent Sales & Lead Agent"}
      </h3>

      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 border"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="text-center">
          <div className="text-xs font-mono text-slate-500 mb-0.5">
            {isHe ? "גישה סטנדרטית" : "standard approach"}
          </div>
          <div className="text-sm font-bold font-mono text-slate-500 line-through">
            {isHe ? "שיחה קרה גנרית" : "Generic cold call"}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {isHe ? (
            <>
              <ChevronRight className="fp-arr2-rtl w-4 h-4" style={{ color: FP.teal, opacity: 0.55 }} />
              <ChevronRight className="fp-arr-rtl  w-4 h-4" style={{ color: FP.teal }} />
            </>
          ) : (
            <>
              <ChevronRight className="fp-arr  w-4 h-4" style={{ color: FP.teal }} />
              <ChevronRight className="fp-arr2 w-4 h-4" style={{ color: FP.teal, opacity: 0.55 }} />
            </>
          )}
        </div>
        <div className="text-center">
          <div className="text-xs font-mono text-slate-500 mb-0.5">
            {isHe ? "עם סוכן AI" : "with AI agent"}
          </div>
          <div className="text-sm font-bold font-mono fp-glow-text" style={{ color: FP.teal }}>
            {isHe ? "ליד מוכן" : "Prepared lead"}
          </div>
        </div>
        <span
          className="ms-auto rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold"
          style={{ background: FP.tealGlass, color: FP.teal, border: `1px solid ${FP.tealBorder}` }}
        >
          {isHe ? "מותאם אישית" : "Personalized"}
        </span>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">
        {isHe
          ? "סוכן מבוסס-גרף (LangGraph) בארכיטקטורה מרובת-סביבות. הנתונים של כל חברה — קטלוג מוצרים, פלייבוק התנגדויות, פרופיל לקוח (ICP) ומיצוב תחרותי — יושבים בשורת DB בודדת. החלפת סביבות מתבצעת באופן דינמי וללא זמן השבתה (Zero Downtime)."
          : "Graph-based agent (LangGraph) with multi-tenant architecture — each company\u2019s products, objection playbook, ICP definition, and competitive map live in a single DB row, hot-swappable with zero restart required."}
      </p>

      <div
        className="rounded-xl px-4 py-3 border"
        style={{ background: "rgba(76,199,184,0.06)", borderColor: "rgba(76,199,184,0.22)" }}
      >
        <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
          <span style={{ color: "#4cc7b8", fontWeight: 600 }}>
            {isHe ? "✦ הנתונים האמיתיים של Forcepoint מוזנים בדמו:" : "\u2718 Forcepoint\u2019s real data is live in the demo."}
          </span>{" "}
          {isHe
            ? "קטלוג המוצרים, הטיפול בהתנגדויות DLP והמיצוב מול המתחרים (Netskope, Zscaler, Purview, Symantec) נשאבו אוטומטית מ-"
            : "Product catalog, DLP objection playbook, and competitive positioning (Netskope, Zscaler, Purview, Symantec) were scraped from "}
          <span style={{ fontFamily: "monospace", color: "#cbd5e1" }}>forcepoint.com</span>
          {isHe ? " עם " : " using "}
          <span style={{ color: "#4cc7b8", fontWeight: 600 }}>Antigravity</span>
          {isHe ? " והוגדרו כסביבת עבודה עצמאית. נסו את זה למטה." : " and loaded as a single tenant. Try it below."}
        </p>
      </div>

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

      <div className="mt-auto pt-1">
        <button
          onClick={() => document.getElementById("salesbot")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85 active:opacity-70"
          style={{ background: FP.teal, color: FP.navy, boxShadow: `0 4px 18px rgba(76,199,184,0.35)` }}
        >
          <Zap className="w-3.5 h-3.5" />
          {isHe ? "נסה את בוט Forcepoint \u2193" : "Try the Forcepoint Bot \u2191"}
        </button>
      </div>
    </div>
  );
}

/* ── STOMP card ──────────────────────────────────────────────────────────── */
function StompCard({ lang }: { lang: Lang }) {
  const isHe = lang === "he";

  const aiBullets = isHe
    ? [
        "פתרון אתגרי Multi-threading ו-Thread-safety ב-C++ באמצעות AI Pair Programming.",
        "תבנית Reactor ב-Java נבנתה וקודדה יחד עם Claude תוך שעות.",
        "דיבוג אינטגרציית Client-Server ברמת הפרוטוקול בשילוב מודלי שפה.",
      ]
    : [
        "C++ multi-threading & thread-safety solved with AI pair programming",
        "Java Reactor pattern generated & reviewed with Claude in hours",
        "STOMP protocol client\u2013server integration debugged via AI",
      ];

  return (
    <div
      dir={isHe ? "rtl" : undefined}
      className="fp-a2 relative flex flex-col rounded-2xl border p-5 gap-4 h-full"
      style={{
        background: FP.navyGlass,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderColor: "rgba(76,199,184,0.18)",
        boxShadow: "0 8px 32px rgba(6,59,88,0.35)",
        fontFamily: isHe ? "var(--font-heebo)" : undefined,
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-semibold"
          style={{ background: FP.tealGlass, borderColor: FP.tealBorder, color: FP.teal }}
        >
          <Bot className="w-3 h-3" />
          {isHe ? "פיתוח Low-Level מואץ באמצעות AI" : "AI-Accelerated Engineering"}
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

      <h3 className="font-bold text-white text-lg leading-tight">
        {isHe ? "מערכת אירועים מרובת-פרוטוקולים (STOMP)" : "Multi-Protocol Event System (STOMP)"}
      </h3>

      <p className="text-sm text-slate-400 leading-relaxed">
        {isHe
          ? "מערכת Pub/Sub בזמן אמת לאירועי ספורט. כתבים משדרים קבצי JSON לערוצים, ומנויים מקבלים תשדורות MESSAGE מיידיות. נבנה עם שרת Java Reactor, גישור Python-SQLite, וקליינט C++ (מבוסס שני Threads) המממש את פרוטוקול STOMP 1.2 מאפס מעל TCP גולמי."
          : "Real-time pub/sub system for live football match events \u2014 reporters upload event JSON to named channels; all subscribers receive instant MESSAGE frames. Built with a Java Reactor server, Python SQLite bridge, and a two-threaded C++ client implementing the STOMP 1.2 protocol from scratch over raw TCP."}
      </p>

      <div className="flex items-stretch gap-2 w-full">
        <div
          className="flex-1 rounded-xl p-3 border flex flex-col items-center justify-center text-center gap-1"
          style={{ background: FP.redGlass, borderColor: FP.redBorder }}
        >
          <div className="text-xs font-mono text-red-400/55 uppercase tracking-widest">
            {isHe ? "ללא AI" : "Without AI"}
          </div>
          <div className="text-xl font-bold font-mono text-red-300/60 line-through">
            {isHe ? "~3\u20134 שבועות" : "~3\u20134 weeks"}
          </div>
          <div className="text-xs text-red-300/45">
            {isHe ? "ממוצע תעשייתי" : "industry average"}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0">
          {isHe ? (
            <>
              <ChevronRight className="fp-arr-rtl  w-5 h-5" style={{ color: FP.teal }} />
              <ChevronRight className="fp-arr2-rtl w-5 h-5" style={{ color: FP.teal, opacity: 0.5 }} />
            </>
          ) : (
            <>
              <ChevronRight className="fp-arr  w-5 h-5" style={{ color: FP.teal }} />
              <ChevronRight className="fp-arr2 w-5 h-5" style={{ color: FP.teal, opacity: 0.5 }} />
            </>
          )}
        </div>

        <div
          className="flex-1 rounded-xl p-3 border flex flex-col items-center justify-center text-center gap-1"
          style={{ background: FP.tealGlass, borderColor: FP.tealBorder, boxShadow: `0 0 24px rgba(76,199,184,0.15)` }}
        >
          <div className="text-xs font-mono uppercase tracking-widest" style={{ color: `${FP.teal}99` }}>
            {isHe ? "מהירות AI" : "AI Velocity"}
          </div>
          <div className="text-xl font-bold font-mono fp-glow-text" style={{ color: FP.teal }}>
            {isHe ? "2 ימים" : "2 days"}
          </div>
          <div className="text-xs" style={{ color: `${FP.teal}70` }}>
            Cursor \u00b7 Claude \u00b7 Copilot
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5">
        {aiBullets.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
            <ChevronRight
              className="w-3.5 h-3.5 flex-shrink-0 mt-px"
              style={{ color: FP.teal, transform: isHe ? "scaleX(-1)" : undefined }}
            />
            {item}
          </li>
        ))}
      </ul>

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

      <div className="mt-auto pt-1">
        <button
          onClick={() => document.getElementById("spl")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85 active:opacity-70"
          style={{ background: FP.teal, color: FP.navy, boxShadow: `0 4px 18px rgba(76,199,184,0.35)` }}
        >
          <Bot className="w-3.5 h-3.5" />
          {isHe ? "חקור מקרה בוחן חי \u2193" : "Explore Live Case Study \u2193"}
        </button>
      </div>
    </div>
  );
}

/* ── Security strip panel ────────────────────────────────────────────────── */
function SecurityPanel({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
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
export function ForcepointShowcase({ lang = "en" }: { lang?: Lang }) {
  const isHe = lang === "he";

  const securityPanels = isHe
    ? [
        { icon: <Shield className="w-4 h-4" />, label: "הגנת פרטיות (Zero-PII)", desc: "כל הקוד והלוגים עוברים סניטציה מלאה לפני שליחה ל-LLM. נתוני משתמשים אמיתיים לעולם לא מגיעים למודל." },
        { icon: <KeyRound className="w-4 h-4" />, label: "בקרת הרשאות קפדנית", desc: "ניהול מחמיר של .env ו-.gitignore. מפתחות API של AI לעולם אינם עולים ל-Source Control." },
        { icon: <Bot className="w-4 h-4" />, label: "סוכני AI מבודדים (Sandboxed)", desc: "סוכני ה-LangGraph רצים תחת System Prompts נוקשים למניעת הזיות (Hallucinations) ודליפת נתונים." },
      ]
    : [
        { icon: <Shield className="w-4 h-4" />, label: "Zero-PII Prompting", desc: "All code and logs sanitized before LLM interaction — no real user data ever reaches the model." },
        { icon: <KeyRound className="w-4 h-4" />, label: "Access Control", desc: "Strict .env & .gitignore for all AI API keys — never committed to source control." },
        { icon: <Bot className="w-4 h-4" />, label: "Policy-Aware Agents", desc: "LangGraph agents sandboxed with strict system prompts — preventing hallucinations and data leaks." },
      ];

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

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(6,59,88,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        <div className="fp-a0 text-center mb-12" dir={isHe ? "rtl" : undefined}>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-semibold mb-5"
            style={{ background: FP.tealGlass, borderColor: FP.tealBorder, color: FP.teal }}
          >
            <Shield className="w-3.5 h-3.5" />
            {isHe ? "פיתוח המותאם לסטנדרט של Forcepoint" : "Forcepoint-Ready Engineering"}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-display, system-ui)" }}
          >
            {isHe ? (
              <>נבנה לתפקידי <span style={{ color: FP.teal }}>אבטחת נתונים (Data Security)</span></>
            ) : (
              <>Built for <span style={{ color: FP.teal }}>Data Security Roles</span></>
            )}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            {isHe
              ? "שילוב מדויק בין מהירות פיתוח להבנת מערכות Low-Level"
              : "AI automation velocity paired with low-level systems engineering \u2014 the exact combination Forcepoint needs to build and ship AI-native security tooling fast."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 items-start" dir={isHe ? "rtl" : undefined}>
          <SalesBotCard lang={lang} />
          <StompCard lang={lang} />
        </div>

        <div className="fp-a3 grid grid-cols-1 sm:grid-cols-3 gap-3" dir={isHe ? "rtl" : undefined}>
          {securityPanels.map((p) => (
            <SecurityPanel key={p.label} icon={p.icon} label={p.label} desc={p.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}
