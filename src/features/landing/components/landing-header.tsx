import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { AppLogo } from "@/components/shared/app-logo";

export function LandingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10">
      <AppLogo href="/" />
      <AppButton variant="secondary" asChild>
        <Link href="/login">Log in</Link>
      </AppButton>
    </header>
  );
}
