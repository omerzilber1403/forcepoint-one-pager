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

  return (
    <main>
      <Navbar lang={lang} onLangChange={handleLangChange} />
      <Hero lang={lang} />
      <ForcepointShowcase />
      <AgentShowcase />
      <SPLCaseStudy />
      <Skills />
      <DataPrivacy />
      <Contact />
    </main>
  );
}
