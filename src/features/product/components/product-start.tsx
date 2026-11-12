import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { ModuleIcon } from "@/components/shared/module-icon";

type Props = { companyId: string };

// What the module page shows until the first assessment exists.
export function ProductStart({ companyId }: Props) {
  return (
    <section className="flex flex-col items-start gap-4 rounded-xl border p-5 sm:flex-row">
      <ModuleIcon module="product" />
      <div className="flex flex-1 flex-col gap-1">
        <h2 className="font-bold text-neutral-900">No assessments yet</h2>
        <p className="text-sm text-neutral-600">
          Answer a few questions about your product to get a SWOT analysis, the market blockers to
          watch for and a market research guide.
        </p>
      </div>
      <AppButton asChild>
        <Link href={`/companies/${companyId}/product/new`}>Start assessment</Link>
      </AppButton>
    </section>
  );
}
