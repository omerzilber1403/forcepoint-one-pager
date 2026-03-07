import LightNavbar from "@/components/light/LightNavbar";
import LightHero from "@/components/light/LightHero";
import LightForcepointShowcase from "@/components/light/LightForcepointShowcase";
import LightAgentShowcase from "@/components/light/LightAgentShowcase";
import LightSPLCaseStudy from "@/components/light/LightSPLCaseStudy";
import LightSkills from "@/components/light/LightSkills";
import LightDataPrivacy from "@/components/light/LightDataPrivacy";
import LightContact from "@/components/light/LightContact";

export const metadata = {
  title: "Omer Zilbershtein — Light Theme",
};

export default function LightPage() {
  return (
    <main>
      <LightNavbar />
      <LightHero />
      <LightForcepointShowcase />
      <LightAgentShowcase />
      <LightSPLCaseStudy />
      <LightSkills />
      <LightDataPrivacy />
      <LightContact />
    </main>
  );
}
