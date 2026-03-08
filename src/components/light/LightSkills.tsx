"use client";
import { FadeIn } from "@/components/ui/fade-in";
import { CV } from "@/data/portfolio";
import type { WorkExperience, EducationExperience } from "@/types";
import { Code, Shield, GraduationCap } from "lucide-react";

const ICON_MAP = { Code, Shield, GraduationCap } as const;
type Lang = "en" | "he";

const HE: Record<string, { role:string; organization:string; period:string; metric?:string; highlights:string[] }> = {
  freelance: {
    role: "מפתח Web ו-AI עצמאי", organization: "פרילנס", period: "2023 – היום", metric: "3 מערכות Production הושקו",
    highlights: [
      "פיתוח מערכות Web לייצור: React, Node.js, WordPress",
      "בניית סוכן מכירות GenAI מבוסס LangGraph (Multi-agent)",
      "אינטגרציית מודלי שפה (LLM API) מול מערכות Dashboard ב-React",
    ],
  },
  idf: {
    role: "מפתח תוכנה", organization: 'חיל הים, צה"ל', period: "2020 – 2023", metric: "חיסכון של ₪500,000 בשנה",
    highlights: [
      "פיתוח סימולטור (Unity3D / C#) לאימון מאות קצינים בשנה",
      "בניית הדמיות מבוססות-תרחישים כולל מנועי ניקוד אוטומטיים (Scoring Engines)",
      "המערכת החליפה ספק חיצוני וקיבלה הכרה רשמית מהצבא",
    ],
  },
  bgu: {
    role: "תואר ראשון (B.Sc.) במדעי המחשב", organization: "אוניברסיטת בן גוריון בנגב", period: "2024 – 2027", metric: "התמחות במדע נתונים (Data Science)",
    highlights: [
      "סטודנט בשנה ב' (סמסטר 4), במסלול מדעי הנתונים",
      "מבני נתונים: 98 | מבוא למדעי המחשב: 92",
      "תכנות מערכות (SPL): 87 | הסתברות: 93",
    ],
  },
};

function isWork(exp: WorkExperience | EducationExperience): exp is WorkExperience { return "stack" in exp; }

export default function LightSkills({ lang = "en" }: { lang?: Lang }) {
  const isHe = lang === "he";
  return (
    <section id="skills" dir={isHe ? "rtl" : undefined}
      style={{ background:"#F5F5F4", padding:"7rem 1.5rem", borderTop:"1px solid #E7E5E4", borderBottom:"1px solid #E7E5E4" }}>
      <div style={{ maxWidth:"72rem", margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:"4rem" }}>
            <p style={{ fontSize:"0.7rem", fontFamily:"monospace", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"#A8A29E", marginBottom:"0.75rem" }}>{isHe ? "ניסיון" : "Experience"}</p>
            <h2 style={{ fontSize:"clamp(1.9rem,4vw,3rem)", fontWeight:700, color:"#1C1917", letterSpacing:"-0.025em", lineHeight:1.1, margin:"0 0 1rem" }}>
              {isHe ? <>נבנה תחת <span style={{ color:"#4F46E5" }}>אילוצים אמיתיים</span></> : <>Built under <span style={{ color:"#4F46E5" }}>real constraints</span></>}
            </h2>
            <p style={{ color:"#57534E", fontSize:"1rem", margin:"0 auto", lineHeight:1.75, maxWidth:"32rem" }}>
              {isHe ? "ממדמי ים לפרילנס AI — נשלח ובייצור." : "From Navy simulators to AI freelance work — shipped and in production."}
            </p>
          </div>
        </FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1.5rem" }}>
          {CV.experience.map((exp, idx) => {
            const Icon = ICON_MAP[exp.icon as keyof typeof ICON_MAP];
            const he = HE[exp.id];
            const role = isHe && he ? he.role : exp.role;
            const organization = isHe && he ? he.organization : exp.organization;
            const period = isHe && he ? he.period : exp.period;
            const metric = isHe && he?.metric ? he.metric : exp.metric;
            const highlights = isHe && he ? he.highlights : exp.highlights;
            return (
              <FadeIn key={exp.id} delay={idx * 0.1}>
                <div style={{ background:"#FFFFFF", border:"1px solid #E7E5E4", borderRadius:"1.25rem", padding:"1.75rem", boxShadow:"0 1px 4px rgba(28,25,23,0.06)", display:"flex", flexDirection:"column", transition:"box-shadow 0.2s,border-color 0.2s,transform 0.2s" }}
                  onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow="0 8px 24px -4px rgba(28,25,23,0.10)"; d.style.borderColor="#D6D3D1"; d.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow="0 1px 4px rgba(28,25,23,0.06)"; d.style.borderColor="#E7E5E4"; d.style.transform="translateY(0)"; }}
                >
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"0.875rem", marginBottom:"1.25rem" }}>
                    <div style={{ flexShrink:0, width:40, height:40, borderRadius:"0.75rem", display:"flex", alignItems:"center", justifyContent:"center", background:`${exp.accentColor}18`, color:exp.accentColor }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight:700, color:"#1C1917", fontSize:"0.95rem", lineHeight:1.35, margin:"0 0 0.25rem" }}>{role}</h3>
                      <p style={{ color:"#A8A29E", fontSize:"0.775rem", margin:0 }}>{organization} · {period}</p>
                    </div>
                  </div>
                  {metric && (
                    <div style={{ borderRadius:"0.625rem", padding:"0.5rem 0.875rem", marginBottom:"1rem", fontSize:"0.82rem", fontWeight:700, fontFamily:"monospace", background:`${exp.accentColor}12`, color:exp.accentColor, borderLeft:`3px solid ${exp.accentColor}` }}>{metric}</div>
                  )}
                  <ul style={{ listStyle:"none", margin:"0 0 1.25rem", padding:0, display:"flex", flexDirection:"column", gap:"0.625rem", flex:1 }}>
                    {highlights.map((h, i) => (
                      <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.625rem", fontSize:"0.85rem", color:"#57534E", lineHeight:1.65 }}>
                        <span style={{ marginTop:"0.45rem", width:6, height:6, borderRadius:"50%", flexShrink:0, background:exp.accentColor }} />{h}
                      </li>
                    ))}
                  </ul>
                  <div style={{ paddingTop:"1rem", borderTop:"1px solid #F5F5F4", display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
                    {isWork(exp)
                      ? exp.stack.map(t => <span key={t} style={{ padding:"0.2rem 0.55rem", borderRadius:"0.4rem", fontSize:"0.7rem", fontFamily:"monospace", fontWeight:500, background:"#F5F5F4", border:"1px solid #E7E5E4", color:"#57534E" }}>{t}</span>)
                      : exp.topics?.map(t => <span key={t} style={{ padding:"0.2rem 0.55rem", borderRadius:"0.4rem", fontSize:"0.7rem", fontFamily:"monospace", fontWeight:500, background:"#F5F5F4", border:"1px solid #E7E5E4", color:"#57534E" }}>{t}</span>)
                    }
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
