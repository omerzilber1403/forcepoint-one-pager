"use client";
import { Shield, KeyRound, Bot, Zap, Github, ArrowUpRight, ChevronRight } from "lucide-react";

type Lang = "en" | "he";

const CSS = `
  @keyframes lfp-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lfp-arr { from{transform:translateX(-2px)} to{transform:translateX(2px)} }
  .lfp-a0 { animation: lfp-fade-up 0.5s ease both; }
  .lfp-a1 { animation: lfp-fade-up 0.5s 0.1s ease both; }
  .lfp-a2 { animation: lfp-fade-up 0.5s 0.2s ease both; }
  .lfp-a3 { animation: lfp-fade-up 0.5s 0.32s ease both; }
  .lfp-arr  { animation: lfp-arr 0.6s ease-in-out infinite alternate; }
  .lfp-arr2 { animation: lfp-arr 0.6s 0.18s ease-in-out infinite alternate; }
  .lfp-card { background:#fff; border:1px solid #E7E5E4; border-radius:1.25rem; padding:1.75rem;
    box-shadow:0 1px 4px rgba(28,25,23,0.06);
    transition:box-shadow 0.2s,border-color 0.2s,transform 0.2s;
    display:flex; flex-direction:column; gap:1rem; height:100%; }
  .lfp-card:hover { box-shadow:0 8px 24px -4px rgba(28,25,23,0.10); border-color:#D6D3D1; transform:translateY(-2px); }
  .lfp-pill-core { display:inline-flex; align-items:center; padding:0.2rem 0.65rem;
    border-radius:9999px; border:1px solid #C7D2FE; background:#EEF2FF; color:#4338CA;
    font-size:0.7rem; font-family:monospace; font-weight:600; }
  .lfp-pill { display:inline-flex; align-items:center; padding:0.2rem 0.65rem;
    border-radius:0.5rem; border:1px solid #E7E5E4; background:#F5F5F4; color:#57534E;
    font-size:0.7rem; font-family:monospace; font-weight:500; }
  .lfp-cta { width:100%; display:flex; align-items:center; justify-content:center; gap:0.5rem;
    border-radius:0.875rem; padding:0.7rem 1rem; font-size:0.875rem; font-weight:600;
    background:#4F46E5; color:#fff; border:none; cursor:pointer;
    box-shadow:0 4px 14px rgba(79,70,229,0.28); transition:all 0.15s ease; }
  .lfp-cta:hover { background:#4338CA; box-shadow:0 6px 20px rgba(79,70,229,0.38); transform:translateY(-1px); }
`;

function Pill({ children, core }: { children: React.ReactNode; core?: boolean }) {
  return <span className={core ? "lfp-pill-core" : "lfp-pill"}>{children}</span>;
}

