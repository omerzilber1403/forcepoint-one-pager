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

  return (
    <main>
      <LightNavbar lang={lang} onLangChange={handleLangChange} />
      <LightHero lang={lang} />
      <LightForcepointShowcase lang={lang} />

      <LightAgentShowcase lang={lang} />
      <LightSPLCaseStudy lang={lang} />
      <LightSkills lang={lang} />
      <LightDataPrivacy lang={lang} />
      <LightContact lang={lang} />
    </main>
  );
}
