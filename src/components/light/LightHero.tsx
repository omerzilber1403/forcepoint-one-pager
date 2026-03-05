"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { FlipWords } from "@/components/ui/flip-words";
import { SplineScene } from "@/components/ui/spline-scene";
import { Sparkles } from "@/components/ui/sparkles";
import { OWNER } from "@/lib/data";
import { Github, Linkedin, ArrowDown, Download } from "lucide-react";

const HERO_ROTATING_WORDS = [
  "Intelligent",
  "Secure",
  "Privacy-Aware",
  "Policy-Driven",
  "Automation-First",
];
const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HlFTv7Soj/scene.splinecode";

/* ── Ghost button — shared style helper ───────────────────────── */
function GhostBtn({
  href,
  download,
  target,
  icon,
  label,
}: {
  href: string;
  download?: boolean;
  target?: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      download={download || undefined}
      target={target}
      rel={target ? "noopener noreferrer" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        borderRadius: "9999px",
        border: "1px solid #D6D3D1",
        padding: "0.7rem 1.25rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "#57534E",
        textDecoration: "none",
        background: "transparent",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#A8A29E";
        e.currentTarget.style.background = "#F5F5F4";
        e.currentTarget.style.color = "#1C1917";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#D6D3D1";
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#57534E";
      }}
    >
      {icon}
      {label}
    </a>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function LightHero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#FAFAF9",
      }}
    >
      {/* Indigo radial bloom — top-right, per UX plan */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% 0%, rgba(238,242,255,0.85) 0%, transparent 55%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "6rem 1.5rem 4rem",
        }}
      >
        <div className="lhero-grid">
          {/* ── LEFT: text column ─────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Role badge */}
            <FadeIn delay={0}>
              <div
                style={{
                  marginBottom: "1.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderRadius: "9999px",
                  border: "1px solid #C7D2FE",
                  background: "#EEF2FF",
                  color: "#4338CA",
                  padding: "0.375rem 1rem",
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4F46E5",
                    display: "inline-block",
                    flexShrink: 0,
                    animation: "lhero-pulse 2.4s ease-in-out infinite",
                  }}
                />
                Applying — Software Engineer Student @ Forcepoint
              </div>
            </FadeIn>

            {/* Name — editorial large, stone-900 */}
            <FadeIn delay={0.07}>
              <Sparkles
                particleColor="#6366f1"
                particleDensity={40}
                className="block mb-2"
              >
                <h1
                  style={{
                    fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                    fontWeight: 900,
                    color: "#1C1917",
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    margin: 0,
                  }}
                >
                  {OWNER.name}
                </h1>
              </Sparkles>
            </FadeIn>

            {/* Flip tagline */}
            <FadeIn delay={0.18}>
              <div
                style={{
                  marginTop: "1.25rem",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                  fontWeight: 700,
                  color: "#1C1917",
                  lineHeight: 1.4,
                }}
              >
                I build{" "}
                {/* Wrap FlipWords in a colored span so indigo propagates */}
                <span style={{ color: "#4F46E5" }}>
                  <FlipWords
                    words={HERO_ROTATING_WORDS}
                    duration={3000}
                    className="font-bold"
                  />
                </span>
                {" "}systems.
              </div>
            </FadeIn>

            {/* Bio */}
            <FadeIn delay={0.28}>
              <p
                style={{
                  marginTop: "1rem",
                  color: "#57534E",
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  maxWidth: "28rem",
                }}
              >
                IDF Navy developer — now BGU CS student &amp; AI freelancer.
                I identify high-friction workflows and ship automations with
                measurable before/after impact. FastAPI, LangGraph, always
                security-first.
              </p>
            </FadeIn>

            {/* CTA row */}
            <FadeIn delay={0.38}>
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                {/* Primary — filled indigo */}
                <a
                  href="#projects"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderRadius: "9999px",
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    background: "#4F46E5",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    boxShadow: "0 4px 14px rgba(79,70,229,0.28)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4338CA";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(79,70,229,0.38)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#4F46E5";
                    e.currentTarget.style.boxShadow =
                      "0 4px 14px rgba(79,70,229,0.28)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  View My Work <ArrowDown size={16} />
                </a>

                {/* Ghost buttons */}
                <GhostBtn
                  href={OWNER.cvPdf}
                  download
                  icon={<Download size={15} />}
                  label="Download CV"
                />
                <GhostBtn
                  href={OWNER.linkedin}
                  target="_blank"
                  icon={<Linkedin size={15} />}
                  label="LinkedIn"
                />
                <GhostBtn
                  href={OWNER.github}
                  target="_blank"
                  icon={<Github size={15} />}
                  label="GitHub"
                />
              </div>
            </FadeIn>
          </div>

          {/* ── RIGHT: Spline in a light card ─────────────── */}
          <div
            className="lhero-right"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 520,
                borderRadius: "1.25rem",
                overflow: "hidden",
                border: "1px solid #E7E5E4",
                boxShadow: "0 20px 60px -12px rgba(28,25,23,0.10)",
                background: "#FFFFFF",
              }}
            >
              <SplineScene scene={SPLINE_SCENE_URL} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lhero-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .lhero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          min-height: calc(100vh - 10rem);
        }
        @media (max-width: 1023px) {
          .lhero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .lhero-right { display: none; }
        }
      `}</style>
    </section>
  );
}
