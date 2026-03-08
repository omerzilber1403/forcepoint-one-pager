"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LightNavbar from "@/components/light/LightNavbar";
import LightHero from "@/components/light/LightHero";
import LightForcepointShowcase from "@/components/light/LightForcepointShowcase";
import LightSkills from "@/components/light/LightSkills";
import LightDataPrivacy from "@/components/light/LightDataPrivacy";
import LightContact from "@/components/light/LightContact";

// Lazy-load heavy interactive sections — defers JS bundles and backend polling
// until after the above-the-fold content has painted.
const LightAgentShowcase = dynamic(
  () => import("@/components/light/LightAgentShowcase"),
  { ssr: false }
);
const LightSPLCaseStudy = dynamic(
  () => import("@/components/light/LightSPLCaseStudy"),
  { ssr: false }
);

type Lang = "en" | "he";

export default function LightPageContent() {
  const [lang, setLang] = useState<Lang>("en");

  // Restore persisted language preference (survives theme-route navigation)
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Lang | null;
    if (saved === "en" || saved === "he") setLang(saved);
  }, []);

  const handleLangChange = (l: Lang) => {
    setLang(l);
    localStorage.setItem("portfolio-lang", l);
  };

  const isHe = lang === "he";

  return (
    <main>
      <LightNavbar lang={lang} onLangChange={handleLangChange} />
      <LightHero lang={lang} />
      <LightForcepointShowcase lang={lang} />

      {/* Demo teaser — bridges the engineering projects to the live demo below */}
      <div
        dir={isHe ? "rtl" : undefined}
        style={{
          textAlign: "center",
          padding: "3.5rem 1.5rem 0",
          background: "#FAFAF9",
        }}
      >
        <p
          style={{
            fontSize: "clamp(1.35rem, 3.5vw, 2rem)",
            fontWeight: 800,
            color: "#1C1917",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {isHe
            ? "יצרתי דמו במיוחד עבורכם 👇"
            : "I built a live demo — just for you 👇"}
        </p>
      </div>

      <LightAgentShowcase />
      <LightSPLCaseStudy />
      <LightSkills lang={lang} />
      <LightDataPrivacy lang={lang} />
      <LightContact lang={lang} />
    </main>
  );
}
