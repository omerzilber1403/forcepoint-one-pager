"use client";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { FadeIn } from "@/components/ui/fade-in";
import { CV } from "@/data/portfolio";
import type { WorkExperience, EducationExperience } from "@/types";
import { Code, Shield, GraduationCap } from "lucide-react";

const ICON_MAP = { Code, Shield, GraduationCap } as const;
type Lang = "en" | "he";

const HE: Record<string, { role:string; organization:string; period:string; metric?:string; highlights:string[] }> = {
  freelance: {
    role: "מפתח Web ו-AI עצמאי", organization: "פרילנס", period: "2023 – היום", metric: "הובלת 3 פרויקטים מקצה לקצה (End-to-End) שהושקו לסביבת ייצור (Production).",
    highlights: [
      "ארכיטקטורה ופיתוח אפליקציות Web מתקדמות ב-React ו-Node.js, תוך דגש על ביצועים וחווית משתמש.",
      "תכנון ומימוש סוכני מכירות אוטונומיים (GenAI) בארכיטקטורת Multi-agent מורכבת מבוססת LangGraph.",
      "הטמעת יכולות בינה מלאכותית (LLMs) בתוך ממשקי ניהול (Dashboards), ויצירת תהליכי עבודה חכמים מבוססי דאטה.",
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

export function Skills({ lang = "en" }: { lang?: Lang }) {
  const isHe = lang === "he";
  return (
    <section id="skills" className="py-24 border-y" style={{ borderColor:"rgba(255,255,255,0.07)" }} dir={isHe ? "rtl" : undefined}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="mb-12 text-center">
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">{isHe ? "ניסיון" : "Experience"}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">{isHe ? "פיתוח בתנאי שטח ואילוצי אמת" : "Built under real constraints"}</h2>
            <p className="mt-3 text-text-secondary max-w-xl mx-auto">{isHe ? "מסימולטורים בחיל הים ועד מערכות AI בייצור (Production)." : "From Navy simulators to AI freelance work — shipped and in production."}</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CV.experience.map((exp, idx) => {
            const Icon = ICON_MAP[exp.icon as keyof typeof ICON_MAP];
            const he = HE[exp.id];
            const role = isHe && he ? he.role : exp.role;
            const organization = isHe && he ? he.organization : exp.organization;
            const period = isHe && he ? he.period : exp.period;
            const metric = isHe && he?.metric ? he.metric : exp.metric;
            const highlights = isHe && he ? he.highlights : exp.highlights;
            return (
              <FadeIn key={exp.id} delay={idx * 0.12}>
                <CardSpotlight color={`${exp.accentColor}14`} radius={300} className="flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${exp.accentColor}20`, color:exp.accentColor }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-base leading-tight">{role}</h3>
                      <p className="text-text-muted text-xs mt-0.5">{organization} · {period}</p>
                    </div>
                  </div>
                  {metric && (
                    <div className="rounded-lg px-3 py-2 mb-4 text-sm font-bold font-mono" style={{ background:`${exp.accentColor}1a`, color:exp.accentColor, borderLeft:`3px solid ${exp.accentColor}` }}>{metric}</div>
                  )}
                  <ul className="space-y-2 mb-5 flex-1">
                    {highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:exp.accentColor }} />{h}
                      </li>
                    ))}
                  </ul>
                  {isWork(exp) ? (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
                      {exp.stack.map(tech => (
                        <span key={tech} className="px-2 py-0.5 rounded-md text-xs font-mono" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"#94a3b8" }}>{tech}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
                      {exp.topics?.map(topic => (
                        <span key={topic} className="px-2 py-0.5 rounded-md text-xs font-mono" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"#94a3b8" }}>{topic}</span>
                      ))}
                    </div>
                  )}
                </CardSpotlight>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
