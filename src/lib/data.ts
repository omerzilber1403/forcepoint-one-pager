import type { Project, SkillGroup, NavLink } from "@/types";

export const OWNER = {
  name: "Omer Zilbershtein",
  role: "Software Engineer Student",
  email: "omerzilber1403@gmail.com",
  phone: "+972-54-6970612",
  github: "https://github.com/omerzilber1403",
  linkedin: "https://www.linkedin.com/in/omer-zilbershtein",
  cvPdf: "/cv/Omer_Zilbershtein_CV.pdf",
  targetCompany: "Forcepoint",
  targetRole: "Software Engineer- Student",
} as const;

export const HERO_TAGLINES = [
  "I build AI automations that save real time.",
  "I ship lightweight services, fast.",
  "I evaluate AI tools and document what works.",
  "I apply a security-first mindset by default.",
];

export const PROJECTS: Project[] = [
  {
    id: "sales-bot",
    title: "Intelligent Sales Bot",
    tagline: "AI agent that qualifies B2B and B2C leads autonomously",
    metricBefore: "~45 min manual qualification call",
    metricAfter: "~8 min agent conversation",
    metricLabel: "5.6× faster lead qualification",
    description:
      "A multi-tenant LangGraph agent that adapts its conversation strategy to B2B vs B2C scenarios in real time. Company configs are hot-swappable with zero restart required. A built-in debug view shows every graph node decision live — full auditability of the AI's reasoning path.",
    fpAlignment:
      "Mirrors Forcepoint's DLP philosophy: route sensitive content through policy-aware pipelines, not ad-hoc logic.",
    stack: ["Python", "FastAPI", "LangGraph", "OpenAI GPT-4", "React", "SQLite", "SQLAlchemy"],
    links: {
      github: "https://github.com/omerzilber1403/agent-sales-bot",
    },
  },
  {
    id: "world-cup",
    title: "C++ World Cup Simulator",
    tagline: "OOP tournament engine with full bracket simulation and memory management",
    metricBefore: "Manual bracket tracking",
    metricAfter: "Automated round-robin + knockout engine",
    metricLabel: "Clean OOP C++ architecture",
    description:
      "Full tournament simulation: group-stage round-robin, knockout rounds, and a live standings engine — all in C++ with proper OOP design, STL containers, and manual memory management. Next planned step: wrap with an AI interface to demonstrate the same velocity shown with the DJ project.",
    fpAlignment:
      "Demonstrates strong C++ systems fundamentals — the same foundation needed to instrument, wrap, or modernize legacy security tooling with AI.",
    stack: ["C++", "OOP", "STL", "Data Structures", "Memory Management"],
    links: {
      github: "https://github.com/omerzilber1403/assignment3-world-cup",
    },
  },
];

export const SKILLS: SkillGroup[] = [
  {
    label: "AI & Automation",
    items: ["LangGraph", "OpenAI API", "Claude API", "Prompt Engineering", "n8n", "Cursor", "GitHub Copilot"],
  },
  {
    label: "Backend & Services",
    items: ["Python", "FastAPI", "SQLite", "SQLAlchemy", "C++", "REST APIs", "Streamlit"],
  },
  {
    label: "Frontend & Tooling",
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git", "GitHub Actions", "Docker"],
  },
];

// Flat list for the marquee — alternating rows
export const SKILLS_ROW_1 = [
  "LangGraph", "OpenAI API", "Claude API", "Prompt Engineering", "n8n", "Cursor", "Copilot", "FastAPI",
];
export const SKILLS_ROW_2 = [
  "Python", "C++", "Streamlit", "React", "TypeScript", "Next.js", "Tailwind CSS", "Docker", "Git",
];

export const DATA_PRIVACY_POINTS = [
  "API keys stored in .env files and excluded via .gitignore — never committed to source control",
  "All AI agent testing uses fully synthetic data — no real user PII is ever processed or stored",
  "Security and correctness are not afterthoughts — every component is built with rigorous testing, strict input validation, and disciplined engineering: from prompt engineering guardrails to typed APIs, the same methodical mindset applies across the stack.",
];

export const NAV_LINKS: NavLink[] = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Security", href: "#security" },
  { label: "Contact", href: "#contact" },
];
