"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Sparkles } from "@/components/ui/sparkles";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { SplineScene } from "@/components/ui/spline-scene";
import { FadeIn } from "@/components/ui/fade-in";
import { OWNER } from "@/lib/data";
import { Github, Linkedin, ArrowDown, Download } from "lucide-react";

const HERO_ROTATING_WORDS = ["Intelligent", "Secure", "Privacy-Aware", "Policy-Driven", "Automation-First"];
const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HlFTv7Soj/scene.splinecode";

interface HeroProps {
  lang?: "en" | "he";
}

export function Hero({ lang = "en" }: HeroProps) {
  const isHe = lang === "he";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <BackgroundBeams className="z-0 opacity-30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">

          {/* LEFT: text column */}
          <div
            dir={isHe ? "rtl" : undefined}
            className="flex flex-col justify-center items-center text-center"
          >
            {/* Role badge — glass */}
            <FadeIn delay={0}>
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono uppercase tracking-widest w-fit"
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderColor: "rgba(99, 102, 241, 0.3)",
                color: "#818cf8",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {isHe
                ? "מועמד — סטודנט להנדסת תוכנה @ Forcepoint"
                : "Applying — Software Engineer Student @ Forcepoint"}
            </div>
            </FadeIn>

            {/* Name with sparkles — key forces re-animation on lang switch */}
            <Sparkles key={lang} particleColor="#6366f1" particleDensity={50} className="block mb-2">
              <TextGenerateEffect
                words={isHe ? "עומר זילברשטיין" : OWNER.name}
                filter={true}
                duration={0.6}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-text-primary leading-none"
              />
            </Sparkles>

            {/* Flip tagline / static HE tagline */}
            <FadeIn delay={0.15}>
            <div className="mt-5 text-2xl sm:text-3xl font-bold text-text-secondary leading-snug">
              {isHe ? (
                <>
                  אני בונה מערכות{" "}
                  <span className="inline-block relative text-accent font-bold">
                    מונחות-מדיניות
                  </span>{" "}
                  (Policy-Driven).
                </>
              ) : (
                <>
                  I build{" "}
                  <FlipWords
                    words={HERO_ROTATING_WORDS}
                    duration={3000}
                    className="text-accent font-bold"
                  />
                  {" "}systems.
                </>
              )}
            </div>
            </FadeIn>

            {/* Bio blurb */}
            <FadeIn delay={0.25}>
            <p className="mt-4 text-text-secondary text-base leading-relaxed max-w-md">
              {isHe
                ? "מפתח יוצא חיל הים — כיום סטודנט למדעי המחשב בבן גוריון ופרילנסר בתחום ה-AI. אני מאתר תהליכי עבודה עתירי-חיכוך ומפתח אוטומציות בעלות אימפקט מדיד. מתמחה ב-FastAPI, LangGraph, ותמיד בגישת Security-First."
                : "IDF Navy developer — now BGU CS student & AI freelancer. I identify high-friction workflows and ship automations with measurable before/after impact. FastAPI, LangGraph, always security-first."}
            </p>
            </FadeIn>

            {/* CTA row */}
            <FadeIn delay={0.35}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {/* Primary CTA — solid accent */}
              <a
                href="#projects"
                className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "#6366f1", color: "#fff" }}
              >
                {isHe ? "צפה בעבודות שלי" : "View My Work"} <ArrowDown className="w-4 h-4" />
              </a>

              {/* Secondary CTAs — glass */}
              <a
                href={OWNER.cvPdf}
                download
                className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <Download className="w-4 h-4" />
                {isHe ? "הורד קורות חיים" : "Download CV"}
              </a>

              <a
                href={OWNER.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>

              <a
                href={OWNER.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
            </FadeIn>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <CardSpotlight
              className="w-full h-[520px] p-0 overflow-hidden"
              color="rgba(99,102,241,0.07)"
              radius={400}
            >
              <SplineScene scene={SPLINE_SCENE_URL} className="w-full h-full" />
            </CardSpotlight>
          </div>

        </div>
      </div>
    </section>
  );
}
