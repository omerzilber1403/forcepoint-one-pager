"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ForcepointShowcase } from "@/components/sections/ForcepointShowcase";
import dynamic from "next/dynamic";
import { Skills } from "@/components/sections/Skills";
import { DataPrivacy } from "@/components/sections/DataPrivacy";
import { Contact } from "@/components/sections/Contact";

// Lazy-load heavy interactive sections — defers their JS bundles and
// backend polling until after the above-the-fold content has painted.
const AgentShowcase = dynamic(() => import("@/components/agent-showcase"), { ssr: false });
const SPLCaseStudy   = dynamic(() => import("@/components/spl-case-study"),  { ssr: false });

type Lang = "en" | "he";

export default function Home() {
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
      <Navbar lang={lang} onLangChange={handleLangChange} />
      <Hero lang={lang} />
      <ForcepointShowcase lang={lang} />

      {/* Demo teaser — bridges the engineering projects to the live demo below */}
      <div
        dir={isHe ? "rtl" : undefined}
        style={{
          textAlign: "center",
          padding: "3.5rem 1.5rem 0",
        }}
      >
        <p
          style={{
            fontSize: "clamp(1.35rem, 3.5vw, 2rem)",
            fontWeight: 800,
            color: "#e2e8f0",
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

      <AgentShowcase />
      <SPLCaseStudy lang={lang} />
      <Skills lang={lang} />
      <DataPrivacy lang={lang} />
      <Contact lang={lang} />
    </main>
  );
}
