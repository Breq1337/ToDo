import { HomeHero } from "@/components/sections/home/HomeHero";
import { StatsBand } from "@/components/sections/home/StatsBand";
import { Challenge } from "@/components/sections/home/Challenge";
import { Operation } from "@/components/sections/home/Operation";
import { Differentials } from "@/components/sections/home/Differentials";
import { ClientsBlock } from "@/components/sections/ClientsBlock";
import { Culture } from "@/components/sections/home/Culture";
import { JoinUs } from "@/components/sections/home/JoinUs";
import { HomeCta } from "@/components/sections/home/HomeCta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <StatsBand />
      <Challenge />
      <Operation />
      <Differentials />
      <ClientsBlock />
      <Culture />
      <JoinUs />
      <HomeCta />
    </>
  );
}
