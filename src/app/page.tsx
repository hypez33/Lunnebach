import { PageMotion } from "@/components/motion/PageMotion";
import { CabinetTeaser } from "@/components/sections/CabinetTeaser";
import { CareerTeaser } from "@/components/sections/CareerTeaser";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { InquiryCta } from "@/components/sections/InquiryCta";
import { Intro } from "@/components/sections/Intro";
import { Process } from "@/components/sections/Process";
import { TwoWorlds } from "@/components/sections/TwoWorlds";
import { Values } from "@/components/sections/Values";
import { Workshop } from "@/components/sections/Workshop";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <TwoWorlds />
      <FeaturedProjects />
      <Process />
      <Workshop />
      <Values />
      <CareerTeaser />
      <CabinetTeaser />
      <InquiryCta />
      <PageMotion />
    </>
  );
}
