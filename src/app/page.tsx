"use client";
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

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AgentShowcase />
      <ForcepointShowcase />
      <SPLCaseStudy />
      <Skills />
      <DataPrivacy />
      <Contact />
    </main>
  );
}
