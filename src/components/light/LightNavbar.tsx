"use client";

import { useEffect, useState } from "react";
import { OWNER, NAV_LINKS } from "@/lib/data";
import { Github, Download } from "lucide-react";

export default function LightNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
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
          {OWNER.name}
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
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {[
            { href: OWNER.cvPdf, download: true, icon: <Download size={13} />, label: "CV" },
            {
              href: OWNER.github,
              target: "_blank",
              icon: <Github size={15} />,
              label: "GitHub",
            },
          ].map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              download={btn.download ? true : undefined}
              target={btn.target}
              rel={btn.target ? "noopener noreferrer" : undefined}
              style={{
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
