"use client";
import { AppButton } from "@/components/shared/app-button";

// Shows anything unexpected (database down, a bug). Expected problems are toasts instead.
export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        Please try again. If it keeps happening, tell the team.
      </p>
      <AppButton onClick={retry}>Try again</AppButton>
    </main>
  );
}
