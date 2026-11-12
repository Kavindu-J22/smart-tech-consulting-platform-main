import { ModuleIcon } from "@/components/shared/module-icon";

// Stands in for the questionnaire until it's built (Phase 6 of docs/plans/2026-10-19-product-module.md).
export function QuestionnairePending() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-xl border p-5 sm:flex-row">
      <ModuleIcon module="product" />
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-neutral-900">Draft saved</h2>
        <p className="text-sm text-neutral-600">
          Your assessment has been started. The questions for this stage are being built and will
          appear here soon.
        </p>
      </div>
    </section>
  );
}
