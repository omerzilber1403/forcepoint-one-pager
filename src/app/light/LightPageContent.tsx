"use client";
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

export default function LightPageContent() {
  return (
    <main>
      <LightNavbar />
      <LightHero />
      <LightAgentShowcase />
      <LightForcepointShowcase />
      <LightSPLCaseStudy />
      <LightSkills />
      <LightDataPrivacy />
      <LightContact />
    </main>
  );
}
