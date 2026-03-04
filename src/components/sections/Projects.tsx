"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Badge } from "@/components/ui/badge";
import { PROJECTS } from "@/lib/data";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";

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

export function Projects() {
  return (
    <section id="projects" style={{ background: "#0a0a0f" }}>
      <ContainerScroll titleComponent={<ProjectTitleComponent />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">

          {/* Real project cards */}
          {PROJECTS.map((project) => (
            <CardSpotlight key={project.id} className="flex flex-col h-full">
              {/* Title + GitHub icon */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-bold text-text-primary leading-tight">
                  {project.title}
                </h3>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
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
                style={{ background: "#0a0a0f", borderColor: "#1e1e2e" }}
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

              {/* Stack badges — max 4 */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.stack.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="muted">
                    {tech}
                  </Badge>
                ))}
                {project.stack.length > 4 && (
                  <Badge variant="muted">+{project.stack.length - 4}</Badge>
                )}
              </div>

              {/* Footer */}
              <div
                className="mt-auto flex items-center gap-4 pt-3 border-t"
                style={{ borderColor: "#1e1e2e" }}
              >
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  Source
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <span className="text-xs text-text-muted italic">Demo coming soon</span>
              </div>
            </CardSpotlight>
          ))}

        </div>
      </ContainerScroll>
    </section>
  );
}
