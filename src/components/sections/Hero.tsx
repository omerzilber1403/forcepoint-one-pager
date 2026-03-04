"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Sparkles } from "@/components/ui/sparkles";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { SplineScene } from "@/components/ui/spline-scene";
import { OWNER } from "@/lib/data";
import { Github, Linkedin, ArrowDown, Download } from "lucide-react";

const HERO_ROTATING_WORDS = ["Intelligent", "Secure", "Data-Aware", "Policy-Driven", "Scalable"];
const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HlFTv7Soj/scene.splinecode";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      <BackgroundBeams className="z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">

          {/* LEFT: text column */}
          <div className="flex flex-col justify-center">
            {/* Role badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono uppercase tracking-widest w-fit"
              style={{
                borderColor: "rgba(99,102,241,0.3)",
                color: "#818cf8",
                background: "rgba(99,102,241,0.06)",
              }}
            >
              Applying — Student AI Automation @ Forcepoint
            </div>

            {/* Name with sparkles */}
            <Sparkles particleColor="#6366f1" particleDensity={50} className="block mb-2">
              <TextGenerateEffect
                words={OWNER.name}
                filter={true}
                duration={0.6}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-text-primary leading-none"
              />
            </Sparkles>

            {/* Flip tagline */}
            <div className="mt-5 text-2xl sm:text-3xl font-bold text-text-secondary leading-snug">
              I build{" "}
              <FlipWords
                words={HERO_ROTATING_WORDS}
                duration={3000}
                className="text-accent font-bold"
              />
              {" "}systems.
            </div>

            {/* Bio blurb */}
            <p className="mt-4 text-text-secondary text-base leading-relaxed max-w-md">
              IDF Navy developer turned AI freelancer. BGU Software Engineering student.
              Shipping GenAI agents and simulators that work under real pressure.
            </p>

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "#6366f1", color: "#fff" }}
              >
                View My Work <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href={OWNER.cvPdf}
                download
                className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                style={{ borderColor: "#1e1e2e" }}
              >
                <Download className="w-4 h-4" /> Download CV
              </a>

              <a
                href={OWNER.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                style={{ borderColor: "#1e1e2e" }}
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>

              <a
                href={OWNER.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                style={{ borderColor: "#1e1e2e" }}
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>

          {/* RIGHT: Spline 3D — desktop only */}
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
