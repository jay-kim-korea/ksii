import { Hero } from "@/components/landing/Hero";
import { AboutSection } from "@/components/landing/AboutSection";
import { BusinessSection } from "@/components/landing/BusinessSection";
import { NewsSection } from "@/components/landing/NewsSection";
import { CareersSection } from "@/components/landing/CareersSection";
import { MembersSection } from "@/components/landing/MembersSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <BusinessSection />
      <NewsSection />
      <CareersSection />
      <MembersSection />
    </>
  );
}
