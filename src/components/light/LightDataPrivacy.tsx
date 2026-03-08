"use client";
import { FadeIn } from "@/components/ui/fade-in";
import { DATA_PRIVACY_POINTS } from "@/lib/data";
import { ShieldCheck, CheckCircle } from "lucide-react";

type Lang = "en" | "he";

const DATA_PRIVACY_POINTS_HE = [
  "מפתחות API שמורים בקבצי .env ומוחרגים דרך .gitignore — לעולם לא מועלים לבקרת גרסאות",
  "כל בדיקות סוכן ה-AI מבוצעות עם נתונים סינתטיים לחלוטין — שום PII אמיתי אינו מעובד או נשמר",
  "אבטחה ונכונות אינן מחשבה שניה — כל רכיב נבנה עם בדיקות קפדניות, ולידציית קלט מוקפדת, והנדסה ממושמעת: מגארדריילים בהנדסת פרומפטים ועד API מוקלד, אותה חשיבה מתודית חלה על כל המחסנית.",
];

export default function LightDataPrivacy({ lang = "en" }: { lang?: Lang }) {
  const isHe = lang === "he";
  const points = isHe ? DATA_PRIVACY_POINTS_HE : DATA_PRIVACY_POINTS;
  return (
    <section id="security" dir={isHe ? "rtl" : undefined} style={{ background:"#FFFFFF", padding:"7rem 1.5rem" }}>
      <div style={{ maxWidth:"36rem", margin:"0 auto" }}>
        <FadeIn>
          <div style={{ background:"#FFFFFF", border:"1px solid #E7E5E4", borderRadius:"1.5rem", padding:"3rem 2.5rem", textAlign:"center", boxShadow:"0 20px 60px -12px rgba(28,25,23,0.10)" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:"1.75rem" }}>
              <div style={{ width:56, height:56, borderRadius:"1rem", display:"flex", alignItems:"center", justifyContent:"center", background:"#EEF2FF", border:"1px solid #C7D2FE" }}>
                <ShieldCheck size={26} style={{ color:"#4F46E5" }} />
              </div>
            </div>
            <FadeIn delay={0.08}>
              <p style={{ fontSize:"0.7rem", fontFamily:"monospace", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"#A8A29E", marginBottom:"0.75rem" }}>
                {isHe ? "איך אני שומר על כלי ה-AI בטוחים" : "How I Keep AI Tools Safe"}
              </p>
              <h2 style={{ fontSize:"clamp(1.5rem,3vw,2.25rem)", fontWeight:700, color:"#1C1917", letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 1rem" }}>
                {isHe ? <>Security-First <span style={{ color:"#4F46E5" }}>כברירת מחדל</span></> : <>Security-First <span style={{ color:"#4F46E5" }}>by Default</span></>}
              </h2>
              <p style={{ color:"#57534E", lineHeight:1.75, fontSize:"0.95rem", marginBottom:"2rem" }}>
                {isHe ? "כשאני עובד עם כלי AI, הבטיחות אינה מחשבה שניה — היא משולבת בזרימת העבודה מהפרומפט הראשון." : "When I work with AI tools, safety isn’t added after the fact — it’s built into the workflow from the first prompt."}
              </p>
            </FadeIn>
            <div style={{ textAlign:"left", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              {points.map((point, idx) => (
                <FadeIn key={idx} delay={0.15 + idx * 0.08}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"0.875rem", background:"#F5F5F4", border:"1px solid #E7E5E4", borderRadius:"0.875rem", padding:"0.875rem 1rem" }}>
                    <CheckCircle size={18} style={{ color:"#4F46E5", flexShrink:0, marginTop:"1px" }} />
                    <span style={{ color:"#57534E", fontSize:"0.875rem", lineHeight:1.7 }}>{point}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
