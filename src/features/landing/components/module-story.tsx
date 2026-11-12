"use client";
import { useEffect, useRef, useState } from "react";
import { MODULES } from "@/features/company/options";
import { ExampleCaption } from "@/features/landing/components/example-caption";
import { ModuleStep, type ExampleStep } from "@/features/landing/components/module-step";
import { StoryMark } from "@/features/landing/components/story-mark";

// A made-up company, one question per module, labelled "Example" wherever it shows.
// The gaps and sources follow DESIGN.md's sample copy; none of it is a real result.
const STEPS: ExampleStep[] = [
  {
    module: "infrastructure",
    question: "If the power goes off, how long does your setup keep running?",
    answers: [
      "It stops straight away",
      "Under an hour on a UPS",
      "A generator or a cloud fallback",
    ],
    answer: "It stops straight away",
    score: 62,
    gap: "Power backup is the biggest gap.",
    fix: "a UPS for your network gear, then a cloud fallback for the app.",
    source: "Weights: AHP, expert panel",
  },
  {
    module: "marketing",
    question: "How have you tested your main channel?",
    answers: ["Not yet", "One small paid test", "It already brings in customers"],
    answer: "Not yet",
    score: 48,
    gap: "No channel has been tested with real customers.",
    fix: "run one small paid test before launch day.",
    source: "Criteria: literature review",
  },
  {
    module: "compliance",
    question: "Is the company registered with the Registrar of Companies?",
    answers: ["Not yet", "Registration in progress", "Yes, registered"],
    answer: "Yes, registered",
    score: 71,
    gap: "The Personal Data Protection Act steps are not started.",
    fix: "write down what personal data you collect and why.",
    source: "Legal steps: expert interviews",
  },
  {
    module: "product",
    question: "How do you know people want this?",
    answers: ["We think so", "We talked to five or more users", "People already pay for it"],
    answer: "We talked to five or more users",
    score: 55,
    gap: "Demand is talked about, not yet paid for.",
    fix: "get one paid pilot or pre-order.",
    source: "Weights: AHP, expert panel",
  },
];

const EXAMPLE_SCORES = Object.fromEntries(STEPS.map((step) => [step.module, step.score]));

// The hero and the four steps on the left; on wide screens the big mark stays on the right and
// fills one square for every step that has reached the middle of the screen.
export function ModuleStory({ children }: { children: React.ReactNode }) {
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const [shownCount, setShownCount] = useState(0);

  // Reading positions on scroll is simpler than an IntersectionObserver here, and it also
  // un-fills squares when the visitor scrolls back up.
  useEffect(() => {
    function update() {
      const middle = window.innerHeight / 2;
      const count = stepRefs.current.filter(
        (step) => step && step.getBoundingClientRect().top < middle,
      ).length;
      setShownCount(count);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const filled = MODULES.slice(0, shownCount);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-x-16 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="flex min-w-0 flex-col">
        {children}
        {/* Phones: the finished example sits under the hero, since there's no room beside it */}
        <div className="flex flex-col items-start gap-4 pb-4 lg:hidden">
          <StoryMark scores={EXAMPLE_SCORES} filled={MODULES} size="md" />
          <ExampleCaption count={4} />
        </div>
        {STEPS.map((step, index) => (
          <ModuleStep
            key={step.module}
            step={step}
            filled={MODULES.slice(0, index + 1)}
            ref={(element) => {
              stepRefs.current[index] = element;
            }}
          />
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-8">
          <StoryMark scores={EXAMPLE_SCORES} filled={filled} />
          <ExampleCaption count={shownCount} />
        </div>
      </div>
    </div>
  );
}
