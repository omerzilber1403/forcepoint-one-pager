import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ForcepointShowcase } from "@/components/sections/ForcepointShowcase";
import { Skills } from "@/components/sections/Skills";
import { DataPrivacy } from "@/components/sections/DataPrivacy";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ForcepointShowcase />
      <Skills />
      <DataPrivacy />
      <Contact />
    </main>
  );
}
