"use client";
import { OWNER } from "@/lib/data";
import { Mail, Github, Linkedin } from "lucide-react";

type Lang = "en" | "he";

export default function LightContact({ lang = "en" }: { lang?: Lang }) {
  const isHe = lang === "he";
  return (
    <section id="contact" dir={isHe ? "rtl" : undefined}
      style={{ background:"#F5F5F4", borderTop:"1px solid #E7E5E4", padding:"7rem 1.5rem" }}>
      <div style={{ maxWidth:"72rem", margin:"0 auto", textAlign:"center" }}>
        <p style={{ fontSize:"0.7rem", fontFamily:"monospace", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"#A8A29E", marginBottom:"0.875rem" }}>
          {isHe ? "צור קשר" : "Get in Touch"}
        </p>
        <h2 style={{ fontSize:"clamp(1.9rem,4vw,3rem)", fontWeight:700, color:"#1C1917", letterSpacing:"-0.025em", lineHeight:1.1, margin:"0 0 1rem" }}>
          {isHe ? <>בואו נבנה משהו <span style={{ color:"#4F46E5" }}>עם אימפקט.</span></> : <>Let’s build something <span style={{ color:"#4F46E5" }}>that matters.</span></>}
        </h2>
        <p style={{ color:"#57534E", maxWidth:"32rem", margin:"0 auto 3rem", lineHeight:1.75, fontSize:"1rem" }}>
          {isHe ? "פתוח לתפקיד סטודנט מהנדס תוכנה ב-Forcepoint. מענה מהיר מובטח." : "Open to the Software Engineer‑ Student role at Forcepoint. Fast reply guaranteed."}
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", alignItems:"center", gap:"2rem", marginBottom:"4rem" }}>
          {[
            { href:`mailto:${OWNER.email}`, icon:<Mail size={16} />, label:OWNER.email },
            { href:OWNER.github, icon:<Github size={16} />, label:"github.com/omerzilber1403", target:"_blank" },
            { href:OWNER.linkedin, icon:<Linkedin size={16} />, label:"linkedin.com/in/omer-zilbershtein", target:"_blank" },
          ].map(link => (
            <a key={link.label} href={link.href} target={link.target} rel={link.target ? "noopener noreferrer" : undefined}
              style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", color:"#57534E", textDecoration:"none", fontSize:"0.875rem", transition:"color 0.15s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4F46E5")}
              onMouseLeave={e => (e.currentTarget.style.color = "#57534E")}
            >{link.icon} {link.label}</a>
          ))}
        </div>
        <div style={{ borderTop:"1px solid #E7E5E4", paddingTop:"2rem" }}>
          <p style={{ fontSize:"0.775rem", color:"#A8A29E" }}>© 2025 Omer Zilbershtein — Built with Next.js + Aceternity UI + Tailwind CSS</p>
        </div>
      </div>
    </section>
  );
}
