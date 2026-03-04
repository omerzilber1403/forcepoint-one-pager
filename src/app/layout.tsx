import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omer-zilbershtein.vercel.app"),
  title: "Omer Zilbershtein — AI Automation | Forcepoint",
  description:
    "Student building AI agents, FastAPI services, and workflow automations. Applying for the Student – AI Automation role at Forcepoint.",
  keywords: [
    "AI automation", "LangGraph", "FastAPI", "Forcepoint",
    "Python", "AI agent", "Omer Zilbershtein", "security-first",
  ],
  authors: [{ name: "Omer Zilbershtein" }],
  openGraph: {
    title: "Omer Zilbershtein — AI Automation",
    description: "AI agent builder. Sales Bot (LangGraph + FastAPI), DJ Controller (C++ + Streamlit). Security-first mindset.",
    url: "https://omer-zilbershtein.vercel.app",
    siteName: "Omer Zilbershtein Portfolio",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Omer Zilbershtein — AI Automation Portfolio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omer Zilbershtein — AI Automation",
    description: "AI agent builder targeting the Student – AI Automation role at Forcepoint.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-text-primary overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
