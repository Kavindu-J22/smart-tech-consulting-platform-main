import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";

// The page's one promise and its one action. Bigger than an app PageHeader on purpose: this is
// the only screen that has to win attention before anyone has an account.
export function LandingHero() {
  return (
    <div className="flex flex-col gap-8 pt-10 pb-12 sm:pt-16 lg:pt-24 lg:pb-16">
      <div className="flex max-w-2xl flex-col gap-5">
        <h1 className="text-4xl font-bold tracking-tight text-balance text-neutral-900 lg:text-5xl">
          Know how ready your startup is to launch, and what to fix first
        </h1>
        <p className="max-w-xl text-lg text-pretty text-neutral-600">
          Describe your company once. Four assessments score your infrastructure, marketing,
          compliance and product against Sri Lankan costs and rules, and every score shows the rule
          behind it.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <AppButton size="lg" asChild>
          <Link href="/signup">Check your company</Link>
        </AppButton>
        <AppButton variant="ghost" size="lg" asChild>
          <Link href="/login">Log in</Link>
        </AppButton>
      </div>
    </div>
  );
}
