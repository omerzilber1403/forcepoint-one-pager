import LightNavbar from "@/components/light/LightNavbar";
import LightHero from "@/components/light/LightHero";
import LightSPLCaseStudy from "@/components/light/LightSPLCaseStudy";

export const metadata = {
  title: "Omer Zilbershtein — Light Theme",
};

export default function LightPage() {
  return (
    <main>
      <LightNavbar />
      <LightHero />
      <LightSPLCaseStudy />
    </main>
  );
}
