"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { FadeIn } from "@/components/ui/fade-in";
import { CV } from "@/data/portfolio";
import type { WorkExperience, EducationExperience } from "@/types";
import { Code, Shield, GraduationCap } from "lucide-react";

const ICON_MAP = {
  Code: Code,
  Shield: Shield,
  GraduationCap: GraduationCap,
} as const;

function isWork(exp: WorkExperience | EducationExperience): exp is WorkExperience {
  return "stack" in exp;
}

export function Skills() {
  return (
    <section
      id="skills"
      className="py-24 border-y"
      style={{ borderColor: "rgba(255, 255, 255, 0.07)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <FadeIn>
        <div className="mb-12 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
            Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Built under real constraints
          </h2>
          <p className="mt-3 text-text-secondary max-w-xl mx-auto">
            From Navy simulators to AI freelance work — shipped and in production.
          </p>
        </div>
        </FadeIn>

        {/* Experience cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CV.experience.map((exp, idx) => {
            const Icon = ICON_MAP[exp.icon];
            return (
              <FadeIn key={exp.id} delay={idx * 0.12}>
              <CardSpotlight
                color={`${exp.accentColor}14`}
                radius={300}
                className="flex flex-col"
              >
                {/* Card header */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${exp.accentColor}20`, color: exp.accentColor }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-base leading-tight">
                      {exp.role}
                    </h3>
                    <p className="text-text-muted text-xs mt-0.5">
                      {exp.organization} · {exp.period}
                    </p>
                  </div>
                </div>

                {/* Metric callout */}
                {exp.metric && (
                <div
                  className="rounded-lg px-3 py-2 mb-4 text-sm font-bold font-mono"
                  style={{
                    background: `${exp.accentColor}1a`,
                    color: exp.accentColor,
                    borderLeft: `3px solid ${exp.accentColor}`,
                  }}
                >
                  {exp.metric}
                </div>
                )}

                {/* Highlights */}
                <ul className="space-y-2 mb-5 flex-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: exp.accentColor }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Stack badges (WorkExperience) or cert chip (EducationExperience) */}
                {isWork(exp) ? (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    {exp.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-xs font-mono"
                        style={{
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#94a3b8",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : exp.certifications && exp.certifications.length > 0 ? (
                  <div className="pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    {exp.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
                        style={{ background: `${exp.accentColor}20`, color: exp.accentColor }}
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                ) : null}
              </CardSpotlight>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
