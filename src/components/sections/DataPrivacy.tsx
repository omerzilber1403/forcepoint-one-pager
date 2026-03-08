"use client";
import { GlowingStarsBackground } from "@/components/ui/glowing-stars";
import { FadeIn } from "@/components/ui/fade-in";
import { DATA_PRIVACY_POINTS } from "@/lib/data";
import { ShieldCheck, CheckCircle } from "lucide-react";

type Lang = "en" | "he";

const DATA_PRIVACY_POINTS_HE = [
  "מפתחות API שמורים בקבצי .env ומוחרגים דרך .gitignore — לעולם לא מועלים לבקרת גרסאות",
  "כל בדיקות סוכן ה-AI מבוצעות עם נתונים סינתטיים לחלוטין — שום PII אמיתי אינו מעובד או נשמר",
  "אבטחה ונכונות אינן מחשבה שניה — כל רכיב נבנה עם בדיקות קפדניות, ולידציית קלט מוקפדת, והנדסה ממושמעת: מגארדריילים בהנדסת פרומפטים ועד API מוקלד, אותה חשיבה מתודית חלה על כל המחסנית.",
];

export function DataPrivacy({ lang = "en" }: { lang?: Lang }) {
  const isHe = lang === "he";
  const points = isHe ? DATA_PRIVACY_POINTS_HE : DATA_PRIVACY_POINTS;
  return (
    <section id="security" className="relative py-24 overflow-hidden" dir={isHe ? "rtl" : undefined}>
      <GlowingStarsBackground starCount={60} className="opacity-40" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="rounded-3xl border p-10 text-center"
            style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderColor:"rgba(255,255,255,0.1)", boxShadow:"0 24px 64px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl border"
                style={{ background:"rgba(99,102,241,0.12)", backdropFilter:"blur(12px)", borderColor:"rgba(99,102,241,0.3)", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)" }}>
                <ShieldCheck className="w-7 h-7" style={{ color:"#818cf8" }} />
              </div>
            </div>
            <FadeIn delay={0.1}>
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                {isHe ? "איך אני שומר על כלי ה-AI בטוחים" : "How I Keep AI Tools Safe"}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                {isHe ? "Security-First כברירת מחדל" : "Security-First by Default"}
              </h2>
              <p className="text-text-secondary mb-10 max-w-xl mx-auto">
                {isHe
                  ? "כשאני עובד עם כלי AI, הבטיחות אינה מחשבה שניה — היא משולבת בזרימת העבודה מהפרומפט הראשון."
                  : "When I work with AI tools, safety isn't added after the fact — it's built into the workflow from the first prompt."}
              </p>
            </FadeIn>
            <div className="text-left space-y-4 max-w-xl mx-auto">
              {points.map((point, idx) => (
                <FadeIn key={idx} delay={0.2 + idx * 0.08}>
                  <div className="flex items-start gap-3 rounded-xl px-4 py-3 border"
                    style={{ background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.07)" }}>
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color:"#6366f1" }} />
                    <span className="text-text-secondary text-sm leading-relaxed">{point}</span>
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
