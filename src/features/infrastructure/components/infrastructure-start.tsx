import { Server } from "lucide-react";

// What the module page shows until the first assessment exists.
export function InfrastructureStart() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-xl border p-5 sm:flex-row">
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-neutral-900"
      >
        <Server className="size-5" strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-neutral-900">No assessments yet</h2>
        <p className="text-sm text-neutral-600">
          The infrastructure questions are being built. You’ll be able to start an assessment here
          soon.
        </p>
      </div>
    </section>
  );
}
