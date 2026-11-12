import { HowScoresWork } from "@/features/landing/components/how-scores-work";
import { LandingClose } from "@/features/landing/components/landing-close";
import { LandingHeader } from "@/features/landing/components/landing-header";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { ModuleStory } from "@/features/landing/components/module-story";

export function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main className="flex flex-1 flex-col">
        <ModuleStory>
          <LandingHero />
        </ModuleStory>
        <HowScoresWork />
        <LandingClose />
      </main>
    </>
  );
}
