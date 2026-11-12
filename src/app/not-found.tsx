import type { Metadata } from "next";
import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        It doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <AppButton asChild>
        <Link href="/companies">Go to your companies</Link>
      </AppButton>
    </main>
  );
}
