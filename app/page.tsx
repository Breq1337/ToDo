import { Hero } from "@/components/sections/Hero";
import { SolutionMission } from "@/components/sections/SolutionMission";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";
import { DriversSection } from "@/components/sections/DriversSection";
import { ForCompaniesSection } from "@/components/sections/ForCompaniesSection";
import { ClientsBlock } from "@/components/sections/ClientsBlock";
import { CtaSection } from "@/components/sections/CtaSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SolutionMission />
      <PartnersMarquee />
      <DriversSection />
      <ForCompaniesSection />
      <ClientsBlock />
      <CtaSection />
    </>
  );
}
