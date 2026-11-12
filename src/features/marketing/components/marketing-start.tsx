import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { ModuleIcon } from "@/components/shared/module-icon";

type Props = { companyId: string };

// Initial welcome component displayed when no marketing assessments have been created yet.
export function MarketingStart({ companyId }: Props) {
  return (
    <section className="flex flex-col items-start gap-5 rounded-xl border border-neutral-200 bg-card p-6 shadow-xs sm:flex-row sm:items-center">
      <ModuleIcon module="marketing" />
      <div className="flex flex-1 flex-col gap-1.5">
        <h2 className="text-base font-bold text-neutral-900">Marketing Strategy Assessment</h2>
        <p className="text-sm text-neutral-600">
          Complete a comprehensive 5-step questionnaire (Q1–Q21) to analyze your target
          audience&apos;s technical literacy, translate technical features into customer-oriented
          marketing messages, rank marketing channels with the Analytical Hierarchy Process (AHP),
          and receive an exact-sum LKR budget allocation.
        </p>
      </div>
      <AppButton asChild className="shrink-0">
        <Link href={`/companies/${companyId}/marketing/new`}>Start Assessment</Link>
      </AppButton>
    </section>
  );
}
