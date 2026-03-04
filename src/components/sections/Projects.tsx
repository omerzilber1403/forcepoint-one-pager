"use client";

import { useState } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Badge } from "@/components/ui/badge";
import { ProjectModal } from "@/components/ui/project-modal";
import { TerminalUI } from "@/components/ui/terminal-ui";
import { PROJECTS } from "@/lib/data";
import type { Project } from "@/types";
import {
  ArrowRight, ArrowUpRight, Github, ExternalLink,
  Terminal, Cpu, Layers, GitBranch,
} from "lucide-react";

/* ─── Projects Section Title ────────────────────────────────────────────── */
function ProjectTitleComponent() {
  return (
    <>
      <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
        Featured Work
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
        Projects that ship
      </h2>
      <p className="mt-3 text-text-secondary max-w-xl mx-auto">
        Two real projects. Concrete metrics. Built with the exact tools Forcepoint needs.
      </p>
    </>
  );
}

/* ─── Sales Bot Modal Content ───────────────────────────────────────────── */
function SalesBotDetail({ project }: { project: Project }) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <p className="text-text-secondary leading-relaxed">{project.description}</p>

      {/* Before → After metric callout */}
      <div className="rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Impact</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-text-muted text-sm line-through font-mono">{project.metricBefore}</span>
          <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />
          <span className="text-xl font-black font-mono" style={{ color: "#22d3ee" }}>{project.metricAfter}</span>
        </div>
        <p className="mt-2 text-sm font-semibold" style={{ color: "#818cf8" }}>{project.metricLabel}</p>
      </div>

      {/* Architecture highlights */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Architecture</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <GitBranch className="w-4 h-4" />, label: "LangGraph multi-agent graph", detail: "B2B / B2C intent routing — separate nodes per market segment" },
            { icon: <Cpu className="w-4 h-4" />,       label: "Hot-swap config",             detail: "Company profiles reload with zero server restart" },
            { icon: <Layers className="w-4 h-4" />,    label: "Live debug view",             detail: "React dashboard shows every graph node decision in real time" },
            { icon: <Terminal className="w-4 h-4" />,  label: "FastAPI backend",             detail: "REST + SSE streaming, async SQLAlchemy, multi-tenant isolation" },
          ].map(({ icon, label, detail }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-lg p-3 border"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <span className="flex-shrink-0 mt-0.5" style={{ color: "#6366f1" }}>{icon}</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">{label}</p>
                <p className="text-xs text-text-muted mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FP alignment */}
      <div
        className="rounded-r-lg pl-4 py-3 border-l-2 text-sm italic"
        style={{ borderColor: "#6366f1", color: "#a5b4fc" }}
      >
        <span className="font-semibold not-italic" style={{ color: "#818cf8" }}>Forcepoint alignment: </span>
        {project.fpAlignment}
      </div>

      {/* Stack */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Stack</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map(tech => (
            <Badge key={tech} variant="muted">{tech}</Badge>
          ))}
        </div>
      </div>

      {/* GitHub CTA */}
      <a
        href={project.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border hover:border-accent transition-colors"
        style={{ borderColor: "#1e1e2e", color: "#94a3b8" }}
      >
        <Github className="w-4 h-4" />
        View source on GitHub
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

/* ─── World Cup Terminal Modal Content ──────────────────────────────────── */
function WorldCupDetail({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-5" style={{ minHeight: "480px" }}>
      {/* Description + GitHub */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <p className="text-text-secondary text-sm leading-relaxed max-w-xl">{project.description}</p>
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-mono border hover:border-accent transition-colors"
          style={{ borderColor: "#1e1e2e", color: "#94a3b8" }}
        >
          <Github className="w-3.5 h-3.5" />
          GitHub
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Terminal */}
      <div className="flex-1" style={{ minHeight: "380px" }}>
        <TerminalUI />
      </div>
    </div>
  );
}

/* ─── Projects Section ───────────────────────────────────────────────────── */
export function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = PROJECTS.find(p => p.id === selectedId) ?? null;

  return (
    <section id="projects">
      <ContainerScroll titleComponent={<ProjectTitleComponent />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {PROJECTS.map((project) => (
            <CardSpotlight
              key={project.id}
              className="flex flex-col h-full"
              onClick={() => setSelectedId(project.id)}
            >
              {/* Title + GitHub icon */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-bold text-text-primary leading-tight">
                  {project.title}
                </h3>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex-shrink-0 text-text-muted hover:text-accent transition-colors"
                  aria-label={`${project.title} GitHub`}
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>

              {/* Tagline */}
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                {project.tagline}
              </p>

              {/* Before → After metric */}
              <div
                className="rounded-xl p-3 mb-4 border"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-muted text-xs line-through font-mono">
                    {project.metricBefore}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                  <span className="text-base font-bold font-mono" style={{ color: "#22d3ee" }}>
                    {project.metricAfter}
                  </span>
                </div>
                <div className="mt-1.5">
                  <Badge variant="indigo">{project.metricLabel}</Badge>
                </div>
              </div>

              {/* Forcepoint alignment callout */}
              <div
                className="rounded-r-lg pl-3 py-2 mb-4 border-l-2 text-xs italic flex-1"
                style={{ borderColor: "#6366f1", color: "#a5b4fc" }}
              >
                <span className="font-semibold not-italic" style={{ color: "#818cf8" }}>
                  FP alignment:{" "}
                </span>
                {project.fpAlignment}
              </div>

              {/* Stack badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.stack.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="muted">{tech}</Badge>
                ))}
                {project.stack.length > 4 && (
                  <Badge variant="muted">+{project.stack.length - 4}</Badge>
                )}
              </div>

              {/* Footer */}
              <div
                className="mt-auto flex items-center gap-4 pt-3 border-t"
                style={{ borderColor: "rgba(255, 255, 255, 0.07)" }}
              >
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  Source
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <span className="text-xs font-mono" style={{ color: "#6366f1" }}>
                  Click to explore →
                </span>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </ContainerScroll>

      {/* Project modals */}
      <ProjectModal
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        title={selectedProject?.title ?? ""}
      >
        {selectedProject?.id === "world-cup" && (
          <WorldCupDetail project={selectedProject} />
        )}
        {selectedProject?.id === "sales-bot" && (
          <SalesBotDetail project={selectedProject} />
        )}
      </ProjectModal>
    </section>
  );
}
