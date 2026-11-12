import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { ProgressMark } from "@/components/shared/progress-mark";
import { MODULES } from "@/features/company/options";

// The page ends where it started: the same action, next to the finished mark.
export function LandingClose() {
  return (
    <section aria-labelledby="close-heading" className="mx-auto w-full max-w-6xl px-3 pb-3">
      <div className="flex flex-col items-start gap-8 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-12 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-16 lg:py-16">
        <div className="flex items-center gap-6">
          <ProgressMark filled={MODULES} size="lg" />
          <div className="flex max-w-md flex-col gap-2">
            <h2
              id="close-heading"
              className="text-2xl font-bold tracking-tight text-balance text-neutral-900"
            >
              Start with your company
            </h2>
            <p className="text-base text-neutral-600">
              One short form about your company, then the four assessments, in any order.
            </p>
          </div>
        </div>
        <AppButton size="lg" asChild>
          <Link href="/signup">Check your company</Link>
        </AppButton>
      </div>
      <p className="px-3 py-6 text-xs text-neutral-600 sm:px-7">
        A university research project. The weights and questions are still being checked with domain
        experts.
      </p>
    </section>
  );
}
