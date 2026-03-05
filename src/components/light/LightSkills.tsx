"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { CV } from "@/data/portfolio";
import type { WorkExperience, EducationExperience } from "@/types";
import { Code, Shield, GraduationCap } from "lucide-react";

const ICON_MAP = { Code, Shield, GraduationCap } as const;

function isWork(exp: WorkExperience | EducationExperience): exp is WorkExperience {
  return "stack" in exp;
}

export default function LightSkills() {
  return (
    <section
      id="skills"
      style={{
        background: "#F5F5F4",
        padding: "7rem 1.5rem",
        borderTop: "1px solid #E7E5E4",
        borderBottom: "1px solid #E7E5E4",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section header */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{
              fontSize: "0.7rem", fontFamily: "monospace", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: "#A8A29E", marginBottom: "0.75rem",
            }}>
              Experience
            </p>
            <h2 style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)", fontWeight: 700,
              color: "#1C1917", letterSpacing: "-0.025em",
              lineHeight: 1.1, margin: "0 0 1rem",
            }}>
              Built under{" "}
              <span style={{ color: "#4F46E5" }}>real constraints</span>
            </h2>
            <p style={{ color: "#57534E", fontSize: "1rem", margin: "0 auto", lineHeight: 1.75, maxWidth: "32rem" }}>
              From Navy simulators to AI freelance work — shipped and in production.
            </p>
          </div>
        </FadeIn>

        {/* Experience cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {CV.experience.map((exp, idx) => {
            const Icon = ICON_MAP[exp.icon];
            return (
              <FadeIn key={exp.id} delay={idx * 0.1}>
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E7E5E4",
                    borderRadius: "1.25rem",
                    padding: "1.75rem",
                    boxShadow: "0 1px 4px rgba(28,25,23,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                    transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px -4px rgba(28,25,23,0.10)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#D6D3D1";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(28,25,23,0.06)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#E7E5E4";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  {/* Card header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", marginBottom: "1.25rem" }}>
                    <div style={{
                      flexShrink: 0, width: 40, height: 40,
                      borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${exp.accentColor}18`, color: exp.accentColor,
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, color: "#1C1917", fontSize: "0.95rem", lineHeight: 1.35, margin: "0 0 0.25rem" }}>
                        {exp.role}
                      </h3>
                      <p style={{ color: "#A8A29E", fontSize: "0.775rem", margin: 0 }}>
                        {exp.organization} · {exp.period}
                      </p>
                    </div>
                  </div>

                  {/* Metric callout */}
                  {exp.metric && (
                    <div style={{
                      borderRadius: "0.625rem", padding: "0.5rem 0.875rem", marginBottom: "1rem",
                      fontSize: "0.82rem", fontWeight: 700, fontFamily: "monospace",
                      background: `${exp.accentColor}12`, color: exp.accentColor,
                      borderLeft: `3px solid ${exp.accentColor}`,
                    }}>
                      {exp.metric}
                    </div>
                  )}

                  {/* Highlights */}
                  <ul style={{ listStyle: "none", margin: "0 0 1.25rem", padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1 }}>
                    {exp.highlights.map((h, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.85rem", color: "#57534E", lineHeight: 1.65 }}>
                        <span style={{
                          marginTop: "0.45rem", width: 6, height: 6,
                          borderRadius: "50%", flexShrink: 0,
                          background: exp.accentColor,
                        }} />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Tech pills */}
                  <div style={{ paddingTop: "1rem", borderTop: "1px solid #F5F5F4", display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {isWork(exp) ? (
                      exp.stack.map(tech => (
                        <span key={tech} style={{
                          padding: "0.2rem 0.55rem", borderRadius: "0.4rem",
                          fontSize: "0.7rem", fontFamily: "monospace", fontWeight: 500,
                          background: "#F5F5F4", border: "1px solid #E7E5E4", color: "#57534E",
                        }}>
                          {tech}
                        </span>
                      ))
                    ) : exp.certifications && exp.certifications.length > 0 ? (
                      exp.certifications.map(cert => (
                        <span key={cert} style={{
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          padding: "0.2rem 0.65rem", borderRadius: "9999px",
                          fontSize: "0.7rem", fontFamily: "monospace",
                          background: `${exp.accentColor}12`, color: exp.accentColor,
                        }}>
                          ✓ {cert}
                        </span>
                      ))
                    ) : (
                      exp.topics?.map(topic => (
                        <span key={topic} style={{
                          padding: "0.2rem 0.55rem", borderRadius: "0.4rem",
                          fontSize: "0.7rem", fontFamily: "monospace", fontWeight: 500,
                          background: "#F5F5F4", border: "1px solid #E7E5E4", color: "#57534E",
                        }}>
                          {topic}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
