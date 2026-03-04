"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { OWNER } from "@/lib/data";
import { Mail, Github, Linkedin } from "lucide-react";

export function Contact() {
  return (
    <section
      id="contact"
      className="border-t"
      style={{ borderColor: "#1e1e2e" }}
    >
      <AuroraBackground className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Heading */}
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">
            Get in Touch
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Let&apos;s build something that matters.
          </h2>

          <p className="text-text-secondary max-w-lg mx-auto mb-10">
            Open to the {OWNER.targetRole} role at {OWNER.targetCompany}.
            Fast reply guaranteed.
          </p>

          {/* Contact links */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-16">
            <a
              href={`mailto:${OWNER.email}`}
              className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Mail className="w-4 h-4 group-hover:text-accent transition-colors" />
              <span className="text-sm">{OWNER.email}</span>
            </a>

            <a
              href={OWNER.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Github className="w-4 h-4 group-hover:text-accent transition-colors" />
              <span className="text-sm">github.com/omerzilber1403</span>
            </a>

            <a
              href={OWNER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4 group-hover:text-accent transition-colors" />
              <span className="text-sm">linkedin.com/in/omer-zilbershtein</span>
            </a>
          </div>

          {/* Divider */}
          <div className="border-t pt-8" style={{ borderColor: "#1e1e2e" }}>
            <p className="text-xs text-text-muted">
              © 2025 {OWNER.name} — Built with Next.js + Aceternity UI + Tailwind CSS
            </p>
          </div>
        </div>
      </AuroraBackground>
    </section>
  );
}
