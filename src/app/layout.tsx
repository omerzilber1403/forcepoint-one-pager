import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omer-zilbershtein.vercel.app"),
  title: "Omer Zilbershtein — Software Engineer Student | Forcepoint",
  description:
    "BGU CS student & AI freelancer applying for the Software Engineer Student role at Forcepoint. I identify high-friction workflows and ship measurable AI automations — FastAPI, LangGraph, security-first.",
  keywords: [
    "AI automation", "LangGraph", "FastAPI", "Forcepoint",
    "Python", "AI agent", "Omer Zilbershtein", "security-first",
    "prompt engineering", "n8n", "Cursor", "workflow automation",
  ],
  authors: [{ name: "Omer Zilbershtein" }],
  openGraph: {
    title: "Omer Zilbershtein — Software Engineer Student | Forcepoint",
    description: "AI automation builder. Sales Bot (5.6× faster, LangGraph + FastAPI), C++ World Cup Simulator. Security-first mindset.",
    url: "https://omer-zilbershtein.vercel.app",
    siteName: "Omer Zilbershtein Portfolio",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Omer Zilbershtein — Software Engineer Student Portfolio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omer Zilbershtein — Software Engineer Student | Forcepoint",
    description: "AI automation builder applying for Software Engineer Student at Forcepoint. Before/after metrics, security-first.",
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
        className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} antialiased bg-bg text-text-primary overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
