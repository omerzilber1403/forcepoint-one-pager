/**
 * DIAGNOSTIC PAGE — zero animations, zero canvas, zero backdrop-filter.
 * Purpose: isolate whether lag is caused by animation/effects or by
 * something else (bundle size, hydration, server, etc.).
 *
 * If this page scrolls perfectly smoothly → animations are the culprit.
 * If this page is also slow → the problem is elsewhere.
 *
 * Delete this file when diagnosis is done.
 */
export default function TestPage() {
  return (
    <main style={{ background: "#080810", color: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>

      {/* Fixed nav — solid background, NO backdrop-filter */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#0d0d1a", borderBottom: "1px solid #1e1e2e",
        padding: "16px 32px", display: "flex", justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontWeight: 700, color: "#818cf8" }}>Omer Zilbershtein</span>
        <span style={{ color: "#94a3b8", fontSize: 14 }}>/test — diagnostic page</span>
        <a href="/" style={{ color: "#22d3ee", fontSize: 14 }}>← Back to main</a>
      </nav>

      {/* Hero — solid color, static text, zero animation */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: 80, background: "#080810",
        borderBottom: "1px solid #1e1e2e",
      }}>
        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16, textTransform: "uppercase", letterSpacing: 3 }}>
          Full-Stack Developer
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", fontWeight: 800, margin: "0 0 24px", textAlign: "center" }}>
          Omer Zilbershtein
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 480, textAlign: "center", lineHeight: 1.7, marginBottom: 40 }}>
          AI Agents · Full-Stack Engineering · Forcepoint Submission
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="#showcase" style={{ background: "#6366f1", color: "#fff", padding: "12px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
            View Work
          </a>
          <a href="#contact" style={{ border: "1px solid #1e1e2e", color: "#f8fafc", padding: "12px 28px", borderRadius: 8, textDecoration: "none" }}>
            Contact
          </a>
        </div>
      </section>

      {/* Forcepoint Showcase — solid card, no glass */}
      <section id="showcase" style={{
        minHeight: "80vh", background: "#0a0a14", padding: "80px 32px",
        display: "flex", flexDirection: "column", alignItems: "center",
        borderBottom: "1px solid #1e1e2e",
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Forcepoint AI Sales Agent</h2>
        <p style={{ color: "#94a3b8", maxWidth: 560, textAlign: "center", lineHeight: 1.7, marginBottom: 48 }}>
          An autonomous LangGraph-powered B2B sales agent that qualifies leads, answers product questions, and drives pipeline — built specifically for the Forcepoint submission.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, width: "100%", maxWidth: 960 }}>
          {[
            { title: "LangGraph State Machine", desc: "Multi-node conversation graph with intent detection, persona switching, and B2B objection handling." },
            { title: "Forcepoint DLP Knowledge", desc: "Deep product catalog covering DLP, CASB, ZT Web, Private Access, and competitive positioning." },
            { title: "Hebrew + English", desc: "Bilingual support with automatic language detection and proper RTL rendering." },
          ].map((card) => (
            <div key={card.title} style={{
              background: "#12121a", border: "1px solid #1e1e2e",
              borderRadius: 12, padding: 28,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#818cf8" }}>{card.title}</h3>
              <p style={{ color: "#94a3b8", lineHeight: 1.6, margin: 0, fontSize: 15 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills — static grid, no animation */}
      <section id="skills" style={{
        minHeight: "60vh", background: "#080810", padding: "80px 32px",
        display: "flex", flexDirection: "column", alignItems: "center",
        borderBottom: "1px solid #1e1e2e",
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Skills</h2>
        <p style={{ color: "#94a3b8", marginBottom: 48, textAlign: "center" }}>Core technologies used in this project and beyond</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 800 }}>
          {["Python", "FastAPI", "LangGraph", "TypeScript", "Next.js", "React", "PostgreSQL", "SQLite", "Docker", "Render", "Vercel", "OpenAI API", "LangChain", "Tailwind CSS", "Framer Motion"].map((skill) => (
            <span key={skill} style={{
              background: "#12121a", border: "1px solid #1e1e2e",
              padding: "8px 18px", borderRadius: 20, fontSize: 14, color: "#94a3b8",
            }}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Data Privacy — solid card */}
      <section id="privacy" style={{
        minHeight: "60vh", background: "#0a0a14", padding: "80px 32px",
        display: "flex", flexDirection: "column", alignItems: "center",
        borderBottom: "1px solid #1e1e2e",
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Data & Privacy</h2>
        <p style={{ color: "#94a3b8", maxWidth: 560, textAlign: "center", lineHeight: 1.7, marginBottom: 48 }}>
          All demo conversations are ephemeral. No personal data is stored. The backend uses SQLite seeded with demo data on every startup.
        </p>
        <div style={{
          background: "#12121a", border: "1px solid #1e1e2e", borderRadius: 16,
          padding: "40px 48px", maxWidth: 600, width: "100%",
        }}>
          {[
            "No user accounts required",
            "Session data cleared on backend restart",
            "OpenAI API key stored in Render env vars only",
            "CORS restricted to portfolio domain",
          ].map((point) => (
            <div key={point} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ color: "#22d3ee", fontSize: 18 }}>✓</span>
              <span style={{ color: "#94a3b8" }}>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact — no effects */}
      <section id="contact" style={{
        minHeight: "50vh", background: "#080810", padding: "80px 32px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Contact</h2>
        <p style={{ color: "#94a3b8", marginBottom: 40 }}>Get in touch</p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="mailto:omerzilber5@gmail.com" style={{ background: "#6366f1", color: "#fff", padding: "14px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
            Email
          </a>
          <a href="https://linkedin.com/in/omer-zilbershtein" target="_blank" rel="noreferrer" style={{ border: "1px solid #1e1e2e", color: "#f8fafc", padding: "14px 32px", borderRadius: 8, textDecoration: "none" }}>
            LinkedIn
          </a>
          <a href="https://github.com/omerzilber1403" target="_blank" rel="noreferrer" style={{ border: "1px solid #1e1e2e", color: "#f8fafc", padding: "14px 32px", borderRadius: 8, textDecoration: "none" }}>
            GitHub
          </a>
        </div>

        <div style={{ marginTop: 80, padding: "24px 32px", background: "#12121a", borderRadius: 12, border: "1px solid #1e1e2e", textAlign: "center", maxWidth: 500 }}>
          <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
            <strong style={{ color: "#6366f1" }}>DIAGNOSTIC PAGE</strong><br />
            If this page scrolls smoothly → animations are the problem.<br />
            If this is also slow → the issue is bundle size, hydration, or server.
          </p>
        </div>
      </section>

    </main>
  );
}
