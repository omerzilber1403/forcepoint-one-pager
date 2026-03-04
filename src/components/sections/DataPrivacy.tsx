"use client";

import { GlowingStarsBackground } from "@/components/ui/glowing-stars";
import { DATA_PRIVACY_POINTS } from "@/lib/data";
import { ShieldCheck, CheckCircle } from "lucide-react";

export function DataPrivacy() {
  return (
    <section
      id="security"
      className="relative py-24 overflow-hidden"
      style={{ background: "#0d0d14" }}
    >
      {/* Star field background */}
      <GlowingStarsBackground starCount={60} className="opacity-60" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl border"
            style={{ borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)" }}
          >
            <ShieldCheck className="w-7 h-7" style={{ color: "#818cf8" }} />
          </div>
        </div>

        {/* Label */}
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
          How I Keep AI Tools Safe
        </p>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
          Security-First by Default
        </h2>

        <p className="text-text-secondary mb-10 max-w-xl mx-auto">
          When I work with AI tools, safety isn&apos;t added after the fact — it&apos;s
          built into the workflow from the first prompt.
        </p>

        {/* Points list */}
        <ul className="text-left space-y-4 max-w-xl mx-auto">
          {DATA_PRIVACY_POINTS.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "#6366f1" }}
              />
              <span className="text-text-secondary text-sm leading-relaxed">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