function SalesBotCard({ lang }: { lang: Lang }) {
  const isHe = lang === "he";
  return (
    <div className="lfp-card lfp-a1" dir={isHe ? "rtl" : undefined}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.5rem" }}>
        <span className="lfp-pill-core" style={{ gap:"0.4rem", display:"inline-flex", alignItems:"center" }}>
          <Zap size={11} /> {isHe ? "אוטומציה עם AI" : "AI Automation"}
        </span>
        <a href="https://github.com/omerzilber1403/agent-sales-bot" target="_blank" rel="noopener noreferrer"
          style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", fontSize:"0.75rem", fontFamily:"monospace", color:"#4F46E5", textDecoration:"none", opacity:0.75 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
        ><Github size={13} /> GitHub <ArrowUpRight size={11} /></a>
      </div>
      <h3 style={{ fontWeight:700, color:"#1C1917", fontSize:"1.05rem", lineHeight:1.35, margin:0 }}>
        {isHe ? "סוכן מכירות ולידים חכם" : "Intelligent Sales & Lead Agent"}
      </h3>
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", background:"#F5F5F4", border:"1px solid #E7E5E4", borderRadius:"0.875rem", padding:"0.75rem 1rem" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"0.65rem", fontFamily:"monospace", color:"#A8A29E", marginBottom:"0.2rem", textTransform:"uppercase" }}>{isHe ? "גישה סטנדרטית" : "Standard"}</div>
          <div style={{ fontSize:"0.85rem", fontWeight:700, fontFamily:"monospace", color:"#A8A29E", textDecoration:"line-through" }}>{isHe ? "שיחה קרה גנרית" : "Generic cold call"}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"1px" }}>
          <ChevronRight className="lfp-arr" size={16} style={{ color:"#4F46E5" }} />
          <ChevronRight className="lfp-arr2" size={16} style={{ color:"#4F46E5", opacity:0.45 }} />
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"0.65rem", fontFamily:"monospace", color:"#A8A29E", marginBottom:"0.2rem", textTransform:"uppercase" }}>{isHe ? "עם סוכן AI" : "With AI"}</div>
          <div style={{ fontSize:"0.85rem", fontWeight:700, fontFamily:"monospace", color:"#4F46E5" }}>{isHe ? "ליד מוכן" : "Prepared lead"}</div>
        </div>
        <span className="lfp-pill-core" style={{ marginLeft:isHe ? undefined : "auto", marginRight:isHe ? "auto" : undefined }}>
          {isHe ? "מותאם אישית" : "Personalized"}
        </span>
      </div>
      <p style={{ fontSize:"0.875rem", color:"#57534E", lineHeight:1.75, margin:0 }}>
        {isHe
          ? "סוכן מבוסס גרף (LangGraph) עם ארכיטקטורה רב-לקוחית — המוצרים, ספר ההתנגדויות, הגדרת ICP ומפת המתחרים של כל חברה חיים בשורת DB אחת, הניתנת להחלפה ללא אתחול."
          : "Graph-based agent (LangGraph) with multi-tenant architecture — each company’s products, objection playbook, ICP definition, and competitive map live in a single DB row, hot-swappable with zero restart."}
      </p>
      <div style={{ background:"#EEF2FF", border:"1px solid #C7D2FE", borderRadius:"0.875rem", padding:"0.875rem 1rem" }}>
        <p style={{ fontSize:"0.8rem", color:"#4338CA", lineHeight:1.7, margin:0 }}>
          <span style={{ fontWeight:700 }}>{isHe ? "✦ הנתונים האמיתיים של Forcepoint חיים בדמו." : "✦ Forcepoint’s real data is live in the demo."}</span>{" "}
          {isHe
            ? "קטלוג המוצרים, ספר ההתנגדויות ל-DLP ומיצוב תחרותי נצלפו מ-forcepoint.com עם Antigravity ונטענו כטנאנט אחד."
            : "Product catalog, DLP objection playbook, and competitive positioning were scraped from forcepoint.com using Antigravity and loaded as a single tenant."}
        </p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}><Pill core>LangGraph</Pill><Pill core>FastAPI</Pill><Pill core>GPT-4o</Pill></div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}><Pill>Python</Pill><Pill>SQLite</Pill><Pill>React</Pill></div>
      </div>
      <div style={{ marginTop:"auto", paddingTop:"0.25rem" }}>
        <button className="lfp-cta" onClick={() => document.getElementById("salesbot")?.scrollIntoView({ behavior:"smooth" })}>
          <Zap size={14} /> {isHe ? "נסה את בוט Forcepoint ↑" : "Try the Forcepoint Bot ↑"}
        </button>
      </div>
    </div>
  );
}

