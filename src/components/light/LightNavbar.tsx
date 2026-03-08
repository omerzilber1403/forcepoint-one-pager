"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { OWNER, NAV_LINKS } from "@/lib/data";
import { Github, Download, Moon } from "lucide-react";

const HE_NAV_LABELS: Record<string, string> = {
  "#projects": "פרויקטים",
  "#skills":   "כישורים",
  "#security": "אבטחת מידע",
  "#contact":  "צור קשר",
};

type Lang = "en" | "he";

interface LightNavbarProps {
  lang?: Lang;
  onLangChange?: (l: Lang) => void;
}

export default function LightNavbar({ lang = "en", onLangChange }: LightNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const isHe = lang === "he";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLangChange = () => {
    onLangChange?.(isHe ? "en" : "he");
  };

  const btnStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    borderRadius: "9999px",
    border: "1px solid #D6D3D1",
    padding: "0.35rem 0.8rem",
    fontSize: "0.78rem",
    fontWeight: 500,
    color: "#57534E",
    textDecoration: "none",
    background: "transparent",
    transition: "all 0.15s ease",
    cursor: "pointer",
  };

  const handleBtnEnter = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "#A8A29E";
    (e.currentTarget as HTMLElement).style.background = "#F5F5F4";
    (e.currentTarget as HTMLElement).style.color = "#1C1917";
  };
  const handleBtnLeave = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "#D6D3D1";
    (e.currentTarget as HTMLElement).style.background = "transparent";
    (e.currentTarget as HTMLElement).style.color = "#57534E";
  };

  return (
    <header
      dir={isHe ? "rtl" : undefined}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.25s ease",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        background: scrolled ? "rgba(250,250,249,0.92)" : "transparent",
        borderBottom: scrolled ? "1px solid #E7E5E4" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(28,25,23,0.06)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="lnav-logo"
          style={{
            fontWeight: 700,
            color: "#1C1917",
            fontSize: "0.9rem",
            textDecoration: "none",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#4F46E5")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#1C1917")}
        >
          {isHe ? "עומר זילברשטיין" : OWNER.name}
        </a>

        {/* Nav links — hide on mobile */}
        <nav
          className="lnav-links"
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: "#57534E",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1917")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#57534E")}
            >
              {isHe ? (HE_NAV_LABELS[link.href] ?? link.label) : link.label}
            </a>
          ))}
        </nav>

        {/* CTA + toggles */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Language toggle */}
          <button
            onClick={handleLangChange}
            style={{ ...btnStyle, padding: "0.3rem 0.65rem", fontFamily: "monospace", fontWeight: 700 }}
            onMouseEnter={handleBtnEnter}
            onMouseLeave={handleBtnLeave}
            aria-label="Toggle language"
          >
            {isHe ? "EN" : "HE"}
          </button>

          {/* Theme toggle — navigate back to dark mode */}
          <a
            href="/"
            style={{ ...btnStyle, padding: "0.35rem 0.6rem" }}
            onMouseEnter={handleBtnEnter}
            onMouseLeave={handleBtnLeave}
            aria-label="Switch to dark mode"
          >
            <Moon size={14} />
          </a>

          {/* CV + GitHub */}
          {[
            { href: OWNER.cvPdf, download: true, icon: <Download size={13} />, label: isHe ? "קורות חיים" : "CV" },
            { href: OWNER.github, target: "_blank", icon: <Github size={15} />, label: "GitHub" },
          ].map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              download={btn.download ? true : undefined}
              target={"target" in btn ? btn.target : undefined}
              rel={"target" in btn ? "noopener noreferrer" : undefined}
              style={btnStyle}
              onMouseEnter={handleBtnEnter}
              onMouseLeave={handleBtnLeave}
            >
              {btn.icon} {btn.label}
            </a>
          ))}
        </div>
      </div>

      {/* Hide nav links below md */}
      <style>{`
        @media (max-width: 767px) { .lnav-links { display: none !important; } }
      `}</style>
    </header>
  );
}
