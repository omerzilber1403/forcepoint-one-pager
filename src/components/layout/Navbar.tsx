"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OWNER, NAV_LINKS } from "@/lib/data";
import { Github, Download } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b"
          : "bg-transparent"
      )}
      style={{ borderColor: scrolled ? "#1e1e2e" : "transparent" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Name */}
        <a
          href="#hero"
          className="font-bold text-text-primary hover:text-accent transition-colors text-sm sm:text-base"
        >
          {OWNER.name}
        </a>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* GitHub CTA */}
        <div className="flex items-center gap-2">
          <a
            href={OWNER.cvPdf}
            download
            className="hidden md:flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:border-accent transition-all duration-200"
            style={{ borderColor: "#1e1e2e" }}
          >
            <Download className="w-3.5 h-3.5" /> CV
          </a>
          <a
            href={OWNER.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:border-accent transition-all duration-200"
            style={{ borderColor: "#1e1e2e" }}
            aria-label="GitHub profile"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