function StompCard({ lang }: { lang: Lang }) {
  const isHe = lang === "he";
  const bullets = isHe
    ? ["Multi-threading ו-thread-safety ב-C++ נפתרו עם תכנות זוגי AI", "תבנית Reactor ב-Java נוצרה ונסקרה עם Claude בשעות", "אינטגרציית client–server של STOMP עם ניפוי שגיאות AI"]
    : ["C++ multi-threading & thread-safety solved with AI pair programming", "Java Reactor pattern generated & reviewed with Claude in hours", "STOMP protocol client–server integration debugged via AI"];
  return (
    <div className="lfp-card lfp-a2" dir={isHe ? "rtl" : undefined}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.5rem" }}>
        <span className="lfp-pill-core" style={{ gap:"0.4rem", display:"inline-flex", alignItems:"center" }}>
          <Bot size={11} /> {isHe ? "הנדסה מואצת AI" : "AI-Accelerated Engineering"}
        </span>
        <a href="https://github.com/omerzilber1403/assignment3-world-cup" target="_blank" rel="noopener noreferrer"
          style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", fontSize:"0.75rem", fontFamily:"monospace", color:"#4F46E5", textDecoration:"none", opacity:0.75 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
        ><Github size={13} /> GitHub <ArrowUpRight size={11} /></a>
      </div>
      <h3 style={{ fontWeight:700, color:"#1C1917", fontSize:"1.05rem", lineHeight:1.35, margin:0 }}>
        {isHe ? "מערכת אירועים רב-פרוטוקולית (STOMP)" : "Multi-Protocol Event System (STOMP)"}
      </h3>
      <p style={{ fontSize:"0.875rem", color:"#57534E", lineHeight:1.75, margin:0 }}>
        {isHe
          ? "מערכת pub/sub בזמן אמת לאירועי כדורגל חיים. שרת Java Reactor, גשר Python SQLite, קליינט C++ עם שני threads שמממש STOMP 1.2 על TCP גולמי — מאפס."
          : "Real-time pub/sub for live football events. Java Reactor server, Python SQLite bridge, two-threaded C++ client implementing STOMP 1.2 over raw TCP — from scratch."}
      </p>
      <div style={{ display:"flex", alignItems:"stretch", gap:"0.5rem" }}>
        <div style={{ flex:1, borderRadius:"0.75rem", padding:"0.75rem", border:"1px solid rgba(239,68,68,0.25)", background:"rgba(239,68,68,0.04)", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.25rem" }}>
          <div style={{ fontSize:"0.6rem", fontFamily:"monospace", color:"#EF4444", opacity:0.65, textTransform:"uppercase" }}>{isHe ? "ללא AI" : "Without AI"}</div>
          <div style={{ fontSize:"1.1rem", fontWeight:700, fontFamily:"monospace", color:"#EF4444", opacity:0.65, textDecoration:"line-through" }}>{isHe ? "~3–4 שב'" : "~3–4 wks"}</div>
          <div style={{ fontSize:"0.65rem", color:"#EF4444", opacity:0.5 }}>{isHe ? "ממוצע תעשייתי" : "industry avg"}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"2px" }}>
          <ChevronRight className="lfp-arr" size={18} style={{ color:"#4F46E5" }} />
          <ChevronRight className="lfp-arr2" size={18} style={{ color:"#4F46E5", opacity:0.45 }} />
        </div>
        <div style={{ flex:1, borderRadius:"0.75rem", padding:"0.75rem", border:"1px solid #C7D2FE", background:"#EEF2FF", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.25rem" }}>
          <div style={{ fontSize:"0.6rem", fontFamily:"monospace", color:"#4338CA", textTransform:"uppercase" }}>{isHe ? "מהירות AI" : "AI Velocity"}</div>
          <div style={{ fontSize:"1.1rem", fontWeight:700, fontFamily:"monospace", color:"#4F46E5" }}>{isHe ? "2 ימים" : "2 days"}</div>
          <div style={{ fontSize:"0.65rem", color:"#4338CA" }}>Cursor · Claude</div>
        </div>
      </div>
      <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:"0.5rem" }}>
        {bullets.map(item => (
          <li key={item} style={{ display:"flex", alignItems:"flex-start", gap:"0.5rem", fontSize:"0.8rem", color:"#57534E" }}>
            <ChevronRight size={13} style={{ color:"#4F46E5", flexShrink:0, marginTop:"2px" }} />{item}
          </li>
        ))}
      </ul>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}><Pill core>Java Reactor</Pill><Pill core>C++</Pill><Pill core>STOMP Protocol</Pill></div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}><Pill>Python / SQL</Pill><Pill>Multi-threading</Pill></div>
      </div>
      <div style={{ marginTop:"auto", paddingTop:"0.25rem" }}>
        <button className="lfp-cta" onClick={() => document.getElementById("spl")?.scrollIntoView({ behavior:"smooth" })}>
          <Bot size={14} /> {isHe ? "חקור מקרה בוחן חי ↓" : "Explore Live Case Study ↓"}
        </button>
      </div>
    </div>
  );
}

