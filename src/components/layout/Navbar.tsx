"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { OWNER, NAV_LINKS } from "@/lib/data";
import { Github, Download, Sun } from "lucide-react";

const HE_NAV_LABELS: Record<string, string> = {
  "#projects": "פרויקטים",
  "#skills":   "כישורים",
  "#security": "אבטחת מידע",
  "#contact":  "צור קשר",
};

interface NavbarProps {
  lang?: "en" | "he";
  onLangChange?: (l: "en" | "he") => void;
}

export function Navbar({ lang = "en", onLangChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const isHe = lang === "he";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  };

  return (
    <header
      dir={isHe ? "rtl" : undefined}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "border-b" : "bg-transparent"
      )}
      style={{
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        background: scrolled ? "rgba(8, 8, 20, 0.65)" : "transparent",
        borderColor: scrolled ? "rgba(255, 255, 255, 0.08)" : "transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Name */}
        <a
          href="#hero"
          className="font-bold text-text-primary hover:text-accent transition-colors text-sm sm:text-base"
        >
          {isHe ? "עומר זילברשטיין" : OWNER.name}
        </a>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              {isHe ? (HE_NAV_LABELS[link.href] ?? link.label) : link.label}
            </a>
          ))}
        </nav>

        {/* CTA buttons + toggles */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => onLangChange?.(isHe ? "en" : "he")}
            className="rounded-full border px-2.5 py-1 text-xs font-mono font-bold text-text-secondary hover:text-text-primary transition-all duration-200"
            style={glassStyle}
            aria-label="Toggle language"
          >
            {isHe ? "EN" : "HE"}
          </button>

          {/* Theme toggle — navigate to light mode */}
          <a
            href="/light"
            className="flex items-center rounded-full border px-2 py-1.5 text-text-secondary hover:text-text-primary transition-all duration-200"
            style={glassStyle}
            aria-label="Switch to light mode"
          >
            <Sun className="w-3.5 h-3.5" />
          </a>

          {/* CV download (hidden on mobile) */}
          <a
            href={OWNER.cvPdf}
            download
            className="hidden md:flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-all duration-200"
            style={glassStyle}
          >
            <Download className="w-3.5 h-3.5" />
            {isHe ? "קורות חיים" : "CV"}
          </a>

          {/* GitHub link */}
          <a
            href={OWNER.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-all duration-200"
            style={glassStyle}
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