function SecurityFeature({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div style={{ background:"#fff", border:"1px solid #E7E5E4", borderLeft:"3px solid #4F46E5", borderRadius:"0.875rem", padding:"1rem 1.25rem", display:"flex", alignItems:"flex-start", gap:"0.875rem", boxShadow:"0 1px 4px rgba(28,25,23,0.05)" }}>
      <span style={{ color:"#4F46E5", flexShrink:0, marginTop:"2px" }}>{icon}</span>
      <div>
        <div style={{ fontWeight:600, color:"#1C1917", fontSize:"0.875rem", marginBottom:"0.3rem" }}>{label}</div>
        <div style={{ fontSize:"0.775rem", color:"#57534E", lineHeight:1.7 }}>{desc}</div>
      </div>
    </div>
  );
}

export default function LightForcepointShowcase({ lang = "en" }: { lang?: Lang }) {
  const isHe = lang === "he";
  const panels = isHe
    ? [
        { icon: <Shield size={16} />, label: "פרומפטים ללא PII", desc: "כל הקוד והלוגים מסוננים לפני אינטראקציה עם LLM — שום נתוני משתמש אמיתיים לא מגיעים למודל." },
        { icon: <KeyRound size={16} />, label: "בקרת גישה", desc: "קובצי .env ו-.gitignore מחמירים לכל מפתחות API של AI — לעולם לא מועלים לבקרת גרסאות." },
        { icon: <Bot size={16} />, label: "סוכנים מודעי-מדיניות", desc: "סוכני LangGraph מבודדים עם system prompts מחמירים — מונעים הזיות ודליפות נתונים." },
      ]
    : [
        { icon: <Shield size={16} />, label: "Zero-PII Prompting", desc: "All code and logs sanitized before LLM interaction — no real user data ever reaches the model." },
        { icon: <KeyRound size={16} />, label: "Access Control", desc: "Strict .env & .gitignore for all AI API keys — never committed to source control." },
        { icon: <Bot size={16} />, label: "Policy-Aware Agents", desc: "LangGraph agents sandboxed with strict system prompts — preventing hallucinations and data leaks." },
      ];
  return (
    <section id="projects" style={{ background:"#FFFFFF", padding:"7rem 1.5rem" }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ maxWidth:"52rem", margin:"0 auto" }}>
        <div className="lfp-a0" dir={isHe ? "rtl" : undefined} style={{ textAlign:"center", marginBottom:"4rem" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", borderRadius:"9999px", border:"1px solid #C7D2FE", background:"#EEF2FF", color:"#4338CA", padding:"0.35rem 1rem", fontSize:"0.7rem", fontFamily:"monospace", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"1.5rem" }}>
            <Shield size={12} /> {isHe ? "הנדסה מוכנה ל-Forcepoint" : "Forcepoint-Ready Engineering"}
          </div>
          <h2 style={{ fontSize:"clamp(1.9rem,4vw,3rem)", fontWeight:700, color:"#1C1917", letterSpacing:"-0.025em", lineHeight:1.1, margin:"0 0 1rem" }}>
            {isHe ? <>נבנה לתפקידי <span style={{ color:"#4F46E5" }}>אבטחת מידע</span></> : <>Built for <span style={{ color:"#4F46E5" }}>Data Security Roles</span></>}
          </h2>
          <p style={{ color:"#57534E", fontSize:"1rem", maxWidth:"32rem", margin:"0 auto", lineHeight:1.75 }}>
            {isHe ? "מהירות אוטומציה עם AI בשילוב הנדסת מערכות ברמה נמוכה — שילוב מדויק שForcepoint צריך לשלוח כלי אבטחה מבוסס AI במהירות." : "AI automation velocity paired with low-level systems engineering — the exact combination Forcepoint needs to ship AI-native security tooling fast."}
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.25rem", marginBottom:"2rem", alignItems:"start" }}>
          <SalesBotCard lang={lang} />
          <StompCard lang={lang} />
        </div>
        <div className="lfp-a3" dir={isHe ? "rtl" : undefined} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"0.875rem" }}>
          {panels.map(f => <SecurityFeature key={f.label} icon={f.icon} label={f.label} desc={f.desc} />)}
        </div>
      </div>
    </section>
  );
}
